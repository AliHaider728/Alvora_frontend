"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function ScrollStack({ children }: { children: React.ReactNode[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "calc(" + (children.length * 100) + "vh + 100vh)" }}>
      {React.Children.map(children, (child, index) => {
        const targetScale = 1 - ((children.length - index) * 0.05);
        return (
          <ScrollCard 
            key={index}
            i={index}
            progress={scrollYProgress}
            range={[index * (1 / children.length), 1]}
            targetScale={targetScale}
          >
            {child}
          </ScrollCard>
        );
      })}
    </div>
  );
}

function ScrollCard({ i, progress, range, targetScale, children }: any) {
  const containerRef = useRef(null);
  
  const scale = useTransform(progress, range, [1, targetScale]);
  // Odd cards turn left, even cards turn right
  const rotationOffset = i % 2 === 0 ? -2 : 2;
  const rotate = useTransform(progress, range, [0, rotationOffset]);
  const opacity = useTransform(progress, range, [1, 0.3]);

  return (
    <div 
      className="sticky top-0 h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{ zIndex: i + 1 }}
    >
      <motion.div 
        ref={containerRef}
        style={{ scale, rotate, opacity }}
        className="w-full max-w-[1200px] h-[85vh] sm:h-[80vh] md:h-[70vh] rounded-3xl shadow-2xl overflow-hidden bg-white relative origin-top"
      >
        {children}
      </motion.div>
    </div>
  );
}
