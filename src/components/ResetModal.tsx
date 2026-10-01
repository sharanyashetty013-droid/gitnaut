import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="card-base w-full max-w-md p-6 rounded-[12px] space-y-4 text-text font-sans">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-[10px] bg-danger/15 border border-danger">
            <AlertTriangle className="w-5 h-5 text-danger" strokeWidth={1.75} />
          </div>
          <h3 className="font-heading text-lg font-bold text-text">
            Reset Git Learning Progress?
          </h3>
        </div>
        <p className="text-sm text-text-muted leading-relaxed font-sans">
          This will uncheck all mastered commands so you can practice the curriculum lessons from scratch. This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <button
            onClick={onCancel}
            className="btn-secondary text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="min-h-[44px] px-5 py-2.5 rounded-[10px] text-sm font-bold text-accent-ink bg-danger hover:opacity-90 transition-opacity cursor-pointer"
          >
            Yes, Reset All
          </button>
        </div>
      </div>
    </div>
  );
};
