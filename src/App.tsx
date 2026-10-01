import { useState, useEffect } from 'react';
import { GIT_STAGES } from './data/gitStages';
import { StageId } from './types/git';
import { loadProgress, toggleLearnedState, resetProgress } from './utils/storage';
import { getCurrentUser, isGuestMode, setGuestMode, UserProfile } from './utils/auth';
import { subscribeToActivity } from './utils/activityEvents';
import { playSound } from './utils/sound';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StageView } from './components/StageView';
import { CheatSheetView } from './components/CheatSheetView';
import { CelebrationToast } from './components/CelebrationToast';
import { ResetModal } from './components/ResetModal';
import { GitGame } from './components/GitGame';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';
import { AdminView } from './components/AdminView';
import { AskGitnautAI } from './components/AskGitnautAI';
import { InsideCosmos } from './components/InsideCosmos';
import { BottomTabBar } from './components/BottomTabBar';
import { applyTheme } from './utils/theme';

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [isGuest, setIsGuest] = useState<boolean>(() => isGuestMode());
  const [showLoginScreen, setShowLoginScreen] = useState(false);

  // App navigation views: 'learn' | 'practice' | 'cheatsheet' | 'admin'
  const [currentView, setCurrentView] = useState<'learn' | 'practice' | 'cheatsheet' | 'admin'>('learn');
  const [isViewingStage, setIsViewingStage] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<StageId>('stage-1');
  const [targetCommandId, setTargetCommandId] = useState<string | null>(null);

  // Practice sub-tabs: 'campaign' (Missions) | 'arcade' (Speed Drills) | 'sandbox' (Free Lab)
  const [practiceSubTab, setPracticeSubTab] = useState<'campaign' | 'arcade' | 'sandbox'>('campaign');

  const [celebrationStage, setCelebrationStage] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Automatically apply designated theme:
  // Before login (Landing Page & Login Screen): Dark cosmic theme
  // After login (Inside Flight Deck, Lessons, Missions, etc.): Light blue theme
  useEffect(() => {
    if (currentUser || isGuest) {
      applyTheme('light-blue');
    } else {
      applyTheme('dark');
    }
  }, [currentUser, isGuest]);

  useEffect(() => {
    setProgress(loadProgress());
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    const unsub = subscribeToActivity(() => {
      setProgress(loadProgress());
      const u = getCurrentUser();
      if (u) setCurrentUser(u);
    });
    return unsub;
  }, []);

  const handleToggleLearned = (commandId: string) => {
    const res = toggleLearnedState(commandId);
    setProgress(res.progress);
    if (res.stageJustCompleted) {
      playSound('levelUp');
      setCelebrationStage(res.stageJustCompleted);
      if (currentUser) {
        setCurrentUser(getCurrentUser());
      }
    }
  };

  const handleSelectStage = (stageId: StageId, commandId?: string) => {
    if (stageId === 'stage-8') {
      setCurrentView('cheatsheet');
      setIsViewingStage(false);
      setTargetCommandId(null);
    } else {
      setSelectedStageId(stageId);
      setIsViewingStage(true);
      setCurrentView('learn');
      setTargetCommandId(commandId || null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateLearn = () => {
    setCurrentView('learn');
    setIsViewingStage(false);
    setTargetCommandId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePractice = (subTab: 'campaign' | 'arcade' | 'sandbox' = 'campaign') => {
    setCurrentView('practice');
    setPracticeSubTab(subTab);
    setIsViewingStage(false);
    setTargetCommandId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCheatSheet = () => {
    setCurrentView('cheatsheet');
    setIsViewingStage(false);
    setTargetCommandId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateAdmin = () => {
    setCurrentView('admin');
    setIsViewingStage(false);
    setTargetCommandId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmReset = () => {
    resetProgress();
    setProgress(loadProgress());
    setIsResetModalOpen(false);
    playSound('error');
    if (currentUser) {
      setCurrentUser(getCurrentUser());
    }
  };

  const handleUserLoggedIn = (user: UserProfile) => {
    setCurrentUser(user);
    setIsGuest(false);
    setShowLoginScreen(false);
    setIsLoginModalOpen(false);
  };

  const handleUserLoggedOut = () => {
    setCurrentUser(null);
    setIsGuest(false);
  };

  const handleGuestEntry = () => {
    setGuestMode(true);
    setIsGuest(true);
    setShowLoginScreen(false);
  };

  // Find stage details for stage view
  const currentStage = GIT_STAGES.find((s) => s.id === selectedStageId) || GIT_STAGES[0];
  const currentStageIndex = GIT_STAGES.findIndex((s) => s.id === selectedStageId);
  const prevStage = currentStageIndex > 0 ? GIT_STAGES[currentStageIndex - 1] : null;
  const nextStage = 
    currentStageIndex < GIT_STAGES.length - 1 && GIT_STAGES[currentStageIndex + 1].id !== 'stage-8'
      ? GIT_STAGES[currentStageIndex + 1]
      : null;

  // 1. If not logged in and not guest:
  if (!currentUser && !isGuest) {
    if (showLoginScreen) {
      return (
        <LoginScreen
          onLoginSuccess={handleUserLoggedIn}
          onContinueAsGuest={handleGuestEntry}
        />
      );
    }
    return (
      <LandingPage
        onStartFree={() => setShowLoginScreen(true)}
        onLogInClick={() => setShowLoginScreen(true)}
        onExploreGuest={handleGuestEntry}
      />
    );
  }

  // 2. In-App Experience
  return (
    <div className="min-h-[100dvh] bg-bg text-text relative flex flex-col font-sans selection:bg-accent selection:text-accent-ink overflow-x-hidden transition-colors">
      {/* Background Subtle Cosmos */}
      <InsideCosmos />

      {/* Navigation Header */}
      <Header
        currentView={currentView}
        practiceSubTab={practiceSubTab}
        currentUser={currentUser}
        onNavigateLearn={handleNavigateLearn}
        onNavigatePractice={handleNavigatePractice}
        onNavigateCheatSheet={handleNavigateCheatSheet}
        onNavigateAdmin={handleNavigateAdmin}
        onResetProgress={() => setIsResetModalOpen(true)}
        onOpenAuth={() => setIsLoginModalOpen(true)}
        onUserLoggedOut={handleUserLoggedOut}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-20 md:pb-12 min-w-0">
        {/* LEARN VIEW */}
        {currentView === 'learn' && (
          isViewingStage ? (
            <StageView
              stage={currentStage}
              learnedCommandIds={progress.learnedCommandIds}
              onToggleLearned={handleToggleLearned}
              onBackToDashboard={handleNavigateLearn}
              onSelectStage={handleSelectStage}
              prevStage={prevStage}
              nextStage={nextStage}
              targetCommandId={targetCommandId}
            />
          ) : (
            <Dashboard
              currentUser={currentUser}
              onSelectStage={handleSelectStage}
              onOpenGame={() => handleNavigatePractice('campaign')}
              onOpenAuth={() => setIsLoginModalOpen(true)}
            />
          )
        )}

        {/* PRACTICE VIEW: Missions, Speed Drills, Free Lab */}
        {currentView === 'practice' && (
          <div className="w-full min-w-0">
            <GitGame
              isEmbedded={true}
              initialTab={practiceSubTab}
              onClose={handleNavigateLearn}
            />
          </div>
        )}

        {/* CHEAT SHEET VIEW */}
        {currentView === 'cheatsheet' && (
          <CheatSheetView
            learnedCommandIds={progress.learnedCommandIds}
            onToggleLearned={handleToggleLearned}
            onNavigateToCommand={(stageId, commandId) => handleSelectStage(stageId, commandId)}
          />
        )}

        {/* ADMIN VIEW */}
        {currentView === 'admin' && (
          <AdminView
            currentUser={currentUser}
            onBackToLearn={handleNavigateLearn}
          />
        )}
      </main>

      {/* Unified Footer */}
      <footer className="relative z-10 w-full border-t border-border bg-surface py-6 text-sm text-text-muted transition-colors">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 min-w-0">
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <span className="text-text font-bold">Gitnaut</span>
            <span aria-hidden="true" className="text-border">•</span>
            <span>Interactive Git Masterclass</span>
            <span aria-hidden="true" className="text-border">•</span>
            <span>Made by <strong className="text-text font-medium">Sharanya</strong></span>
          </div>

          <div className="flex items-center gap-4 text-sm text-text-muted flex-wrap">
            <button
              onClick={handleNavigateLearn}
              className="hover:text-text transition-colors cursor-pointer min-h-[36px] flex items-center"
            >
              Lessons
            </button>
            <span aria-hidden="true" className="text-border">•</span>
            <button
              onClick={() => handleNavigatePractice('campaign')}
              className="hover:text-text transition-colors cursor-pointer min-h-[36px] flex items-center"
            >
              Missions
            </button>
            <span aria-hidden="true" className="text-border">•</span>
            <button
              onClick={handleNavigateCheatSheet}
              className="hover:text-text transition-colors cursor-pointer min-h-[36px] flex items-center"
            >
              Cheat sheet
            </button>
            {currentUser?.isAdmin && (
              <>
                <span aria-hidden="true" className="text-border">•</span>
                <button
                  onClick={handleNavigateAdmin}
                  className="hover:text-accent font-semibold text-accent transition-colors cursor-pointer min-h-[36px] flex items-center"
                >
                  Admin
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar
        currentView={currentView}
        onNavigateLearn={handleNavigateLearn}
        onNavigatePractice={() => handleNavigatePractice('campaign')}
        onNavigateCheatSheet={handleNavigateCheatSheet}
      />

      {/* Clean Login Modal */}
      {isLoginModalOpen && (
        <LoginScreen
          isModal={true}
          onLoginSuccess={handleUserLoggedIn}
          onContinueAsGuest={() => setIsLoginModalOpen(false)}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}

      {/* Celebratory toast on stage completion */}
      {celebrationStage && (
        <CelebrationToast
          stageTitle={celebrationStage}
          onClose={() => setCelebrationStage(null)}
        />
      )}

      {/* Reset Confirmation Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />

      {/* AI Explainer Floating Widget */}
      <AskGitnautAI currentContext={`Stage ${selectedStageId}`} />
    </div>
  );
}
