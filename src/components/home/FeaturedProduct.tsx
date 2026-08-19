"use client";
import React from 'react';
import Link from 'next/link';
import { Sun, Sparkles, Droplets, Feather } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';

interface Props {
  product?: Product;
}

export const FeaturedProduct: React.FC<Props> = ({ product }) => {
  const { addToCart, settings } = useStore();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <section className="bg-white">
      <div className="flex flex-col lg:flex-row w-full min-h-[80vh]">
        
        {/* Left: Image Split */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#F5EDE4] to-[#F1C9BD] relative min-h-[50vh] lg:min-h-full flex items-center justify-center p-12">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="max-w-md w-full h-auto object-contain shadow-2xl"
            />
          ) : (
            <div className="w-72 h-[450px] bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_30px_60px_rgba(196,139,128,0.2)] flex flex-col items-center justify-center p-8">
              <span className="font-display text-4xl text-[#4D3D2D] mb-2 tracking-widest text-center">ALVORA</span>
              <span className="text-xs tracking-widest text-[#4D3D2D]/60 uppercase text-center mb-6">{product.name}</span>
              <div className="w-16 h-16 rounded-full border border-[#C48B80]/30 flex items-center justify-center">
                <span className="text-[#C48B80] font-display text-2xl">{product.name.charAt(0)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Content Split */}
        <div className="w-full lg:w-1/2 bg-[#FAF6F2] flex flex-col justify-center px-8 py-16 lg:px-24">
          <span className="text-[10px] tracking-widest uppercase text-[#A1A7AA] font-bold mb-4 block">
            FEATURED
          </span>
          
          <h2 className="font-display text-4xl lg:text-5xl text-[#1A1A1A] mb-3">
            {product.name}
          </h2>
          
          <p className="text-sm italic text-[#4D3D2D] mb-6">
            {product.shortDescription || 'Experience the difference.'}
          </p>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-[#C48B80] text-sm">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>{star <= (product.rating || 5) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-xs text-[#A1A7AA]">({product.reviewCount || 0} Reviews)</span>
          </div>
          
          {/* Price */}
          <div className="text-2xl font-bold text-[#C48B80] mb-8">
            {formatPrice(product.price, settings?.currency || 'Rs.')}
          </div>

          <p className="text-[#4D3D2D]/80 leading-relaxed text-base mb-10 max-w-lg">
            {product.description}
          </p>

          {/* Benefit Icons */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-12">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-[#C48B80]" />
              <span className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide">Evens Skin Tone</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#C48B80]" />
              <span className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide">Boosts Radiance</span>
            </div>
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-[#C48B80]" />
              <span className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide">Deep Hydration</span>
            </div>
            <div className="flex items-center gap-3">
              <Feather className="w-5 h-5 text-[#C48B80]" />
              <span className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide">Lightweight</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={handleAddToCart}
              className="btn-primary w-full sm:w-auto px-10 py-4 text-xs tracking-widest uppercase"
            >
              ADD TO CART
            </button>
            <Link 
              href={`/product/${product.slug}`}
              className="btn-ghost w-full sm:w-auto px-6 py-4 text-xs tracking-widest uppercase text-[#4D3D2D]"
            >
              SEE INGREDIENTS &rarr;
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
};
