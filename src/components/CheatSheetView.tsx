import React, { useState, useMemo } from 'react';
import { Search, Copy, Check, ArrowUpRight, CheckCircle2, Circle } from 'lucide-react';
import { ALL_COMMANDS, GIT_STAGES } from '../data/gitStages';
import { StageId } from '../types/git';
import { playSound } from '../utils/sound';

interface CheatSheetViewProps {
  learnedCommandIds: string[];
  onToggleLearned: (id: string) => void;
  onNavigateToCommand: (stageId: StageId, commandId: string) => void;
}

export const CheatSheetView: React.FC<CheatSheetViewProps> = ({
  learnedCommandIds,
  onToggleLearned,
  onNavigateToCommand,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCommands = useMemo(() => {
    return ALL_COMMANDS.filter((cmd) => {
      const matchStage = selectedStage === 'all' || cmd.stageId === selectedStage;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchStage;

      const matchText = 
        cmd.name.toLowerCase().includes(q) ||
        cmd.syntax.toLowerCase().includes(q) ||
        cmd.oneLiner.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q) ||
        (cmd.flags && cmd.flags.some((f) => f.flag.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)));

      return matchStage && matchText;
    });
  }, [searchQuery, selectedStage]);

  const copySyntax = async (id: string, text: string) => {
    playSound('type');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  const handleToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    onToggleLearned(id);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 min-w-0 font-sans">
      {/* Top Banner: 16px mobile, 24px desktop, 12px radius */}
      <div className="card-base p-4 sm:p-6 space-y-4 min-w-0">
        <div className="space-y-1.5 min-w-0">
          <div className="text-sm font-semibold uppercase tracking-wider text-link font-mono">
            Quick Reference Manual
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text tracking-normal leading-tight">
            Git Command Cheat Sheet
          </h1>
          <p className="text-base text-text-muted max-w-2xl leading-relaxed">
            All 37 curriculum commands indexed with syntax, options, and direct links to visual simulators.
          </p>
        </div>

        {/* Search bar & Filter tabs */}
        <div className="space-y-3 pt-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.75} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search commands, flags, keywords (e.g. restore, --staged, rebase, stash, cherry-pick)..."
              style={{ fontSize: '16px' }}
              className="w-full pl-11 pr-4 py-3 rounded-[10px] bg-surface border border-border text-sm text-text placeholder-text-muted focus:outline-none focus:border-accent font-sans min-h-[44px]"
            />
          </div>

          {/* Stage filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm scrollbar-thin">
            <button
              onClick={() => {
                playSound('click');
                setSelectedStage('all');
              }}
              className={`min-h-[44px] px-4 py-2 rounded-[10px] border transition-all whitespace-nowrap cursor-pointer font-semibold ${
                selectedStage === 'all'
                  ? 'bg-accent text-accent-ink border-accent font-bold'
                  : 'bg-surface-2 text-text-muted border-border hover:text-text'
              }`}
            >
              All ({ALL_COMMANDS.length})
            </button>
            {GIT_STAGES.slice(0, 7).map((stage) => (
              <button
                key={stage.id}
                onClick={() => {
                  playSound('click');
                  setSelectedStage(stage.id);
                }}
                className={`min-h-[44px] px-4 py-2 rounded-[10px] border transition-all whitespace-nowrap cursor-pointer font-semibold ${
                  selectedStage === stage.id
                    ? 'bg-accent text-accent-ink border-accent font-bold'
                    : 'bg-surface-2 text-text-muted border-border hover:text-text'
                }`}
              >
                Stage {stage.number}: {stage.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Commands List */}
      <div className="space-y-3">
        {filteredCommands.length === 0 ? (
          <div className="p-12 text-center rounded-[12px] bg-surface border border-border text-text-muted text-sm">
            No commands matched "{searchQuery}". Try searching for words like "commit", "stash", or "revert".
          </div>
        ) : (
          filteredCommands.map((cmd) => {
            const isLearned = learnedCommandIds.includes(cmd.id);
            const isCopied = copiedId === cmd.id;

            return (
              <div
                key={cmd.id}
                className="card-base p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-accent/40"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <button
                    type="button"
                    onClick={(e) => handleToggle(cmd.id, e)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] bg-surface-2 hover:bg-border transition-colors cursor-pointer shrink-0"
                    title={isLearned ? 'Mark as unlearned' : 'Mark as mastered'}
                    aria-label={`Mark ${cmd.name} as ${isLearned ? 'unlearned' : 'mastered'}`}
                  >
                    {isLearned ? (
                      <CheckCircle2 className="w-5 h-5 text-accent fill-accent/20" strokeWidth={1.75} />
                    ) : (
                      <Circle className="w-5 h-5 text-text-muted" strokeWidth={1.75} />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-bold text-base text-text">
                        {cmd.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-[6px] bg-surface-2 text-text-muted border border-border font-medium">
                        {cmd.category}
                      </span>
                      {cmd.isSpecialFile && (
                        <span className="text-xs px-2 py-0.5 rounded-[6px] bg-surface-2 text-link border border-border font-medium">
                          Config
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-muted mt-1 line-clamp-1 leading-relaxed">
                      {cmd.oneLiner}
                    </p>
                  </div>
                </div>

                {/* Command syntax block & Action button */}
                <div className="flex items-center gap-2 self-start md:self-center shrink-0 w-full sm:w-auto">
                  <div
                    onClick={() => copySyntax(cmd.id, cmd.syntax)}
                    className="min-h-[44px] cursor-pointer px-3.5 py-2 rounded-[10px] code-panel font-mono text-sm text-link flex items-center gap-2 transition-all flex-1 sm:flex-initial max-w-full sm:max-w-none truncate hover:border-accent"
                    title="Click to copy syntax"
                  >
                    <span className="text-accent select-none font-bold">$</span>
                    <span className="truncate">{cmd.syntax}</span>
                    {isCopied ? (
                      <Check className="w-4 h-4 text-accent shrink-0 ml-1" strokeWidth={1.75} />
                    ) : (
                      <Copy className="w-4 h-4 text-text-muted shrink-0 ml-1" strokeWidth={1.75} />
                    )}
                  </div>

                  <button
                    onClick={() => {
                      playSound('click');
                      onNavigateToCommand(cmd.stageId, cmd.id);
                    }}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] border border-border bg-surface-2 hover:bg-border text-text-muted hover:text-text transition-colors cursor-pointer shrink-0"
                    title="View animated visual simulator"
                  >
                    <ArrowUpRight className="w-4 h-4 text-link" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
