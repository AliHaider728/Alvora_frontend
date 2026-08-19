"use client";
import React from 'react';
import { Product, HomepageSectionSetting } from '../../types';
import { AlvoraProductCard } from '../common/AlvoraProductCard';
import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  products: Product[];
  sectionSettings?: HomepageSectionSetting;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
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

export const BestSellers: React.FC<Props> = ({ products, sectionSettings }) => {
  const heading = sectionSettings?.heading || 'BEST SELLERS';
  const displayProducts = products.filter(p => p.isBestseller || p.isFeatured).slice(0, 4);
  const shouldReduceMotion = useReducedMotion();
  const animVariants = shouldReduceMotion ? {} : itemVariants;
  const contVariants = shouldReduceMotion ? {} : containerVariants;

  if (displayProducts.length === 0) return null;

  return (
    <section className="bg-[#FAF6F2] py-20 md:py-28">
      <div className="alvora-container">
        
        {/* Header - Centered */}
        <div className="flex flex-col items-center justify-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A] font-medium tracking-[0.2em] uppercase text-center">
            {heading}
          </h2>
        </div>

        {/* Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={contVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayProducts.map(product => (
            <motion.div key={product.id} variants={animVariants} className="h-full">
              <AlvoraProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
