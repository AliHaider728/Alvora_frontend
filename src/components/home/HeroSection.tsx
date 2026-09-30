"use client";

import React from "react";
import Link from "next/link";
import Image, { getImageProps } from "next/image";
import { ArrowRight, ArrowDown } from "lucide-react";
import { AnimatedButton } from "../common/AnimatedButton";

export const HeroSection: React.FC<{ featuredHref?: string }> = ({ featuredHref }) => {
  const common = { alt: "Alvora Skincare - Healthy Skin, Naturally You", fill: true, priority: true, sizes: "100vw" };
  const { props: desktop } = getImageProps({ ...common, src: "/images/alvora-desktop-hero.webp" });
  const { props: mobile } = getImageProps({ ...common, src: "/images/alvora-mobile-hero.webp" });

  return (
    <section className="relative h-[85svh] min-h-[550px] sm:h-screen sm:min-h-[750px] max-h-[950px] w-full bg-transparent overflow-hidden sm:overflow-visible">
      
      {/* Unified Responsive Background Image */}
      <div className="absolute inset-0 z-0 sm:fixed sm:w-screen sm:h-screen">
        <picture>
          <source media="(max-width: 639px)" srcSet={mobile.srcSet} />
          <source media="(min-width: 640px)" srcSet={desktop.srcSet} />
          <img 
            alt={desktop.alt}
            src={desktop.src} 
            srcSet={desktop.srcSet}
            sizes={desktop.sizes}
            fetchPriority="high"
            decoding="sync"
            className="w-full h-full object-cover object-center sm:object-[right_80px] sm:scale-[1.05]" 
          />
        </picture>
      </div>

      {/* Overlay to improve text contrast against dark parts of the image */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#FAF6F2]/80 via-[#FAF6F2]/20 to-transparent sm:bg-none sm:bg-gradient-to-r sm:from-[#FAF6F2]/90 sm:via-[#FAF6F2]/30 sm:to-transparent pointer-events-none" />
      
      {/* Navbar contrast overlay: ensures dark header icons remain visible against the image */}
      <div className="absolute inset-x-0 top-0 h-[180px] z-0 bg-gradient-to-b from-[#FAF6F2] via-[#FAF6F2]/80 to-transparent pointer-events-none" />
      
      {/* 
        The Header is fixed and overlays this section. 
        We add padding-top to ensure the content starts safely below the header,
        but the background itself starts from the very top of the page.
      */}
      <div className="relative z-10 mx-auto flex w-full h-full max-w-375 flex-col justify-start pt-32 sm:justify-center px-5 sm:pt-24 sm:px-8 lg:px-12">
        <div className="max-w-xl pb-16">
          {/* Eyebrow */}
          <div 



            className="mb-6 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-[#8C7B74]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3A2E2A]">
              PURE • NATURAL • EFFECTIVE
            </span>
          </div>

          {/* Headline */}
          <h1 



            className="mb-8 font-display text-4xl leading-[1.2] text-[#241916] md:text-5xl lg:text-5xl tracking-tight"
          >
            Healthy Skin.<br className="hidden sm:inline" />
            <span className="italic text-[#A86249]">Naturally You.</span>
          </h1>

          {/* Supporting paragraph */}
          <p 



            className="mb-10 max-w-sm text-sm leading-relaxed text-[#3A2E2A] md:text-base"
          >
            Thoughtfully crafted skincare with nature's<br className="hidden sm:inline" />
            finest ingredients — for a calmer, clearer,<br className="hidden sm:inline" />
            more radiant you.
          </p>

          {/* CTAs */}
          <div 



            className="flex flex-col flex-wrap items-start gap-4 sm:flex-row sm:items-center sm:gap-6 mt-4"
          >
            <AnimatedButton 
              href="/category/all" 
              size="sm" 
              variant="primary"
              className="!py-[12px] !px-[32px] !text-[14px]"
            >
              DISCOVER THE COLLECTION
            </AnimatedButton>
          </div>
        </div>



        {/* Bottom Right: Scroll Down */}
        <div 



          className="hidden sm:flex absolute bottom-8 right-5 flex-col items-center gap-4 sm:right-8 lg:right-12"
        >
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/60 text-white transition-colors hover:bg-white hover:text-[#241916] backdrop-blur-sm bg-white/10 shadow-sm"
            aria-label="Scroll down"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <span className="text-center text-[8px] font-bold uppercase tracking-[0.2em] text-white drop-shadow-md [writing-mode:vertical-lr] rotate-180 sm:[writing-mode:horizontal-tb] sm:rotate-0">
            SCROLL<br className="hidden sm:block" /> DOWN
          </span>
        </div>

        {/* Right Edge: Vertical Text */}
        <div 



          className="absolute right-5 top-1/2 hidden -translate-y-1/2 lg:block lg:right-12"
        >
          <div className="flex items-center gap-6 [writing-mode:vertical-rl] rotate-180">
            <div className="h-16 w-px bg-[#8C7B74]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3A2E2A]">
              SKINCARE COLLECTION
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
