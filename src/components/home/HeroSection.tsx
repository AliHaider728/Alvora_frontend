"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FlaskConical, Leaf, Rabbit, Droplet } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

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

const trustItems = [
  { icon: FlaskConical, label: ['Clinically', 'Tested'] },
  { icon: Leaf, label: ['Clean', 'Ingredients'] },
  { icon: Rabbit, label: ['Cruelty', 'Free'] },
  { icon: Droplet, label: ['Sensitive', 'Skin'] },
];

export const HeroSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const animVariants = shouldReduceMotion ? {} : itemVariants;
  const contVariants = shouldReduceMotion ? {} : containerVariants;

  return (
    <section className="bg-[#FAF6F2] relative w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row items-stretch min-h-[650px] lg:min-h-[720px] max-w-[1600px] mx-auto">

        {/* Left Content */}
        <motion.div
          className="w-full lg:w-[45%] flex flex-col justify-center py-16 lg:py-0 px-6 lg:pl-16 xl:pl-24 z-10"
          variants={contVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h1
            variants={animVariants}
            className="font-display text-5xl md:text-[5.5rem] lg:text-[6rem] text-[#1A1A1A] font-medium leading-[1.05] tracking-tight mb-4"
          >
            Skincare,<br />Made Simple.
          </motion.h1>

          <motion.p
            variants={animVariants}
            className="text-lg md:text-xl text-[#1A1A1A]/80 leading-relaxed max-w-sm mb-10"
          >
            Thoughtful formulas. Clinically tested.<br/>Made for real skin and real life.
          </motion.p>

          <motion.div variants={animVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-14">
            <Link
              href="/category/all?sort=bestseller"
              className="w-full sm:w-auto text-center px-8 py-3.5 bg-[#B8664C] hover:bg-[#8C4A35] text-white text-[11px] font-bold tracking-widest uppercase transition-colors rounded-full"
            >
              Shop Best Sellers
            </Link>
            <Link
              href="/quiz"
              className="w-full sm:w-auto text-center px-8 py-3.5 border border-[#B8664C] text-[#B8664C] hover:bg-[#B8664C] hover:text-white text-[11px] font-bold tracking-widest uppercase transition-colors rounded-full"
            >
              Take The Quiz
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={animVariants} className="flex flex-row justify-between items-start pt-8 max-w-md border-t border-[#1A1A1A]/10">
            {trustItems.map(({ icon: Icon, label }, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-3">
                <Icon className="w-6 h-6 text-[#1A1A1A]" strokeWidth={1.2} />
                <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-[#1A1A1A]/80">
                  {label[0]}<br />{label[1]}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Image Container - keeping the entire product scene visible naturally */}
        <div className="w-full lg:w-[55%] relative min-h-[400px] lg:min-h-full flex items-center justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative w-full h-full min-h-[400px] lg:min-h-full"
          >
            <Image
              src="/images/hero/alvora-hero.png"
              alt="Alvora skincare products"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-contain object-center lg:object-right"
              priority
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
};