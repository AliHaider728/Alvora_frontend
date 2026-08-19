import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FlaskConical, Heart, Users } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-[#FAF6F2] relative w-full overflow-hidden">
      <div className="alvora-container">
        <div className="flex flex-col lg:flex-row min-h-[70vh] lg:min-h-[90vh]">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 lg:py-20 lg:pr-12 z-10">
            <span className="text-xs tracking-widest uppercase text-[#C48B80] font-semibold mb-6 block">
              PURE INGREDIENTS. VISIBLE RESULTS.
            </span>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#1A1A1A] font-bold leading-[1.1] mb-6">
              Skincare,<br />Made Simple.
            </h1>
            
            <p className="text-base md:text-lg text-[#4D3D2D]/80 leading-relaxed max-w-lg mb-10">
              Thoughtfully formulated skincare that nourishes, protects and brings out your most radiant skin.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
              <Link href="/category/all?sort=bestseller" className="btn-primary w-full sm:w-auto text-center px-8 py-3.5">
                SHOP BEST SELLERS
              </Link>
              <Link href="/category/all" className="btn-secondary w-full sm:w-auto text-center px-8 py-3.5">
                EXPLORE SKINCARE
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-t border-[#EDE5DC] pt-8">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C48B80]" />
                <span className="text-xs font-medium text-[#4D3D2D]">Clean<br/>Ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-[#C48B80]" />
                <span className="text-xs font-medium text-[#4D3D2D]">Dermatologist<br/>Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#C48B80]" />
                <span className="text-xs font-medium text-[#4D3D2D]">Cruelty<br/>Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C48B80]" />
                <span className="text-xs font-medium text-[#4D3D2D]">For All<br/>Skin Types</span>
              </div>
            </div>
          </div>

          {/* Right Image Placeholder */}
          <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#F5EDE4] to-[#F1C9BD] lg:rounded-bl-[80px] overflow-hidden flex items-center justify-center">
              {/* Decorative silhouette simulating a premium product cluster */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white/40 backdrop-blur-sm rounded-full flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(196,139,128,0.15)] border border-white/60">
                <span className="font-display text-3xl md:text-4xl text-[#4D3D2D] tracking-widest uppercase">
                  ALVORA
                </span>
                <span className="text-[10px] tracking-widest text-[#4D3D2D]/60 uppercase mt-2">
                  Premium Skincare
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
