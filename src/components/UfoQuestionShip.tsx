import React, { useState } from 'react';
import { playSound } from '../utils/sound';

interface UfoQuestionShipProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
  onClick?: () => void;
  showTractorBeam?: boolean;
  interactive?: boolean;
  caption?: string;
}

export const UfoQuestionShip: React.FC<UfoQuestionShipProps> = ({
  className = '',
  size = 'responsive',
  onClick,
  showTractorBeam = true,
  interactive = true,
  caption,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pulseWave, setPulseWave] = useState(false);

  const handleClick = () => {
    playSound('warp');
    setPulseWave(true);
    setTimeout(() => setPulseWave(false), 900);
    if (onClick) {
      onClick();
    }
  };

  const sizeClasses = {
    sm: 'w-[180px] h-[190px]',
    md: 'w-[260px] h-[280px]',
    lg: 'w-[360px] h-[390px]',
    responsive: 'w-full max-w-[340px] sm:max-w-[420px] aspect-[4/4.2]',
  }[size];

  return (
    <div
      onClick={interactive ? handleClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col items-center justify-center select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${sizeClasses} ${className}`}
      title={interactive ? "Click the UFO to consult Gitnaut AI!" : undefined}
    >
      <svg
        viewBox="0 0 500 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full overflow-visible transition-transform duration-500 ease-out ${
          isHovered ? 'scale-105' : 'scale-100'
        } ${pulseWave ? 'animate-pulse' : 'animate-[float_5s_ease-in-out_infinite]'}`}
      >
        <defs>
          {/* Glass dome gradient */}
          <linearGradient id="domeGrad" x1="250" y1="365" x2="250" y2="405" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* Upper saucer disc gradient */}
          <linearGradient id="upperSaucerGrad" x1="120" y1="410" x2="380" y2="445" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="50%" stopColor="#312E81" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>

          {/* Lower saucer emerald/cyan hull gradient */}
          <linearGradient id="lowerSaucerGrad" x1="150" y1="440" x2="350" y2="465" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Under-hull lip */}
          <linearGradient id="underHullLip" x1="200" y1="455" x2="300" y2="470" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Tractor beam gradient */}
          <linearGradient id="beamGrad" x1="250" y1="465" x2="250" y2="540" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#67E8F9" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.1" />
          </linearGradient>

          {/* Smoke Question Mark Nebula Gradient */}
          <linearGradient id="smokeGrad" x1="250" y1="50" x2="250" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.65" />
            <stop offset="35%" stopColor="#A78BFA" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#C084FC" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E9D5FF" stopOpacity="0.6" />
          </linearGradient>

          {/* Inner stardust trail */}
          <linearGradient id="stardustCore" x1="250" y1="60" x2="250" y2="370" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#F5D0FE" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0.8" />
          </linearGradient>

          {/* Radial aura glow behind question mark */}
          <radialGradient id="smokeAura" cx="50%" cy="35%" r="45%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#6366F1" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Soft blur filter for glow */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient atmospheric aura */}
        <circle cx="250" cy="220" r="180" fill="url(#smokeAura)" />

        {/* 1. SMOKE QUESTION MARK PLUME */}
        <g className="transition-all duration-700 ease-out">
          <path
            d="M 242 368 
               C 245 348, 252 332, 260 320
               C 272 304, 280 292, 276 278
               C 270 262, 254 260, 248 248
               C 242 232, 250 216, 262 196
               C 278 170, 290 148, 292 128
               C 295 98, 270 66, 230 62
               C 192 58, 156 82, 146 118
               C 140 140, 146 156, 160 168
               C 172 178, 178 194, 168 206
               C 156 220, 134 216, 126 196
               C 118 174, 122 136, 142 98
               C 170 48, 226 34, 278 44
               C 328 54, 356 94, 348 144
               C 342 184, 314 220, 292 254
               C 280 274, 282 288, 288 302
               C 296 320, 288 340, 272 358
               C 264 366, 256 370, 252 372
               Z"
            fill="url(#smokeGrad)"
            filter="url(#softGlow)"
            className="opacity-95"
          />

          <path
            d="M 246 362 
               C 248 342, 256 330, 262 318
               C 270 300, 274 286, 268 274
               C 260 258, 252 248, 256 232
               C 264 212, 276 188, 284 164
               C 290 140, 286 114, 274 94
               C 256 68, 224 64, 196 74
               C 168 84, 150 110, 152 134
               C 154 150, 162 160, 166 172
               C 162 178, 152 176, 148 168
               C 142 152, 140 126, 154 100
               C 176 60, 224 50, 266 60
               C 308 70, 332 104, 326 142
               C 320 178, 298 210, 280 240
               C 268 260, 270 278, 276 294
               C 282 312, 276 332, 262 352
               Z"
            fill="url(#stardustCore)"
            className="opacity-80"
          />

          {/* Stardust particles & golden stars */}
          <g>
            <circle cx="210" cy="85" r="2.5" fill="#FEF08A" className="animate-pulse" />
            <circle cx="240" cy="72" r="3.2" fill="#FACC15" />
            <circle cx="270" cy="80" r="2.8" fill="#FFFFFF" />
            <circle cx="295" cy="100" r="3.5" fill="#FEF08A" />
            <circle cx="318" cy="125" r="2.6" fill="#FDE047" />
            <circle cx="325" cy="155" r="3.0" fill="#FFFFFF" className="animate-pulse" />
            <circle cx="308" cy="188" r="3.6" fill="#FACC15" />
            <circle cx="288" cy="218" r="2.4" fill="#FEF08A" />
            <circle cx="272" cy="248" r="3.2" fill="#FFFFFF" />
            <circle cx="265" cy="285" r="2.5" fill="#FACC15" />
            <circle cx="274" cy="318" r="3.4" fill="#FEF08A" className="animate-pulse" />
            <circle cx="260" cy="345" r="2.8" fill="#FDE047" />

            {/* Inner stardust grains */}
            <circle cx="185" cy="105" r="1.5" fill="#FFFFFF" opacity="0.9" />
            <circle cx="198" cy="92" r="2" fill="#FEF08A" opacity="0.85" />
            <circle cx="225" cy="88" r="1.8" fill="#FACC15" opacity="0.9" />
            <circle cx="252" cy="85" r="2.2" fill="#FFFFFF" opacity="0.9" />
            <circle cx="282" cy="92" r="1.6" fill="#FEF08A" opacity="0.8" />
            <circle cx="302" cy="115" r="2.0" fill="#FACC15" opacity="0.95" />
            <circle cx="310" cy="140" r="1.5" fill="#FFFFFF" opacity="0.85" />
            <circle cx="300" cy="165" r="2.2" fill="#FEF08A" opacity="0.9" />
            <circle cx="292" cy="195" r="1.8" fill="#FACC15" opacity="0.8" />
            <circle cx="280" cy="228" r="2.5" fill="#FFFFFF" opacity="0.95" />
            <circle cx="268" cy="265" r="1.6" fill="#FEF08A" opacity="0.85" />
            <circle cx="262" cy="300" r="2.2" fill="#FACC15" opacity="0.9" />
            <circle cx="266" cy="330" r="1.8" fill="#FFFFFF" opacity="0.8" />

            <circle cx="160" cy="130" r="2.5" fill="#FEF08A" />
            <circle cx="152" cy="155" r="2" fill="#FFFFFF" opacity="0.8" />
            <circle cx="162" cy="180" r="3" fill="#FACC15" />
            <circle cx="140" cy="188" r="1.6" fill="#FEF08A" opacity="0.75" />

            {/* Twinkle stars */}
            <path
              d="M 242 96 L 244 100 L 248 102 L 244 104 L 242 108 L 240 104 L 236 102 L 240 100 Z"
              fill="#FFFFFF"
            />
            <path
              d="M 312 172 L 314 176 L 318 178 L 314 180 L 312 184 L 310 180 L 306 178 L 310 176 Z"
              fill="#FEF08A"
            />
            <path
              d="M 276 270 L 277.5 273 L 280.5 274.5 L 277.5 276 L 276 279 L 274.5 276 L 271.5 274.5 L 274.5 273 Z"
              fill="#FACC15"
            />
          </g>
        </g>

        {/* 2. THE TRACTOR BEAM & LIGHTNING UNDERNEATH */}
        {showTractorBeam && (
          <g className="transition-opacity duration-300">
            <polygon
              points="242,460 258,460 272,535 228,535"
              fill="url(#beamGrad)"
            />
            <path
              d="M 248 460 
                 L 236 495 
                 L 264 495 
                 L 242 535 
                 L 256 535 
                 L 280 495 
                 L 254 495 
                 L 262 460 
                 Z"
              fill="#38BDF8"
              opacity="0.8"
            />
            <path
              d="M 242 495 L 222 518 L 254 518 L 240 538"
              stroke="#38BDF8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-90"
            />
          </g>
        )}

        {/* 3. THE UFO FLYING SAUCER CRAFT */}
        <g id="ufoSaucerBody">
          {/* Top Glass Cockpit Dome */}
          <path
            d="M 205 400 
               C 205 365, 295 365, 295 400 
               Z"
            fill="url(#domeGrad)"
            stroke="#1E1B4B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <ellipse cx="236" cy="380" rx="9" ry="6" fill="#FFFFFF" opacity="0.75" />
          <ellipse cx="258" cy="376" rx="6" ry="4" fill="#FFFFFF" opacity="0.65" />
          <circle cx="270" cy="384" r="3" fill="#FFFFFF" opacity="0.55" />

          {/* Lower Saucer Hull */}
          <ellipse
            cx="250"
            cy="448"
            rx="110"
            ry="26"
            fill="url(#lowerSaucerGrad)"
            stroke="#1E1B4B"
            strokeWidth="4"
          />

          {/* Under-hull ventral plate */}
          <ellipse
            cx="250"
            cy="455"
            rx="55"
            ry="12"
            fill="url(#underHullLip)"
            stroke="#1E1B4B"
            strokeWidth="3"
          />

          {/* Upper Saucer Body */}
          <ellipse
            cx="250"
            cy="428"
            rx="135"
            ry="24"
            fill="url(#upperSaucerGrad)"
            stroke="#1E1B4B"
            strokeWidth="4.5"
          />

          {/* Saucer Outer Rim Edge Glow Band */}
          <ellipse
            cx="250"
            cy="435"
            rx="132"
            ry="13"
            fill="#4F46E5"
            stroke="#1E1B4B"
            strokeWidth="2.5"
          />

          {/* Glowing Saucer Rim Lights */}
          <g id="saucerLights">
            {[-105, -75, -45, -15, 15, 45, 75, 105].map((offset, i) => {
              const cx = 250 + offset;
              const normalizedX = offset / 115;
              const cy = 435 + Math.sqrt(Math.max(0, 1 - normalizedX * normalizedX)) * 4.5;
              return (
                <g key={i}>
                  <ellipse
                    cx={cx}
                    cy={cy}
                    rx="12"
                    ry="5.5"
                    fill="#38BDF8"
                    opacity={pulseWave ? "0.95" : "0.75"}
                    className={pulseWave ? "animate-ping" : ""}
                  />
                  <ellipse
                    cx={cx}
                    cy={cy}
                    rx="8"
                    ry="3.5"
                    fill="#67E8F9"
                  />
                  <ellipse
                    cx={cx}
                    cy={cy}
                    rx="4"
                    ry="1.8"
                    fill="#FFFFFF"
                    opacity="0.9"
                  />
                </g>
              );
            })}
          </g>
        </g>

        {/* Ambient starry backdrop specks around ship */}
        <g opacity="0.8">
          <circle cx="70" cy="180" r="1.5" fill="#FEF08A" />
          <circle cx="430" cy="160" r="2" fill="#FEF08A" />
          <circle cx="410" cy="280" r="1.5" fill="#FFFFFF" />
          <circle cx="90" cy="340" r="2" fill="#38BDF8" />
          <circle cx="40" cy="90" r="2" fill="#FFFFFF" />
          <circle cx="440" cy="60" r="1.8" fill="#FEF08A" />
          <path
            d="M 42 70 L 44 74 L 48 76 L 44 78 L 42 82 L 40 78 L 36 76 L 40 74 Z"
            fill="#FEF08A"
          />
          <path
            d="M 370 470 L 371.5 473 L 374.5 474.5 L 371.5 476 L 370 479 L 368.5 476 L 365.5 474.5 L 368.5 473 Z"
            fill="#FEF08A"
          />
        </g>
      </svg>

      {caption && (
        <span className="mt-2 text-xs font-mono font-semibold text-accent tracking-wide text-center">
          {caption}
        </span>
      )}
    </div>
  );
};
