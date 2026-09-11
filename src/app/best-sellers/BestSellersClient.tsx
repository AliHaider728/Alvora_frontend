"use client";

import React from 'react';
import { RitualAnimation } from '../../components/shop/RitualAnimation';

export default function BestSellersClient() {
  return (
    <div className="min-h-screen bg-[#FAF6F2]">
      {/* 3D Hero Section */}
      <section className="relative w-full pt-24 pb-12 min-h-[250px] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-xs md:text-sm tracking-[0.25em] uppercase text-[#C87355] font-bold mb-4 block">
            The Alvora Collection
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-[#1A1A1A] font-medium leading-tight mb-6 tracking-wide">
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