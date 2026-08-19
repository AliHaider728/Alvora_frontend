"use client";
import React from 'react';
import Link from 'next/link';
import { Product, HomepageSectionSetting } from '../../types';
import { AlvoraProductCard } from '../common/AlvoraProductCard';

interface Props {
  products: Product[];
  sectionSettings?: HomepageSectionSetting;
}

export const BestSellers: React.FC<Props> = ({ products, sectionSettings }) => {
  const heading = sectionSettings?.heading || 'Best Sellers';
  const displayProducts = products.filter(p => p.isBestseller || p.isFeatured).slice(0, 4);

  if (displayProducts.length === 0) return null;

  return (
    <section className="bg-[#FAF6F2] py-16 md:py-24">
      <div className="alvora-container">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A] font-medium uppercase tracking-wide">
              {heading}
            </h2>
          </div>
          <Link 
            href={sectionSettings?.ctaLink || "/category/all"} 
            className="text-xs font-semibold tracking-widest text-[#1A1A1A] hover:text-[#C48B80] transition-colors border-b border-[#1A1A1A] hover:border-[#C48B80] pb-1 uppercase"
          >
            {sectionSettings?.ctaLabel || 'View All'} &rarr;
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map(product => (
            <AlvoraProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
