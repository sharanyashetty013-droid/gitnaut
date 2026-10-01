/**
 * Real User Activity Events Log System
 * Single source of truth for:
 * - XP
 * - Mastered command count (0/37 for new users)
 * - Daily streak (0-day streak for new users)
 * - Weekly goal (e.g. "0 of 5 days this week")
 * - Star map constellation visualization
 * - 7, 14, 30-day streak milestones
 * NO seed or mock data. Zero starting XP. Immediate real-time subscriber updates.
 */

export interface GitEvent {
  id: string;
  type: 'lesson' | 'drill' | 'command' | 'mission' | 'unlearn';
  commandId?: string;
  xp: number;
  timestamp: number;
  dateStr: string; // Local YYYY-MM-DD
}

const EVENTS_STORAGE_KEY_PREFIX = 'gitnaut_events_log_';
const LEARNED_STORAGE_KEY_PREFIX = 'gitnaut_learned_commands_';

type ActivityListener = () => void;
const listeners = new Set<ActivityListener>();

export function getLocalTodayDateStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateToLocalStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getStorageUserKey(): string {
  try {
    const raw = localStorage.getItem('gitnaut_auth_current_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.id) return parsed.id;
    }
  } catch {
    // Ignore error
  }
  return 'guest';
}

export function getActivityEvents(): GitEvent[] {
  if (typeof window === 'undefined') return [];
  const key = EVENTS_STORAGE_KEY_PREFIX + getStorageUserKey();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLearnedCommandIds(): string[] {
  if (typeof window === 'undefined') return [];
  const key = LEARNED_STORAGE_KEY_PREFIX + getStorageUserKey();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLearnedCommandIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  const key = LEARNED_STORAGE_KEY_PREFIX + getStorageUserKey();
  localStorage.setItem(key, JSON.stringify(ids));
  notifySubscribers();
}

export function logActivityEvent(eventData: {
  type: 'lesson' | 'drill' | 'command' | 'mission' | 'unlearn';
  commandId?: string;
  xp: number;
}): GitEvent {
  const dateStr = getLocalTodayDateStr();
  const newEvent: GitEvent = {
    id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: eventData.type,
    commandId: eventData.commandId,
    xp: eventData.xp,
    timestamp: Date.now(),
    dateStr,
  };

  if (typeof window !== 'undefined') {
    const key = EVENTS_STORAGE_KEY_PREFIX + getStorageUserKey();
    const existing = getActivityEvents();
    existing.push(newEvent);
    localStorage.setItem(key, JSON.stringify(existing));
    notifySubscribers();
  }

  return newEvent;
}

export function toggleCommandLearned(commandId: string): {
  isNowLearned: boolean;
  learnedIds: string[];
} {
  const current = getLearnedCommandIds();
  const isLearned = current.includes(commandId);
  let next: string[];

  if (isLearned) {
    next = current.filter((id) => id !== commandId);
    saveLearnedCommandIds(next);
    logActivityEvent({
      type: 'unlearn',
      commandId,
      xp: -25, // Adjust XP if unlearning
    });
    return { isNowLearned: false, learnedIds: next };
  } else {
    next = [...current, commandId];
    saveLearnedCommandIds(next);
    logActivityEvent({
      type: 'lesson',
      commandId,
      xp: 25,
    });
    return { isNowLearned: true, learnedIds: next };
  }
}

export function clearAllActivityEvents(): void {
  if (typeof window === 'undefined') return;
  const userKey = getStorageUserKey();
  localStorage.removeItem(EVENTS_STORAGE_KEY_PREFIX + userKey);
  localStorage.removeItem(LEARNED_STORAGE_KEY_PREFIX + userKey);
  notifySubscribers();
}

export function subscribeToActivity(callback: ActivityListener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notifySubscribers() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Error notifying activity listener', e);
    }
  });
}

/**
 * Computes all metrics strictly and exclusively from real events log.
 */
export function getAggregatedStats() {
  const events = getActivityEvents();
  const learnedIds = getLearnedCommandIds();
  const todayStr = getLocalTodayDateStr();

  // 1. Total XP: sum of all non-negative adjustments
  const xp = Math.max(0, events.reduce((acc, ev) => acc + (ev.xp || 0), 0));

  // 2. Commands practiced per date
  const eventsByDate: Record<string, number> = {};
  events.forEach((ev) => {
    if (ev.type !== 'unlearn') {
      eventsByDate[ev.dateStr] = (eventsByDate[ev.dateStr] || 0) + 1;
    }
  });

  // 3. Unique active days
  const activeDays = Object.keys(eventsByDate).sort();

  // 4. Consecutive day streak calculation
  let streak = 0;
  if (activeDays.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hasToday = activeDays.includes(todayStr);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDateToLocalStr(yesterday);
    const hasYesterday = activeDays.includes(yesterdayStr);

    if (hasToday || hasYesterday) {
      let checkDate = hasToday ? new Date(today) : new Date(yesterday);
      while (true) {
        const checkStr = formatDateToLocalStr(checkDate);
        if (activeDays.includes(checkStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }

  // 5. Weekly goal (days active in current calendar week Monday-Sunday)
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek);
  monday.setHours(0, 0, 0, 0);

  let weeklyActiveDays = 0;
  for (let i = 0; i < 7; i++) {
    const checkD = new Date(monday);
    checkD.setDate(monday.getDate() + i);
    const dateStr = formatDateToLocalStr(checkD);
    if (eventsByDate[dateStr] && eventsByDate[dateStr] > 0) {
      weeklyActiveDays++;
    }
  }

  // 6. Milestones (7, 14, 30 days)
  const milestones = {
    7: streak >= 7,
    14: streak >= 14,
    30: streak >= 30,
  };

  return {
    xp,
    masteredCount: learnedIds.length,
    masteredIds: learnedIds,
    streak,
    weeklyActiveDays,
    totalActiveDays: activeDays.length,
    eventsByDate,
    milestones,
    todayStr,
  };
}
