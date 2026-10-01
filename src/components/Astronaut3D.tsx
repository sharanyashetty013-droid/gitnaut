import React, { useState, useEffect, useRef } from 'react';
import { Volume2 } from 'lucide-react';
import { playSound } from '../utils/sound';
import { speakNaturalSpeech } from '../utils/naturalVoice';

interface Astronaut3DProps {
  mousePos: { x: number; y: number };
  isGreeting?: boolean;
  onVoiceTrigger?: () => void;
  onStartFree?: () => void;
}

export const Astronaut3D: React.FC<Astronaut3DProps> = ({
  mousePos,
  onVoiceTrigger,
  onStartFree,
}) => {
  const [hasFlownAway, setHasFlownAway] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('gitnaut_astronaut_permanently_flown') === 'true';
  });
  const [isFlyingAway, setIsFlyingAway] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [orbPulse, setOrbPulse] = useState(false);
  const [typedText, setTypedText] = useState('Hello, git gang! 🚀');
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Typewriter effect on mount
  useEffect(() => {
    if (hasFlownAway) return;
    const full = 'Hello, git gang! 🚀';
    setTypedText('');
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i <= full.length) {
        setTypedText(full.slice(0, i));
      } else {
        clearInterval(timer);
      }
    }, 70);
    return () => clearInterval(timer);
  }, [hasFlownAway]);

  const handleFlyAway = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isFlyingAway || hasFlownAway) return;
    playSound('warp');
    setIsFlyingAway(true);
    setTimeout(() => {
      setHasFlownAway(true);
      try {
        localStorage.setItem('gitnaut_astronaut_permanently_flown', 'true');
      } catch {
        // ignore
      }
    }, 1200);
  };

  const handleSayHello = async () => {
    playSound('loginWelcome');
    setOrbPulse(true);
    setIsSpeaking(true);
    setTimeout(() => setOrbPulse(false), 2000);

    if (onVoiceTrigger) {
      onVoiceTrigger();
    }

    const greetingText = 'Hello, git gang! Welcome to Gitnaut.';

    // Try natural server-side AI voice first (if available and permitted)
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: greetingText, voice: 'Kore' }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio && !data.fallbackToClient) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audio}`);
          audioRef.current = audio;
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => {
            speakNaturalSpeech(greetingText, () => setIsSpeaking(false), () => setIsSpeaking(false));
          };
          await audio.play();
          return;
        }
      }
    } catch {
      // Fall through to browser natural voice
    }

    // High quality natural browser voice synthesis (pitch 1.0, conversational pace)
    speakNaturalSpeech(
      greetingText,
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  // Calculate mouse tilt
  const tiltX = (mousePos.x || 0) * 14;
  const tiltY = (mousePos.y || 0) * -10;

  // Once flown away, astronaut NEVER EVER comes back
  if (hasFlownAway) {
    return null;
  }

  return (
    <div className="relative w-full max-w-[520px] flex flex-col items-center justify-center select-none py-2 font-sans overflow-visible">
      {/* 1. Speech Bubble: "Hello, git gang! 🚀" */}
      <div 
        className={`relative z-30 mb-3 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-surface border-2 border-cyan text-text shadow-lg backdrop-blur-md transition-all hover:scale-105 cursor-pointer ${
          isFlyingAway ? 'opacity-0 translate-y-4 duration-300 pointer-events-none' : 'opacity-100'
        }`}
        onClick={handleSayHello}
        title="Click to hear Gitnaut speak in a natural voice"
      >
        <span className="font-heading font-bold text-sm sm:text-base tracking-normal text-cyan">
          {typedText}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSayHello();
          }}
          className="px-2.5 py-1 rounded-xl bg-cyan/15 hover:bg-cyan/25 border border-cyan/40 text-cyan transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer active:scale-95"
        >
          <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse text-cyan' : ''}`} />
          <span>{isSpeaking ? 'Speaking' : 'Say it'}</span>
        </button>
        {/* Speech Bubble Tail */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-r-2 border-b-2 border-cyan rotate-45" />
      </div>

      {/* 2. Main Character: Vector Astronaut on Rocket with Duck Floatie */}
      <div 
        className="relative w-full h-[320px] sm:h-[370px] flex items-center justify-center cursor-pointer"
        style={{
          transform: isFlyingAway
            ? 'translate(1800px, -1200px) rotate(42deg) scale(0.08)'
            : `perspective(800px) rotateY(${tiltX}deg) rotateX(${tiltY}deg) ${
                isSpeaking ? 'scale(1.04) translateY(-6px)' : 'translateY(0)'
              }`,
          transition: isFlyingAway
            ? 'transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1.1s ease-in'
            : 'transform 300ms ease-out',
          opacity: isFlyingAway ? 0 : 1,
        }}
        onClick={handleFlyAway}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Click rocket to launch it into space"
      >
        {/* Ambient Glow Aura */}
        <div className="absolute inset-0 bg-radial from-cyan/15 via-accent/10 to-transparent blur-2xl rounded-full pointer-events-none" />

        <svg 
          viewBox="0 0 680 440" 
          className={`w-full h-full drop-shadow-[0_12px_32px_rgba(0,0,0,0.4)] ${
            isSpeaking 
              ? 'animate-pulse' 
              : 'animate-[float_4s_ease-in-out_infinite]'
          }`}
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="flameYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFF00" />
              <stop offset="60%" stopColor="#FFDE59" />
              <stop offset="100%" stopColor="#FFAE33" />
            </linearGradient>
            <linearGradient id="flamePink" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4DB8" />
              <stop offset="50%" stopColor="#FF77C6" />
              <stop offset="100%" stopColor="#FFB3DC" />
            </linearGradient>
            <linearGradient id="flamePeach" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="50%" stopColor="#FF99C8" />
              <stop offset="100%" stopColor="#FC6C85" />
            </linearGradient>
            <linearGradient id="orbGrad" x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FFB3DE" />
              <stop offset="60%" stopColor="#FF40AA" />
              <stop offset="90%" stopColor="#D946EF" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="rocketBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="70%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="duckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFEA31" />
              <stop offset="70%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
            <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="60%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. ROCKET EXHAUST FLAME TRAIL (Soft floating flame glow) */}
          <g className="transition-all duration-300">
            <path 
              d="M 230,300 C 170,300 130,240 80,260 C 40,275 15,310 2,330 C 25,355 60,345 100,325 C 150,300 180,340 230,325 Z" 
              fill="url(#flamePink)" 
              stroke="#000000" 
              strokeWidth="4" 
              strokeLinejoin="round"
              className="opacity-90 animate-pulse"
            />
            <path 
              d="M 230,310 C 160,315 120,270 70,290 C 25,310 5,345 0,370 C 35,395 80,380 120,350 C 165,320 195,355 235,340 Z" 
              fill="url(#flamePeach)" 
              stroke="#000000" 
              strokeWidth="4" 
              strokeLinejoin="round"
            />
            <path 
              d="M 235,320 C 180,325 150,350 100,370 C 60,385 20,410 0,425 C 30,445 90,430 140,390 C 180,360 205,370 240,350 Z" 
              fill="url(#flameYellow)" 
              stroke="#000000" 
              strokeWidth="4.5" 
              strokeLinejoin="round"
            />
            {(isHovered || isSpeaking) && (
              <g className="animate-ping" style={{ animationDuration: '0.6s' }}>
                <circle cx="110" cy="330" r="7" fill="#FFFF00" />
                <circle cx="60" cy="360" r="9" fill="#FF4DB8" />
                <circle cx="30" cy="385" r="6" fill="#5CE1E6" />
                <circle cx="85" cy="275" r="7" fill="#FFAE33" />
                <circle cx="140" cy="310" r="8" fill="#FFFF00" />
              </g>
            )}
          </g>

          {/* 2. THE ROCKET SHIP */}
          <g>
            <path 
              d="M 245,275 C 220,250 180,265 190,290 C 205,295 235,285 245,285 Z" 
              fill="#FF1E27" 
              stroke="#000000" 
              strokeWidth="6" 
              strokeLinejoin="round"
            />
            <path 
              d="M 250,345 C 215,360 195,395 220,415 C 235,415 255,385 260,360 Z" 
              fill="#FF1E27" 
              stroke="#000000" 
              strokeWidth="6" 
              strokeLinejoin="round"
            />
            <path 
              d="M 235,320 L 195,330 C 190,340 215,348 245,342 Z" 
              fill="#D80010" 
              stroke="#000000" 
              strokeWidth="5" 
            />
            <path 
              d="M 230,310 C 235,270 280,250 350,250 C 400,250 435,260 450,270 L 450,335 C 410,355 350,365 290,365 C 245,365 228,340 230,310 Z" 
              fill="url(#rocketBody)" 
              stroke="#000000" 
              strokeWidth="6.5" 
              strokeLinejoin="round"
            />
            <path 
              d="M 445,268 C 475,270 515,290 535,320 C 510,345 470,355 445,337 Z" 
              fill="#FF1E27" 
              stroke="#000000" 
              strokeWidth="6.5" 
              strokeLinejoin="round"
            />
            <circle cx="370" cy="305" r="22" fill="#0E1726" stroke="#06B6D4" strokeWidth="3" />
            <path d="M 362,298 A 11 11 0 0 1 378,298" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
          </g>

          {/* 3. ASTRONAUT'S LEGS & BOOTS */}
          <g>
            <path 
              d="M 292,320 L 315,320 C 322,320 326,335 326,345 C 315,355 295,355 290,345 Z" 
              fill="#64748B" 
              stroke="#000000" 
              strokeWidth="5.5" 
            />
            <path d="M 290,345 L 326,345" stroke="#000000" strokeWidth="5" />
          </g>

          {/* 4. YELLOW RUBBER DUCK SWIM RING (FLOATIE) */}
          <g id="duckFloatie">
            <path 
              d="M 255,275 C 245,250 270,225 320,230 C 375,235 390,265 375,295 C 355,320 290,325 260,305 C 250,295 255,280 255,275 Z" 
              fill="url(#duckGrad)" 
              stroke="#000000" 
              strokeWidth="6.5" 
              strokeLinejoin="round"
            />
            <path 
              d="M 330,245 C 330,205 355,195 375,200 C 395,205 400,230 395,250 C 390,265 375,270 355,265 Z" 
              fill="url(#duckGrad)" 
              stroke="#000000" 
              strokeWidth="6" 
              strokeLinejoin="round"
            />
            <path 
              d="M 390,220 C 415,220 425,230 420,238 C 410,245 388,245 385,238 Z" 
              fill="#FF6B00" 
              stroke="#000000" 
              strokeWidth="5" 
              strokeLinejoin="round"
            />
            <circle cx="380" cy="216" r="4.5" fill="#000000" />
            <circle cx="378.5" cy="214.5" r="1.5" fill="#FFFFFF" />
            <path 
              d="M 245,235 C 235,215 250,205 260,220 Z" 
              fill="#FACC15" 
              stroke="#000000" 
              strokeWidth="4.5" 
            />
          </g>

          {/* 5. THE ASTRONAUT */}
          <g id="astronautBody">
            <rect 
              x="235" 
              y="180" 
              width="35" 
              height="65" 
              rx="12" 
              fill="#E2E8F0" 
              stroke="#000000" 
              strokeWidth="5.5" 
            />
            <path 
              d="M 265,195 C 265,180 340,175 355,195 C 365,210 365,245 340,250 C 300,255 265,235 265,195 Z" 
              fill="url(#suitGrad)" 
              stroke="#000000" 
              strokeWidth="6" 
            />
            <rect x="290" y="200" width="18" height="12" rx="3" fill="#64748B" stroke="#000000" strokeWidth="2" />
            <path 
              d="M 268,225 C 270,245 285,265 305,260 C 315,255 315,240 300,230 Z" 
              fill="#CBD5E1" 
              stroke="#000000" 
              strokeWidth="5" 
            />
            <ellipse cx="295" cy="255" rx="14" ry="12" fill="#94A3B8" stroke="#000000" strokeWidth="4.5" />
            <ellipse cx="310" cy="180" rx="42" ry="14" fill="#94A3B8" stroke="#000000" strokeWidth="6" />
            <circle cx="310" cy="130" r="54" fill="#F1F5F9" stroke="#000000" strokeWidth="7" />
            <ellipse cx="316" cy="132" rx="42" ry="38" fill="#090D16" stroke="#000000" strokeWidth="5.5" />
            <path 
              d="M 288,112 C 300,102 332,102 344,115 C 334,108 304,108 288,112 Z" 
              fill="#FFFFFF" 
              className="opacity-80" 
            />
            <rect x="250" y="118" width="14" height="30" rx="6" fill="#94A3B8" stroke="#000000" strokeWidth="5" />
            <circle cx="257" cy="133" r="3" fill="#000000" />
            <path 
              d="M 345,185 C 375,170 395,160 415,145 C 425,138 435,148 428,160 C 405,180 375,200 355,205 Z" 
              fill="#E2E8F0" 
              stroke="#000000" 
              strokeWidth="6" 
            />
            <ellipse 
              cx="428" 
              cy="150" 
              rx="15" 
              ry="14" 
              fill="#94A3B8" 
              stroke="#000000" 
              strokeWidth="5" 
            />
          </g>

          {/* 6. GLOWING IRIDESCENT ORB / BUBBLE */}
          <g id="glowingOrb">
            <circle 
              cx="445" 
              cy="95" 
              r={orbPulse ? "28" : "22"} 
              fill="url(#orbGrad)" 
              stroke="#FFFFFF" 
              strokeWidth="2" 
              className={orbPulse ? "scale-110 origin-[445px_95px] transition-transform duration-300" : "animate-pulse"} 
            />
            <ellipse cx="440" cy="90" rx="5" ry="3" fill="#FFFFFF" opacity="0.85" transform="rotate(-30 440 90)" />
          </g>
        </svg>
      </div>

      {/* 3. Action Controls */}
      <div className={`mt-2 flex items-center justify-center gap-2 z-20 ${
        isFlyingAway ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <button
          type="button"
          onClick={handleSayHello}
          className="btn-primary text-xs px-4 py-2 gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-white' : ''}`} />
          <span>{isSpeaking ? 'Speaking...' : 'Say Hello'}</span>
        </button>
        <button
          type="button"
          onClick={handleFlyAway}
          className="btn-secondary text-xs px-3.5 py-2 gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Launch the rocket into orbit"
        >
          <span>🚀 Launch</span>
        </button>
      </div>

      {!isFlyingAway && (
        <span className="text-[11px] text-text-muted mt-2 font-mono">
          Click "Say Hello" for voice, or "Launch" to send the rocket into deep space
        </span>
      )}
    </div>
  );
};
