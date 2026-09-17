"use client";

import React from 'react';
import { useStore } from '../../context/StoreContext';
import { RitualAnimation } from '../../components/shop/RitualAnimation';
import { ScrollRevealText } from '../../components/common/ScrollRevealText';
import { AlvoraProductCard } from '../../components/common/AlvoraProductCard';
import { Bundle, Product } from '../../types';

export default function BestSellersClient() {
  const { bundles } = useStore();
  
  // Filter best seller bundles
  const bestSellerBundles = bundles.filter(b => b.isBestseller && (b.isActive || b.status === 'published'));
  
  // Mapper
  const mapBundleToProduct = (b: Bundle): Product => ({
    id: b.id,
    productType: 'bundle',
    bundleData: b,
    name: b.name,
    slug: b.slug,
    price: b.currentPrice || 0,
    originalPrice: b.originalTotalPrice || 0,
    images: b.customImage ? [b.customImage] : (b.image ? [b.image] : []),
    inStock: true,
    category: 'Bundles',
    categorySlug: 'bundles',
    sku: "BUNDLE-" + b.id,
    rating: 5,
    reviewCount: 0,
    tags: b.customImage ? [`bestseller_image:${b.customImage}`] : [],
    features: [],
    description: b.description || '',
    ageGroups: [],
    brand: 'Alvora'
  });
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
            @keyframes floatDownLeft {
              0% { transform: translateY(0) scale(0.7) translateX(0); opacity: 0; }
              15% { opacity: 0.7; }
              50% { transform: translateY(60vh) scale(1) translateX(-40px); }
              85% { opacity: 0.4; }
              100% { transform: translateY(130vh) scale(1.2) translateX(20px); opacity: 0; }
            }
            @keyframes floatDownRight {
              0% { transform: translateY(0) scale(0.7) translateX(0); opacity: 0; }
              15% { opacity: 0.7; }
              50% { transform: translateY(60vh) scale(1) translateX(40px); }
              85% { opacity: 0.4; }
              100% { transform: translateY(130vh) scale(1.2) translateX(-20px); opacity: 0; }
            }
            .hb1 { bottom: -40%; left: 5%; width: 140px; height: 140px; animation: floatUpLeft 12s infinite ease-in-out 0s; }
            .hb2 { top: -40%; left: 18%; width: 200px; height: 200px; animation: floatDownRight 14s infinite ease-in-out 2s; }
            .hb3 { bottom: -40%; left: 32%; width: 120px; height: 120px; animation: floatUpLeft 10s infinite ease-in-out 1s; }
            .hb4 { top: -40%; left: 45%; width: 180px; height: 180px; animation: floatDownRight 16s infinite ease-in-out 5s; }
            .hb5 { bottom: -40%; left: 58%; width: 150px; height: 150px; animation: floatUpLeft 13s infinite ease-in-out 2s; }
            .hb6 { top: -40%; left: 72%; width: 110px; height: 110px; animation: floatDownLeft 11s infinite ease-in-out 7s; }
            .hb7 { bottom: -40%; left: 85%; width: 220px; height: 220px; animation: floatUpRight 18s infinite ease-in-out 3s; }
            .hb8 { top: -40%; left: 92%; width: 160px; height: 160px; animation: floatDownRight 15s infinite ease-in-out 4s; }
            .hb9 { bottom: -40%; left: 12%; width: 130px; height: 130px; animation: floatUpRight 14s infinite ease-in-out 6s; }
            .hb10 { top: -40%; left: 38%; width: 170px; height: 170px; animation: floatDownLeft 12s infinite ease-in-out 8s; }
            .hb11 { bottom: -40%; left: 52%; width: 90px; height: 90px; animation: floatUpRight 19s infinite ease-in-out 1s; }
            .hb12 { top: -40%; left: 68%; width: 140px; height: 140px; animation: floatDownRight 13s infinite ease-in-out 9s; }
            .hb13 { bottom: -40%; left: 25%; width: 190px; height: 190px; animation: floatUpLeft 16s infinite ease-in-out 10s; }
            .hb14 { top: -40%; left: 78%; width: 150px; height: 150px; animation: floatDownLeft 15s infinite ease-in-out 5s; }
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
      
      {/* Best Sellers Text Section */}
      <section className="bg-[#FAF6F2]">
        <ScrollRevealText 
          title="The Alvora Standard"
          text="Curated by our community, driven by science. Our best sellers are the foundation of healthy, radiant skin. Explore the formulas that deliver visible results time and time again." 
        />
      </section>

    </div>
  );
}