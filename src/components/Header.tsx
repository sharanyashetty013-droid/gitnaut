import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Gamepad2, 
  Layers, 
  Flame, 
  User, 
  LogOut, 
  RotateCcw, 
  Compass,
  Sparkles,
  LogIn
} from 'lucide-react';
import { UserProfile, logoutUser } from '../utils/auth';
import { getAggregatedStats, subscribeToActivity } from '../utils/activityEvents';
import { playSound, isSoundEnabled, setSoundEnabled } from '../utils/sound';

interface HeaderProps {
  currentView: 'learn' | 'practice' | 'cheatsheet' | 'admin';
  practiceSubTab?: 'campaign' | 'arcade' | 'sandbox';
  currentUser: UserProfile | null;
  onNavigateLearn: () => void;
  onNavigatePractice: (subTab?: 'campaign' | 'arcade' | 'sandbox') => void;
  onNavigateCheatSheet: () => void;
  onNavigateAdmin: () => void;
  onResetProgress: () => void;
  onOpenAuth: () => void;
  onUserLoggedOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  currentUser,
  onNavigateLearn,
  onNavigatePractice,
  onNavigateCheatSheet,
  onResetProgress,
  onOpenAuth,
  onUserLoggedOut,
}) => {
  const [sound, setSound] = useState(() => isSoundEnabled());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [stats, setStats] = useState(() => getAggregatedStats());
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribeToActivity(() => {
      setStats(getAggregatedStats());
    });
    return unsub;
  }, []);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleToggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
    if (next) playSound('click');
  };

  const handleLogout = () => {
    logoutUser();
    setIsUserMenuOpen(false);
    onUserLoggedOut();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface border-b border-border transition-colors">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 min-w-0">
        {/* Left: Brand Logo */}
        <button
          onClick={() => {
            playSound('click');
            onNavigateLearn();
          }}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90 focus:outline-none shrink-0 cursor-pointer min-h-[44px]"
          aria-label="Gitnaut home"
        >
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-ink shadow-xs">
            <Compass className="w-5 h-5 text-accent-ink" strokeWidth={1.75} />
          </div>
          <span className="font-heading font-bold text-xl text-text tracking-normal leading-tight">
            Gitnaut
          </span>
        </button>

        {/* Center: Desktop Top Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold h-16">
          {[
            { id: 'learn', label: 'Learn', icon: BookOpen, action: onNavigateLearn },
            { id: 'practice', label: 'Practice', icon: Gamepad2, action: () => onNavigatePractice() },
            { id: 'cheatsheet', label: 'Cheat sheet', icon: Layers, action: onNavigateCheatSheet },
          ].map((tab) => {
            const isActive = currentView === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSound('click');
                  tab.action();
                }}
                className={`h-full px-4 flex items-center gap-2 border-b-2 font-semibold transition-colors cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'border-accent text-accent font-bold'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                <Icon className="w-4 h-4 text-current" strokeWidth={1.75} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Area */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0" ref={menuRef}>
          {/* Audio toggle */}
          <button
            onClick={handleToggleSound}
            className="flex min-w-[44px] min-h-[44px] items-center justify-center rounded-[10px] border border-border bg-surface-2 hover:bg-border text-text-muted hover:text-text transition-colors cursor-pointer"
            title={sound ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label="Toggle sound"
          >
            {sound ? <Volume2 className="w-5 h-5 text-current" strokeWidth={1.75} /> : <VolumeX className="w-5 h-5 text-current" strokeWidth={1.75} />}
          </button>

          {/* Avatar & Account Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-1 sm:px-3 sm:py-1 rounded-[10px] border border-border bg-surface-2 hover:bg-border text-sm font-semibold text-text cursor-pointer transition-colors gap-2"
              aria-label="User account menu"
            >
              {currentUser ? (
                <>
                  <span className="hidden sm:inline-block truncate max-w-[100px]">{currentUser.displayName}</span>
                  <span className="w-7 h-7 rounded-[8px] bg-accent text-accent-ink flex items-center justify-center font-bold text-sm shrink-0">
                    <User className="w-4 h-4 text-accent-ink" strokeWidth={1.75} />
                  </span>
                </>
              ) : (
                <span className="w-7 h-7 rounded-[8px] bg-surface border border-border flex items-center justify-center text-text-muted shrink-0">
                  <User className="w-4 h-4 text-current" strokeWidth={1.75} />
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-[12px] shadow-xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2.5 border-b border-border">
                  <div className="font-bold text-sm text-text truncate">
                    {currentUser?.displayName || 'Cadet Explorer'}
                  </div>
                  <div className="text-sm text-text-muted truncate">
                    {currentUser?.email || 'Guest Session'}
                  </div>
                  <div className="text-sm text-accent font-semibold mt-1">
                    Mastered: {stats.masteredCount} of 37 Commands
                  </div>
                </div>

                {/* Mobile: Sound Toggle inside Menu */}
                <button
                  onClick={handleToggleSound}
                  className="w-full text-left px-3 py-2.5 text-sm text-text hover:bg-surface-2 rounded-[10px] flex items-center justify-between min-h-[44px] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {sound ? <Volume2 className="w-4 h-4 text-accent" strokeWidth={1.75} /> : <VolumeX className="w-4 h-4 text-text-muted" strokeWidth={1.75} />}
                    <span>Sound Effects</span>
                  </div>
                  <span className="text-sm font-bold text-accent">{sound ? 'ON' : 'OFF'}</span>
                </button>

                {/* Reset progress */}
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onResetProgress();
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm text-text-muted hover:text-text hover:bg-surface-2 rounded-[10px] flex items-center gap-2 min-h-[44px] cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-current" strokeWidth={1.75} />
                  <span>Reset progress</span>
                </button>

                {/* Log out or Log in */}
                {currentUser ? (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 text-sm text-danger hover:bg-surface-2 rounded-[10px] flex items-center gap-2 min-h-[44px] cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-current" strokeWidth={1.75} />
                    <span>Log out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm text-accent font-bold hover:bg-surface-2 rounded-[10px] flex items-center gap-2 min-h-[44px] cursor-pointer transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-current" strokeWidth={1.75} />
                    <span>Log in / Sign up</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
