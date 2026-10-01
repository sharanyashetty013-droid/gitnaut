import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Terminal } from 'lucide-react';
import { GitCommand } from '../types/git';
import { InitSim, CloneSim, ConfigSim, GitignoreSim } from './simulations/Stage1Sims';
import { StatusSim, AddSim, CommitSim, DiffSim, DiffStagedSim } from './simulations/Stage2Sims';
import { LogSim, LogGraphSim, ShowSim, BlameSim } from './simulations/Stage3Sims';
import { RestoreSim, RestoreStagedSim, ResetSim, RevertSim, RmSim, MvSim, CleanSim } from './simulations/Stage4Sims';
import { BranchListSim, BranchCreateSim, CheckoutSim, CheckoutBSim, MergeSim, RebaseSim, BranchDeleteSim } from './simulations/Stage5Sims';
import { RemoteListSim, RemoteAddSim, PushSim, PushUSim, PullSim, FetchSim } from './simulations/Stage6Sims';
import { StashSim, StashPopSim, CherryPickSim, TagSim } from './simulations/Stage7Sims';

interface VisualSimulatorProps {
  command: GitCommand;
}

export const VisualSimulator: React.FC<VisualSimulatorProps> = ({ command }) => {
  const [step, setStep] = useState<'before' | 'running' | 'after'>('before');
  const [typedText, setTypedText] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fullPromptCommand = command.isSpecialFile
    ? `cat >> .gitignore`
    : command.syntax.split('\n')[0].split('#')[0].trim();

  const startDemo = () => {
    setIsPlaying(true);
    setStep('before');
    setTypedText('');
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    let charIndex = 0;
    const textToType = fullPromptCommand;

    typingTimerRef.current = setInterval(() => {
      charIndex++;
      if (charIndex <= textToType.length) {
        setTypedText(textToType.slice(0, charIndex));
      } else {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setStep('running');
        setTimeout(() => {
          setStep('after');
          setIsPlaying(false);
        }, 600);
      }
    }, 35);
  };

  useEffect(() => {
    startDemo();
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [command.id]);

  const renderSimulationContent = () => {
    switch (command.visualType) {
      case 'init': return <InitSim step={step} />;
      case 'clone': return <CloneSim step={step} />;
      case 'config': return <ConfigSim step={step} />;
      case 'gitignore': return <GitignoreSim step={step} />;
      case 'status': return <StatusSim step={step} />;
      case 'add': return <AddSim step={step} />;
      case 'commit': return <CommitSim step={step} />;
      case 'diff': return <DiffSim step={step} />;
      case 'diff-staged': return <DiffStagedSim step={step} />;
      case 'log': return <LogSim step={step} />;
      case 'log-graph': return <LogGraphSim step={step} />;
      case 'show': return <ShowSim step={step} />;
      case 'blame': return <BlameSim step={step} />;
      case 'restore': return <RestoreSim step={step} />;
      case 'restore-staged': return <RestoreStagedSim step={step} />;
      case 'reset': return <ResetSim step={step} />;
      case 'revert': return <RevertSim step={step} />;
      case 'rm': return <RmSim step={step} />;
      case 'mv': return <MvSim step={step} />;
      case 'clean': return <CleanSim step={step} />;
      case 'branch-list': return <BranchListSim step={step} />;
      case 'branch-create': return <BranchCreateSim step={step} />;
      case 'checkout': return <CheckoutSim step={step} />;
      case 'checkout-b': return <CheckoutBSim step={step} />;
      case 'merge': return <MergeSim step={step} />;
      case 'rebase': return <RebaseSim step={step} />;
      case 'branch-delete': return <BranchDeleteSim step={step} />;
      case 'remote-list': return <RemoteListSim step={step} />;
      case 'remote-add': return <RemoteAddSim step={step} />;
      case 'push': return <PushSim step={step} />;
      case 'push-u': return <PushUSim step={step} />;
      case 'pull': return <PullSim step={step} />;
      case 'fetch': return <FetchSim step={step} />;
      case 'stash': return <StashSim step={step} />;
      case 'stash-pop': return <StashPopSim step={step} />;
      case 'cherry-pick': return <CherryPickSim step={step} />;
      case 'tag': return <TagSim step={step} />;
      default:
        return <CommitSim step={step} />;
    }
  };

  return (
    <div className="w-full rounded-[12px] bg-[#07080F] border border-border overflow-hidden flex flex-col shadow-sm">
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
          </div>
          <span className="text-xs font-mono text-text-muted ml-2 flex items-center gap-1.5 font-semibold">
            <Terminal className="w-4 h-4 text-link" strokeWidth={1.75} /> terminal demo
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-surface-2 p-0.5 rounded-[8px] border border-border text-xs font-mono">
            <button
              onClick={() => { setStep('before'); setIsPlaying(false); }}
              className={`px-2.5 py-1 rounded-[6px] transition-colors cursor-pointer ${
                step === 'before' ? 'bg-border text-text font-bold' : 'text-text-muted hover:text-text'
              }`}
            >
              Before
            </button>
            <button
              onClick={() => { setStep('after'); setIsPlaying(false); }}
              className={`px-2.5 py-1 rounded-[6px] transition-colors cursor-pointer ${
                step === 'after' ? 'bg-accent text-accent-ink font-bold' : 'text-text-muted hover:text-text'
              }`}
            >
              After
            </button>
          </div>
          <button
            onClick={startDemo}
            disabled={isPlaying}
            className="flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1 rounded-[8px] bg-surface-2 hover:bg-border text-text transition-colors border border-border cursor-pointer min-h-[36px]"
          >
            {isPlaying ? (
              <span className="text-link animate-pulse">Running...</span>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5 text-link" strokeWidth={1.75} />
                <span>Replay</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="px-4 py-2.5 bg-[#07080F] border-b border-border font-mono text-xs flex items-center justify-between text-text">
        <div className="flex items-center gap-2 truncate">
          <span className="text-link font-bold select-none">$</span>
          <span className="text-text">{typedText || fullPromptCommand}</span>
          {isPlaying && (
            <span className="inline-block w-1.5 h-3.5 bg-cyan animate-pulse" />
          )}
        </div>
        <div className="shrink-0 text-xs font-mono text-text-muted uppercase tracking-wider font-semibold">
          State: <span className={step === 'after' ? 'text-accent font-bold' : step === 'running' ? 'text-cyan font-bold' : 'text-text-muted font-bold'}>{step}</span>
        </div>
      </div>

      <div className="relative bg-[#07080F] flex items-center justify-center">
        {renderSimulationContent()}
      </div>
    </div>
  );
};
