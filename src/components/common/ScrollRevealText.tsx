"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface Props {
  text: string;
  title?: string;
  className?: string;
}

const Word = ({ children, progress, range }: { children: string, progress: MotionValue<number>, range: [number, number] }) => {
  const color = useTransform(progress, range, ["#A1A7AA", "#1A1A1A"]);
  return (
    <motion.span style={{ color }} className="inline">
      {children}
    </motion.span>
  );
};

export const ScrollRevealText: React.FC<Props> = ({ text, title = "Our Philosophy", className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "end 45%"] // Starts highlighting when 90% down the screen, finishes highlighting by the time it reaches 45% down
  });

  const words = text.split(" ").map((w, i, arr) => w + (i === arr.length - 1 ? "" : " "));

  return (
    <div className={className}>
      <div ref={containerRef} className="relative w-full py-20 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="flex flex-col items-center justify-center max-w-[1000px] mx-auto">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#C87355] font-bold mb-6 md:mb-8 block text-center">
            {title}
          </span>
          <p className="text-center font-display text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[48px] leading-[1.6] md:leading-[1.5] font-medium whitespace-pre-wrap">
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
