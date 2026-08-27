"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';
import { Bundle } from '../../types';

export const BundleSection: React.FC = () => {
  const { bundles, addToCart, setIsCartOpen } = useStore();
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
    if (!bundles || bundles.length === 0) return null;

  const handleAddBundle = (bundle: Bundle) => {
    if (bundle.products) {
      bundle.products.forEach(p => {
        addToCart(p, p.bundle_quantity || 1);
      });
      setIsCartOpen(true);
    }
  };

  return (
    <section id="bundles-section" className="bg-white overflow-hidden">
      
      {/* Header Section */}
      <div className="bg-[#FAF6F2] py-20 border-t border-[#E7D9D0]">
        <div className="alvora-container">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[10px] tracking-widest uppercase text-[#A86249] font-bold mb-4 block">
              Curated For You
            </span>
            <h2 className="font-display text-4xl lg:text-5xl text-[#241916] font-medium leading-tight mb-6">
              Alvora Bundles
            </h2>
            <p className="text-[#241916]/70 leading-relaxed max-w-xl mx-auto">
              Achieve your skin goals faster with our expertly curated routines. Save up to 25% when you shop our sets.
            </p>
          </div>
        </div>
      </div>

      {/* Alternating Split Layout for Bundles */}
      {bundles.map((bundle, index) => {
        const isReverse = index % 2 === 1;
        const bgClass = isReverse ? 'bg-[#FAF6F2]' : 'bg-white';
        const imageBgClass = isReverse ? 'bg-[#1A1A1A]' : 'bg-[#F1C9BD]';

        return (
          <div key={bundle.id} className={`flex flex-col ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'} w-full min-h-[500px]`}>
            {/* Image Side */}
            <div className={`w-full md:w-1/2 ${imageBgClass} relative aspect-square md:aspect-auto overflow-hidden`}>
              {bundle.image && (
                <Image 
                  src={bundle.image} 
                  alt={bundle.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
              <div className="absolute top-6 left-6 md:top-8 md:left-8 bg-[#A86249] text-white text-[10px] font-bold px-4 py-2 uppercase tracking-widest z-10 rounded-full shadow-sm">
                Save {bundle.discountPercent}%
              </div>
            </div>
            
            {/* Content Side */}
            <div className={`w-full md:w-1/2 flex items-center justify-center p-12 lg:p-24 ${bgClass}`}>
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={variants}
                className="max-w-md w-full"
              >
                <h2 className="font-display text-4xl md:text-5xl text-[#1A1A1A] mb-6 leading-[1.1]">
                  {bundle.name}
                </h2>
                <p className="text-[#1A1A1A]/80 leading-relaxed text-base mb-8">
                  {bundle.description}
                </p>
                
                {/* Bundle Items Summary */}
                <div className="mb-8">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-3">Includes:</h4>
                  <ul className="space-y-2">
                    {bundle.products?.map(p => (
                      <li key={p.id} className="text-[#1A1A1A]/70 text-sm flex items-center">
                        <span className="w-1 h-1 rounded-full bg-[#A86249] mr-3"></span>
                        {p.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & CTA */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-end gap-3">
                    <span className="text-2xl font-medium text-[#A86249]">{formatPrice(bundle.currentPrice || 0)}</span>
                    <span className="text-base text-[#1A1A1A]/40 line-through pb-0.5">{formatPrice(bundle.originalTotalPrice || 0)}</span>
                  </div>

                  <button 
                    onClick={() => handleAddBundle(bundle)}
                    className="w-full sm:w-auto px-8 py-4 bg-[#A86249] hover:bg-[#8C4A35] text-white text-[11px] font-bold tracking-widest uppercase transition-colors rounded-full"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}

      {/* Build Your Own Bundle CTA */}
      <div className="bg-[#EFCDBE]/20 py-20 border-t border-[#EFCDBE]">
        <div className="alvora-container">
          <motion.div 
            className="bg-white rounded-lg p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#EFCDBE] shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-xl text-center md:text-left">
              <h3 className="font-display text-3xl text-[#241916] mb-3">Build Your Own Bundle</h3>
              <p className="text-[#241916]/80 text-base">
                Mix and match any 3 products to create your perfect routine and automatically save 15%.
              </p>
            </div>
            <Link 
              href="/bundles/build"
              className="flex-shrink-0 px-8 py-4 bg-[#A86249] hover:bg-[#8C4A35] text-white text-[11px] font-bold tracking-widest uppercase transition-colors rounded-full"
            >
              Create Your Routine
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
