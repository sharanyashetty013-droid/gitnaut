import React from 'react';
import { Archive, ArchiveRestore, Tag, ArrowRight } from 'lucide-react';

interface SimProps {
  step: 'before' | 'running' | 'after';
}

export const StashSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-between w-full max-w-md gap-4 p-6 min-h-[190px]">
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex-1 p-3 rounded-xl bg-[#171a22] border border-[#2b313e] text-center">
          <span className="text-[10px] font-mono text-[#9599a3] block mb-1">Working Directory</span>
          <div className={`p-2 rounded border text-xs font-mono transition-all duration-500 ${
            step === 'after'
              ? 'bg-[#14161c] border-[#252a36] text-[#7fb069]'
              : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
          }`}>
            {step === 'after' ? 'Clean! (0 uncommitted edits)' : 'Dirty WIP (payment form edits)'}
          </div>
        </div>

        <ArrowRight className={`w-4 h-4 transition-colors ${step === 'after' ? 'text-[#e8703a]' : 'text-[#414856]'}`} />

        <div className={`flex-1 p-3 rounded-xl border text-center transition-all duration-500 ${
          step === 'after'
            ? 'bg-[#221c2b] border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
            : 'bg-[#171a22] border-[#2b313e]'
        }`}>
          <div className="flex items-center justify-center gap-1.5 mb-1 text-[10px] font-mono text-[#9599a3]">
            <Archive className={`w-3.5 h-3.5 ${step === 'after' ? 'text-purple-400' : 'text-[#414856]'}`} />
            <span>Stash Pocket</span>
          </div>
          <div className={`text-xs font-mono ${step === 'after' ? 'text-purple-300' : 'text-[#62697b]'}`}>
            {step === 'after' ? 'stash@{0}: "WIP"' : '(empty)'}
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Edits tucked into stash@{0}! Working directory is completely clean and ready for urgent tasks.'
          : 'Safely shelves uncommitted changes in temporary storage.'}
      </p>
    </div>
  );
};

export const StashPopSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-between w-full max-w-md gap-4 p-6 min-h-[190px]">
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex-1 p-3 rounded-xl bg-[#171a22] border border-[#2b313e] text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1 text-[10px] font-mono text-[#9599a3]">
            <ArchiveRestore className="w-3.5 h-3.5 text-[#e8703a]" />
            <span>Stash Storage</span>
          </div>
          <div className={`text-xs font-mono transition-colors ${step === 'after' ? 'text-[#62697b]' : 'text-purple-300'}`}>
            {step === 'after' ? '(stash@{0} popped & cleared)' : 'stash@{0}: "WIP"'}
          </div>
        </div>

        <ArrowRight className={`w-4 h-4 transition-colors ${step === 'after' ? 'text-[#7fb069]' : 'text-[#414856]'}`} />

        <div className={`flex-1 p-3 rounded-xl border text-center transition-all duration-500 ${
          step === 'after'
            ? 'bg-[#18231c] border-[#7fb069]/60 shadow-md'
            : 'bg-[#171a22] border-[#2b313e]'
        }`}>
          <span className="text-[10px] font-mono text-[#9599a3] block mb-1">Working Directory</span>
          <div className={`text-xs font-mono ${step === 'after' ? 'text-[#7fb069] font-medium' : 'text-[#62697b]'}`}>
            {step === 'after' ? 'Restored WIP edits!' : 'Clean state'}
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Unfolded! Stashed edits reapplied to your files and removed from the stash list.'
          : 'Restores your shelved changes and deletes them from the stash.'}
      </p>
    </div>
  );
};

export const CherryPickSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="w-full max-w-md space-y-3">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#161820] border border-[#272d3a]">
          <span className="text-xs font-mono text-[#9599a3]">other-branch:</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#9599a3]">c1</span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono transition-all ${
              step === 'after' ? 'border border-[#38bdf8] text-[#38bdf8]' : 'bg-[#38bdf8] text-[#031326] font-bold'
            }`}>
              e4c1
            </div>
            <span className="text-[10px] font-mono text-[#38bdf8]">"Critical security patch"</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#161820] border border-[#272d3a]">
          <span className="text-xs font-mono text-[#7fb069]">main (current):</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#9599a3]">c8</span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-700 ${
              step === 'after'
                ? 'bg-[#7fb069] text-black shadow-[0_0_15px_rgba(127,176,105,0.4)] scale-110'
                : 'border-2 border-dashed border-[#414856] text-[#414856]'
            }`}>
              e4c1'
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Cherry-picked! Commit e4c1 was isolated and applied onto main without merging the whole branch.'
          : 'Applies a single chosen commit from any branch.'}
      </p>
    </div>
  );
};

export const TagSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="relative flex items-center justify-center w-full max-w-sm py-4">
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#2c323f] -translate-y-1/2" />
        <div className="relative z-10 flex items-center justify-between w-full px-6">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#1e232e] border border-[#62697b] flex items-center justify-center text-[10px] font-mono text-[#9599a3]">c1</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#1e232e] border border-[#62697b] flex items-center justify-center text-[10px] font-mono text-[#9599a3]">c2</div>
          </div>
          <div className="flex flex-col items-center relative">
            <div className="w-9 h-9 rounded-full bg-[#7fb069] text-black font-bold flex items-center justify-center text-[10px] font-mono shadow-md">
              c3
            </div>
            <div className={`mt-2 flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-semibold transition-all duration-700 ${
              step === 'after'
                ? 'bg-[#0f172a] border-[#38bdf8] text-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.3)] scale-105'
                : 'opacity-0 scale-75'
            }`}>
              <Tag className="w-3 h-3 text-[#38bdf8]" />
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Release tag v1.0.0 permanently pinned to commit c3 for deployments!'
          : 'Creates an immutable named release marker for production.'}
      </p>
    </div>
  );
};
