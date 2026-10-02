import React from "react";

interface CareSaathiLogoProps {
  className?: string;
  showText?: boolean;
  showTagline?: boolean;
}

export default function CareSaathiLogo({
  className = "w-12 h-12",
  showText = false,
  showTagline = false,
}: CareSaathiLogoProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${showText ? "gap-2" : ""}`}>
      <svg
        id="care-saathi-logo"
        viewBox="0 0 100 100"
        className={`${className} select-none`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft rounded background shield/heart */}
        <rect x="6" y="6" width="88" height="88" rx="24" fill="#0d9488" />
        {/* Subtle inner protective ring */}
        <circle cx="50" cy="50" r="38" stroke="#14b8a6" strokeWidth="2.5" strokeDasharray="3 3" />
        
        {/* Medical Cross in clean white */}
        <path
          d="M 43,26 H 57 V 43 H 74 V 57 H 57 V 74 H 43 V 57 H 26 V 43 H 43 Z"
          fill="#ffffff"
          rx="3"
        />

        {/* Small warm heart inside the medical cross center */}
        <path
          d="M 50,56 C 45,51 40,46 40,42 C 40,39 42,37 45,37 C 47,37 49,38 50,40 C 51,38 53,37 55,37 C 58,37 60,39 60,42 C 60,46 55,51 50,56 Z"
          fill="#f43f5e"
        />

        {/* Golden Saathi companion dot / sun accent */}
        <circle cx="72" cy="28" r="5" fill="#f59e0b" />
      </svg>

      {showText && (
        <div className="text-center">
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
            <span>CARE SAATHI</span>
            <span className="text-xs px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full font-medium">केयर साथी</span>
          </h1>
          {showTagline && (
            <p className="text-slate-600 mt-1 text-xs max-w-xs mx-auto">
              AI-Powered Healthcare Access & Continuity Platform
            </p>
          )}
        </div>
      )}
    </div>
  );
}
