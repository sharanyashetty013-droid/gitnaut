import React from 'react';
import { Folder, FolderGit2, Shield, User, AtSign, ArrowRight, Laptop, Server, Check } from 'lucide-react';

interface SimProps {
  step: 'before' | 'running' | 'after';
}

export const InitSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="flex items-center justify-center gap-8 relative">
        <div className="flex flex-col items-center p-4 rounded-xl bg-[#1e222b] border border-[#2e3442] shadow-md transition-all duration-500">
          <Folder className="w-10 h-10 text-amber-400 mb-2" />
          <span className="text-xs font-mono font-medium text-[#e8e6e1]">my-project/</span>
          <span className="text-[11px] text-[#9599a3]">Standard folder</span>
        </div>

        <div className="flex flex-col items-center">
          <ArrowRight className={`w-5 h-5 transition-colors duration-300 ${step === 'after' ? 'text-[#7fb069]' : 'text-[#414856]'}`} />
          {step === 'running' && (
            <span className="text-[10px] text-[#e8703a] font-mono animate-pulse mt-1">initializing...</span>
          )}
        </div>

        <div className={`flex flex-col items-center p-4 rounded-xl border transition-all duration-700 ${
          step === 'after'
            ? 'bg-[#18231c] border-[#7fb069]/60 shadow-[0_0_20px_rgba(127,176,105,0.2)] scale-100 opacity-100'
            : step === 'running'
            ? 'bg-[#1e222b] border-[#e8703a]/50 scale-95 opacity-60 animate-pulse'
            : 'bg-[#181a20] border-dashed border-[#2e3442] opacity-30 scale-90'
        }`}>
          <FolderGit2 className={`w-10 h-10 mb-2 transition-colors duration-500 ${step === 'after' ? 'text-[#7fb069]' : 'text-[#62697b]'}`} />
          <span className="text-xs font-mono font-semibold text-[#e8e6e1]">.git/</span>
          <span className={`text-[11px] ${step === 'after' ? 'text-[#7fb069]' : 'text-[#9599a3]'}`}>
            {step === 'after' ? 'Hidden repo active' : 'Hidden snapshot db'}
          </span>
        </div>
      </div>

      <div className="mt-5 text-xs text-[#9599a3] text-center max-w-md">
        {step === 'before' && 'Ordinary directory with no version tracking.'}
        {step === 'running' && 'Creating hidden objects, refs, and HEAD pointers inside .git...'}
        {step === 'after' && (
          <span className="text-[#7fb069] flex items-center justify-center gap-1">
            <Check className="w-3.5 h-3.5 inline" /> Initialized empty Git repository in /my-project/.git/
          </span>
        )}
      </div>
    </div>
  );
};

export const CloneSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="flex items-center justify-between w-full max-w-md relative px-4">
        <div className="flex flex-col items-center p-3 rounded-xl bg-[#1e222b] border border-[#2e3442]">
          <Server className="w-8 h-8 text-[#61afef] mb-1.5" />
          <span className="text-xs font-mono text-[#e8e6e1]">github.com</span>
          <span className="text-[10px] text-[#9599a3]">remote repository</span>
        </div>

        <div className="flex-1 mx-4 flex flex-col items-center relative">
          <div className="w-full h-1 bg-[#282d39] rounded-full overflow-hidden relative">
            <div
              className={`h-full bg-gradient-to-r from-[#61afef] to-[#7fb069] transition-all duration-700 rounded-full ${
                step === 'after' ? 'w-full' : step === 'running' ? 'w-2/3 animate-pulse' : 'w-0'
              }`}
            />
          </div>
          <span className="text-[10px] font-mono text-[#9599a3] mt-2">
            {step === 'after' ? '100% downloaded' : step === 'running' ? 'Receiving objects...' : 'ready to clone'}
          </span>
        </div>

        <div className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-500 ${
          step === 'after'
            ? 'bg-[#18231c] border-[#7fb069]/60 shadow-lg scale-105'
            : 'bg-[#181a20] border-dashed border-[#2c323e] opacity-40'
        }`}>
          <Laptop className={`w-8 h-8 mb-1.5 ${step === 'after' ? 'text-[#7fb069]' : 'text-[#62697b]'}`} />
          <span className="text-xs font-mono text-[#e8e6e1]">local-folder/</span>
          <span className="text-[10px] text-[#9599a3]">full commit history</span>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after' ? 'Full project code + commit history successfully cloned to your disk.' : 'Downloads remote repo files and establishes origin tracking.'}
      </p>
    </div>
  );
};

export const ConfigSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="flex items-center gap-6 max-w-md w-full justify-center">
        <div className={`p-4 rounded-xl border transition-all duration-500 flex items-center gap-4 ${
          step === 'after'
            ? 'bg-[#0f172a] border-[#38bdf8]/60 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
            : 'bg-[#171a22] border-[#2c323e]'
        }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
            step === 'after' ? 'bg-[#38bdf8] text-[#031326]' : 'bg-[#2a2f3c] text-[#9599a3]'
          }`}>
            {step === 'after' ? 'AD' : '?'}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#e8e6e1]">
              <User className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>{step === 'after' ? 'Alex Dev' : 'Not configured'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#9599a3] mt-0.5">
              <AtSign className="w-3.5 h-3.5 text-[#9599a3]" />
              <span>{step === 'after' ? 'alex@example.com' : 'anonymous'}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Identity configured! Every future commit will permanently credit your name & email.'
          : 'Git needs to know who you are so commit history is clearly attributed.'}
      </p>
    </div>
  );
};

export const GitignoreSim: React.FC<SimProps> = ({ step }) => {
  const files = [
    { name: 'src/index.js', ignored: false, status: 'Tracked' },
    { name: '.env', ignored: true, status: 'Ignored (Secret)' },
    { name: 'node_modules/', ignored: true, status: 'Ignored (Heavy)' },
    { name: 'README.md', ignored: false, status: 'Tracked' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
        {files.map((file) => {
          const isIgnored = file.ignored && step === 'after';
          return (
            <div
              key={file.name}
              className={`p-3 rounded-lg border text-left transition-all duration-500 relative ${
                isIgnored
                  ? 'bg-[#15171c]/70 border-[#282d38] opacity-45'
                  : 'bg-[#1e222b] border-[#2e3442]'
              }`}
            >
              {isIgnored && (
                <Shield className="w-3.5 h-3.5 text-amber-500 absolute top-2 right-2" />
              )}
              <div className={`text-xs font-mono font-medium truncate ${isIgnored ? 'line-through text-[#62697b]' : 'text-[#e8e6e1]'}`}>
                {file.name}
              </div>
              <div className="text-[10px] text-[#9599a3] mt-1">
                {step === 'after' ? file.status : 'Pending rules'}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Git automatically shields .env (secrets) and node_modules/ from git status & commits!'
          : 'Without .gitignore, private API keys and megabytes of dependencies get committed by accident.'}
      </p>
    </div>
  );
};
