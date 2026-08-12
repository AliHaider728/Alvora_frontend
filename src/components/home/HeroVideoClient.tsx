"use client";
import React, { useState, useEffect } from 'react';

export const HeroVideoClient: React.FC = () => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#E2F1F8]">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/herowebp-mobile.webp"
        className="w-full h-full object-cover object-[42%_center]"
      >
        {!isMobile && <source src="https://res.cloudinary.com/dn2bcvcvg/video/upload/v1786438386/newplaybimboo_xfnt47.mp4" type="video/mp4" />}
      </video>
    </div>
  );
};
