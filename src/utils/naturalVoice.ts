/**
 * Natural voice synthesis utility.
 * Plays calm, natural, and conversational speech using Web Speech API or server TTS.
 * Automatically chooses the best natural voice with pitch 1.0 and calm pacing.
 */

let selectedVoice: SpeechSynthesisVoice | null = null;

function loadBestNaturalVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Search for the most natural, human-sounding English voice available
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));

  // Priority 1: Natural / Online Neural voices (Edge / Chrome Natural)
  const natural = englishVoices.find(v => 
    v.name.toLowerCase().includes('natural') || 
    v.name.toLowerCase().includes('neural')
  );
  if (natural) return natural;

  // Priority 2: High quality Google or Apple voices
  const premium = englishVoices.find(v => 
    v.name.includes('Google') || 
    v.name.includes('Samantha') || 
    v.name.includes('Daniel') ||
    v.name.includes('Karen') ||
    v.name.includes('Serena') ||
    v.name.includes('Alex')
  );
  if (premium) return premium;

  // Priority 3: Default English voice
  const defaultEn = englishVoices.find(v => v.default) || englishVoices[0];
  return defaultEn || voices[0];
}

// Pre-warm voices on load
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  selectedVoice = loadBestNaturalVoice();
  window.speechSynthesis.onvoiceschanged = () => {
    selectedVoice = loadBestNaturalVoice();
  };
}

export function speakNaturalSpeech(
  text: string,
  onEnd?: () => void,
  onError?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    // Clean markdown and code symbols so speech sounds completely natural
    const clean = text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*_#]/g, '')
      .trim();

    if (!clean) {
      if (onEnd) onEnd();
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(clean);
    
    // Natural, calm settings: pitch 1.0, rate 1.0 (conversational, neutral, not dramatic)
    utterance.pitch = 1.0;
    utterance.rate = 1.0;
    utterance.volume = 1.0;

    const voice = selectedVoice || loadBestNaturalVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      // SpeechSynthesis cancelled is not an error
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis notice:', e.error);
      }
      if (onError) onError();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis fallback notice:', err);
    if (onError) onError();
    return false;
  }
}

export function stopNaturalSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
