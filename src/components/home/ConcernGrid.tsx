"use client";
import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
  }
};

export const ConcernGrid: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const animVariants = shouldReduceMotion ? {} : itemVariants;
  const contVariants = shouldReduceMotion ? {} : containerVariants;

  const concerns = [
    {
      id: 'hydration',
      name: 'Hydration',
      link: '/category/all?tags=hydrating',
      bgClass: 'bg-[#C48B80]' // Terracotta
    },
    {
      id: 'brightening',
      name: 'Brightening',
      link: '/category/all?tags=brightening',
      bgClass: 'bg-[#B8664C]' // Deeper Terracotta
    },
    {
      id: 'acne',
      name: 'Acne & Blemishes',
      link: '/category/all?tags=acne',
      bgClass: 'bg-[#8C6B61]' // Muted Warm Brown
    },
    {
      id: 'barrier',
      name: 'Skin Barrier',
      link: '/category/all?tags=barrier',
      bgClass: 'bg-[#EADED2]' // Warm beige
    }
  ];

  return (
    <section className="bg-white py-10 md:py-20">
      <div className="alvora-container">
        
        <div className="mb-12 flex flex-col items-center justify-center">
          <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A] font-medium tracking-[0.1em] uppercase text-center">
            SHOP BY CONCERN
          </h2>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          variants={contVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {concerns.map((concern) => (
            <motion.div key={concern.id} variants={animVariants} className="h-full">
              <Link 
                href={concern.link}
                className={`group relative overflow-hidden aspect-[4/3] flex flex-col justify-end p-8 ${concern.bgClass} transition-all duration-500 rounded-sm hover:shadow-xl`}
              >
                {/* Texture overlay (mocking actual image) */}
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay opacity-50 group-hover:scale-105 transition-transform duration-700"></div>
                
                {/* Solid charcoal overlay for consistent text contrast */}
                <div className="absolute inset-0 bg-[#1A1A1A]/40 group-hover:bg-[#1A1A1A]/50 transition-colors duration-500"></div>
                {/* Gradient for extra pop at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-[#1A1A1A]/20 to-transparent"></div>

                <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="font-display text-3xl mb-2 text-white text-shadow-sm">
                    {concern.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/90">
                    <span>SHOP NOW</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
