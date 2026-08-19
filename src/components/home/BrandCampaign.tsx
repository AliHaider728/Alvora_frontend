import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Atom, Lightbulb, Sparkles } from 'lucide-react';
import promoToysImage from '../../assets/images/placeholder.webp';
import logoImage from '../../assets/images/play_bimboo_logo_1785311841625.webp';

export const BrandCampaign: React.FC<{ sectionSettings: any }> = ({ sectionSettings }) => {
  if (!sectionSettings?.enabled) return null;

  return (
    <section style={{ order: sectionSettings.order }} className="py-14 sm:py-16 w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
      <div className="relative w-full rounded-[28px] md:rounded-[36px] overflow-hidden flex flex-col justify-center min-h-125 md:h-[600px] lg:h-[650px] shadow-xl group">
        {/* Full Background Image */}
        <Image 
          src={promoToysImage}
          alt="Magical Learning Toys"
          fill
          sizes="100vw"
          className="object-cover object-center transition-transform duration-1000 group-hover:scale-[1.02]"
        />
        
        {/* Light Readability Overlay */}
        <div className="absolute inset-0 bg-[#14083c]/15 pointer-events-none" />
        
        {/* Mobile-only stronger overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-t from-[#14083c]/80 via-[#14083c]/40 to-transparent md:hidden pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-r from-[#14083c]/40 to-transparent hidden md:block pointer-events-none" />

        {/* Content Overlay */}
        <div className="relative z-10 w-full md:w-[44%] p-8 sm:p-12 lg:p-16 flex flex-col items-center md:items-start text-center md:text-left space-y-6 md:ml-4 lg:ml-8 mt-auto md:mt-0">
          
          {/* Logo */}
          <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-2xl shadow-sm border border-white/20 mb-2 shrink-0 animate-fade-in">
            <Image 
              src={logoImage} 
              alt="Alvora Skincare" 
              className="w-32 h-auto object-contain"
            />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-900/40 border border-indigo-400/30 text-white text-xs font-bold tracking-wider backdrop-blur-md animate-fade-in">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>PLAY • LEARN • GROW</span>
          </div>

          {/* Headline */}
          <h3 className="font-heading font-black text-3xl sm:text-4xl lg:text-[44px] leading-[1.15] text-white animate-fade-in-up">
            {sectionSettings.heading}
          </h3>

          {/* Copy */}
          <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed max-w-[420px] animate-fade-in-up [animation-delay:100ms]">
            {sectionSettings.subheading}
          </p>

          {/* CTA & Pills Container */}
          <div className="pt-4 w-full flex flex-col items-center md:items-start gap-5 animate-fade-in-up [animation-delay:200ms]">
            <Link
              href={sectionSettings.ctaLink || '/category/all'}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-[20px] bg-linear-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 font-heading font-extrabold text-sm shadow-[0_8px_20px_-6px_rgba(251,191,36,0.6)] transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>{sectionSettings.ctaLabel || 'Explore Alvora Skincare Favorites'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-900/30 border border-blue-400/20 text-blue-100 text-xs font-semibold backdrop-blur-md">
                <Atom className="w-3.5 h-3.5 text-blue-300" /> STEM
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-900/30 border border-pink-400/20 text-pink-100 text-xs font-semibold backdrop-blur-md">
                <Lightbulb className="w-3.5 h-3.5 text-pink-300" /> Creativity
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-900/30 border border-teal-400/20 text-teal-100 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" /> Imagination
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
