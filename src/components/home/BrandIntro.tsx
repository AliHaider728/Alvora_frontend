import React from 'react';

export const BrandIntro: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24 relative overflow-hidden">
      <div className="alvora-container">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          
          {/* Decorative Top Line */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-[1px] bg-[#C48B80]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C48B80]"></div>
            <div className="w-12 h-[1px] bg-[#C48B80]"></div>
          </div>

          <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A] font-medium leading-tight mb-6">
            Thoughtfully Formulated.<br />Beautifully Simple.
          </h2>

          <p className="text-[#4D3D2D]/80 leading-relaxed text-base md:text-lg mb-10">
            At Alvora, we believe healthy skin starts with gentle, effective formulas and the finest ingredients nature has to offer. No unnecessary steps. No harsh ingredients. Just results.
          </p>

          {/* Decorative Stamp */}
          <div className="w-24 h-24 rounded-full border border-[#C48B80] flex items-center justify-center relative spin-slow">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#C48B80] animate-spin-slow" style={{ animationDuration: '15s' }}>
              <path id="curve" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
              <text fontSize="10" letterSpacing="2" className="uppercase font-semibold fill-current">
                <textPath href="#curve" startOffset="0">
                  ✦ ALVORA SKINCARE ✦ CLEAN INGREDIENTS
                </textPath>
              </text>
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
};
