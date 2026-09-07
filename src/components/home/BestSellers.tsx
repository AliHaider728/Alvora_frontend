"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Product, HomepageSectionSetting } from '../../types';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { getSafeImageSrc } from '../../utils/images';
import { formatPrice } from '../../utils/formatters';

const OrganicSphere = dynamic(
  () => import('../common/OrganicSphere').then(mod => ({ default: mod.OrganicSphere })),
  { ssr: false }
);

interface Props {
  products: Product[];
  sectionSettings?: HomepageSectionSetting;
}

export const BestSellers: React.FC<Props> = ({ products, sectionSettings }) => {
  const heading = sectionSettings?.heading || 'BEST SELLERS';
  const displayProducts = products.filter(p => p.isBestseller || p.isFeatured).slice(0, 4);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollProgress = -rect.top;
      
      if (scrollProgress < windowHeight * 0.3) {
        setActiveIndex(-1); // Intro screen
      } else {
        const index = Math.floor((scrollProgress - windowHeight * 0.3) / windowHeight);
        setActiveIndex(Math.min(Math.max(index, 0), displayProducts.length - 1));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayProducts.length]);

  if (displayProducts.length === 0) return null;

  return (
    <section ref={containerRef} className="relative bg-[#FAF6F2]" style={{ height: `${(displayProducts.length + 1) * 100}vh` }}>
      
      {/* ─── Sticky Background (3D Sphere + Product Images) ─── */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* 3D Glass Bubble */}
        <div className="absolute inset-0 scale-[0.8] md:scale-100 transition-transform duration-1000">
          <OrganicSphere />
        </div>
        
        {/* Floating Product Images Overlaid on Bubble */}
        {displayProducts.map((product, idx) => {
          const isActive = activeIndex === idx;
          return (
            <div 
              key={`img-${product.id}`}
              className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-1000 ease-out
                ${isActive ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10'}`}
            >
              <div className="relative w-56 h-56 md:w-[400px] md:h-[400px] mix-blend-multiply drop-shadow-2xl">
                <Image 
                  src={getSafeImageSrc(product.images[0])} 
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 224px, 400px"
                  priority={idx === 0}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Scrolling Content Layers ─── */}
      <div className="absolute top-0 w-full z-10 pointer-events-none">
        
        {/* Intro Screen */}
        <div className="h-screen flex flex-col items-center justify-center text-center px-4">
          <span className="text-sm tracking-[0.2em] uppercase text-[#C87355] font-bold mb-4 block">
            Cult Favorites
          </span>
          <h2 className="font-display text-5xl md:text-7xl text-[#1A1A1A] font-medium tracking-wide">
            {heading}
          </h2>
          <p className="mt-6 text-[#1A1A1A]/70 max-w-lg mx-auto text-lg md:text-xl leading-relaxed">
            Discover the formulas our community reaches for every day. The essentials of the Alvora routine.
          </p>
        </div>

        {/* Product Screens */}
        {displayProducts.map((product, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div key={`text-${product.id}`} className="h-screen flex items-center w-full max-w-7xl mx-auto px-6 md:px-12">
              <div className={`w-full md:w-1/2 flex flex-col pointer-events-auto ${isEven ? 'md:pr-20' : 'md:ml-auto md:pl-20'}`}>
                
                <div className="bg-white/90 backdrop-blur-md p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#EDE5DC]/50 rounded-sm transform transition-all duration-700 hover:shadow-[0_20px_50px_rgba(200,115,85,0.05)]">
                  <span className="text-4xl text-[#E8D5C4] font-display mb-2 block italic">0{idx + 1}</span>
                  <h3 className="font-display text-3xl md:text-4xl text-[#1A1A1A] mb-4">{product.name}</h3>
                  <p className="text-[#1A1A1A]/70 text-base md:text-lg mb-8 leading-relaxed">
                    {product.shortDescription || product.description?.substring(0, 150) + '...'}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="font-display font-medium text-2xl text-[#1A1A1A]">
                      {formatPrice(product.price)}
                    </span>
                    <Link 
                      href={`/product/${product.slug}`}
                      className="group relative inline-flex items-center justify-center bg-[#1A1A1A] hover:bg-[#C87355] text-white text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase py-4 px-8 rounded-sm transition-all duration-300 overflow-hidden"
                    >
                      <span className="relative z-10">Discover</span>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
