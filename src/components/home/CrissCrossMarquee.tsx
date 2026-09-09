"use client";
import React from 'react';

const WORDS_1 = [
  "PURE INGREDIENTS", "VISIBLE RESULTS", "CLINICALLY PROVEN", "DERMATOLOGIST TESTED", 
  "CRUELTY FREE", "VEGAN", "FRAGRANCE FREE", "NON-COMEDOGENIC"
];

const WORDS_2 = [
  "SULFATE FREE", "MINDFUL PACKAGING", "ETHICALLY SOURCED", "SKIN BARRIER SUPPORT", 
  "PARABEN FREE", "RADIANT GLOW", "BOTANICAL EXTRACTS", "BALANCED PH"
];

// Helper to repeat words with bullet points
const createLine = (words: string[]) => {
  const repeated = [...words, ...words, ...words, ...words];
  return repeated.join(" � ") + " � ";
};

const line1 = createLine(WORDS_1);
const line2 = createLine(WORDS_2);

export const CrissCrossMarquee: React.FC = () => {
  return (
    <section className="relative w-full h-[180px] md:h-[220px] bg-[#FAF6F2] overflow-hidden flex items-center justify-center">
      
      {/* Strip 2: Charcoal background, angled DOWN (bottom layer) */}
      <div className="absolute w-[120%] -left-[10%] rotate-[4deg] bg-[#1A1A1A] py-3 md:py-4 shadow-lg z-0">
        <div 
          className="flex whitespace-nowrap alvora-marquee-track text-[#F5EDE4] font-sans text-base md:text-xl tracking-[0.2em] font-semibold uppercase"
          style={{ animationDirection: 'reverse', animationDuration: '15s' }}
        >
          <span>{line2}</span>
          <span>{line2}</span>
        </div>
      </div>

      {/* Strip 1: Terracotta background, angled UP (top layer) */}
      <div className="absolute w-[120%] -left-[10%] -rotate-[4deg] bg-[#C87355] py-3 md:py-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)] z-10">
        <div 
          className="flex whitespace-nowrap alvora-marquee-track text-white font-sans text-base md:text-xl tracking-[0.2em] font-semibold uppercase"
          style={{ animationDuration: '12s' }}
        >
          <span>{line1}</span>
          <span>{line1}</span>
        </div>
      </div>

    </section>
  );
};
