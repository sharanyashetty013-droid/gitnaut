import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  CheckCircle2, 
  Circle, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';
import { GitCommand } from '../types/git';
import { VisualSimulator } from './VisualSimulator';
import { playSound } from '../utils/sound';
import { renderFormattedCodeText } from '../utils/textUtils';

interface CommandCardProps {
  command: GitCommand;
  index: number;
  isLearned: boolean;
  onToggleLearned: (id: string) => void;
  isOpenDefault?: boolean;
}

export const CommandCard: React.FC<CommandCardProps> = ({
  command,
  index,
  isLearned,
  onToggleLearned,
  isOpenDefault = true,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(isOpenDefault);
  const [activeTab, setActiveTab] = useState<'simulator' | 'whyNeeded'>('simulator');

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('type');
    try {
      await navigator.clipboard.writeText(command.syntax);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleToggleLearned = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLearned) {
      playSound('success');
    } else {
      playSound('click');
    }
    onToggleLearned(command.id);
  };

  return (
    <article
      id={`command-${command.id}`}
      className={`card-base overflow-hidden font-sans transition-all min-w-0 ${
        isLearned ? 'border-accent/50' : 'hover:border-border'
      }`}
    >
      {/* Header bar / Card summary */}
      <div
        onClick={() => {
          playSound('click');
          setIsExpanded(!isExpanded);
        }}
        className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 select-none min-w-0"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
      >
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          {/* Learned toggle checkmark button - min 44px tap target */}
          <button
            type="button"
            onClick={handleToggleLearned}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] transition-colors cursor-pointer shrink-0 ${
              isLearned
                ? 'text-accent bg-accent/15 hover:bg-accent/25'
                : 'text-text-muted hover:text-text bg-surface-2 hover:bg-border'
            }`}
            title={isLearned ? 'Mark as unlearned' : 'Mark as mastered'}
            aria-label={`Mark ${command.name} as ${isLearned ? 'unlearned' : 'mastered'}`}
          >
            {isLearned ? (
              <CheckCircle2 className="w-5 h-5 text-accent fill-accent/20" strokeWidth={1.75} />
            ) : (
              <Circle className="w-5 h-5 text-text-muted" strokeWidth={1.75} />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-text-muted font-bold shrink-0">
                {String(index + 1).padStart(2, '0')}.
              </span>
              <h3 className="font-heading text-lg font-bold text-text tracking-normal truncate">
                {command.name}
              </h3>
              {command.isSpecialFile && (
                <span className="text-sm text-link font-semibold bg-surface-2 px-2.5 py-0.5 rounded-[6px] border border-border shrink-0">
                  Config
                </span>
              )}
              <span className="text-border" aria-hidden="true">•</span>
              <span className="text-sm font-semibold text-text-muted uppercase tracking-wider shrink-0">
                {command.category}
              </span>
            </div>
            <p className="text-sm text-text-muted mt-1 line-clamp-2 leading-relaxed">
              {command.oneLiner}
            </p>
          </div>
        </div>

        {/* Action zone: Copy button & Expand toggle */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            type="button"
            onClick={copyToClipboard}
            className="btn-secondary min-h-[44px] px-3.5 py-1.5 text-sm gap-1.5"
            title="Copy command to clipboard"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-accent" strokeWidth={1.75} />
                <span className="text-accent font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-link" strokeWidth={1.75} />
                <span>Copy</span>
              </>
            )}
          </button>
          <div className="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-muted hover:text-text rounded-[8px]">
            {isExpanded ? <ChevronUp className="w-5 h-5" strokeWidth={1.75} /> : <ChevronDown className="w-5 h-5" strokeWidth={1.75} />}
          </div>
        </div>
      </div>

      {/* Expanded Details and Simulator */}
      {isExpanded && (
        <div className="border-t border-border bg-surface-2/40 animate-in fade-in duration-200">
          {/* Syntax Code Bar */}
          <div className="px-5 py-3.5 bg-surface-2/80 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Command:</span>
              <code className="font-mono text-sm font-bold text-link code-panel px-3 py-1.5 rounded-[8px] border border-border">
                {command.syntax}
              </code>
            </div>
            <div className="text-xs text-text-muted">
              {command.flags ? `${command.flags.length} common options` : 'Interactive command module'}
            </div>
          </div>

          {/* Sub-Tabs: Simulator vs Why Needed */}
          <div className="px-5 pt-4 pb-2 flex items-center gap-2 border-b border-border/80">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`min-h-[38px] px-4 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'bg-accent text-accent-ink shadow-xs'
                  : 'text-text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              <Activity className="w-4 h-4" strokeWidth={1.75} />
              <span>Interactive Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab('whyNeeded')}
              className={`min-h-[38px] px-4 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'whyNeeded'
                  ? 'bg-accent text-accent-ink shadow-xs'
                  : 'text-text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              <Lightbulb className="w-4 h-4" strokeWidth={1.75} />
              <span>Why Is This Needed?</span>
            </button>
          </div>

          {/* Tab Content 1: Simulator */}
          {activeTab === 'simulator' && (
            <div className="p-5 space-y-4">
              <VisualSimulator command={command} />
            </div>
          )}

          {/* Tab Content 2: Why Needed */}
          {activeTab === 'whyNeeded' && (
            command.whyNeeded ? (
              <div className="p-5 sm:p-6 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Disaster without */}
                  <div className="p-4 rounded-[10px] bg-surface border border-border space-y-1.5">
                    <div className="flex items-center gap-1.5 text-danger font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" strokeWidth={1.75} />
                      <span>The Disaster Without It</span>
                    </div>
                    <p className="text-text-muted leading-relaxed">
                      {renderFormattedCodeText(command.whyNeeded.disasterWithout)}
                    </p>
                  </div>

                  {/* Rescue with */}
                  <div className="p-4 rounded-[10px] bg-surface border border-border space-y-1.5">
                    <div className="flex items-center gap-1.5 text-accent font-bold text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
                      <span>How This Rescues You</span>
                    </div>
                    <p className="text-text-muted leading-relaxed">
                      {renderFormattedCodeText(command.whyNeeded.rescueWith)}
                    </p>
                  </div>
                </div>

                {/* Real world analogy */}
                <div className="p-4 rounded-[10px] bg-surface border border-border space-y-1">
                  <div className="flex items-center gap-1.5 text-link font-bold text-xs uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4" strokeWidth={1.75} />
                    <span>Real-World Spaceflight Analogy</span>
                  </div>
                  <p className="text-text leading-relaxed">
                    {renderFormattedCodeText(command.whyNeeded.realWorldAnalogy)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-sm text-text-muted">
                Practical guide and flags available in the interactive simulator above.
              </div>
            )
          )}

          {/* Flags / Options Accordion */}
          {command.flags && command.flags.length > 0 && (
            <div className="px-5 py-4 border-t border-border bg-surface/50">
              <div className="text-xs font-bold text-text uppercase tracking-wider mb-2.5">
                Common Useful Options
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {command.flags.map((flag, fIdx) => (
                  <div key={fIdx} className="p-2.5 rounded-[8px] bg-surface-2 border border-border flex items-start gap-2.5">
                    <code className="font-mono text-link font-bold shrink-0">{flag.flag}</code>
                    <span className="text-text-muted leading-relaxed">{flag.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
