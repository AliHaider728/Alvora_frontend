"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
export const BrandIntro: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } }
  };

  return (
    <section className="bg-white overflow-hidden">
      
      {/* Block 1: Skincare rooted in balance */}
      <div className="flex flex-col md:flex-row w-full min-h-[500px]">
        <div className="w-full md:w-1/2 bg-[#F1C9BD] relative aspect-square md:aspect-auto overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=800&auto=format&fit=crop" 
            alt="Cream texture" 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        
        <div className="w-full md:w-1/2 flex items-center justify-center p-12 lg:p-24 bg-white">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={variants}
            className="max-w-md w-full"
          >
            <h2 className="font-display text-4xl md:text-5xl text-[#1A1A1A] mb-6 leading-[1.1]">
              Skincare rooted<br/>in balance
            </h2>
            <p className="text-[#1A1A1A]/80 leading-relaxed text-base mb-8">
              At ALVORA, we blend clinically proven ingredients with the best of nature to support your skin's health today and tomorrow.
            </p>
            <Link 
              href="/about" 
              className="group inline-flex items-center text-[10px] font-bold tracking-widest text-[#1A1A1A] uppercase relative"
            >
              <span>OUR SCIENCE</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#1A1A1A] scale-x-100 group-hover:scale-x-0 origin-left transition-transform duration-300"></span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Block 2: Better for your skin. Better for the planet. */}
      <div className="flex flex-col md:flex-row-reverse w-full min-h-[500px]">
        <div className="w-full md:w-1/2 bg-[#1A1A1A] relative aspect-square md:aspect-auto overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1629198728644-486161a0fb87?q=80&w=800&auto=format&fit=crop" 
            alt="Product in water" 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        
        <div className="w-full md:w-1/2 flex items-center justify-center p-12 lg:p-24 bg-[#FAF6F2]">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={variants}
            className="max-w-md w-full relative"
          >
            <h2 className="font-display text-4xl md:text-5xl text-[#1A1A1A] mb-6 leading-[1.1]">
              Better for your skin.<br/>Better for the planet.
            </h2>
            <p className="text-[#1A1A1A]/80 leading-relaxed text-base mb-8 max-w-sm">
              Sustainable choices. Responsible formulas. Beautiful results for you and the world we all share.
            </p>
            <Link 
              href="/about" 
              className="group inline-flex items-center text-[10px] font-bold tracking-widest text-[#1A1A1A] uppercase relative"
            >
              <span>OUR PROMISE</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#1A1A1A] scale-x-100 group-hover:scale-x-0 origin-left transition-transform duration-300"></span>
            </Link>

            {/* Clean Ingredients Stamp */}
            <div className="absolute -bottom-4 -right-4 md:-right-12 w-24 h-24 rounded-full border border-[#1A1A1A] flex items-center justify-center spin-slow hidden sm:flex">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#1A1A1A] animate-spin-slow" style={{ animationDuration: '15s' }}>
                <path id="curve-brand" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                <text fontSize="11" letterSpacing="1.5" className="uppercase font-semibold fill-current">
                  <textPath href="#curve-brand" startOffset="0">
                    ✦ CLEAN INGREDIENTS ✦
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
