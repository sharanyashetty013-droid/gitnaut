import React, { useState, useEffect, useMemo } from 'react';
import { 
  FolderPlus, 
  Save, 
  Clock, 
  RotateCcw, 
  GitBranch, 
  CloudUpload, 
  Zap, 
  BookmarkCheck, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { GIT_STAGES, ALL_COMMANDS } from '../data/gitStages';
import { StageId } from '../types/git';
import { UserProfile } from '../utils/auth';
import { getAggregatedStats, subscribeToActivity } from '../utils/activityEvents';
import { playSound } from '../utils/sound';
import { StarMap } from './StarMap';
import { CommandChip } from '../utils/textUtils';
import { UfoQuestionShip } from './UfoQuestionShip';
import { openGitnautAI } from './AskGitnautAI';

interface DashboardProps {
  currentUser: UserProfile | null;
  onSelectStage: (stageId: StageId, targetCommandId?: string) => void;
  onOpenGame: () => void;
  onOpenAuth: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  onSelectStage,
  onOpenGame,
}) => {
  const [stats, setStats] = useState(() => getAggregatedStats());
  const [showMoreSections, setShowMoreSections] = useState(false);

  useEffect(() => {
    const unsub = subscribeToActivity(() => {
      setStats(getAggregatedStats());
    });
    return unsub;
  }, []);

  const learnedCount = stats.masteredCount;
  const hasProgress = learnedCount > 0;

  // Extract first name
  const firstName = currentUser?.displayName 
    ? currentUser.displayName.split(' ')[0] 
    : 'Cadet';
  const greeting = hasProgress 
    ? `Welcome back, ${firstName}` 
    : `Welcome, ${firstName}`;

  // Find next unlearned command
  const nextUnlearnedCommand = useMemo(() => {
    const unlearned = ALL_COMMANDS.find((c) => !stats.masteredIds.includes(c.id));
    return unlearned || ALL_COMMANDS[0];
  }, [stats.masteredIds]);

  const getStageIcon = (stageId: string, isComplete: boolean, isDimmed: boolean) => {
    const iconClass = isComplete ? 'text-accent' : isDimmed ? 'text-text-muted' : 'text-accent';
    const strokeWidth = 1.75;
    switch (stageId) {
      case 'stage-1': return <FolderPlus className={`w-5 h-5 ${iconClass} shrink-0`} strokeWidth={strokeWidth} />;
      case 'stage-2': return <Save className={`w-5 h-5 ${iconClass} shrink-0`} strokeWidth={strokeWidth} />;
      case 'stage-3': return <Clock className={`w-5 h-5 ${iconClass} shrink-0`} strokeWidth={strokeWidth} />;
      case 'stage-4': return <RotateCcw className={`w-5 h-5 ${iconClass} shrink-0`} strokeWidth={strokeWidth} />;
      case 'stage-5': return <GitBranch className={`w-5 h-5 ${iconClass} shrink-0`} strokeWidth={strokeWidth} />;
      case 'stage-6': return <CloudUpload className={`w-5 h-5 ${iconClass} shrink-0`} strokeWidth={strokeWidth} />;
      case 'stage-7': return <Zap className={`w-5 h-5 ${iconClass} shrink-0`} strokeWidth={strokeWidth} />;
      case 'stage-8': return <BookmarkCheck className={`w-5 h-5 ${iconClass} shrink-0`} strokeWidth={strokeWidth} />;
      default: return <FolderPlus className={`w-5 h-5 ${iconClass} shrink-0`} strokeWidth={strokeWidth} />;
    }
  };

  return (
    <div className="w-full space-y-8 min-w-0 font-sans">
      {/* 1. TOP HERO */}
      <section className="pt-2 pb-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 min-w-0">
        <div className="space-y-1.5 min-w-0 max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-wider text-link font-mono">
            Flight Deck • Lessons
          </div>
          <h1 className="font-heading text-[28px] sm:text-[40px] font-bold text-text tracking-normal leading-tight">
            {greeting}
          </h1>
          <p className="text-base text-text-muted leading-normal line-clamp-1 sm:line-clamp-none">
            {hasProgress
              ? `You have mastered ${learnedCount} of 37 commands. Continue your lessons below.`
              : 'Master Git from zero through visual interactive models and spaceflight missions.'}
          </p>
        </div>

        {/* Continue Button */}
        <div className="w-full md:w-auto shrink-0">
          <button
            onClick={() => {
              playSound('click');
              onSelectStage(nextUnlearnedCommand.stageId, nextUnlearnedCommand.id);
            }}
            className="btn-primary w-full md:w-auto text-base py-3 px-6 shadow-sm justify-center whitespace-nowrap min-w-0"
          >
            <span className="truncate">Continue: {nextUnlearnedCommand.name}</span>
            <ArrowRight className="w-5 h-5 shrink-0" strokeWidth={1.75} />
          </button>
        </div>
      </section>

      {/* 2. COPILOT SECTION: Gitnaut UFO Copilot */}
      <section className="card-base p-4 sm:p-6 overflow-hidden min-w-0 border border-border bg-surface hover:border-accent/40 transition-colors">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 min-w-0">
          <div className="flex-1 space-y-3 min-w-0 text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-link font-mono">
                AI Flight Copilot
              </span>
              <span className="text-xs text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 rounded-full font-mono font-bold">
                Online
              </span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-text tracking-normal">
              Gitnaut UFO Copilot
            </h2>
            <p className="text-sm text-text-muted leading-relaxed max-w-lg">
              Got a Git question or stuck on a concept? Your cosmic flight copilot explains everything with clear analogies, diagrams, and commands.
            </p>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 pt-1">
              {['What is a commit?', 'Why git add?', 'What is a branch in simple terms?', 'Undo last commit'].map((q) => (
                <button
                  key={q}
                  onClick={() => openGitnautAI(q)}
                  className="text-xs bg-surface-2 hover:bg-border text-text border border-border px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>

          {/* UFO Question Ship Graphic */}
          <div className="shrink-0 flex flex-col items-center">
            <div 
              onClick={() => openGitnautAI()}
              className="cursor-pointer group flex flex-col items-center"
              title="Click the UFO to consult Gitnaut AI Copilot!"
            >
              <div className="w-[150px] sm:w-[180px] h-[160px] sm:h-[190px] flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                <UfoQuestionShip size="sm" interactive={false} />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openGitnautAI();
                }}
                className="mt-1 text-xs font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Launch UFO Copilot</span>
                <Sparkles className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURRICULUM STAGES */}
      <section className="space-y-4 sm:space-y-6 min-w-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-text tracking-normal">
              Curriculum Stages
            </h2>
            <p className="text-sm text-text-muted mt-0.5">
              Interactive visual lessons from repository setup to emergency recovery
            </p>
          </div>
          <div className="text-sm text-text-muted bg-surface border border-border px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap">
            <span className="text-accent font-bold">{learnedCount}</span>/37 Mastered
          </div>
        </div>

        {/* 8 Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 min-w-0">
          {GIT_STAGES.map((stage, idx) => {
            const isStage8 = stage.id === 'stage-8' || idx === 7;
            const stageCmdCount = stage.commands.length;
            const stageLearnedCount = stage.commands.filter((c) =>
              stats.masteredIds.includes(c.id)
            ).length;
            const isStageComplete = stageCmdCount > 0 && stageLearnedCount === stageCmdCount;
            const hasStarted = stageLearnedCount > 0;
            const isStage1 = stage.id === 'stage-1';
            const isDimmed = !isStage1 && !hasStarted && !isStage8 && !isStageComplete;

            return (
              <div
                key={stage.id}
                onClick={() => {
                  playSound('click');
                  onSelectStage(stage.id);
                }}
                className={`card-base p-4 sm:p-6 cursor-pointer h-full flex flex-col justify-between transition-all min-w-0 ${
                  isStageComplete
                    ? 'border-border hover:border-accent'
                    : isStage1 && !hasStarted
                    ? 'border-accent/70 hover:border-accent'
                    : 'border-border hover:border-accent/60'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center justify-between text-sm text-text-muted mb-3 font-medium gap-2">
                    <span className={`font-bold ${isDimmed ? 'text-text-muted' : 'text-text'}`}>
                      Stage 0{stage.number}
                    </span>
                    {isStage1 && !hasStarted ? (
                      <span className="text-accent-ink bg-accent px-2.5 py-0.5 rounded-lg text-sm font-bold shrink-0">
                        Start here
                      </span>
                    ) : isStage8 ? (
                      <span className="text-link bg-surface-2 px-2.5 py-0.5 rounded-lg border border-border text-sm font-semibold shrink-0">
                        Reference
                      </span>
                    ) : isStageComplete ? (
                      <span className="text-accent flex items-center gap-1.5 text-sm font-bold shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />
                        Completed
                      </span>
                    ) : hasStarted ? (
                      <span className="text-text-muted text-sm font-semibold shrink-0">
                        {stageLearnedCount}/{stageCmdCount} Mastered
                      </span>
                    ) : (
                      <span className="text-text-muted text-sm shrink-0">
                        {stageCmdCount} commands
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isDimmed ? 'bg-surface-2/60 border-border text-text-muted' : 'bg-surface-2 border-border text-accent'
                    }`}>
                      {getStageIcon(stage.id, isStageComplete, isDimmed)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-heading text-lg font-bold tracking-normal truncate ${
                        isDimmed ? 'text-text-muted' : 'text-text'
                      }`}>
                        {stage.title}
                      </h3>
                      <p className="text-sm text-text-muted mt-1 line-clamp-2 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3.5 border-t border-border flex items-center justify-between text-sm text-text-muted min-w-0">
                  <div className="w-full bg-track h-2 rounded-full overflow-hidden mr-3">
                    <div
                      className="h-full transition-all duration-300 rounded-full bg-accent"
                      style={{
                        width: isStage8
                          ? '100%'
                          : hasStarted
                          ? `${Math.round((stageLearnedCount / stageCmdCount) * 100)}%`
                          : '0%',
                      }}
                    />
                  </div>
                  <span className="tabular-nums shrink-0 font-semibold text-text text-sm">
                    {isStage8
                      ? 'Ready'
                      : hasStarted
                      ? `${Math.round((stageLearnedCount / stageCmdCount) * 100)}%`
                      : '0%'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. COLLAPSIBLE SECTION: Streak Map & Missions list */}
      <section className="pt-2 min-w-0">
        <button
          onClick={() => {
            playSound('click');
            setShowMoreSections(!showMoreSections);
          }}
          className="btn-secondary w-full py-3.5 text-base justify-center min-touch"
        >
          <span>{showMoreSections ? 'Hide streak map & mission practice' : 'Show streak map & mission practice'}</span>
          {showMoreSections ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0" strokeWidth={1.75} /> : <ChevronDown className="w-4 h-4 text-text-muted shrink-0" strokeWidth={1.75} />}
        </button>

        {showMoreSections && (
          <div className="space-y-8 animate-in fade-in duration-200 pt-6 min-w-0">
            {/* Constellation Star Map */}
            <StarMap />

            {/* Mission Nodes Arena */}
            <div className="card-base p-4 sm:p-6 space-y-6 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border min-w-0">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold uppercase tracking-wider text-link font-mono">
                      Flight Missions
                    </span>
                    <span className="text-sm text-text-muted bg-surface-2 px-2.5 py-0.5 rounded-lg border border-border font-medium">
                      7 Levels
                    </span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-text tracking-normal">
                    Interactive Flight Missions
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed max-w-xl">
                    Scenario-based flight missions: staging cargo, branching realities, and handling merge collisions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    playSound('levelUp');
                    onOpenGame();
                  }}
                  className="btn-secondary text-sm self-start sm:self-center shrink-0 min-touch"
                >
                  <span>Launch missions</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>

              {/* 7 Level Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 min-w-0">
                {[
                  { num: 1, title: 'Airlock Staging', cmd: 'git add', desc: 'Safe cargo staging' },
                  { num: 2, title: 'Multiverse Split', cmd: 'git switch -c', desc: 'Parallel branches' },
                  { num: 3, title: 'Subspace Pocket', cmd: 'git stash', desc: 'Save messy edits' },
                  { num: 4, title: 'Orbital Uplink', cmd: 'git push', desc: 'Remote uplink' },
                  { num: 5, title: 'Quantum Harvest', cmd: 'git cherry-pick', desc: 'Surgical commit' },
                  { num: 6, title: 'Tachyon Reversal', cmd: 'git revert', desc: 'Safe rollback' },
                  { num: 7, title: 'Omega Merge', cmd: 'git merge', desc: 'Seal collision' },
                ].map((lvl) => (
                  <div
                    key={lvl.num}
                    onClick={() => {
                      playSound('warp');
                      onOpenGame();
                    }}
                    className="bg-surface-2 border border-border p-3 sm:p-3.5 rounded-xl text-left cursor-pointer transition-all hover:border-accent hover:-translate-y-0.5 shadow-xs min-w-0"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-text-muted">
                        0{lvl.num}
                      </span>
                      <span className="text-sm text-accent font-bold">★</span>
                    </div>
                    <div className="font-bold text-sm text-text truncate">
                      {lvl.title}
                    </div>
                    <div className="mt-1.5">
                      <CommandChip command={lvl.cmd} className="text-sm py-0.5 px-1.5 font-mono" />
                    </div>
                    <div className="text-sm text-text-muted mt-2 line-clamp-1">
                      {lvl.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
