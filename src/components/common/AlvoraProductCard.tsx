"use client";
import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';

interface Props {
  product: Product;
}

export const AlvoraProductCard: React.FC<Props> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, settings } = useStore();
  const inWishlist = isInWishlist(product.id);
  
  const hasVariants = product.variants && product.variants.length > 0;
  const isVariable = product.variations && product.variations.length > 0;
  const needsSelection = hasVariants || isVariable;

  const handleAddToCart = (e: React.MouseEvent) => {
    if (needsSelection) return;
    e.preventDefault();
    addToCart(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  const hasImage = product.images && product.images.length > 0;

  return (
    <div className="group flex flex-col h-full bg-white transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
      <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] bg-gradient-to-br from-[#F5EDE4] to-[#F1C9BD] overflow-hidden">
        {hasImage ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#C48B80] font-display text-5xl opacity-40">
              {product.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Badges - White Pill as in reference */}
        {product.isBestseller && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-[#EDE5DC] text-[#1A1A1A] text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full z-10 shadow-sm">
            BEST SELLER
          </div>
        )}
        {!product.isBestseller && product.isNewArrival && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-[#EDE5DC] text-[#1A1A1A] text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full z-10 shadow-sm">
            NEW
          </div>
        )}
      </Link>

      <div className="p-6 flex flex-col items-center text-center flex-grow">
        <Link href={`/product/${product.slug}`} className="flex flex-col items-center flex-grow w-full">
          <h3 className="font-display text-lg font-medium text-[#1A1A1A] leading-snug mb-2 group-hover:text-[#C48B80] transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-[#C48B80] font-semibold text-base">
              {formatPrice(product.price, settings?.currency || 'Rs.')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-[#A1A7AA] line-through">
                {formatPrice(product.compareAtPrice, settings?.currency || 'Rs.')}
              </span>
            )}
          </div>
        </Link>

        {needsSelection ? (
          <Link
            href={`/product/${product.slug}`}
            className="w-4/5 mx-auto bg-[#1A1A1A] hover:bg-[#333] text-white text-[10px] font-bold tracking-widest uppercase py-3 px-6 rounded-full transition-colors text-center shadow-md hover:shadow-lg"
          >
            SELECT OPTIONS
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-4/5 mx-auto bg-[#1A1A1A] hover:bg-[#333] disabled:bg-[#A1A7AA] disabled:cursor-not-allowed text-white text-[10px] font-bold tracking-widest uppercase py-3 px-6 rounded-full transition-colors text-center shadow-md hover:shadow-lg"
          >
            {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button>
        )}
      </div>
    </div>
  );
};
