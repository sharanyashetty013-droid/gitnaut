import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GitStage, StageId } from '../types/git';
import { CommandCard } from './CommandCard';
import { playSound } from '../utils/sound';
import { openGitnautAI } from './AskGitnautAI';
import { UfoQuestionShip } from './UfoQuestionShip';

interface StageViewProps {
  stage: GitStage;
  learnedCommandIds: string[];
  onToggleLearned: (id: string) => void;
  onBackToDashboard: () => void;
  onSelectStage: (stageId: StageId) => void;
  prevStage: GitStage | null;
  nextStage: GitStage | null;
  targetCommandId?: string | null;
}

export const StageView: React.FC<StageViewProps> = ({
  stage,
  learnedCommandIds,
  onToggleLearned,
  onBackToDashboard,
  onSelectStage,
  prevStage,
  nextStage,
  targetCommandId,
}) => {
  const totalInStage = stage.commands.length;
  const learnedInStage = stage.commands.filter((c) =>
    learnedCommandIds.includes(c.id)
  ).length;
  const isComplete = totalInStage > 0 && learnedInStage === totalInStage;
  const progressPercent = totalInStage > 0 ? Math.round((learnedInStage / totalInStage) * 100) : 0;

  useEffect(() => {
    if (targetCommandId) {
      const el = document.getElementById(`command-${targetCommandId}`);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [stage.id, targetCommandId]);

  return (
    <div className="w-full space-y-6 sm:space-y-8 min-w-0 font-sans">
      {/* Top stage navigation */}
      <div className="flex items-center justify-between pt-1 gap-2 flex-wrap min-w-0">
        <button
          onClick={() => {
            playSound('click');
            onBackToDashboard();
          }}
          className="btn-secondary text-sm min-touch"
        >
          <ArrowLeft className="w-4 h-4 text-cyan" strokeWidth={1.75} />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2 text-sm flex-wrap">
          {prevStage && (
            <button
              onClick={() => {
                playSound('click');
                onSelectStage(prevStage.id);
              }}
              className="btn-secondary text-sm min-touch"
              title={`Previous: ${prevStage.title}`}
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
              <span>Stage 0{prevStage.number}</span>
            </button>
          )}
          {nextStage && (
            <button
              onClick={() => {
                playSound('click');
                onSelectStage(nextStage.id);
              }}
              className="btn-secondary text-sm min-touch"
              title={`Next: ${nextStage.title}`}
            >
              <span>Stage 0{nextStage.number}</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      {/* Stage Banner */}
      <div className="card-base p-4 sm:p-6 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 min-w-0">
          <div className="space-y-1.5 min-w-0 max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-link font-mono">
              <span>Stage 0{stage.number}</span>
              <span className="text-border">•</span>
              <span>{stage.subtitle}</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text tracking-normal leading-tight">
              {stage.title}
            </h1>
            <p className="text-base text-text-muted leading-relaxed">
              {stage.description}
            </p>
          </div>

          {/* Stage Progress Box */}
          <div className="md:self-center shrink-0 p-3.5 sm:p-4 rounded-xl bg-surface-2 border border-border flex flex-col items-center min-w-[170px] shadow-sm w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm font-bold text-text mb-2">
              {isComplete ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-accent" strokeWidth={1.75} />
                  <span className="text-accent">Stage Certified</span>
                </>
              ) : (
                <span>Stage Progress</span>
              )}
            </div>
            <div className="w-full bg-track h-2 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-accent transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-sm text-text-muted font-medium">
              <span className="font-bold text-text">{learnedInStage}</span> of {totalInStage} Mastered ({progressPercent}%)
            </div>
          </div>
        </div>

        {/* UFO Stage Copilot Helper Banner */}
        <div className="mt-4 pt-3.5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm min-w-0">
          <div className="flex items-center gap-3 text-text">
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <UfoQuestionShip size="sm" interactive={false} className="!w-9 !h-9" />
            </div>
            <span className="line-clamp-2 sm:line-clamp-none">
              Need a clear explanation for this stage? <strong className="text-accent font-semibold">Gitnaut UFO Copilot</strong> is available.
            </span>
          </div>
          <button
            onClick={() => {
              playSound('warp');
              openGitnautAI(`Can you explain the key concepts and commands for Stage ${stage.number} (${stage.title})?`);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-border border border-border text-accent hover:border-accent font-bold cursor-pointer transition-colors self-start sm:self-auto min-touch shrink-0"
          >
            <span>Ask UFO Copilot</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Commands List Header */}
      <div className="flex items-center justify-between pt-2 border-b border-border/80 pb-3">
        <h2 className="font-heading text-xl font-bold text-text">
          Interactive Command Modules
        </h2>
        <span className="text-xs text-text-muted font-semibold">
          Click any module to simulate
        </span>
      </div>

      {/* Commands List Cards */}
      <div className="space-y-4">
        {stage.commands.map((command, idx) => (
          <CommandCard
            key={command.id}
            command={command}
            index={idx}
            isLearned={learnedCommandIds.includes(command.id)}
            onToggleLearned={onToggleLearned}
            isOpenDefault={idx === 0}
          />
        ))}
      </div>

      {/* Bottom Stage Completion Banner / Next Step */}
      <div className="card-base p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-text">
            {isComplete ? 'Stage Complete! Ready for the next orbit?' : `${totalInStage - learnedInStage} commands remaining in this stage`}
          </h3>
          <p className="text-sm text-text-muted mt-0.5">
            {isComplete ? 'Keep your mastery streak flying high.' : 'Interact with each simulator to test commands and verify your learning.'}
          </p>
        </div>

        {nextStage ? (
          <button
            onClick={() => {
              playSound('levelUp');
              onSelectStage(nextStage.id);
            }}
            className="btn-primary shrink-0 text-sm"
          >
            <span>Proceed to Stage 0{nextStage.number}</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          </button>
        ) : (
          <button
            onClick={() => {
              playSound('click');
              onBackToDashboard();
            }}
            className="btn-primary shrink-0 text-sm"
          >
            <span>Back to Dashboard</span>
          </button>
        )}
      </div>
    </div>
  );
};
