"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface Props {
  text: string;
  className?: string;
}

const Word = ({ children, progress, range }: { children: string, progress: MotionValue<number>, range: [number, number] }) => {
  // Interpolate from muted grey to white text
  const color = useTransform(progress, range, ["rgba(26, 26, 26, 0.25)", "rgba(255, 255, 255, 1)"]);
  // Interpolate from transparent to solid Terracotta highlight
  const backgroundColor = useTransform(progress, range, ["rgba(200, 115, 85, 0)", "rgba(200, 115, 85, 1)"]);
  
  return (
    <motion.span 
      style={{ color, backgroundColor }} 
      className="inline transition-colors duration-75"
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

      {/* ─── DESKTOP VIEW (Pinned Scroll Highlight) ─── */}
      <div ref={containerRef} className="hidden md:block relative w-full h-[250vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-16 lg:px-24 overflow-hidden">
          
          <span className="text-xs tracking-[0.3em] uppercase text-[#C87355] font-bold mb-12 block">
            Our Philosophy
          </span>

          <p className="text-center font-display text-4xl lg:text-5xl xl:text-6xl leading-[1.6] font-medium max-w-6xl mx-auto whitespace-pre-wrap">
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
