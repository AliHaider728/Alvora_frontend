"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };
  
  return (
    <section className="relative py-24 md:py-32 overflow-hidden border-y border-[#1A1A1A]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/images/our-story-lifestyle.jpg')] bg-cover bg-center"
      ></div>
      
      {/* Gradient Overlay for readability (Terracotta fading into the image) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#C87355]/95 via-[#C87355]/80 to-[#C87355]/40 md:to-transparent"></div>

      <div className="alvora-container relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          
          <motion.div 
            className="text-center md:text-left md:max-w-2xl w-full"
            initial={shouldReduceMotion ? false : { opacity: 0, x: -30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl lg:text-5xl text-white mb-6 leading-tight drop-shadow-md">
              Your Best Skin<br/>Is Just One Step Away
            </h2>
            <p className="text-white/90 text-lg mb-10 max-w-lg mx-auto md:mx-0">
              Discover clinically proven skincare that respects your skin barrier and the planet.
            </p>
            
            <div className="flex flex-col xl:flex-row items-center gap-6 xl:gap-8">
              {/* Primary CTA Button */}
              <Link 
                href="/category/all" 
                className="w-full xl:w-auto inline-flex items-center justify-center bg-[#1A1A1A] hover:bg-white text-white hover:text-[#1A1A1A] transition-colors duration-300 px-10 h-14 text-xs font-bold tracking-widest uppercase rounded-full shadow-lg whitespace-nowrap"
              >
                EXPLORE ALVORA
              </Link>
              
              <span className="text-white/60 text-sm hidden xl:block uppercase tracking-widest font-bold">OR</span>

              {/* Newsletter Form */}
              <div className="w-full max-w-md">
                <form onSubmit={handleSubscribe} className="relative w-full flex items-center group">
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your email to join us"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 rounded-full pl-6 pr-32 h-14 focus:outline-none focus:border-white focus:bg-white/20 transition-all text-sm"
                  />
                  <button 
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-white text-[#C87355] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300 px-6 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm"
                  >
                    {subscribed ? "JOINED!" : "JOIN US"}
                  </button>
                </form>
                {subscribed && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} 
                    className="text-white text-sm mt-3 flex items-center justify-center md:justify-start gap-2 font-medium"
                  >
                    <CheckCircle className="w-4 h-4" /> Welcome to the Alvora community!
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div 
            className="hidden md:flex relative w-64 h-64 items-center justify-center text-white"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="absolute right-0 w-32 h-32 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm">
              <svg viewBox="0 0 100 100" className="w-full h-full text-white animate-spin-slow" style={{ animationDuration: '20s' }}>
                <path id="curve-cta" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                <text fontSize="10" letterSpacing="1.5" className="uppercase font-semibold fill-current">
                  <textPath href="#curve-cta" startOffset="0">
                    • CLEAN INGREDIENTS • CONSCIOUS BEAUTY
                  </textPath>
                </text>
              </svg>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
