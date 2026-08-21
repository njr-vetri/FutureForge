import React, { useEffect, useRef, useState } from 'react';

export type MascotMood = 'idle' | 'shy' | 'excited' | 'peeking' | 'focused';

interface LoginMascotProps {
  mood?: MascotMood;
  isPasswordActive?: boolean;
  isPasswordVisible?: boolean;
  onMascotClick?: () => void;
  className?: string;
}

export const LoginMascot: React.FC<LoginMascotProps> = ({
  mood = 'idle',
  isPasswordActive = false,
  isPasswordVisible = false,
  onMascotClick,
  className = '',
}) => {
  const mascotRef = useRef<SVGSVGElement>(null);
  const pupilLRef = useRef<SVGCircleElement>(null);
  const pupilRRef = useRef<SVGCircleElement>(null);
  const [interactiveMood, setInteractiveMood] = useState<MascotMood>(mood);

  // Synchronize incoming mood prop or password states
  useEffect(() => {
    if (mood === 'excited') {
      setInteractiveMood('excited');
    } else if (isPasswordActive) {
      if (isPasswordVisible) {
        setInteractiveMood('peeking');
      } else {
        setInteractiveMood('shy');
      }
    } else {
      setInteractiveMood(mood);
    }
  }, [mood, isPasswordActive, isPasswordVisible]);

  // Cursor pupil tracking
  useEffect(() => {
    const EYE = { L: { cx: 94, cy: 76 }, R: { cx: 126, cy: 76 }, maxR: 3.8 };

    const handleMouseMove = (e: MouseEvent) => {
      if (interactiveMood === 'shy' || interactiveMood === 'excited') return;
      if (!mascotRef.current || !pupilLRef.current || !pupilRRef.current) return;

      const rect = mascotRef.current.getBoundingClientRect();
      const scaleX = rect.width / 220;
      const scaleY = rect.height / 220;

      const movePupil = (el: SVGCircleElement, eye: { cx: number; cy: number }) => {
        const eyeScreenX = rect.left + eye.cx * scaleX;
        const eyeScreenY = rect.top + eye.cy * scaleY;

        const dx = e.clientX - eyeScreenX;
        const dy = e.clientY - eyeScreenY;
        const dist = Math.min(Math.hypot(dx, dy), 65);
        const angle = Math.atan2(dy, dx);
        const offX = Math.cos(angle) * (dist / 65) * EYE.maxR;
        const offY = Math.sin(angle) * (dist / 65) * EYE.maxR;

        el.setAttribute('transform', `translate(${offX.toFixed(2)}, ${offY.toFixed(2)})`);
      };

      movePupil(pupilLRef.current, EYE.L);
      movePupil(pupilRRef.current, EYE.R);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactiveMood]);

  const handleMascotClickInternal = () => {
    if (interactiveMood !== 'shy') {
      setInteractiveMood('excited');
      setTimeout(() => {
        setInteractiveMood('idle');
      }, 1200);
    }
    if (onMascotClick) onMascotClick();
  };

  const getMascotClass = () => {
    switch (interactiveMood) {
      case 'shy':
        return 'mascot-shy';
      case 'excited':
        return 'mascot-excited';
      case 'peeking':
        return 'mascot-peeking';
      case 'focused':
        return 'mascot-focused';
      default:
        return 'mascot-idle';
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-end select-none ${className}`}>
      {/* Dynamic Sparkles (Triggers on Excited state) */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {interactiveMood === 'excited' && (
          <div className="sparkle-burst">
            <span className="sparkle s1 text-[#F4C95D]">✦</span>
            <span className="sparkle s2 text-[#22C55E]">✧</span>
            <span className="sparkle s3 text-[#F4C95D]">✦</span>
            <span className="sparkle s4 text-[#74C69D]">✧</span>
            <span className="sparkle s5 text-[#F4C95D]">✦</span>
            <span className="sparkle s6 text-[#22C55E]">✧</span>
          </div>
        )}
      </div>

      {/* Mascot Base Shadow */}
      <div
        className={`mascot-shadow-el transition-all duration-300 ${
          interactiveMood === 'excited'
            ? 'scale-115 opacity-60'
            : interactiveMood === 'shy'
            ? 'scale-90 opacity-40'
            : 'scale-100 opacity-50'
        }`}
      />

      {/* Mascot SVG Robot */}
      <svg
        ref={mascotRef}
        id="mascot"
        className={`w-40 h-40 md:w-44 md:h-44 transition-transform duration-300 cursor-pointer ${getMascotClass()}`}
        viewBox="0 0 220 220"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleMascotClickInternal}
        role="img"
        aria-label="Byte the AI CareerOS Mascot"
      >
        <defs>
          <linearGradient id="mascotHeadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E6F5EC" />
          </linearGradient>

          <linearGradient id="mascotBodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#DFF2E6" />
          </linearGradient>

          <linearGradient id="mascotArmGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#74C69D" />
            <stop offset="100%" stopColor="#1B4332" />
          </linearGradient>

          <filter id="mascotGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Antenna Stem */}
        <line
          x1="110"
          y1="18"
          x2="110"
          y2="38"
          stroke="#1B4332"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Antenna Glowing Bulb */}
        <circle
          className="mascot-antenna-light"
          cx="110"
          cy="15"
          r="6"
          fill={interactiveMood === 'excited' ? '#F4C95D' : '#95D5B2'}
          stroke="#1B4332"
          strokeWidth="2"
        />

        {/* Right Arm */}
        <g className="mascot-arm right-arm">
          <rect
            x="152"
            y="118"
            width="20"
            height="52"
            rx="10"
            fill="url(#mascotArmGrad)"
            stroke="#1B4332"
            strokeWidth="3"
          />
          <circle cx="162" cy="174" r="10" fill="#E6F5EC" stroke="#1B4332" strokeWidth="3" />
        </g>

        {/* Left Arm */}
        <g className="mascot-arm left-arm">
          <rect
            x="48"
            y="118"
            width="20"
            height="52"
            rx="10"
            fill="url(#mascotArmGrad)"
            stroke="#1B4332"
            strokeWidth="3"
          />
          <circle cx="58" cy="174" r="10" fill="#E6F5EC" stroke="#1B4332" strokeWidth="3" />
        </g>

        {/* Legs / Paws */}
        <rect x="86" y="196" width="16" height="12" rx="4" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1.5" />
        <rect x="118" y="196" width="16" height="12" rx="4" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1.5" />

        {/* Main Body Chassis */}
        <rect
          x="58"
          y="108"
          width="104"
          height="88"
          rx="26"
          fill="url(#mascotBodyGrad)"
          stroke="#1B4332"
          strokeWidth="4"
        />

        {/* Chest Plate Panel */}
        <circle cx="110" cy="152" r="18" fill="#F2FBF6" stroke="#95D5B2" strokeWidth="2.5" />
        <circle
          className="mascot-core-glow"
          cx="110"
          cy="152"
          r="9"
          fill={interactiveMood === 'excited' ? '#F4C95D' : '#95D5B2'}
        />
        <circle cx="110" cy="152" r="4" fill="#40916C" />

        {/* Side Panel Tech Seams */}
        <line
          x1="70"
          y1="130"
          x2="70"
          y2="182"
          stroke="#95D5B2"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
        <line
          x1="150"
          y1="130"
          x2="150"
          y2="182"
          stroke="#95D5B2"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Head Chassis */}
        <rect
          x="62"
          y="38"
          width="96"
          height="76"
          rx="22"
          fill="url(#mascotHeadGrad)"
          stroke="#1B4332"
          strokeWidth="4"
        />

        {/* Screen Face Plate */}
        <rect
          x="76"
          y="54"
          width="68"
          height="44"
          rx="12"
          fill="#0C2B21"
          stroke="#95D5B2"
          strokeWidth="2.5"
        />

        {/* Cheek LED Blushes (Shy & Excited) */}
        <circle
          className={`transition-opacity duration-300 ${
            interactiveMood === 'shy' || interactiveMood === 'peeking'
              ? 'opacity-90'
              : interactiveMood === 'excited'
              ? 'opacity-60'
              : 'opacity-0'
          }`}
          cx="70"
          cy="72"
          r="6"
          fill="#FFB3B3"
        />
        <circle
          className={`transition-opacity duration-300 ${
            interactiveMood === 'shy' || interactiveMood === 'peeking'
              ? 'opacity-90'
              : interactiveMood === 'excited'
              ? 'opacity-60'
              : 'opacity-0'
          }`}
          cx="150"
          cy="72"
          r="6"
          fill="#FFB3B3"
        />

        {/* Screen Eye Sockets & Interactive Pupils */}
        <g
          className={`transition-opacity duration-200 ${
            interactiveMood === 'shy'
              ? 'opacity-0'
              : interactiveMood === 'excited'
              ? 'opacity-0'
              : 'opacity-100'
          }`}
        >
          <circle cx="94" cy="76" r="10" fill="#0C2B21" stroke="#95D5B2" strokeWidth="2" />
          <circle cx="126" cy="76" r="10" fill="#0C2B21" stroke="#95D5B2" strokeWidth="2" />
          <circle ref={pupilLRef} className="pupil-dot" cx="94" cy="76" r="6" fill="#95D5B2" />
          <circle ref={pupilRRef} className="pupil-dot" cx="126" cy="76" r="6" fill="#95D5B2" />
        </g>

        {/* Happy Arched Eyes (Excited Mode) */}
        <g
          className={`transition-opacity duration-200 ${
            interactiveMood === 'excited' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <path
            d="M86 78 L94 70 L102 78"
            stroke="#95D5B2"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M118 78 L126 70 L134 78"
            stroke="#95D5B2"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Shy Hidden Eyes (Slit Lines) */}
        <g
          className={`transition-opacity duration-200 ${
            interactiveMood === 'shy' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <line x1="88" y1="76" x2="100" y2="76" stroke="#95D5B2" strokeWidth="3" strokeLinecap="round" />
          <line x1="120" y1="76" x2="132" y2="76" stroke="#95D5B2" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Mouth Speaker Grille */}
        <rect
          className="transition-all duration-300"
          x="94"
          y="88"
          width="32"
          height={interactiveMood === 'excited' ? '7' : '5'}
          rx="2.5"
          fill="#40916C"
        />

        {/* Side Ear Bolts */}
        <circle cx="62" cy="76" r="6" fill="#E6F5EC" stroke="#1B4332" strokeWidth="2.5" />
        <circle cx="158" cy="76" r="6" fill="#E6F5EC" stroke="#1B4332" strokeWidth="2.5" />
      </svg>
    </div>
  );
};
