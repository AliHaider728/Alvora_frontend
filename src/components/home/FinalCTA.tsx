import React from 'react';
import Link from 'next/link';

export const FinalCTA: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-[#F1C9BD] to-[#C48B80] py-20 overflow-hidden relative">
      <div className="alvora-container relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          
          <div className="text-center md:text-left md:max-w-xl">
            <h2 className="font-display text-4xl lg:text-5xl text-[#1A1A1A] mb-4">
              Your Best Skin Is<br />Just One Step Away
            </h2>
            <p className="text-[#1A1A1A]/80 text-base md:text-lg mb-8">
              Discover skincare that fits your skin and your routine.
            </p>
            <Link 
              href="/category/all" 
              className="inline-flex items-center justify-center bg-[#1A1A1A] hover:bg-white text-white hover:text-[#1A1A1A] transition-colors duration-300 px-10 py-4 text-xs font-semibold tracking-widest uppercase"
            >
              EXPLORE ALVORA &rarr;
            </Link>
          </div>

          <div className="hidden md:flex relative w-64 h-64 items-center justify-center">
            {/* Abstract Decorative Element replacing product stack */}
            <div className="absolute inset-0 border border-[#1A1A1A]/20 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }}></div>
            <div className="absolute inset-4 border border-[#1A1A1A]/10 rounded-full animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex flex-col items-center justify-center shadow-lg border border-white/40">
               <span className="font-display text-2xl text-[#1A1A1A] opacity-80">A</span>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Background soft pattern/texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
    </section>
  );
};
