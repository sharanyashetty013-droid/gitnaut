import React from 'react';
import { RotateCcw, Trash2, ArrowRight, FileCode } from 'lucide-react';

interface SimProps {
  step: 'before' | 'running' | 'after';
}

export const RestoreSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="flex items-center gap-6 max-w-md w-full justify-center">
        <div className={`p-4 rounded-xl border transition-all duration-500 flex items-center gap-3 ${
          step === 'after'
            ? 'bg-[#18231c] border-[#7fb069]/60'
            : 'bg-amber-950/20 border-amber-500/50'
        }`}>
          <FileCode className={`w-6 h-6 ${step === 'after' ? 'text-[#7fb069]' : 'text-amber-400'}`} />
          <div>
            <div className="text-xs font-mono font-medium text-[#e8e6e1]">index.html</div>
            <div className="text-[11px] font-mono">
              {step === 'after' ? (
                <span className="text-[#7fb069]">clean (reverted to commit)</span>
              ) : (
                <span className="text-amber-400">modified (accidental edits)</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <RotateCcw className={`w-5 h-5 transition-transform duration-500 ${
            step === 'running' ? 'animate-spin text-[#38bdf8]' : step === 'after' ? 'text-[#7fb069]' : 'text-[#414856]'
          }`} />
          <span className="text-[10px] font-mono text-[#9599a3] mt-1">revert to HEAD</span>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Uncommitted edits were discarded! File restored cleanly to match the last commit.'
          : 'Safely undoes local modifications in your working directory.'}
      </p>
    </div>
  );
};

export const RestoreStagedSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-between w-full max-w-md gap-4 p-6 min-h-[190px]">
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex-1 p-3 rounded-xl bg-[#191d26] border border-[#2b313f] text-center">
          <span className="text-[10px] font-mono text-[#9599a3] block mb-1">Staging Area</span>
          <div className={`p-2 rounded border text-xs font-mono transition-all duration-500 ${
            step === 'after'
              ? 'bg-[#14161c] border-dashed border-[#282d38] text-[#414856]'
              : 'bg-emerald-950/20 border-[#7fb069]/40 text-[#7fb069]'
          }`}>
            {step === 'after' ? '(empty)' : 'staged: config.json'}
          </div>
        </div>

        <ArrowRight className={`w-4 h-4 transition-colors ${step === 'after' ? 'text-[#e8703a]' : 'text-[#414856]'}`} />

        <div className="flex-1 p-3 rounded-xl bg-[#191d26] border border-[#2b313f] text-center">
          <span className="text-[10px] font-mono text-[#9599a3] block mb-1">Working Directory</span>
          <div className={`p-2 rounded border text-xs font-mono transition-all duration-500 ${
            step === 'after'
              ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
              : 'bg-[#14161c] border-[#252a36] text-[#62697b]'
          }`}>
            modified: config.json
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'config.json was removed from staging, but your edits on disk were kept safe!'
          : 'Unstages a file without destroying your work.'}
      </p>
    </div>
  );
};

export const ResetSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="relative flex items-center justify-between w-full max-w-md py-4">
        <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-[#2c323f] -translate-y-1/2" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#1e232e] border-2 border-[#62697b] flex items-center justify-center text-[10px] font-mono text-[#9599a3]">
            c1
          </div>
          <span className="text-[10px] font-mono text-[#62697b] mt-1">v1.0</span>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono transition-all ${
            step === 'after'
              ? 'bg-[#38bdf8] border-2 border-[#38bdf8] text-[#031326] font-bold shadow-[0_0_15px_rgba(56,189,248,0.4)]'
              : 'bg-[#1e232e] border-2 border-[#62697b] text-[#9599a3]'
          }`}>
            c2
          </div>
          <span className={`text-[10px] font-mono mt-1 ${step === 'after' ? 'text-[#38bdf8] font-bold' : 'text-[#62697b]'}`}>
            {step === 'after' ? 'HEAD -> main' : 'v1.1'}
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono transition-all duration-500 ${
            step === 'after'
              ? 'bg-[#161820] border-2 border-dashed border-[#414856] text-[#414856] opacity-40'
              : 'bg-[#7fb069] border-2 border-emerald-300 text-black'
          }`}>
            c3
          </div>
          <span className={`text-[10px] font-mono mt-1 ${step === 'after' ? 'text-[#414856] line-through' : 'text-[#7fb069]'}`}>
            {step === 'after' ? 'rewound' : 'HEAD'}
          </span>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'HEAD pointer moved backward along the timeline from c3 to c2!'
          : 'Rewinds the branch pointer back in time to an earlier commit.'}
      </p>
    </div>
  );
};

export const RevertSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="relative flex items-center justify-between w-full max-w-md py-4">
        <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-[#2c323f] -translate-y-1/2" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-red-950/40 border-2 border-red-500/60 flex items-center justify-center text-[10px] font-mono text-red-400">
            c2
          </div>
          <span className="text-[10px] font-mono text-red-400 mt-1">buggy commit</span>
        </div>

        <div className="flex flex-col items-center">
          <span className={`text-[10px] font-mono transition-colors ${step === 'after' ? 'text-[#7fb069]' : 'text-[#414856]'}`}>
            inverses
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-700 ${
            step === 'after'
              ? 'bg-[#7fb069] text-black shadow-[0_0_15px_rgba(127,176,105,0.4)] scale-110'
              : 'border-2 border-dashed border-[#414856] text-[#414856]'
          }`}>
            c3
          </div>
          <span className={`text-[10px] font-mono mt-1 ${step === 'after' ? 'text-[#7fb069] font-medium' : 'text-[#414856]'}`}>
            {step === 'after' ? 'Revert c2' : 'Inverse commit'}
          </span>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Safe undo: rather than erasing history, c3 applies the opposite changes to cancel c2.'
          : 'Creates a new commit that undoes an earlier mistake safely.'}
      </p>
    </div>
  );
};

export const RmSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="flex items-center gap-6 max-w-sm w-full justify-center">
        <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all duration-500 ${
          step === 'after'
            ? 'bg-red-950/10 border-red-500/20 opacity-30 scale-90'
            : 'bg-[#1a1e27] border-[#2c323f]'
        }`}>
          <Trash2 className={`w-5 h-5 ${step === 'after' ? 'text-red-400' : 'text-[#9599a3]'}`} />
          <div>
            <div className={`text-xs font-mono ${step === 'after' ? 'line-through text-red-400' : 'text-[#e8e6e1]'}`}>
              old-component.js
            </div>
            <div className="text-[10px] text-[#9599a3]">
              {step === 'after' ? 'deleted & staged' : 'tracked file'}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'File removed from your disk and deleted from the Git index in a single stroke.'
          : 'Removes a file and queues its deletion for commit.'}
      </p>
    </div>
  );
};

export const MvSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="flex items-center gap-4 max-w-md w-full justify-center">
        <div className={`p-3 rounded-lg border text-xs font-mono transition-all ${
          step === 'after' ? 'opacity-30 border-[#2a2f3b] text-[#62697b] line-through' : 'bg-[#1a1e27] border-[#2c323f] text-[#e8e6e1]'
        }`}>
          old-name.js
        </div>
        <ArrowRight className={`w-4 h-4 transition-colors ${step === 'after' ? 'text-[#7fb069]' : 'text-[#414856]'}`} />
        <div className={`p-3 rounded-lg border text-xs font-mono transition-all ${
          step === 'after' ? 'bg-[#18231c] border-[#7fb069]/60 text-[#7fb069] shadow-sm' : 'border-dashed border-[#2a2f3b] text-[#414856]'
        }`}>
          new-name.js
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Git tracked the rename smoothly! History of old-name.js is fully preserved.'
          : 'Renames or moves files without breaking Git commit history.'}
      </p>
    </div>
  );
};

export const CleanSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs text-center">
        {['temp.log', 'build-trash/', 'scratch.txt'].map((f) => (
          <div
            key={f}
            className={`p-2.5 rounded-lg border font-mono text-[11px] transition-all duration-700 ${
              step === 'after'
                ? 'opacity-0 scale-50 -translate-y-4'
                : 'bg-red-950/20 border-red-500/30 text-red-300'
            }`}
          >
            {f}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Swept clean! All untracked junk files removed, leaving your working directory tidy.'
          : 'Deletes stray files that Git is not tracking.'}
      </p>
    </div>
  );
};
