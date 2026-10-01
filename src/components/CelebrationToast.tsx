import React, { useEffect } from 'react';
import { Trophy, Sparkles, X } from 'lucide-react';

interface CelebrationToastProps {
  stageTitle: string;
  onClose: () => void;
}

export const CelebrationToast: React.FC<CelebrationToastProps> = ({
  stageTitle,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-[calc(100%-32px)] sm:w-auto p-4 rounded-xl bg-surface border border-accent shadow-xl overflow-hidden font-sans animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-start gap-3 relative z-10">
        <div className="p-2.5 rounded-[10px] bg-accent/15 text-accent border border-accent/30 shrink-0">
          <Trophy className="w-5 h-5 text-accent" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-accent font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-accent" strokeWidth={1.75} />
            <span>Stage Certified!</span>
          </div>
          <h4 className="font-heading text-sm font-bold text-text mt-0.5 truncate">
            {stageTitle}
          </h4>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Every command in this stage has been certified. Well done!
          </p>
        </div>
        <button
          onClick={onClose}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-muted hover:text-text rounded-[8px] -mr-2 -mt-2 cursor-pointer"
          aria-label="Dismiss celebration"
        >
          <X className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
};
