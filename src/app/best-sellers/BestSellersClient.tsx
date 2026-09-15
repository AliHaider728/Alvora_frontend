"use client";

import React from 'react';
import { RitualAnimation } from '../../components/shop/RitualAnimation';

export default function BestSellersClient() {
  return (
    <div className="min-h-screen bg-[#FAF6F2]">
      {/* 3D Hero Section */}
      <section className="relative w-full pt-24 pb-12 min-h-[40vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Bubbles */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
          <style dangerouslySetInnerHTML={{ __html: `
            .hero-bubble {
              position: absolute;
              background-image: url('/images/animation/bubble.png');
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              border-radius: 50%;
              animation: floatUp 20s infinite ease-in;
              bottom: -30%;
              opacity: 0;
              filter: grayscale(1) brightness(1.1);
            }
            @keyframes floatUp {
              0% { transform: translateY(0) scale(0.8); opacity: 0; }
              10% { opacity: 0.4; }
              90% { opacity: 0.2; }
              100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
            }
            .hb1 { left: 10%; width: 140px; height: 140px; animation-duration: 25s; animation-delay: 0s; }
            .hb2 { left: 25%; width: 200px; height: 200px; animation-duration: 22s; animation-delay: 3s; }
            .hb3 { left: 45%; width: 120px; height: 120px; animation-duration: 28s; animation-delay: 1s; }
            .hb4 { left: 65%; width: 180px; height: 180px; animation-duration: 24s; animation-delay: 5s; }
            .hb5 { left: 85%; width: 150px; height: 150px; animation-duration: 26s; animation-delay: 2s; }
            .hb6 { left: 15%; width: 110px; height: 110px; animation-duration: 21s; animation-delay: 7s; }
            .hb7 { left: 55%; width: 220px; height: 220px; animation-duration: 29s; animation-delay: 4s; }
            .hb8 { left: 75%; width: 160px; height: 160px; animation-duration: 23s; animation-delay: 6s; }
          `}} />
          <div className="hero-bubble hb1" />
          <div className="hero-bubble hb2" />
          <div className="hero-bubble hb3" />
          <div className="hero-bubble hb4" />
          <div className="hero-bubble hb5" />
          <div className="hero-bubble hb6" />
          <div className="hero-bubble hb7" />
          <div className="hero-bubble hb8" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-xs md:text-sm tracking-[0.25em] uppercase text-[#C87355] font-bold mb-4 block">
            The Alvora Collection
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[#1A1A1A] font-medium leading-tight mb-6 tracking-wide">
            Best Sellers
          </h1>
          <div className="text-[#1A1A1A]/70 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Discover the science-backed formulations our community loves the most. Experience visible results with our top-rated skincare essentials.
          </div>
        </div>
      </section>

      {/* Product Animation Section */}
      <RitualAnimation />
    </div>
  );
}