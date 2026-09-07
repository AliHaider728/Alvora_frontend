"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface Props {
  text: string;
  className?: string;
}

const Word = ({ children, progress, range }: { children: string, progress: MotionValue<number>, range: [number, number] }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative inline-block mr-[0.25em] mt-[0.1em]">
      {/* Background (muted) word */}
      <span className="text-[#1A1A1A] opacity-20">{children}</span>
      {/* Foreground (brand color) word revealed on scroll */}
      <motion.span 
        style={{ opacity }} 
        className="absolute left-0 top-0 text-[#1A1A1A]"
      >
        {children}
      </motion.span>
    </span>
  );
};

export const ScrollRevealText: React.FC<Props> = ({ text, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"] 
  });

  const words = text.split(" ");

  return (
    <div className={className}>
      {/* ─── MOBILE VIEW (Simple Fade-in) ─── */}
      <div className="md:hidden py-24 px-6 flex flex-col items-center justify-center">
        <span className="text-xs tracking-[0.3em] uppercase text-[#C87355] font-bold mb-8 block text-center">
          Our Philosophy
        </span>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[#1A1A1A] leading-relaxed text-2xl font-display text-center"
        >
          {text}
        </motion.p>
      </div>

      {/* ─── DESKTOP VIEW (Pinned Scroll Reveal) ─── */}
      <div ref={containerRef} className="hidden md:block relative w-full h-[250vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-16 lg:px-24 overflow-hidden">
          
          <span className="text-xs tracking-[0.3em] uppercase text-[#C87355] font-bold mb-12 block">
            Our Philosophy
          </span>

          <p className="flex flex-wrap justify-center text-center font-display text-4xl lg:text-5xl xl:text-6xl leading-[1.3] font-medium max-w-6xl mx-auto">
            {words.map((word, i) => {
              const start = 0.1 + (i / words.length) * 0.8;
              const end = start + (1 / words.length) * 0.8;
              
              return (
                <Word key={i} progress={scrollYProgress} range={[start, end]}>
                  {word}
                </Word>
              );
            })}
          </p>

        </div>
      </div>
    </div>
  );
};
