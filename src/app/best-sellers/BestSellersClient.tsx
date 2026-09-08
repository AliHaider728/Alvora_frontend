"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AlvoraProductCard } from '../../components/common/AlvoraProductCard';
import { useStore } from '../../context/StoreContext';
import { TextScatter } from '../../components/ui/text-scatter';



export default function BestSellersClient() {
  const { products } = useStore();

  const bestSellers = useMemo(() => {
    return products.filter(p => p.isVisible);
  }, [products]);

  return (
    <div className="min-h-screen bg-[#FAF6F2]">
      {/* 3D Hero Section */}
      <section className="relative w-full pt-24 pb-12 min-h-[250px] flex items-center justify-center overflow-hidden">
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-xs md:text-sm tracking-[0.25em] uppercase text-[#C87355] font-bold mb-4 block">
            <TextScatter text="The Alvora Collection" />
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-[#1A1A1A] font-medium leading-tight mb-6 tracking-wide">
            <TextScatter text="Best Sellers" scatterMultiplier={1.5} />
          </h1>
          <div className="text-[#1A1A1A]/70 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            <TextScatter text="Discover the science-backed formulations our community loves the most. Experience visible results with our top-rated skincare essentials." scatterMultiplier={0.6} />
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="pb-16 pt-4 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-3xl text-[#1A1A1A] font-medium">Cult Favorites</h2>
          <span className="text-sm font-medium text-gray-500">{bestSellers.length} Products</span>
        </div>

        {bestSellers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {bestSellers.map(product => (
              <AlvoraProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No best sellers found at the moment.
          </div>
        )}
      </section>
    </div>
  );
}





