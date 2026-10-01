import React from 'react';
import { BookOpen, Gamepad2, Layers } from 'lucide-react';
import { playSound } from '../utils/sound';

interface BottomTabBarProps {
  currentView: 'learn' | 'practice' | 'cheatsheet' | 'admin';
  onNavigateLearn: () => void;
  onNavigatePractice: () => void;
  onNavigateCheatSheet: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentView,
  onNavigateLearn,
  onNavigatePractice,
  onNavigateCheatSheet,
}) => {
  const tabs = [
    { id: 'learn', label: 'Learn', icon: BookOpen, action: onNavigateLearn },
    { id: 'practice', label: 'Practice', icon: Gamepad2, action: onNavigatePractice },
    { id: 'cheatsheet', label: 'Cheat sheet', icon: Layers, action: onNavigateCheatSheet },
  ];

  return (
    <nav 
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 h-14 bg-surface/95 backdrop-blur-md border-t border-border flex items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] shadow-lg"
    >
      {tabs.map((tab) => {
        const isActive = currentView === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => {
              playSound('click');
              tab.action();
            }}
            className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              isActive
                ? 'text-accent font-bold'
                : 'text-text-muted hover:text-text'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.25 : 1.75} />
            <span className="text-[14px] leading-tight font-medium whitespace-nowrap">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
