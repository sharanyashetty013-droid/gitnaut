import { UserProgress } from '../types/git';
import { GIT_STAGES } from '../data/gitStages';
import {
  getLearnedCommandIds,
  toggleCommandLearned,
  clearAllActivityEvents,
  getActivityEvents,
  getLocalTodayDateStr,
} from './activityEvents';

export function getTodayKey(): string {
  return getLocalTodayDateStr();
}

export function loadProgress(): UserProgress {
  const learnedIds = getLearnedCommandIds();
  const events = getActivityEvents();

  // Real active dates
  const activeDateSet = new Set<string>();
  events.forEach((ev) => {
    if (ev.type !== 'unlearn' && ev.dateStr) {
      activeDateSet.add(ev.dateStr);
    }
  });

  // Calculate completed stages from real mastered commands
  const completedStageIds: string[] = [];
  for (const stage of GIT_STAGES) {
    if (stage.commands.length === 0) continue;
    const allStageDone = stage.commands.every((cmd) => learnedIds.includes(cmd.id));
    if (allStageDone) {
      completedStageIds.push(stage.id);
    }
  }

  return {
    learnedCommandIds: learnedIds,
    lastLearnedCommandId: learnedIds.length > 0 ? learnedIds[learnedIds.length - 1] : null,
    streakDates: Array.from(activeDateSet).sort(),
    completedStageIds,
  };
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('git_from_zero_progress_v1', JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
}

export function toggleLearnedState(commandId: string): {
  progress: UserProgress;
  isNowLearned: boolean;
  stageJustCompleted: string | null;
} {
  const beforeCompletedStages = loadProgress().completedStageIds;
  const { isNowLearned, learnedIds } = toggleCommandLearned(commandId);
  const updatedProgress = loadProgress();

  let stageJustCompleted: string | null = null;
  for (const stage of GIT_STAGES) {
    if (stage.commands.length === 0) continue;
    const allStageDone = stage.commands.every((cmd) => learnedIds.includes(cmd.id));
    if (allStageDone && !beforeCompletedStages.includes(stage.id) && isNowLearned) {
      stageJustCompleted = stage.title;
      break;
    }
  }

  return {
    progress: updatedProgress,
    isNowLearned,
    stageJustCompleted,
  };
}

export function resetProgress(): UserProgress {
  clearAllActivityEvents();
  return loadProgress();
}
