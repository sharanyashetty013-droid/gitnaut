import React from 'react';

/**
 * Parses markdown-style backticks `code` into styled monospace chips.
 * Command chips and code: --surface-2 background with --text and 1px --border.
 */
export function renderFormattedCodeText(text: string): React.ReactNode {
  if (!text) return null;
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          const codeContent = part.slice(1, -1);
          return (
            <code
              key={idx}
              className="font-mono text-[12px] bg-surface-2 text-text px-1.5 py-0.5 rounded border border-border font-semibold mx-0.5 inline-block align-baseline"
            >
              {codeContent}
            </code>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </>
  );
}

/**
 * Standardized command chip component using semantic tokens.
 */
export const CommandChip: React.FC<{ command: string; className?: string }> = ({
  command,
  className = '',
}) => {
  const clean = command.replace(/^\$/, '').trim();
  return (
    <code
      className={`font-mono text-xs bg-surface-2 text-text px-2 py-0.5 rounded-md border border-border font-semibold inline-flex items-center gap-1 shadow-xs ${className}`}
    >
      <span className="text-accent select-none font-bold">$</span>
      <span>{clean}</span>
    </code>
  );
};
