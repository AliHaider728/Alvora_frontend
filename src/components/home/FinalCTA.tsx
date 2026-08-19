"use client";
import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export const FinalCTA: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <section className="bg-[#C48B80] py-20 overflow-hidden relative border-y border-[#1A1A1A]">
      <div className="alvora-container relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          
          <motion.div 
            className="text-center md:text-left md:max-w-xl"
            initial={shouldReduceMotion ? false : { opacity: 0, x: -30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl lg:text-5xl text-white mb-8 leading-tight">
              Your Best Skin<br/>Is Just One Step Away
            </h2>
            <Link 
              href="/category/all" 
              className="inline-flex items-center justify-center bg-[#1A1A1A] hover:bg-white text-white hover:text-[#1A1A1A] transition-colors duration-300 px-10 py-4 text-xs font-bold tracking-widest uppercase rounded-full shadow-lg"
            >
              EXPLORE ALVORA
            </Link>
          </motion.div>

          <motion.div 
            className="hidden md:flex relative w-64 h-64 items-center justify-center text-white"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Stamp Element */}
            <div className="absolute right-0 w-32 h-32 rounded-full border border-white flex items-center justify-center spin-slow">
              <svg viewBox="0 0 100 100" className="w-full h-full text-white animate-spin-slow" style={{ animationDuration: '20s' }}>
                <path id="curve-cta" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                <text fontSize="10" letterSpacing="1.5" className="uppercase font-semibold fill-current">
                  <textPath href="#curve-cta" startOffset="0">
                    ✦ CLEAN INGREDIENTS ✦ CONSCIOUS BEAUTY
                  </textPath>
                </text>
              </svg>
            </div>
            
            {/* Decorative floral placeholder */}
            <div className="absolute -right-20 top-0 text-white/20">
               <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor">
                 <path d="M50 0 C60 40, 90 50, 100 50 C90 60, 60 90, 50 100 C40 90, 10 60, 0 50 C10 40, 40 10, 50 0" />
               </svg>
            </div>
          </motion.div>
          
        </div>
      </div>
      
      {/* Background soft pattern */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-black/10 to-transparent mix-blend-overlay"></div>
    </section>
  );
};
