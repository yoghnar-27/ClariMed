import React from "react";

interface ClariMedLogoProps {
  className?: string;
  showText?: boolean;
  showTagline?: boolean;
}

export default function ClariMedLogo({
  className = "w-16 h-16",
  showText = false,
  showTagline = false,
}: ClariMedLogoProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${showText ? "gap-2" : ""}`}>
      <svg
        id="clarimed-vector-logo"
        viewBox="0 0 500 500"
        className={`${className} select-none`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Gradient for the C-shape and highlights */}
          <linearGradient id="logoGradient" x1="100" y1="100" x2="400" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284c7" /> {/* sky-600 */}
            <stop offset="50%" stopColor="#0ea5e9" /> {/* sky-500 */}
            <stop offset="100%" stopColor="#0d9488" /> {/* teal-600 */}
          </linearGradient>

          {/* Sparkles and accent gradient */}
          <linearGradient id="accentGradient" x1="330" y1="100" x2="420" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>

          {/* Paper shadow */}
          <filter id="paperShadow" x="150" y="120" width="180" height="240" filterUnits="userSpaceOnUse">
            <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.12" />
          </filter>

          {/* 4-point Star / Sparkle definition */}
          <g id="sparkle">
            <path
              d="M 0,-15 C 0,-2 2,0 15,0 C 2,0 0,2 0,15 C 0,2 -2,0 -15,0 C -2,0 0,-2 0,-15 Z"
              fill="url(#accentGradient)"
            />
          </g>
        </defs>

        {/* 1. Styled Background 'C' Shape (Ring) */}
        <path
          id="logo-c-ring"
          d="M 350,150 A 135,135 0 1,0 350,310"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="48"
          strokeLinecap="round"
        />

        {/* 2. Speech Bubble Tail at bottom left of the 'C' */}
        <path
          id="logo-bubble-tail"
          d="M 165,312 L 140,375 C 158,358 190,340 210,330"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="48"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Extra circle overlap to smooth tail connection */}
        <circle cx="165" cy="312" r="24" fill="url(#logoGradient)" />

        {/* 3. The Medical Report Document (with Shadow) */}
        <g filter="url(#paperShadow)">
          {/* Main Paper Sheet */}
          <path
            id="report-paper-body"
            d="M 195,145 H 275 L 315,185 V 325 C 315,333 308,340 300,340 H 195 C 187,340 180,333 180,325 V 160 C 180,152 187,145 195,145 Z"
            fill="#ffffff"
          />
          {/* Folded Top-Right Corner */}
          <path
            id="report-paper-fold"
            d="M 275,145 V 185 H 315 Z"
            fill="#ccfbf1"
          />
          <path
            id="report-paper-fold-dark"
            d="M 275,185 L 315,185 L 275,145 Z"
            fill="#99f6e4"
            opacity="0.5"
          />
        </g>

        {/* 4. Inside Report Content */}
        {/* Medical Cross (+) */}
        <path
          id="report-cross"
          d="M 226,180 H 234 V 188 H 242 V 196 H 234 V 204 H 226 V 196 H 218 V 188 H 226 Z"
          fill="#0d9488"
        />

        {/* Horizontal Placeholder Lines */}
        <line
          id="report-line-1"
          x1="218"
          y1="220"
          x2="280"
          y2="220"
          stroke="#94a3b8"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          id="report-line-2"
          x1="218"
          y1="234"
          x2="265"
          y2="234"
          stroke="#cbd5e1"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Heartbeat / EKG Pulse Line */}
        <path
          id="report-ekg"
          d="M 198,275 H 222 L 227,260 L 232,290 L 239,248 L 246,282 L 251,275 H 295"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 5. Floating Sparkles / Stars */}
        <use href="#sparkle" x="375" y="115" transform="scale(1)" />
        <use href="#sparkle" x="345" y="155" transform="scale(0.7)" />
        <use href="#sparkle" x="400" y="145" transform="scale(0.5)" />
      </svg>

      {showText && (
        <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
          ClariMed
        </h1>
      )}
      {showText && showTagline && (
        <p className="text-slate-500 mt-3 text-center text-sm font-sans leading-relaxed max-w-xs font-light">
          Clarify and listen to your medical reports with Claria, your professional clinical voice assistant.
        </p>
      )}
    </div>
  );
}
