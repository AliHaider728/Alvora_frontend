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
    <section className="bg-[#FAF6F2] relative w-full overflow-hidden min-h-[100vh] lg:min-h-[800px] flex items-center">
      
      {/* Background Image Layer - absolutely positioned to allow natural overlap */}
      <div className="absolute inset-0 z-0 flex justify-end">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative w-full lg:w-[65%] xl:w-[60%] h-full mt-32 lg:mt-0"
        >
          <Image
            src="/images/hero/alvora-hero.png"
            alt="Alvora skincare products"
            fill
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-contain object-bottom lg:object-center lg:object-right"
            priority
          />
        </motion.div>
      </div>

      <div className="alvora-container relative z-10 w-full h-full flex flex-col justify-center pt-20 pb-10 lg:py-0">

        {/* Left Content */}
        <motion.div
          className="w-full lg:max-w-2xl flex flex-col justify-center"
          variants={contVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h1
            variants={animVariants}
            className="font-display text-6xl md:text-[6rem] lg:text-[7rem] text-[#1A1A1A] font-medium leading-[1.0] tracking-tight mb-6"
          >
            Skincare,<br />Made Simple.
          </motion.h1>

          <motion.p
            variants={animVariants}
            className="text-lg md:text-xl text-[#1A1A1A]/80 leading-relaxed max-w-md mb-10"
          >
            Thoughtful formulas. Clinically tested.<br/>Made for real skin and real life.
          </motion.p>

          <motion.div variants={animVariants} className="flex flex-col sm:flex-row items-center gap-5 mb-16">
            <Link
              href="/category/all?sort=bestseller"
              className="w-full sm:w-auto text-center px-10 py-4 bg-[#A86249] hover:bg-[#8C4A35] text-white text-[11px] font-bold tracking-[0.15em] uppercase transition-colors rounded-full"
            >
              Shop Best Sellers
            </Link>
            <Link
              href="/quiz"
              className="w-full sm:w-auto text-center px-10 py-4 border border-[#A86249] text-[#A86249] hover:bg-[#A86249] hover:text-white text-[11px] font-bold tracking-[0.15em] uppercase transition-colors rounded-full"
            >
              Take The Quiz
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={animVariants} className="flex flex-row justify-between items-start pt-10 max-w-md border-t border-[#1A1A1A]/10">
            {trustItems.map(({ icon: Icon, label }, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-4">
                <Icon className="w-7 h-7 text-[#1A1A1A]" strokeWidth={1} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/80 leading-tight">
                  {label[0]}<br />{label[1]}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};