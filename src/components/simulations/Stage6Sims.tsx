import React from 'react';
import { Cloud, ArrowUp, ArrowDown, Laptop, Link2 } from 'lucide-react';

interface SimProps {
  step: 'before' | 'running' | 'after';
}

export const RemoteListSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="w-full max-w-md rounded-xl bg-[#161820] border border-[#2b313e] p-3 font-mono text-xs">
        <div className="text-[10px] text-[#9599a3] border-b border-[#252a36] pb-1.5 mb-2">
          $ git remote -v
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between text-[#e8e6e1]">
            <span>origin  https://github.com/user/app.git</span>
            <span className="text-[#61afef] font-semibold">(fetch)</span>
          </div>
          <div className="flex items-center justify-between text-[#e8e6e1]">
            <span>origin  https://github.com/user/app.git</span>
            <span className="text-[#7fb069] font-semibold">(push)</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'origin is registered for both fetching (downloading) and pushing (uploading).'
          : 'Displays names and URLs of all registered remote repositories.'}
      </p>
    </div>
  );
};

export const RemoteAddSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="flex flex-col items-center p-3 rounded-xl bg-[#1c202a] border border-[#2c323f]">
          <Laptop className="w-7 h-7 text-[#e8e6e1] mb-1" />
          <span className="text-xs font-mono text-[#e8e6e1]">local repo</span>
        </div>

        <div className="flex-1 mx-4 flex flex-col items-center">
          <div className={`w-full h-0.5 border-t-2 transition-all duration-700 ${
            step === 'after'
              ? 'border-solid border-[#7fb069]'
              : 'border-dashed border-[#414856]'
          }`} />
          <div className="flex items-center gap-1 text-[10px] font-mono text-[#9599a3] mt-1.5">
            <Link2 className={`w-3.5 h-3.5 ${step === 'after' ? 'text-[#7fb069]' : 'text-[#414856]'}`} />
            <span>{step === 'after' ? 'linked: origin' : 'unconnected'}</span>
          </div>
        </div>

        <div className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-500 ${
          step === 'after'
            ? 'bg-[#18231c] border-[#7fb069]/60 shadow-[0_0_15px_rgba(127,176,105,0.2)]'
            : 'bg-[#1c202a] border-[#2c323f]'
        }`}>
          <Cloud className={`w-7 h-7 mb-1 ${step === 'after' ? 'text-[#7fb069]' : 'text-[#61afef]'}`} />
          <span className="text-xs font-mono text-[#e8e6e1]">origin (GitHub)</span>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Remote connection established! Your local repo now knows where to send code.'
          : 'Links a local repo to a remote repository URL.'}
      </p>
    </div>
  );
};

export const PushSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="flex flex-col items-center w-full max-w-sm">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1c212c] border border-[#2e3544] w-full justify-center">
          <Cloud className="w-5 h-5 text-[#61afef]" />
          <span className="text-xs font-mono text-[#e8e6e1]">origin / main</span>
          {step === 'after' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#7fb069]/20 text-[#7fb069] font-mono">
              up to date!
            </span>
          )}
        </div>

        <div className="my-3 flex flex-col items-center">
          <div className={`p-1.5 rounded-full border transition-all duration-700 ${
            step === 'after'
              ? '-translate-y-2 bg-[#7fb069] text-black border-emerald-300 shadow-[0_0_15px_rgba(127,176,105,0.5)]'
              : step === 'running'
              ? 'animate-bounce bg-[#38bdf8] text-[#031326] border-sky-400'
              : 'bg-[#1b202a] text-[#414856] border-[#2b313f]'
          }`}>
            <ArrowUp className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono text-[#9599a3] mt-1">uploading commit c3...</span>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#171a22] border border-[#292e3a] w-full justify-center">
          <Laptop className="w-4 h-4 text-[#9599a3]" />
          <span className="text-xs font-mono text-[#e8e6e1]">local: commit c3</span>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Push complete! Local commit c3 is now live on the remote GitHub repository.'
          : 'Uploads your local commits to the remote branch.'}
      </p>
    </div>
  );
};

export const PushUSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="flex items-center justify-center gap-4 w-full max-w-md">
        <div className="p-3 rounded-xl bg-[#171a22] border border-[#2b313e] text-center flex-1">
          <span className="text-[10px] font-mono text-[#9599a3] block mb-1">Local Branch</span>
          <span className="text-xs font-mono text-[#e8e6e1]">main</span>
        </div>

        <div className="flex flex-col items-center">
          <Link2 className={`w-5 h-5 transition-colors duration-500 ${
            step === 'after' ? 'text-[#7fb069]' : 'text-[#414856]'
          }`} />
          <span className="text-[9px] font-mono text-[#9599a3] mt-1">upstream pair</span>
        </div>

        <div className="p-3 rounded-xl border border-[#2b313e] text-center flex-1">
          <span className="text-[10px] font-mono text-[#9599a3] block mb-1">Tracking Upstream</span>
          <span className={`text-xs font-mono transition-colors ${
            step === 'after' ? 'text-[#7fb069] font-bold' : 'text-[#62697b]'
          }`}>
            origin/main
          </span>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Upstream tracking linked! Now you can simply run "git push" or "git pull" with no branch arguments.'
          : 'Pushes commits and locks default upstream tracking.'}
      </p>
    </div>
  );
};

export const PullSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="flex flex-col items-center w-full max-w-sm">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1c212c] border border-[#2e3544] w-full justify-center">
          <Cloud className="w-5 h-5 text-[#61afef]" />
          <span className="text-xs font-mono text-[#e8e6e1]">origin (Teammate commits c4, c5)</span>
        </div>

        <div className="my-3 flex flex-col items-center">
          <div className={`p-1.5 rounded-full border transition-all duration-700 ${
            step === 'after'
              ? 'translate-y-2 bg-[#7fb069] text-black border-emerald-300 shadow-[0_0_15px_rgba(127,176,105,0.5)]'
              : step === 'running'
              ? 'animate-bounce bg-[#61afef] text-white'
              : 'bg-[#1b202a] text-[#414856] border-[#2b313f]'
          }`}>
            <ArrowDown className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono text-[#9599a3] mt-1">downloading &amp; merging...</span>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#171a22] border border-[#292e3a] w-full justify-center">
          <Laptop className="w-4 h-4 text-[#9599a3]" />
          <span className="text-xs font-mono text-[#e8e6e1]">
            {step === 'after' ? 'Local updated to c5!' : 'Local currently at c3'}
          </span>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Pull finished! Incoming commits downloaded and automatically merged into your local branch.'
          : 'Downloads and integrates remote changes directly into your current branch.'}
      </p>
    </div>
  );
};

export const FetchSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="w-full max-w-md space-y-3">
        <div className="p-3 rounded-xl bg-[#171a22] border border-[#2b313e]">
          <div className="text-[10px] font-mono text-[#9599a3] mb-2 flex items-center justify-between">
            <span>Local Branch Status</span>
            <span className="text-amber-400">Notice: working files untouched!</span>
          </div>
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#7fb069] text-black font-bold flex items-center justify-center text-[10px] font-mono">c3</div>
              <span className="text-[10px] font-mono text-[#7fb069] mt-1">HEAD (you)</span>
            </div>
            <div className="w-8 h-0.5 bg-[#2c323f]" />
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full border-2 border-dashed flex items-center justify-center text-[10px] font-mono transition-all duration-500 ${
                step === 'after'
                  ? 'border-[#61afef] bg-[#61afef]/10 text-[#61afef] opacity-100'
                  : 'border-[#414856] text-[#414856] opacity-30'
              }`}>
                c4
              </div>
              <span className={`text-[10px] font-mono mt-1 ${step === 'after' ? 'text-[#61afef]' : 'text-[#414856]'}`}>
                origin/main
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Fetch downloaded the ghost commit c4 to your remote tracking cache without modifying your work!'
          : 'Safe inspection: downloads remote history without merging it.'}
      </p>
    </div>
  );
};
