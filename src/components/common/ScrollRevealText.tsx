"use client";
import React, { useRef, useState, useEffect } from 'react';
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

const DesktopHighlight = ({ text, words, title }: { text: string; words: string[], title: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 40%"] 
  });

  return (
    <div ref={containerRef} className="hidden md:block relative w-full py-32 px-12 lg:px-24">
      <div className="flex flex-col items-center justify-center max-w-[1000px] mx-auto">
        <span className="text-xs tracking-[0.3em] uppercase text-[#C87355] font-bold mb-8 block text-center">
          {title}
        </span>
        <p className="text-center font-display text-3xl md:text-4xl lg:text-[42px] xl:text-[48px] leading-[1.5] font-medium whitespace-pre-wrap">
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
  );
};

export const ScrollRevealText: React.FC<Props> = ({ text, title = "Our Philosophy", className = "" }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only mount the heavy Desktop scrolling observer on medium+ screens
    const mql = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const words = text.split(" ").map((w, i, arr) => w + (i === arr.length - 1 ? "" : " "));

  return (
    <div className={className}>
      {/* MOBILE VIEW (Always rendered for SSR safety, but visually simple) */}
      <div className="md:hidden py-16 px-6 flex flex-col items-center justify-center">
        <span className="text-xs tracking-[0.3em] uppercase text-[#C87355] font-bold mb-6 block text-center">
          {title}
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

      {/* DESKTOP VIEW (Only mounted on client if desktop, avoiding heavy mobile observers) */}
      {isDesktop && <DesktopHighlight text={text} words={words} title={title} />}
    </div>
  );
};
