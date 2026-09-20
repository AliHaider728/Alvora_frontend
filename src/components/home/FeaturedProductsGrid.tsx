'use client';

import React from 'react';
import { Product } from '../../types';
import { AlvoraProductCard } from '../common/AlvoraProductCard';
import { motion } from 'framer-motion';

interface Props {
  products: Product[];
}

export const FeaturedProductsGrid: React.FC<Props> = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#FAF6F2] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-[#1A1A1A] mb-4">
            Featured Products
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <AlvoraProductCard product={product} layout="compact" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
