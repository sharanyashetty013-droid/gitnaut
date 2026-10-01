import React from 'react';
import { GitBranch, ArrowRight } from 'lucide-react';

interface SimProps {
  step: 'before' | 'running' | 'after';
}

export const BranchListSim: React.FC<SimProps> = ({ step }) => {
  const branches = [
    { name: 'main', active: false },
    { name: 'feature/login', active: true },
    { name: 'fix/navbar-mobile', active: false },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="w-full max-w-sm rounded-xl bg-[#161820] border border-[#2b313e] p-3 font-mono text-xs">
        <div className="text-[10px] text-[#9599a3] border-b border-[#252a36] pb-1.5 mb-2">
          $ git branch
        </div>
        <div className="space-y-1.5">
          {branches.map((b) => (
            <div
              key={b.name}
              className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${
                b.active && step === 'after'
                  ? 'bg-emerald-950/30 text-[#7fb069] font-bold'
                  : 'text-[#9599a3]'
              }`}
            >
              <span className="w-3">
                {b.active && step === 'after' ? '*' : ' '}
              </span>
              <span>{b.name}</span>
              {b.active && step === 'after' && (
                <span className="text-[10px] ml-auto font-normal text-[#7fb069]">HEAD</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Asterisk (*) and green highlight show you are currently working on feature/login.'
          : 'Lists all local branches in this repository.'}
      </p>
    </div>
  );
};

export const BranchCreateSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="relative w-full max-w-md py-4">
        <div className="flex items-center justify-between relative z-10 px-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#1e232e] border-2 border-[#62697b] flex items-center justify-center text-[10px] font-mono text-[#9599a3]">c1</div>
            <span className="text-[10px] font-mono text-[#62697b] mt-1">main</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#7fb069] text-black font-bold flex items-center justify-center text-[10px] font-mono">c2</div>
            <span className="text-[10px] font-mono text-[#7fb069] mt-1">HEAD -&gt; main</span>
          </div>
        </div>

        <div className="flex justify-end px-6 mt-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-xs transition-all duration-500 ${
            step === 'after'
              ? 'bg-[#1e2738] border-[#61afef] text-[#61afef] scale-100 opacity-100 shadow-md'
              : 'border-dashed border-[#2b313f] opacity-20 scale-90'
          }`}>
            <GitBranch className="w-3.5 h-3.5" />
            <span>feature/navbar</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'New branch pointer created pointing at c2! Notice HEAD is still on main.'
          : 'Creates a lightweight pointer to your current commit.'}
      </p>
    </div>
  );
};

export const CheckoutSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between p-2.5 rounded-lg border bg-[#181b24] border-[#292f3d]">
          <span className="text-xs font-mono text-[#e8e6e1] flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#7fb069]" /> main
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all ${
            step === 'after' ? 'text-[#62697b]' : 'bg-[#7fb069]/20 text-[#7fb069] font-bold'
          }`}>
            {step === 'after' ? 'inactive' : 'YOU ARE HERE (HEAD)'}
          </span>
        </div>

        <div className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-500 ${
          step === 'after'
            ? 'bg-[#18231c] border-[#7fb069]/60 shadow-[0_0_15px_rgba(127,176,105,0.2)]'
            : 'bg-[#181b24] border-[#292f3d]'
        }`}>
          <span className="text-xs font-mono text-[#e8e6e1] flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#38bdf8]" /> feature/navbar
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all ${
            step === 'after' ? 'bg-[#38bdf8] text-[#031326] font-bold' : 'text-[#62697b]'
          }`}>
            {step === 'after' ? 'YOU ARE HERE (HEAD)' : 'inactive'}
          </span>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Switched branch! Working files on your disk now match feature/navbar.'
          : 'Moves the HEAD pointer to an existing branch.'}
      </p>
    </div>
  );
};

export const CheckoutBSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="flex items-center justify-center gap-4 w-full max-w-md">
        <div className="p-3 rounded-xl bg-[#171a22] border border-[#2b313e] text-center flex-1">
          <span className="text-[10px] font-mono text-[#9599a3] block mb-1">Old State</span>
          <span className="text-xs font-mono text-[#e8e6e1]">main</span>
        </div>

        <ArrowRight className={`w-5 h-5 transition-colors ${step === 'after' ? 'text-[#38bdf8]' : 'text-[#414856]'}`} />

        <div className={`p-3 rounded-xl border text-center flex-1 transition-all duration-500 ${
          step === 'after' ? 'bg-[#0f172a] border-[#38bdf8]/70 shadow-md' : 'border-dashed border-[#2b313e] opacity-30'
        }`}>
          <span className="text-[10px] font-mono text-[#38bdf8] block mb-1">Spawned &amp; Active</span>
          <span className="text-xs font-mono font-bold text-[#e8e6e1]">feature/auth (HEAD)</span>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Created feature/auth and switched HEAD to it in a single command.'
          : 'Creates and switches to a new branch simultaneously.'}
      </p>
    </div>
  );
};

export const MergeSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="relative w-full max-w-md py-3">
        <div className="flex items-center justify-between relative z-10 px-4">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-[#1e232e] border border-[#62697b] flex items-center justify-center text-[10px] font-mono">c1</div>
            <span className="text-[10px] font-mono text-[#9599a3]">main</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-[#1e232e] border border-[#62697b] flex items-center justify-center text-[10px] font-mono">c2</div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-700 ${
              step === 'after'
                ? 'bg-[#7fb069] text-black shadow-[0_0_20px_rgba(127,176,105,0.4)] scale-110'
                : 'border-2 border-dashed border-[#414856] text-[#414856]'
            }`}>
              M
            </div>
            <span className={`text-[10px] font-mono mt-1 ${step === 'after' ? 'text-[#7fb069] font-bold' : 'text-[#414856]'}`}>
              {step === 'after' ? 'Merge commit' : 'converging'}
            </span>
          </div>
        </div>

        <div className={`flex justify-center mt-2 transition-all duration-500 ${
          step === 'after' ? 'opacity-40 translate-y-1' : 'opacity-100'
        }`}>
          <div className="flex items-center gap-2 text-xs font-mono text-[#e8703a] bg-[#1a1f2c] px-3 py-1 rounded-full border border-[#2b3345]">
            <GitBranch className="w-3.5 h-3.5" />
            <span>feature/login commits merged</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Merged! Feature history successfully incorporated into main via merge commit M.'
          : 'Integrates changes from another branch into your current branch.'}
      </p>
    </div>
  );
};

export const RebaseSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="w-full max-w-md py-2">
        <div className="text-[11px] font-mono text-[#9599a3] text-center mb-3">
          {step === 'after' ? 'Result: Pure Linear History' : 'Before: Diverged Branch History'}
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1e232e] border border-[#62697b] flex items-center justify-center text-[10px] font-mono text-[#9599a3]">c1</div>
          <div className="w-4 h-0.5 bg-[#2c323f]" />
          <div className="w-7 h-7 rounded-full bg-[#1e232e] border border-[#62697b] flex items-center justify-center text-[10px] font-mono text-[#9599a3]">c2</div>
          <div className="w-4 h-0.5 bg-[#2c323f]" />
          <div className="w-7 h-7 rounded-full bg-[#1e232e] border border-[#62697b] flex items-center justify-center text-[10px] font-mono text-[#9599a3]">c3</div>
          <div className="w-4 h-0.5 bg-[#2c323f]" />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-700 ${
            step === 'after'
              ? 'bg-[#38bdf8] text-[#031326] shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-110'
              : 'border-2 border-dashed border-[#414856] text-[#414856]'
          }`}>
            c4'
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Rebased! Branch commit was lifted and replayed on top of main, creating a clean linear timeline.'
          : 'Replays your commits on top of the target branch.'}
      </p>
    </div>
  );
};

export const BranchDeleteSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all duration-500 ${
        step === 'after'
          ? 'opacity-0 scale-75 -translate-y-2'
          : 'bg-[#181b24] border-[#2a303e]'
      }`}>
        <GitBranch className="w-5 h-5 text-red-400" />
        <div>
          <div className="text-xs font-mono text-[#e8e6e1]">feature/navbar</div>
          <div className="text-[10px] text-[#7fb069]">already merged into main</div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Deleted feature branch cleanly! Keeps your branch list minimal and organized.'
          : 'Deletes a merged branch safely.'}
      </p>
    </div>
  );
};
