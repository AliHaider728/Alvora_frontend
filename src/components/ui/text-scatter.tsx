"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TextScatterProps {
  text: string;
  className?: string;
  scatterMultiplier?: number;
}

export function TextScatter({ text, className = "", scatterMultiplier = 1 }: TextScatterProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const letters = text.split('');

  // Fixed pseudo-random values so they don't jitter on re-renders
  // but remain consistent between client and server (after mount)
  const getRandom = (index: number, seed: number) => {
    return Math.sin(index * seed) * 30 * scatterMultiplier;
  };

  return (
    <div 
      className={inline-block cursor-default select-none }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {letters.map((char, i) => {
        if (char === ' ') return <span key={i}>&nbsp;</span>;
        
        const x = getRandom(i + 1, 12.5);
        const y = getRandom(i + 1, 25.3);
        const rotate = getRandom(i + 1, 4.2) * 1.5;

        return (
          <motion.span
            key={i}
            className="inline-block transition-colors"
            initial={{ x: 0, y: 0, rotate: 0 }}
            animate={{
              x: isHovered && mounted ? x : 0,
              y: isHovered && mounted ? y : 0,
              rotate: isHovered && mounted ? rotate : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 15,
              mass: 0.5,
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </div>
  );
}
