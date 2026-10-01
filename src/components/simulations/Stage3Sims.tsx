import React from 'react';
import { GitCommitHorizontal, User, GitGraph } from 'lucide-react';

interface SimProps {
  step: 'before' | 'running' | 'after';
}

export const LogSim: React.FC<SimProps> = ({ step }) => {
  const commits = [
    { hash: 'e4c1b90', msg: 'feat: add dark mode theme', author: 'Alex', time: '2 hours ago' },
    { hash: 'a7f93c2', msg: 'fix: address responsive padding', author: 'Sarah', time: '5 hours ago' },
    { hash: '1d84e21', msg: 'docs: update readme with quickstart', author: 'Alex', time: 'Yesterday' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="w-full max-w-md space-y-2.5">
        {commits.map((c, idx) => {
          const isRevealed = step === 'after' || (step === 'running' && idx < 2);
          return (
            <div
              key={c.hash}
              className={`p-2.5 rounded-lg border font-mono text-xs transition-all duration-500 flex items-center justify-between ${
                isRevealed
                  ? 'bg-[#1b2029] border-[#2e3544] translate-x-0 opacity-100'
                  : 'bg-[#15171e] border-[#222732] -translate-x-3 opacity-30'
              }`}
            >
              <div className="flex items-center gap-2">
                <GitCommitHorizontal className={`w-4 h-4 ${isRevealed ? 'text-[#38bdf8]' : 'text-[#414856]'}`} />
                <span className="text-[#38bdf8] font-semibold">{c.hash}</span>
                <span className="text-[#e8e6e1] truncate max-w-[170px]">{c.msg}</span>
              </div>
              <div className="text-[10px] text-[#9599a3] shrink-0">
                {c.author} • {c.time}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'git log reveals your project history chronologically from most recent to oldest.'
          : 'Inspects full repository commit history.'}
      </p>
    </div>
  );
};

export const LogGraphSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="w-full max-w-md rounded-xl bg-[#171a22] border border-[#2c323f] p-3 font-mono text-xs shadow-inner">
        <div className="text-[10px] text-[#9599a3] mb-2 flex items-center justify-between border-b border-[#252a36] pb-1">
          <span className="flex items-center gap-1.5 text-[#61afef]">
            <GitGraph className="w-3.5 h-3.5" /> git log --oneline --graph
          </span>
          <span>visual branch topology</span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-[#7fb069] font-bold">*</span>
            <span className="text-amber-400">c93f12a</span>
            <span className="text-[#e8e6e1] truncate">(HEAD -&gt; main) Merge branch 'feature'</span>
          </div>
          <div className="flex items-center gap-2 text-[#61afef]">
            <span>| \</span>
            <span className="text-[10px] text-[#9599a3]">fork point</span>
          </div>
          <div className={`flex items-center gap-2 transition-opacity duration-500 ${step === 'after' ? 'opacity-100' : 'opacity-40'}`}>
            <span className="text-[#e8703a] font-bold">|  *</span>
            <span className="text-amber-400">8b71d9e</span>
            <span className="text-[#e8e6e1] truncate">(feature) implement auth modal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#7fb069] font-bold">* /</span>
            <span className="text-amber-400">12a88fe</span>
            <span className="text-[#9599a3] truncate">initial project setup</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'Compact ASCII graph visualizes parallel branches, merge joins, and commit lineage instantly.'
          : 'ASCII tree representation of all diverging and converging branches.'}
      </p>
    </div>
  );
};

export const ShowSim: React.FC<SimProps> = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="w-full max-w-md">
        <div className={`rounded-xl border transition-all duration-500 p-3.5 ${
          step === 'after'
            ? 'bg-[#0f172a] border-[#38bdf8]/60 shadow-[0_0_20px_rgba(56,189,248,0.2)] scale-100'
            : 'bg-[#171a22] border-[#2a2f3c] scale-95'
        }`}>
          <div className="flex items-center justify-between border-b border-[#282d3a] pb-2 mb-2 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#38bdf8] font-bold">commit a7f93c2</span>
              <span className="text-[10px] text-[#7fb069] bg-[#7fb069]/10 px-1.5 py-0.5 rounded">HEAD</span>
            </div>
            <span className="text-[10px] text-[#9599a3]">Author: Alex Dev</span>
          </div>
          <div className="text-xs text-[#e8e6e1] font-medium mb-2 font-sans">
            "Optimize database connection pool and retry logic"
          </div>
          <div className="bg-[#12141a] rounded p-2 text-[11px] font-mono space-y-0.5 border border-[#252a36]">
            <div className="text-[#62697b]">--- a/db.js</div>
            <div className="text-[#62697b]">+++ b/db.js</div>
            <div className="text-red-400 bg-red-950/20 px-1">- maxConnections: 10</div>
            <div className="text-[#7fb069] bg-emerald-950/20 px-1">+ maxConnections: 50</div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'git show pops open that exact commit to reveal the full patch diff, author, and timestamp.'
          : 'Deep dive into an individual commit snapshot.'}
      </p>
    </div>
  );
};

export const BlameSim: React.FC<SimProps> = ({ step }) => {
  const lines = [
    { num: 1, author: 'Alex', hash: '4f2a', date: '2d ago', code: 'export function calculateTotal(items) {' },
    { num: 2, author: 'Sarah', hash: '9b1c', date: '3w ago', code: '  return items.reduce((acc, item) =>' },
    { num: 3, author: 'Alex', hash: '4f2a', date: '2d ago', code: '    acc + (item.price * item.qty), 0);' },
    { num: 4, author: 'David', hash: '18dc', date: '1m ago', code: '}' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[190px] w-full">
      <div className="w-full max-w-md rounded-xl bg-[#161820] border border-[#2b313e] p-2.5 font-mono text-xs overflow-hidden shadow-inner">
        <div className="space-y-1">
          {lines.map((ln) => (
            <div key={ln.num} className="flex items-center gap-2 py-0.5 px-1 hover:bg-[#1f2430] rounded">
              <div className={`flex items-center gap-1.5 text-[10px] shrink-0 border-r border-[#2c323f] pr-2 transition-all ${
                step === 'after' ? 'text-[#38bdf8] opacity-100 font-semibold' : 'text-[#414856] opacity-40'
              }`}>
                <User className="w-3 h-3 text-[#38bdf8]" />
                <span className="w-10 truncate">{ln.author}</span>
                <span className="text-[#62697b]">{ln.hash}</span>
              </div>
              <div className="text-[11px] text-[#e8e6e1] truncate flex-1">
                {ln.code}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-[#9599a3] text-center">
        {step === 'after'
          ? 'git blame annotates each line with who wrote it, in what commit, and when.'
          : 'Find the author and context behind every line of code.'}
      </p>
    </div>
  );
};
