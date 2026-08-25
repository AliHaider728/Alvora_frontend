"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
  }
};

const MOCK_BUNDLES = [
  {
    id: 'bundle-glow',
    name: 'Glow Starter Kit',
    description: 'Everything you need for a radiant, glowing complexion.',
    productIds: ['prod-radiance-serum', 'prod-gentle-face-wash'],
    discountPercentage: 15,
  },
  {
    id: 'bundle-hydration',
    name: 'Hydration Bundle',
    description: 'Deep moisture for dry or compromised skin barriers.',
    productIds: ['prod-hydra-gel-cream', 'prod-nourishing-essence'],
    discountPercentage: 20,
  },
  {
    id: 'bundle-anti-aging',
    name: 'Anti-Aging Set',
    description: 'Firm, brighten, and protect your skin daily.',
    productIds: ['prod-vitamin-c-serum', 'prod-daily-spf50', 'prod-barrier-repair-cream'],
    discountPercentage: 25,
  }
];

export const BundleSection: React.FC = () => {
  const { products, addToCart, setIsCartOpen } = useStore();
  const shouldReduceMotion = useReducedMotion();
  const animVariants = shouldReduceMotion ? {} : itemVariants;
  const contVariants = shouldReduceMotion ? {} : containerVariants;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleAddBundle = (bundle: typeof MOCK_BUNDLES[0]) => {
    bundle.productIds.forEach(id => {
      const p = products.find(prod => prod.id === id);
      if (p) addToCart(p, 1);
    });
    setIsCartOpen(true);
  };

  return (
    <section className="bg-[#FAF6F2] py-20 border-t border-[#E7D9D0]">
      <div className="alvora-container">
        <div className="mb-14 flex flex-col items-center justify-center text-center">
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

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16"
          variants={contVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {MOCK_BUNDLES.map((bundle) => {
            const bundleProducts = bundle.productIds.map(id => products.find(p => p.id === id)).filter(Boolean) as typeof products;
            if (bundleProducts.length === 0) return null;

            const originalPrice = bundleProducts.reduce((sum, p) => sum + p.price, 0);
            const discountedPrice = originalPrice * (1 - bundle.discountPercentage / 100);

            return (
              <motion.div key={bundle.id} variants={animVariants} className="group flex flex-col bg-white border border-[#E7D9D0] rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                
                {/* Images */}
                <div className="relative aspect-square bg-[#F5EDE4] p-6 flex items-center justify-center overflow-hidden">
                  <div className="absolute top-4 right-4 bg-[#A86249] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10 rounded-full shadow-sm">
                    Save {bundle.discountPercentage}%
                  </div>
                  <div className="flex -space-x-12 relative z-0 group-hover:scale-105 transition-transform duration-500">
                    {bundleProducts.slice(0, 3).map((p, i) => (
                      <div key={p.id} className="relative w-32 h-40 drop-shadow-lg" style={{ zIndex: 3 - i }}>
                        <Image src={p.images[0]} alt={p.name} fill className="object-contain" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-display text-2xl text-[#241916] mb-2">{bundle.name}</h3>
                  <p className="text-sm text-[#241916]/70 mb-4 flex-grow">{bundle.description}</p>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-lg font-medium text-[#A86249]">{formatPrice(discountedPrice)}</span>
                    <span className="text-sm text-[#241916]/40 line-through">{formatPrice(originalPrice)}</span>
                  </div>

                  <button 
                    onClick={() => handleAddBundle(bundle)}
                    className="w-full py-3.5 border border-[#A86249] text-[#A86249] hover:bg-[#A86249] hover:text-white text-[11px] font-bold tracking-widest uppercase transition-colors rounded-full"
                  >
                    Add Bundle to Cart
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Build Your Own Bundle CTA */}
        <motion.div 
          className="bg-[#EFCDBE]/30 rounded-lg p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#EFCDBE]"
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
    </section>
  );
};
