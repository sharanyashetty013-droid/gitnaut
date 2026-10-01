import React from 'react';
import { FileCode, Plus, Minus, ArrowRight, CheckCircle2, Layers } from 'lucide-react';

interface SimProps {
  step: 'before' | 'running' | 'after';
}

export const StatusSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <div className="p-3.5 rounded-xl bg-[#1a1e26] border border-[#2b313e]">
          <div className="text-[11px] font-mono text-[#9599a3] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Working Tree</span>
            <span className="text-amber-400 text-[10px]">Unstaged</span>
          </div>
          <div className={`p-2 rounded border transition-all duration-500 flex items-center justify-between ${
            step === 'after'
              ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
              : 'bg-[#15171e] border-[#252a36] text-[#e8e6e1]'
          }`}>
            <span className="text-xs font-mono">modified: app.js</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">M</span>
          </div>
          <div className={`mt-2 p-2 rounded border transition-all duration-500 flex items-center justify-between ${
            step === 'after'
              ? 'bg-red-950/20 border-red-500/40 text-red-300'
              : 'bg-[#15171e] border-[#252a36] text-[#e8e6e1]'
          }`}>
            <span className="text-xs font-mono">untracked: test.js</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">??</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#1a1e26] border border-[#2b313e]">
          <div className="text-[11px] font-mono text-[#9599a3] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Staging Area</span>
            <span className="text-[#7fb069] text-[10px]">To be committed</span>
          </div>
          <div className={`p-2 rounded border transition-all duration-500 flex items-center justify-between ${
            step === 'after'
              ? 'bg-emerald-950/20 border-[#7fb069]/40 text-[#7fb069]'
              : 'bg-[#15171e] border-[#252a36] text-[#62697b]'
          }`}>
            <span className="text-xs font-mono">staged: style.css</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#7fb069]/10 text-[#7fb069]">A</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'git status gives you instant X-ray vision into unstaged edits, untracked files, and staged ready items.'
          : 'Run git status anytime to avoid guessing what files have changed.'}
      </p>
    </div>
  );
};

export const AddSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-lg">
        <div className="flex-1 p-3.5 rounded-xl bg-[#1c202a] border border-[#2c323f] w-full text-center">
          <span className="text-[11px] font-mono text-[#9599a3] block mb-2">Working Directory</span>
          <div className={`p-2.5 rounded-lg border transition-all duration-500 flex items-center justify-center gap-2 ${
            step === 'after'
              ? 'bg-[#14171d] border-[#252a36] opacity-40 scale-95'
              : 'bg-amber-950/30 border-amber-500/50 text-amber-300 shadow-sm'
          }`}>
            <FileCode className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono">app.js</span>
            <span className="text-[10px] text-amber-400">{step === 'after' ? 'clean copy' : 'modified'}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <ArrowRight className={`w-5 h-5 transition-all duration-500 ${
            step === 'running' || step === 'after' ? 'text-[#7fb069] scale-125' : 'text-[#414856]'
          }`} />
          <span className="text-[9px] font-mono text-[#9599a3] mt-1">stages</span>
        </div>

        <div className={`flex-1 p-3.5 rounded-xl border transition-all duration-500 w-full text-center ${
          step === 'after'
            ? 'bg-[#18231c] border-[#7fb069]/60 shadow-[0_0_15px_rgba(127,176,105,0.15)]'
            : 'bg-[#1c202a] border-[#2c323f]'
        }`}>
          <span className="text-[11px] font-mono text-[#9599a3] block mb-2">Staging Box (Index)</span>
          <div className={`p-2.5 rounded-lg border transition-all duration-500 flex items-center justify-center gap-2 ${
            step === 'after'
              ? 'bg-[#1e3023] border-[#7fb069] text-[#7fb069] scale-100'
              : 'bg-[#14171d] border-dashed border-[#2b313e] opacity-40'
          }`}>
            <CheckCircle2 className={`w-4 h-4 ${step === 'after' ? 'text-[#7fb069]' : 'text-[#62697b]'}`} />
            <span className="text-xs font-mono font-medium">app.js</span>
            <span className="text-[10px]">{step === 'after' ? 'staged!' : 'empty'}</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'app.js is now safely in the staging area, queued up for your next snapshot.'
          : 'Staging lets you curate exactly which changes belong in each commit.'}
      </p>
    </div>
  );
};

export const CommitSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="relative flex items-center justify-center w-full max-w-md py-4">
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#2e3442] -translate-y-1/2" />
        <div className="relative z-10 flex items-center justify-between w-full px-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#1e232e] border-2 border-[#62697b] flex items-center justify-center text-[10px] font-mono text-[#9599a3]">
              9a1c
            </div>
            <span className="text-[10px] font-mono text-[#62697b] mt-1">Initial</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#1e232e] border-2 border-[#62697b] flex items-center justify-center text-[10px] font-mono text-[#9599a3]">
              4b2d
            </div>
            <span className="text-[10px] font-mono text-[#62697b] mt-1">Navbar</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-700 ${
              step === 'after'
                ? 'bg-[#7fb069] border-2 border-emerald-300 text-black shadow-[0_0_20px_rgba(127,176,105,0.4)] scale-110'
                : step === 'running'
                ? 'bg-[#38bdf8] text-[#031326] animate-bounce scale-100'
                : 'border-2 border-dashed border-[#414856] text-[#414856] scale-90'
            }`}>
              {step === 'after' ? 'f83a' : '+'}
            </div>
            <div className="flex flex-col items-center mt-1">
              <span className={`text-[10px] font-mono font-medium transition-colors ${
                step === 'after' ? 'text-[#7fb069]' : 'text-[#62697b]'
              }`}>
                {step === 'after' ? 'HEAD -> main' : 'Staged files'}
              </span>
              <span className="text-[9px] text-[#9599a3] italic">"Fix login click"</span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Snapshot sealed permanently with hash f83a and descriptive message!'
          : 'Commits are immutable checkpoints you can always roll back or review.'}
      </p>
    </div>
  );
};

export const DiffSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="w-full max-w-md rounded-xl bg-[#171a22] border border-[#2b313e] p-3 font-mono text-xs shadow-inner">
        <div className="text-[11px] text-[#9599a3] border-b border-[#252a36] pb-1.5 mb-2 flex items-center justify-between">
          <span>diff --git a/app.js b/app.js</span>
          <span className="text-[10px] text-amber-400">working vs staged</span>
        </div>
        <div className="space-y-1">
          <div className="text-[#62697b] pl-4">function handleSubmit(e) &#123;</div>
          <div className={`flex items-center gap-2 px-2 py-0.5 rounded transition-all duration-500 ${
            step === 'after' ? 'bg-red-950/40 text-red-400' : 'text-[#62697b]'
          }`}>
            <Minus className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className={step === 'after' ? 'line-through' : ''}>console.log("Submitting...");</span>
          </div>
          <div className={`flex items-center gap-2 px-2 py-0.5 rounded transition-all duration-500 ${
            step === 'after' ? 'bg-emerald-950/40 text-[#7fb069]' : 'opacity-20 text-[#62697b]'
          }`}>
            <Plus className="w-3.5 h-3.5 text-[#7fb069] shrink-0" />
            <span>await authenticateUser(credentials);</span>
          </div>
          <div className="text-[#62697b] pl-4">&#125;</div>
        </div>
      </div>
      <p className="mt-3 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'git diff highlights exact lines added (+) and removed (-) so you never push surprises.'
          : 'Shows real-time additions and removals before staging.'}
      </p>
    </div>
  );
};

export const DiffStagedSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="w-full max-w-md rounded-xl bg-[#171a22] border border-[#2b313e] p-3 font-mono text-xs shadow-inner">
        <div className="text-[11px] text-[#9599a3] border-b border-[#252a36] pb-1.5 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#7fb069]" />
            <span>diff --cached (staged changes)</span>
          </div>
          <span className="text-[10px] text-[#7fb069]">ready for commit</span>
        </div>
        <div className="space-y-1">
          <div className="text-[#62697b] pl-4">export const config = &#123;</div>
          <div className={`flex items-center gap-2 px-2 py-0.5 rounded transition-all duration-500 ${
            step === 'after' ? 'bg-emerald-950/40 text-[#7fb069]' : 'text-[#62697b]'
          }`}>
            <Plus className="w-3.5 h-3.5 text-[#7fb069] shrink-0" />
            <span>timeoutMs: 5000,</span>
          </div>
          <div className={`flex items-center gap-2 px-2 py-0.5 rounded transition-all duration-500 ${
            step === 'after' ? 'bg-emerald-950/40 text-[#7fb069]' : 'text-[#62697b]'
          }`}>
            <Plus className="w-3.5 h-3.5 text-[#7fb069] shrink-0" />
            <span>retryCount: 3</span>
          </div>
          <div className="text-[#62697b] pl-4">&#125;;</div>
        </div>
      </div>
      <p className="mt-3 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'git diff --staged verifies what will go into the next commit snapshot vs last commit.'
          : 'Inspects only the files already staged with git add.'}
      </p>
    </div>
  );
};
