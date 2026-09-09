"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full bg-[url('/images/hero/hero-bg.png')] bg-cover bg-center bg-fixed bg-no-repeat overflow-hidden">
      {/* 
        The Header is fixed and overlays this section. 
        We add padding-top to ensure the content starts safely below the header,
        but the background itself starts from the very top of the page.
      */}
      <div className="mx-auto flex min-h-screen max-w-375 flex-col justify-center px-5 pt-24 sm:px-8 lg:px-12">
        <div className="max-w-xl pb-16">
          {/* Eyebrow */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-[#8C7B74]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C7B74]">
              PURE � NATURAL � EFFECTIVE
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="mb-8 font-display text-5xl leading-[1.1] text-[#241916] md:text-6xl lg:text-[5.5rem]"
          >
            Healthy Skin.<br />
            <span className="italic text-[#A86249]">Naturally You.</span>
          </motion.h1>

          {/* Supporting paragraph */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mb-10 max-w-sm text-sm leading-relaxed text-[#5C4F4A] md:text-base"
          >
            Thoughtfully crafted skincare with nature's<br />
            finest ingredients � for a calmer, clearer,<br />
            more radiant you.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center sm:gap-10"
          >
            <Link 
              href="/best-sellers"
              className="group flex items-center justify-center gap-3 bg-[#A86249] px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#8E4D39]"
            >
              SHOP BEST SELLERS
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link 
              href="/category/all"
              className="relative text-xs font-bold uppercase tracking-[0.15em] text-[#5C4F4A] transition-colors hover:text-[#A86249] after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-[#241916] after:transition-colors hover:after:bg-[#A86249]"
            >
              DISCOVER THE COLLECTION
            </Link>
          </motion.div>
        </div>



        {/* Bottom Right: Scroll Down */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-8 right-5 flex flex-col items-center gap-4 sm:right-8 lg:right-12"
        >
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#8C7B74] text-[#241916] transition-colors hover:bg-[#241916] hover:text-[#FAF6F2]"
            aria-label="Scroll down"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <span className="text-center text-[8px] font-bold uppercase tracking-[0.2em] text-[#8C7B74] [writing-mode:vertical-lr] rotate-180 sm:[writing-mode:horizontal-tb] sm:rotate-0">
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
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C7B74]">
              SKINCARE COLLECTION
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

