import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Copy, 
  Check, 
  User,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { playSound } from '../utils/sound';
import { speakNaturalSpeech, stopNaturalSpeech } from '../utils/naturalVoice';
import { UfoQuestionShip } from './UfoQuestionShip';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  isStreaming?: boolean;
}

interface AskGitnautAIProps {
  currentContext?: string;
  initialIsOpen?: boolean;
}

const SUGGESTION_CHIPS = [
  "What is a commit?",
  "Why do I need git add?",
  "I'm stuck on this mission",
  "What is a branch and why use it?",
  "How do I undo my last commit?",
];

const FOLLOW_UP_CHIPS = [
  "Explain simpler",
  "Show an example",
  "Quiz me"
];

export function openGitnautAI(query?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-gitnaut-ai', { detail: { query } }));
  }
}

export const AskGitnautAI: React.FC<AskGitnautAIProps> = ({ currentContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuestion, setInputQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi there! I'm **Gitnaut**, your friendly Git guide. Ask me any Git question in plain English, or tap one of the suggested prompts below.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Listen for open events triggered across the app
  useEffect(() => {
    const handleOpen = (e: any) => {
      setIsOpen(true);
      playSound('warp');
      if (e.detail?.query) {
        setTimeout(() => {
          handleSendMessage(e.detail.query);
        }, 150);
      }
    };
    window.addEventListener('open-gitnaut-ai', handleOpen);
    return () => window.removeEventListener('open-gitnaut-ai', handleOpen);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Setup Web Speech Recognition for voice input if available
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputQuestion((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListening(false);
        };
        recognition.onerror = () => {
          setIsListening(false);
        };
        recognition.onend = () => {
          setIsListening(false);
        };
        recognitionRef.current = recognition;
      } catch {
        // SpeechRecognition not supported or permission denied
      }
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      return;
    }
    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    } else {
      try {
        setIsListening(true);
        recognitionRef.current.start();
        playSound('pop');
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuestion).trim();
    if (!query || isLoading) return;

    playSound('pop');
    setInputQuestion('');

    const userMsgId = 'user-' + Date.now();
    const assistantMsgId = 'assistant-' + Date.now();

    const newMessages: Message[] = [
      ...messages,
      { id: userMsgId, sender: 'user', text: query },
      { id: assistantMsgId, sender: 'assistant', text: '', isStreaming: true },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }));

      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          context: currentContext || 'Git masterclass curriculum',
          history,
        }),
      });

      if (!res.ok) {
        throw new Error('API server error');
      }

      if (!res.body) {
        throw new Error('No response stream');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6).trim();
            if (dataStr === '[DONE]') {
              continue;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedText += parsed.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, text: accumulatedText, isStreaming: true }
                      : msg
                  )
                );
              }
            } catch {
              // Ignore non-json chunks
            }
          }
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
        )
      );
      playSound('success');
    } catch {
      // Friendly client-side AI fallback if Gemini key or server route is unavailable
      const fallbackReply = generateClientFallback(query, currentContext);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? { ...msg, text: fallbackReply, isStreaming: false }
            : msg
        )
      );
      playSound('pop');
    } finally {
      setIsLoading(false);
    }
  };

  const generateClientFallback = (q: string, ctx?: string): string => {
    const lower = q.toLowerCase();
    if (lower.includes('commit')) {
      return "A commit is a saved snapshot of your project files at a specific moment. It gives you a clean record of your work so you can review history or roll back whenever needed.\n\n```bash\ngit commit -m \"feat: add navigation component\"\n```";
    }
    if (lower.includes('add') || lower.includes('stage')) {
      return "`git add` lets you choose exactly which changed files to include before creating your next commit snapshot. It acts as a staging checkpoint so you don't commit unfinished or private files.\n\n```bash\ngit add src/navigation.ts\n```";
    }
    if (lower.includes('branch')) {
      return "A branch is an independent line of development. You can build new features or experiment without affecting your main code, then merge everything back when you're ready.\n\n```bash\ngit switch -c feat/navigation-update\n```";
    }
    if (lower.includes('stuck') || lower.includes('mission')) {
      return `If you're stuck in ${ctx || 'this mission'}, check your terminal output with \`git status\` to see which files are modified or staged, and verify your command syntax.\n\n\`\`\`bash\ngit status\n\`\`\``;
    }
    if (lower.includes('undo') || lower.includes('revert')) {
      return "To undo a committed change safely in a team project, run `git revert <hash>`. To discard unstaged edits in your working directory, run `git restore <file>`.\n\n```bash\ngit restore src/app.js\n```";
    }
    return `To inspect what's happening right now, running \`git status\` is usually the best first step. It shows your current branch and all modified files.\n\n\`\`\`bash\ngit status\n\`\`\``;
  };

  const handleSpeakText = async (messageId: string, textToSpeak: string) => {
    if (playingAudioId === messageId) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      stopNaturalSpeech();
      setPlayingAudioId(null);
      return;
    }

    stopNaturalSpeech();
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    const cleanSpeech = textToSpeak
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*_#]/g, '')
      .trim();

    try {
      setPlayingAudioId(messageId);
      playSound('click');

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanSpeech, voice: 'Kore' }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio && !data.fallbackToClient) {
          const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audio}`);
          currentAudioRef.current = audio;
          audio.onended = () => {
            setPlayingAudioId(null);
            currentAudioRef.current = null;
          };
          audio.onerror = () => {
            speakNaturalSpeech(
              cleanSpeech,
              () => setPlayingAudioId(null),
              () => setPlayingAudioId(null)
            );
          };
          await audio.play();
          return;
        }
      }
    } catch {
      // Fall through to browser natural voice
    }

    // High quality natural browser voice synthesis (pitch 1.0, conversational pace)
    speakNaturalSpeech(
      cleanSpeech,
      () => setPlayingAudioId(null),
      () => setPlayingAudioId(null)
    );
  };

  const copyCode = async (codeSnippet: string, id: string) => {
    playSound('type');
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const renderMessageContent = (content: string, msgId: string) => {
    const parts = [];
    const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index),
        });
      }
      parts.push({
        type: 'code',
        lang: match[1] || 'bash',
        content: match[2].trim(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex),
      });
    }

    return (
      <div className="space-y-2 leading-relaxed text-sm">
        {parts.map((part, idx) => {
          if (part.type === 'code') {
            const blockId = `${msgId}-code-${idx}`;
            return (
              <div
                key={idx}
                className="my-2 rounded-[8px] code-panel p-3 font-mono text-xs relative group"
              >
                <div className="flex items-center justify-between text-text-muted pb-1 mb-1.5 border-b border-border/80">
                  <span className="font-semibold text-link">{part.lang || 'git'}</span>
                  <button
                    onClick={() => copyCode(part.content, blockId)}
                    className="flex items-center gap-1 text-text-muted hover:text-text cursor-pointer transition-colors"
                    title="Copy command"
                  >
                    {copiedId === blockId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-accent" strokeWidth={1.75} />
                        <span className="text-accent text-xs">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-link" strokeWidth={1.75} />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="font-mono text-text whitespace-pre overflow-x-auto">
                  <code>{part.content}</code>
                </pre>
              </div>
            );
          }

          const lines = part.content.split('\n').filter(Boolean);
          return (
            <div key={idx} className="space-y-1">
              {lines.map((line, lIdx) => {
                const formatted = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
                const withCode = formatted.replace(
                  /`([^`]+)`/g,
                  '<code class="px-1.5 py-0.5 rounded-[4px] bg-surface-2 text-text font-mono text-xs border border-border">$1</code>'
                );
                return (
                  <p 
                    key={lIdx} 
                    dangerouslySetInnerHTML={{ __html: withCode }} 
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Ask AI Button: Mobile bottom-[72px], Desktop bottom-6 */}
      <div className="fixed bottom-[72px] right-4 sm:bottom-6 sm:right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              playSound('warp');
            }}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg min-h-[44px] cursor-pointer text-sm font-bold whitespace-nowrap active:scale-95 transition-transform"
            aria-label="Ask Gitnaut UFO AI Copilot"
            title="Ask Gitnaut UFO AI Copilot"
          >
            <span className="text-base leading-none">🛸</span>
            <span>Ask UFO AI</span>
          </button>
        )}
      </div>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs sm:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Responsive Chat Sheet: Bottom Sheet on Mobile, Compact Floating Panel on Desktop */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:right-6 sm:inset-x-auto z-50 w-full sm:w-[440px] max-h-[85dvh] sm:max-h-[80dvh] h-[560px] flex flex-col bg-surface border-t sm:border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200 font-sans">
          {/* Mobile Drag Handle */}
          <div className="sm:hidden w-12 h-1.5 rounded-full bg-border mx-auto my-2 shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 sm:py-3 bg-surface-2 border-b border-border min-h-[52px]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/60 flex items-center justify-center shrink-0">
                <span className="text-base leading-none">🛸</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-text flex items-center gap-2 font-heading tracking-normal">
                  Gitnaut UFO Copilot
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface text-accent border border-border font-mono font-bold">
                    Online
                  </span>
                </h3>
                <p className="text-xs text-text-muted">Plain-English Git explanations</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: 'welcome-' + Date.now(),
                      sender: 'assistant',
                      text: "Hello! I'm **Gitnaut**, your friendly Git tutor. Ask me any question in plain English, or tap one of the suggested prompts below.",
                    },
                  ]);
                  playSound('pop');
                }}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-muted hover:text-text rounded-lg hover:bg-surface transition-colors cursor-pointer"
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <RefreshCw className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (currentAudioRef.current) {
                    currentAudioRef.current.pause();
                    currentAudioRef.current = null;
                  }
                  setPlayingAudioId(null);
                }}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-muted hover:text-text rounded-lg hover:bg-surface transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-text min-h-0">
            {messages.length <= 1 && (
              <div className="flex flex-col items-center justify-center py-2 text-center select-none">
                <div className="w-[140px] h-[150px] flex items-center justify-center">
                  <UfoQuestionShip size="sm" interactive={false} />
                </div>
                <div className="text-xs font-mono text-link font-semibold uppercase tracking-wider mt-1">
                  UFO Flight Copilot Ready
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-accent" strokeWidth={1.75} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-accent text-accent-ink font-semibold'
                      : 'bg-surface-2 text-text border border-border'
                  }`}
                >
                  {renderMessageContent(msg.text, msg.id)}

                  {msg.sender === 'assistant' && !msg.isStreaming && msg.text && (
                    <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border text-sm text-text-muted">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleSpeakText(msg.id, msg.text)}
                          className="flex items-center gap-1.5 hover:text-accent transition-colors cursor-pointer font-bold text-sm min-touch"
                          title="Listen to this explanation"
                        >
                          <Volume2 className={`w-4 h-4 ${playingAudioId === msg.id ? 'text-accent animate-pulse' : 'text-cyan'}`} strokeWidth={1.75} />
                          <span>{playingAudioId === msg.id ? 'Stop audio' : 'Listen'}</span>
                        </button>
                      </div>

                      {/* Follow-up chips */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {FOLLOW_UP_CHIPS.map((chip) => (
                          <button
                            key={chip}
                            onClick={() => handleSendMessage(chip)}
                            className="text-sm px-3 py-1.5 rounded-lg bg-surface border border-border text-text hover:text-accent hover:border-accent transition-all cursor-pointer font-medium min-h-[36px]"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-cyan pl-9 font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-cyan" strokeWidth={1.75} />
                <span>Gitnaut is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-surface-2/60 border-t border-border overflow-x-auto flex items-center gap-1.5 text-sm scrollbar-thin">
            <span className="text-xs text-text-muted shrink-0 uppercase tracking-wider font-semibold">Try:</span>
            {SUGGESTION_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                disabled={isLoading}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-2 border border-border text-text-muted hover:text-text hover:border-accent transition-all text-xs cursor-pointer disabled:opacity-50 font-medium whitespace-nowrap min-h-[36px]"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar with safe-area padding on mobile */}
          <div className="p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-surface-2 border-t border-border flex items-center gap-2">
            <button
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className={`p-2 rounded-xl border transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isListening
                  ? 'bg-danger/20 border-danger text-danger animate-pulse'
                  : 'bg-surface border-border text-text-muted hover:text-text'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Speak your question'}
              aria-label="Microphone input"
            >
              {isListening ? <MicOff className="w-5 h-5" strokeWidth={1.75} /> : <Mic className="w-5 h-5" strokeWidth={1.75} />}
            </button>
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={isListening ? 'Listening to your voice...' : 'Ask any Git question in plain words...'}
              disabled={isLoading}
              style={{ fontSize: '16px' }}
              className="flex-1 bg-surface border border-border rounded-xl px-3.5 py-2.5 text-base text-text placeholder-text-muted focus:outline-none focus:border-accent transition-colors font-sans min-h-[44px]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuestion.trim() || isLoading}
              className="btn-primary min-h-[44px] min-w-[44px] p-2.5 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
