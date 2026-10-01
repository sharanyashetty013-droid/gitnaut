import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Terminal, 
  Gamepad2, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  GitBranch, 
  GitCommit, 
  ShieldCheck, 
  Compass, 
  ChevronDown 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SpaceCanvas } from './SpaceCanvas';
import { CommitGraph3D, Commit3DNode } from './CommitGraph3D';
import { Astronaut3D } from './Astronaut3D';
import { AskGitnautAI } from './AskGitnautAI';
import { playSound } from '../utils/sound';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  onStartFree: () => void;
  onLogInClick: () => void;
  onExploreGuest: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFree,
  onExploreGuest,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Sound & Voice greeting state
  const [isGreeting, setIsGreeting] = useState(false);

  // Interactive Live Commit Graph Simulation State for Section 3
  const [previewCommits, setPreviewCommits] = useState<Commit3DNode[]>([
    {
      hash: 'e82a9f1',
      msg: 'init: launch orbital vessel core',
      branch: 'main',
    },
    {
      hash: 'a41d902',
      msg: 'feat: configure thruster guidance',
      branch: 'main',
    },
    {
      hash: 'f03c14b',
      msg: 'fix: patch oxygen regulator seal',
      branch: 'main',
      isHead: true,
    },
  ]);
  const [previewBranch, setPreviewBranch] = useState('main');

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const graphPreviewRef = useRef<HTMLDivElement>(null);
  const signupRef = useRef<HTMLDivElement>(null);

  // Parallax mouse tracker
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth) - 0.5,
      y: (clientY / innerHeight) - 0.5,
    });
  };

  const playGreetingAudio = () => {
    playSound('loginWelcome');
    setIsGreeting(true);
    setTimeout(() => setIsGreeting(false), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // GSAP ScrollTrigger Animations
    const ctx = gsap.context(() => {
      // 1. Hero Content Entrance
      gsap.from('.hero-anim', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // 2. How it works section entrance
      gsap.from('.section-anim', {
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ctx.revert();
    };
  }, []);

  const triggerWarpTo = (target: 'login' | 'guest') => {
    playSound('click');
    if (target === 'login') {
      onStartFree();
    } else if (target === 'guest') {
      onExploreGuest();
    }
  };

  const handlePreviewCommit = () => {
    playSound('type');
    const newHash = Math.random().toString(16).substring(2, 9);
    const newCommit: Commit3DNode = {
      hash: newHash,
      msg: `commit: calibrate vector matrix #${previewCommits.length + 1}`,
      branch: previewBranch,
      isHead: true,
    };
    setPreviewCommits((prev) => [
      ...prev.map((c) => ({ ...c, isHead: false })),
      newCommit,
    ]);
  };

  const handlePreviewBranch = () => {
    playSound('pop');
    const newBranch = previewBranch === 'main' ? 'feature/thruster-opt' : 'main';
    setPreviewBranch(newBranch);
    const newHash = Math.random().toString(16).substring(2, 9);
    const newCommit: Commit3DNode = {
      hash: newHash,
      msg: `branch: diverged to [${newBranch}]`,
      branch: newBranch,
      isHead: true,
    };
    setPreviewCommits((prev) => [
      ...prev.map((c) => ({ ...c, isHead: false })),
      newCommit,
    ]);
  };

  const handlePreviewMerge = () => {
    playSound('success');
    const mergeHash = Math.random().toString(16).substring(2, 9);
    const mergeCommit: Commit3DNode = {
      hash: mergeHash,
      msg: `merge: reconciled into main branch`,
      branch: 'main',
      isHead: true,
    };
    setPreviewBranch('main');
    setPreviewCommits((prev) => [
      ...prev.map((c) => ({ ...c, isHead: false })),
      mergeCommit,
    ]);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] w-full bg-bg text-text font-sans selection:bg-accent selection:text-accent-ink overflow-x-hidden"
    >
      {/* 3D Deep Space Canvas */}
      <SpaceCanvas
        scrollProgress={scrollProgress}
        mousePos={mousePos}
      />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-border transition-colors">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 min-w-0">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-ink shadow-xs">
              <Compass className="w-5 h-5 text-accent-ink" strokeWidth={1.75} />
            </div>
            <span className="font-heading text-xl font-bold tracking-normal text-text">
              Gitnaut
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-muted">
            <a href="#how-it-works" className="hover:text-text transition-colors">
              How it works
            </a>
            <a href="#live-preview" className="hover:text-text transition-colors">
              Live preview
            </a>
            <a href="#curriculum" className="hover:text-text transition-colors">
              Curriculum
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => triggerWarpTo('login')}
              className="text-sm font-semibold text-text-muted hover:text-text transition-colors cursor-pointer px-3 py-2 min-h-[44px] flex items-center"
            >
              Log in
            </button>
            <button
              onClick={() => triggerWarpTo('login')}
              className="btn-primary text-sm px-4 py-2"
            >
              Start free
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 min-w-0">
        {/* SECTION 1: HERO */}
        <section
          ref={heroRef}
          className="min-h-[calc(100dvh-64px)] flex flex-col justify-center py-12 sm:py-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="hero-anim inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-2 border border-border text-sm font-medium text-link">
                <Sparkles className="w-4 h-4 text-link" />
                <span>Interactive Git Masterclass</span>
              </div>

              <h1 className="hero-anim text-[clamp(32px,5.5vw,52px)] font-bold text-text tracking-normal leading-tight">
                Learn Git by doing.
              </h1>

              <p className="hero-anim text-base sm:text-lg text-text-muted leading-relaxed font-sans max-w-xl">
                Troubleshoot detached HEADs, resolve parallel branch collisions, and navigate your commit tree in an intuitive celestial flight deck.
              </p>

              {/* Action Buttons: Min 44px height */}
              <div className="hero-anim flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => triggerWarpTo('login')}
                  className="btn-primary text-sm py-3.5 px-6 shadow-sm gap-2"
                >
                  <span>Start free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => triggerWarpTo('guest')}
                  className="btn-secondary text-sm py-3 px-5 gap-2"
                >
                  <Gamepad2 className="w-4 h-4 text-link" />
                  <span>Explore as guest</span>
                </button>
              </div>

              {/* Benefit highlights */}
              <div className="hero-anim pt-4 flex items-center gap-6 text-sm text-text-muted flex-wrap">
                <span className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-link" />
                  8 curriculum stages
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-link" />
                  37 interactive commands
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-link" />
                  3D live commit graphs
                </span>
              </div>
            </div>

            {/* Right Column: Duck Rocket Astronaut */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
              <Astronaut3D 
                mousePos={mousePos} 
                isGreeting={isGreeting} 
                onVoiceTrigger={playGreetingAudio}
                onStartFree={() => triggerWarpTo('login')}
              />
            </div>
          </div>

          {/* Scroll Down Prompt */}
          <div className="pt-8 flex items-center justify-center">
            <a
              href="#how-it-works"
              className="flex flex-col items-center gap-1 text-sm text-text-muted hover:text-link transition-colors"
            >
              <span>Scroll to explore</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </a>
          </div>
        </section>

        {/* SECTION 2: HOW IT WORKS */}
        <section
          id="how-it-works"
          ref={howItWorksRef}
          className="min-h-[80dvh] flex flex-col justify-center py-16 sm:py-24 border-t border-border"
        >
          <div className="space-y-3 mb-10 text-center sm:text-left">
            <span className="section-anim text-sm font-semibold text-link uppercase tracking-widest block">
              Step-By-Step Pedagogy
            </span>
            <h2 className="section-anim font-heading text-3xl sm:text-4xl font-bold text-text tracking-normal leading-tight">
              Master the Git dimension in 3 steps
            </h2>
            <p className="section-anim text-sm sm:text-base text-text-muted max-w-xl leading-relaxed">
              Break free from memorizing random flags. Build genuine mental models that stick forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Inspect Visual Models',
                desc: 'See staging, commit snapshots, and branch topology rendered before running a command. No more guesswork.',
                icon: Layers,
              },
              {
                step: '02',
                title: 'Practice in Live Terminals',
                desc: 'Type actual Git syntax in browser cockpits with real-time feedback, guided hints, and instant auto-formatting.',
                icon: Terminal,
              },
              {
                step: '03',
                title: 'Tackle Real Emergencies',
                desc: 'Clean untracked clutter, salvage detached HEADs, and conquer the final Omega Merge Conflict without breaking production.',
                icon: ShieldCheck,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card-base p-6 space-y-4 hover:border-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-text-muted">
                    {item.step}
                  </span>
                  <div className="p-2.5 rounded-xl bg-surface-2 text-link border border-border">
                    <item.icon className="w-5 h-5 text-current" />
                  </div>
                </div>
                <h3 className="font-heading text-lg font-bold text-text tracking-normal">
                  {item.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: LIVE GIT GRAPH PREVIEW */}
        <section
          id="live-preview"
          ref={graphPreviewRef}
          className="min-h-[80dvh] flex flex-col justify-center py-16 sm:py-24 border-t border-border"
        >
          <div className="space-y-3 mb-8 text-center sm:text-left">
            <span className="section-anim text-sm font-semibold text-link uppercase tracking-widest block">
              Interactive 3D Simulation
            </span>
            <h2 className="section-anim font-heading text-3xl sm:text-4xl font-bold text-text tracking-normal leading-tight">
              Watch your commit graph evolve in 3D
            </h2>
            <p className="section-anim text-sm sm:text-base text-text-muted max-w-xl leading-relaxed">
              Test out real Git commands below to see the interactive 3D commit graph react in real time right now.
            </p>
          </div>

          <div className="card-base p-5 sm:p-6 space-y-5">
            {/* Interactive 3D Canvas */}
            <CommitGraph3D
              commits={previewCommits}
              currentBranch={previewBranch}
              className="w-full"
            />

            {/* Test Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-text-muted font-medium mr-1">
                  Run simulated command:
                </span>
                <button
                  onClick={handlePreviewCommit}
                  className="px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-border text-text font-mono text-sm font-bold transition-all border border-border flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                >
                  <GitCommit className="w-3.5 h-3.5 text-link" />
                  <span>$ git commit -m "update"</span>
                </button>
                <button
                  onClick={handlePreviewBranch}
                  className="px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-border text-text font-mono text-sm font-bold transition-all border border-border flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                >
                  <GitBranch className="w-3.5 h-3.5 text-accent" />
                  <span>$ git switch -c feat/warp</span>
                </button>
                <button
                  onClick={handlePreviewMerge}
                  className="px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-border text-text font-mono text-sm font-bold transition-all border border-border flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-success" />
                  <span>$ git merge feat/warp</span>
                </button>
              </div>
              <div className="text-sm text-link font-medium">
                {previewCommits.length} Commits active in memory
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: GET STARTED GATEWAY */}
        <section
          id="curriculum"
          ref={signupRef}
          className="min-h-[70dvh] flex flex-col justify-center py-16 sm:py-24 border-t border-border"
        >
          <div className="card-base max-w-3xl mx-auto w-full p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
            <div className="space-y-3">
              <span className="text-sm font-semibold text-link uppercase tracking-widest block">
                Zero Setup • 100% In-Browser
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-text tracking-normal leading-tight">
                Begin your flight training today
              </h2>
              <p className="text-sm sm:text-base text-text-muted max-w-lg mx-auto font-sans leading-relaxed">
                Take the pilot's seat. Track your streak on the constellation star map and graduate to fleet admiral.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => triggerWarpTo('login')}
                className="btn-primary text-sm px-8 py-4 gap-2"
              >
                <span>Start free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => triggerWarpTo('guest')}
                className="btn-secondary text-sm px-6 py-4"
              >
                Continue as guest
              </button>
            </div>

            <div className="pt-2 text-sm text-text-muted">
              No credit card required • Instant client-side workspace
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-8 text-sm text-text-muted transition-colors">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 min-w-0">
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <span className="font-bold text-text">Gitnaut</span>
            <span aria-hidden="true" className="text-border">•</span>
            <span>Interactive Git Masterclass</span>
            <span aria-hidden="true" className="text-border">•</span>
            <span>Made by <strong className="text-text font-medium">Sharanya</strong></span>
          </div>
          <div className="text-text-muted text-xs sm:text-sm">
            Learn Git by doing. All simulations run client-side.
          </div>
        </div>
      </footer>

      {/* Floating Ask Gitnaut AI Explainer */}
      <AskGitnautAI currentContext="Landing page: Getting started with Git" />
    </div>
  );
};
