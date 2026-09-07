"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface Props {
  text: string;
  className?: string;
}

const Word = ({ children, progress, range }: { children: string, progress: MotionValue<number>, range: [number, number] }) => {
  // Interpolate from light grey to dark brand color
  const color = useTransform(progress, range, ["#A1A7AA", "#1A1A1A"]);
  
  return (
    <motion.span 
      style={{ color }} 
      className="inline"
    >
      {children}
    </motion.span>
  );
};

export const ScrollRevealText: React.FC<Props> = ({ text, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"] 
  });

  // Preserve spaces so the background highlight is continuous
  const words = text.split(" ").map((w, i, arr) => w + (i === arr.length - 1 ? "" : " "));

  return (
    <div className={className}>
      {/* ─── MOBILE VIEW (Simple Fade-in) ─── */}
      <div className="md:hidden py-24 px-6 flex flex-col items-center justify-center">
        <span className="text-xs tracking-[0.3em] uppercase text-[#C87355] font-bold mb-6 block text-center">
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

      {/* ─── DESKTOP VIEW (Pinned Scroll Highlight) ─── */}
      <div ref={containerRef} className="hidden md:block relative w-full h-[250vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-12 lg:px-24 overflow-hidden">
          
          <span className="text-xs tracking-[0.3em] uppercase text-[#C87355] font-bold mb-8 block">
            Our Philosophy
          </span>

          <p className="text-center font-display text-3xl md:text-4xl lg:text-[42px] xl:text-[48px] leading-[1.5] font-medium max-w-[1000px] mx-auto whitespace-pre-wrap">
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
