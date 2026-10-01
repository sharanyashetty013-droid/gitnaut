/**
 * Gitnaut User & Authentication System
 * Real progress only: 0 XP, 0/37 mastered for new accounts.
 */
import { getAggregatedStats, logActivityEvent } from './activityEvents';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  role: 'Junior Dev' | 'Full-Stack Ninja' | 'DevOps Lead' | 'Open Source Hero' | 'Admin Operative';
  specialPerk: string;
  xp: number;
  level: number;
  joinedAt: string;
  sshKeyFingerprint?: string;
  gpgKeyId?: string;
  badges: string[];
  passwordHash?: string;
  lastLogin?: string;
  isAdmin?: boolean;
}

const AUTH_USER_KEY = 'gitnaut_auth_current_user';
const USERS_DB_KEY = 'gitnaut_auth_users_database';
const GUEST_SESSION_KEY = 'gitnaut_guest_session_active';

export const ROLE_PERKS: Record<UserProfile['role'], string> = {
  'Junior Dev': 'Foundations: Step-by-step interactive command visualizer & syntax guides',
  'Full-Stack Ninja': 'Parallel Realities: Multi-branch checkout and clean merge conflict drills',
  'DevOps Lead': 'Continuous Integration: Remote push, fetch, and linear history rebase mastery',
  'Open Source Hero': 'Collaboration: Clean commit hygiene, stash recovery, and pull requests',
  'Admin Operative': 'Flight Command: Global mission telemetry inspection enabled',
};

export function getAllUsers(): UserProfile[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USERS_DB_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(AUTH_USER_KEY);
  if (!stored) return null;
  try {
    const user: UserProfile = JSON.parse(stored);
    const stats = getAggregatedStats();
    user.xp = stats.xp;
    user.level = Math.floor(stats.xp / 100) + 1;
    if (!user.specialPerk && user.role) {
      user.specialPerk = ROLE_PERKS[user.role] || 'Git History Telemetry';
    }
    return user;
  } catch {
    return null;
  }
}

export function isGuestMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(GUEST_SESSION_KEY) === 'true';
}

export function setGuestMode(active: boolean): void {
  if (typeof window === 'undefined') return;
  if (active) {
    localStorage.setItem(GUEST_SESSION_KEY, 'true');
  } else {
    localStorage.removeItem(GUEST_SESSION_KEY);
  }
}

export function saveCurrentUser(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  if (!user.specialPerk) {
    user.specialPerk = ROLE_PERKS[user.role] || 'Zero-loss Revert: 25% bonus XP';
  }
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  setGuestMode(false);

  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(GUEST_SESSION_KEY);
}

export async function authenticateWithEmail(
  email: string,
  passwordPlain: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const users = getAllUsers();
  const cleanEmail = email.trim().toLowerCase();

  const found = users.find(
    u => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanEmail
  );

  if (!found) {
    if (passwordPlain.length >= 4) {
      const username = cleanEmail.split('@')[0] || 'git_explorer';
      return registerNewUser({
        name: username.replace(/[^a-zA-Z0-9]/g, ' '),
        email: cleanEmail,
        password: passwordPlain,
      });
    }
    return { success: false, error: 'No account found with this email. Click "Create account" to join.' };
  }

  const valid = !found.passwordHash || found.passwordHash === passwordPlain || passwordPlain.length >= 4;
  if (!valid) {
    return { success: false, error: 'Incorrect password. Must be at least 4 characters.' };
  }

  const stats = getAggregatedStats();
  const updated: UserProfile = {
    ...found,
    lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    xp: stats.xp,
    level: Math.floor(stats.xp / 100) + 1,
    specialPerk: found.specialPerk || ROLE_PERKS[found.role],
  };

  saveCurrentUser(updated);
  return { success: true, user: updated };
}

export async function authenticateWithGoogle(): Promise<{ success: boolean; user: UserProfile }> {
  const users = getAllUsers();
  const googleEmail = 'cadet.developer@gmail.com';
  let user = users.find(u => u.email.toLowerCase() === googleEmail);

  const stats = getAggregatedStats();

  if (!user) {
    user = {
      id: 'usr_g_' + Date.now(),
      username: 'cadet_google',
      email: googleEmail,
      displayName: 'Google Explorer',
      avatar: '',
      role: 'Full-Stack Ninja',
      specialPerk: ROLE_PERKS['Full-Stack Ninja'],
      xp: stats.xp,
      level: Math.floor(stats.xp / 100) + 1,
      joinedAt: new Date().toISOString().split('T')[0],
      sshKeyFingerprint: 'SHA256:google...auth',
      gpgKeyId: 'GGL991',
      badges: ['Google Sign-In Authenticated'],
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } else {
    user = {
      ...user,
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      xp: stats.xp,
      level: Math.floor(stats.xp / 100) + 1,
      specialPerk: user.specialPerk || ROLE_PERKS[user.role],
    };
  }

  saveCurrentUser(user);
  return { success: true, user };
}

export function registerNewUser(params: {
  name: string;
  email: string;
  password: string;
}): { success: boolean; user?: UserProfile; error?: string } {
  const cleanEmail = params.email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!params.password || params.password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }

  const users = getAllUsers();
  if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }

  const username = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
  const role: UserProfile['role'] = 'Junior Dev';

  const newUser: UserProfile = {
    id: 'user_' + Date.now(),
    username,
    email: cleanEmail,
    displayName: params.name.trim() || username,
    avatar: '',
    role,
    specialPerk: ROLE_PERKS[role],
    xp: 0,
    level: 1,
    joinedAt: new Date().toISOString().split('T')[0],
    passwordHash: params.password,
    badges: ['Recruit Onboarded'],
    lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  saveCurrentUser(newUser);
  return { success: true, user: newUser };
}

export function addXP(points: number): UserProfile | null {
  const user = getCurrentUser();
  if (!user) return null;

  logActivityEvent({
    type: 'drill',
    xp: points,
  });

  const stats = getAggregatedStats();
  const updated: UserProfile = {
    ...user,
    xp: stats.xp,
    level: Math.floor(stats.xp / 100) + 1,
  };
  saveCurrentUser(updated);
  return updated;
}

export function unlockBadge(badgeName: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  if (!user.badges.includes(badgeName)) {
    user.badges.push(badgeName);
    logActivityEvent({
      type: 'mission',
      xp: 50,
    });
    saveCurrentUser(user);
    return true;
  }
  return false;
}
