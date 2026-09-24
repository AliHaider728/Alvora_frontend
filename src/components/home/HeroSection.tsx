"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedButton } from "../common/AnimatedButton";

export const HeroSection: React.FC<{ featuredHref?: string }> = ({ featuredHref }) => {
  return (
    <section className="relative min-h-[100svh] w-full bg-[url('/images/home-hero-mobile.jpg')] sm:bg-[url('/images/home-hero-desktop.png')] bg-cover bg-bottom sm:bg-center bg-scroll sm:bg-fixed bg-no-repeat overflow-hidden">
      {/* Overlay to improve text contrast against dark parts of the image (Mobile: solid fade, Desktop: gradient from left) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F2]/80 via-[#FAF6F2]/20 to-transparent sm:bg-none sm:bg-gradient-to-r sm:from-[#FAF6F2]/90 sm:via-[#FAF6F2]/30 sm:to-transparent pointer-events-none transition-colors duration-300" />
      {/* Subtle overlay for bottom/right icons contrast (Bug 32) */}
      <div className="hidden sm:block absolute inset-0 bg-gradient-to-tl from-black/50 via-transparent to-transparent pointer-events-none opacity-80" />
      
      {/* 
        The Header is fixed and overlays this section. 
        We add padding-top to ensure the content starts safely below the header,
        but the background itself starts from the very top of the page.
      */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-start pt-32 sm:justify-center px-5 sm:pt-24 sm:px-8 lg:px-12">
        <div className="max-w-xl pb-16">
          {/* Eyebrow */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-[#8C7B74]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3A2E2A]">
              PURE • NATURAL • EFFECTIVE
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="mb-8 font-display text-4xl leading-[1.2] text-[#241916] md:text-5xl lg:text-5xl tracking-tight"
          >
            Healthy Skin.<br className="hidden sm:inline" />
            <span className="italic text-[#A86249]">Naturally You.</span>
          </motion.h1>

          {/* Supporting paragraph */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mb-10 max-w-sm text-sm leading-relaxed text-[#3A2E2A] md:text-base"
          >
            Thoughtfully crafted skincare with nature's<br className="hidden sm:inline" />
            finest ingredients — for a calmer, clearer,<br className="hidden sm:inline" />
            more radiant you.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
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
          </motion.div>
        </div>



        {/* Bottom Right: Scroll Down */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
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
        </motion.div>

        {/* Right Edge: Vertical Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute right-5 top-1/2 hidden -translate-y-1/2 lg:block lg:right-12"
        >
          <div className="flex items-center gap-6 [writing-mode:vertical-rl] rotate-180">
            <div className="h-16 w-px bg-[#8C7B74]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3A2E2A]">
              SKINCARE COLLECTION
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


