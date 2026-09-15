"use client";

import React from 'react';
import { RitualAnimation } from '../../components/shop/RitualAnimation';

export default function BestSellersClient() {
  return (
    <div className="min-h-screen bg-[#FAF6F2]">
      {/* 3D Hero Section */}
      <section className="relative w-full pt-24 pb-12 min-h-[40vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Bubbles */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-90">
          <style dangerouslySetInnerHTML={{ __html: `
            .hero-bubble {
              position: absolute;
              background-image: url('/images/animation/bubble.png');
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              border-radius: 50%;
              bottom: -40%;
              opacity: 0;
              filter: grayscale(1) brightness(1.2);
            }
            @keyframes floatUpLeft {
              0% { transform: translateY(0) scale(0.7) translateX(0); opacity: 0; }
              15% { opacity: 0.7; }
              50% { transform: translateY(-60vh) scale(1) translateX(-40px); }
              85% { opacity: 0.4; }
              100% { transform: translateY(-130vh) scale(1.2) translateX(20px); opacity: 0; }
            }
            @keyframes floatUpRight {
              0% { transform: translateY(0) scale(0.7) translateX(0); opacity: 0; }
              15% { opacity: 0.7; }
              50% { transform: translateY(-60vh) scale(1) translateX(40px); }
              85% { opacity: 0.4; }
              100% { transform: translateY(-130vh) scale(1.2) translateX(-20px); opacity: 0; }
            }
            .hb1 { left: 5%; width: 140px; height: 140px; animation: floatUpLeft 25s infinite ease-in-out 0s; }
            .hb2 { left: 18%; width: 200px; height: 200px; animation: floatUpRight 22s infinite ease-in-out 3s; }
            .hb3 { left: 32%; width: 120px; height: 120px; animation: floatUpLeft 28s infinite ease-in-out 1s; }
            .hb4 { left: 45%; width: 180px; height: 180px; animation: floatUpRight 24s infinite ease-in-out 7s; }
            .hb5 { left: 58%; width: 150px; height: 150px; animation: floatUpLeft 26s infinite ease-in-out 2s; }
            .hb6 { left: 72%; width: 110px; height: 110px; animation: floatUpRight 21s infinite ease-in-out 8s; }
            .hb7 { left: 85%; width: 220px; height: 220px; animation: floatUpLeft 29s infinite ease-in-out 4s; }
            .hb8 { left: 92%; width: 160px; height: 160px; animation: floatUpRight 23s infinite ease-in-out 6s; }
            .hb9 { left: 12%; width: 130px; height: 130px; animation: floatUpRight 27s infinite ease-in-out 5s; }
            .hb10 { left: 38%; width: 170px; height: 170px; animation: floatUpLeft 20s infinite ease-in-out 9s; }
            .hb11 { left: 52%; width: 90px; height: 90px; animation: floatUpRight 30s infinite ease-in-out 2s; }
            .hb12 { left: 68%; width: 140px; height: 140px; animation: floatUpLeft 24s infinite ease-in-out 10s; }
            .hb13 { left: 25%; width: 190px; height: 190px; animation: floatUpRight 26s infinite ease-in-out 12s; }
            .hb14 { left: 78%; width: 150px; height: 150px; animation: floatUpLeft 22s infinite ease-in-out 11s; }
          `}} />
          <div className="hero-bubble hb1" />
          <div className="hero-bubble hb2" />
          <div className="hero-bubble hb3" />
          <div className="hero-bubble hb4" />
          <div className="hero-bubble hb5" />
          <div className="hero-bubble hb6" />
          <div className="hero-bubble hb7" />
          <div className="hero-bubble hb8" />
          <div className="hero-bubble hb9" />
          <div className="hero-bubble hb10" />
          <div className="hero-bubble hb11" />
          <div className="hero-bubble hb12" />
          <div className="hero-bubble hb13" />
          <div className="hero-bubble hb14" />
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