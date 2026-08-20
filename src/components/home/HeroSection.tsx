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
    // Full-bleed section — NO max-width container wrapping the whole row.
    <section className="bg-[#FAF6F2] relative w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row items-stretch min-h-[70vh] lg:min-h-[80vh]">

        {/* Left Content — this is the ONLY part that respects the site's text container/padding */}
        <motion.div
          className="w-full lg:w-[42%] flex flex-col justify-center py-14 lg:py-0 pl-6 lg:pl-16 xl:pl-24 pr-6 lg:pr-10 z-10"
          variants={contVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h1
            variants={animVariants}
            className="font-display text-5xl md:text-[4.5rem] text-[#1A1A1A] font-medium leading-[1.05] tracking-tight mb-6"
          >
            Skincare,<br />Made Simple.
          </motion.h1>

          <motion.p
            variants={animVariants}
            className="text-base md:text-lg text-[#1A1A1A]/70 leading-relaxed max-w-sm mb-10"
          >
            Thoughtful formulas. Clinically tested. Made for real skin and real life.
          </motion.p>

          <motion.div variants={animVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Link
              href="/category/all?sort=bestseller"
              className="w-full sm:w-auto text-center px-8 py-3.5 bg-[#C48B80] hover:bg-[#a8746a] text-white text-xs font-semibold tracking-widest uppercase transition-colors rounded-md"
            >
              Shop Best Sellers
            </Link>
            <Link
              href="/quiz"
              className="w-full sm:w-auto text-center px-8 py-3.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors rounded-md"
            >
              Take The Quiz
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={animVariants} className="grid grid-cols-4 gap-2 md:gap-6 pt-6 border-t border-[#1A1A1A]/10">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label.join('-')} className="flex flex-col items-center text-center gap-3">
                <Icon className="w-6 h-6 text-[#1A1A1A]" strokeWidth={1.5} />
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#1A1A1A]/70">
                  {label[0]}<br />{label[1]}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Image Container — full bleed, touches viewport's right edge */}
        <div className="w-full lg:w-[58%] relative min-h-[420px] lg:min-h-full flex items-end justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-full h-[85%] lg:h-[90%] lg:w-full bg-[#EADED2] relative overflow-hidden flex items-end justify-center"
            style={{
              borderRadius: "45% 0% 0% 55% / 60% 0% 0% 40%",
            }}
          >
            <Image
              src="/images/hero/alvora-hero.png"
              alt="Alvora skincare bottles arranged on a stone pedestal"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-bottom"
              priority
            />
          </motion.div>

          {/* Decorative dried branch accent */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
            className="hidden lg:block absolute top-4 right-6 w-32 h-40 pointer-events-none z-20"
          >
            <Image
              src="/images/hero/dried-branch.png"
              alt=""
              fill
              className="object-contain object-top-right opacity-90"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
};