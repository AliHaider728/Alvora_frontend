"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FlaskConical, Leaf, Heart, Droplet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
  }
};

export const HeroSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const animVariants = shouldReduceMotion ? {} : itemVariants;
  const contVariants = shouldReduceMotion ? {} : containerVariants;

  return (
    <section className="bg-[#FAF6F2] relative w-full overflow-hidden">
      <div className="alvora-container">
        <div className="flex flex-col lg:flex-row min-h-[70vh] lg:min-h-[85vh]">
          
          {/* Left Content */}
          <motion.div 
            className="w-full lg:w-1/2 flex flex-col justify-center py-12 lg:py-20 lg:pr-12 z-10"
            variants={contVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h1 
              variants={animVariants}
              className="font-display text-5xl md:text-[5.5rem] text-[#1A1A1A] font-medium leading-[1.05] tracking-tight mb-6"
            >
              Skincare,<br />Made Simple.
            </motion.h1>
            
            <motion.p 
              variants={animVariants}
              className="text-base md:text-lg text-[#1A1A1A]/80 leading-relaxed max-w-sm mb-10"
            >
              Thoughtful formulas. Clinically tested. Made for real skin and real life.
            </motion.p>
            
            <motion.div variants={animVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-16">
              <Link 
                href="/category/all?sort=bestseller" 
                className="w-full sm:w-auto text-center px-8 py-3.5 bg-[#C48B80] hover:bg-[#a8746a] text-white text-xs font-semibold tracking-widest uppercase transition-colors rounded-full"
              >
                SHOP BEST SELLERS
              </Link>
              <Link 
                href="/category/all" 
                className="w-full sm:w-auto text-center px-8 py-3.5 border border-[#C48B80] text-[#C48B80] hover:bg-[#C48B80] hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors rounded-full"
              >
                TAKE THE QUIZ
              </Link>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div variants={animVariants} className="grid grid-cols-4 gap-2 md:gap-6 pt-4 border-t border-[#EDE5DC]/60">
              <div className="flex flex-col items-center text-center gap-3">
                <FlaskConical className="w-6 h-6 text-[#1A1A1A]" strokeWidth={1.5} />
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#1A1A1A]/70">Clinically<br/>Tested</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Leaf className="w-6 h-6 text-[#1A1A1A]" strokeWidth={1.5} />
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#1A1A1A]/70">Clean<br/>Ingredients</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Heart className="w-6 h-6 text-[#1A1A1A]" strokeWidth={1.5} />
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#1A1A1A]/70">Cruelty<br/>Free</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Droplet className="w-6 h-6 text-[#1A1A1A]" strokeWidth={1.5} />
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#1A1A1A]/70">Sensitive<br/>Skin</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image Container */}
          <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-full flex items-end justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="w-full h-full max-h-[85%] lg:max-h-full bg-[#EADED2] rounded-t-full lg:rounded-tl-full lg:rounded-tr-none lg:rounded-bl-[100px] relative overflow-hidden flex items-end justify-center"
            >
              <Image 
                src="/images/hero/alvora-hero.png" 
                alt="Alvora Skincare Routine" 
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                priority
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
