"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

export const FinalCTA: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      <Image 
        src="/images/cta-bg.png" 
        alt="Alvora Skincare Collection"
        fill
        className="object-cover object-center md:object-right"
        quality={90}
      />
      
      {/* Soft overlay gradient to ensure text readability on the left */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>

      <div className="alvora-container relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-xl px-4 md:px-8">
          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/90 font-bold mb-4 block drop-shadow-sm">
              Experience the Glow
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight drop-shadow-md">
              Your Best Skin<br/>Is Just One Step Away
            </h2>
            
            <Link 
              href="/category/all" 
              className="inline-flex items-center justify-center bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300 px-10 py-4 text-xs font-bold tracking-widest uppercase rounded-sm shadow-lg group"
            >
              EXPLORE ALVORA
              <svg className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
