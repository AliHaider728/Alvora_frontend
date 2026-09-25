"use client";
import React from 'react';

const strip1Text = "CLEAR ACNE CARE • DEEP CLEANSING • OIL CONTROL • CLEARER-LOOKING SKIN • DAILY ACNE CARE • ";
const strip2Text = "SKIN GLOW • HYDRATION • SKIN NOURISHMENT • RADIANT-LOOKING SKIN • DAILY SKINCARE ESSENTIALS • ";

const line1 = strip1Text.repeat(10);
const line2 = strip2Text.repeat(10);

export const CrissCrossMarquee: React.FC = () => {
  return (
    <section className="relative w-full h-[180px] md:h-[220px] bg-[#FAF6F2] overflow-hidden flex items-center justify-center">
      
      {/* Strip 2: Charcoal background, angled DOWN (bottom layer) */}
      <div className="absolute w-[120%] -left-[10%] rotate-[4deg] bg-[#1A1A1A] py-3 md:py-4 shadow-lg z-0">
        <div 
          className="flex whitespace-nowrap alvora-marquee-track text-[#F5EDE4] font-sans text-base md:text-xl tracking-[0.2em] font-semibold uppercase"
          style={{ animationDirection: 'reverse', animationDuration: '30s' }}
        >
          <span>{line2}</span>
          <span>{line2}</span>
        </div>
      </div>

      {/* Strip 1: Terracotta background, angled UP (top layer) */}
      <div className="absolute w-[120%] -left-[10%] -rotate-[4deg] bg-[#C87355] py-3 md:py-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)] z-10">
        <div 
          className="flex whitespace-nowrap alvora-marquee-track text-white font-sans text-base md:text-xl tracking-[0.2em] font-semibold uppercase"
          style={{ animationDuration: '25s' }}
        >
          <span>{line1}</span>
          <span>{line1}</span>
        </div>
      </div>

    </section>
  );
};
