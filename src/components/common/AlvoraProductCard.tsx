import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, ArrowLeftRight, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';
import { getSafeImageSrc } from '../../utils/images';

export const AlvoraProductCard = ({ product, layout = 'standard' }: { product: Product, layout?: 'standard' | 'compact' }) => {
  const { addToCart, settings } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.inStock) {
      addToCart(product, 1);
    }
  };

  const needsSelection = (product.variations && product.variations.length > 0) ;

  return (
    <div className="group relative bg-white flex flex-col h-full border border-[#EDE5DC] hover:shadow-md transition-shadow duration-300">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] bg-[#F5EDE4] overflow-hidden block">
        <Image
          src={getSafeImageSrc(product.images[0])}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestseller && (
            <span className="bg-[#C87355] text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm shadow-sm">
              BESTSELLER
            </span>
          )}
          {!product.isBestseller && product.isNewArrival && (
            <span className="bg-[#D4A373] text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* Top Right Action - Wishlist */}
        <button 
          className="absolute top-3 right-3 z-10 text-white hover:text-rose-500 transition-colors drop-shadow-md"
          aria-label="Add to Wishlist"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="w-6 h-6" strokeWidth={1.5} />
        </button>

        {/* Bottom Right Actions - Quick View & Compare */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-[#C48B80] shadow-sm" title="Quick View" onClick={(e) => e.preventDefault()}>
            <Eye className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-[#C48B80] shadow-sm" title="Compare" onClick={(e) => e.preventDefault()}>
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-grow text-left">
        <Link href={`/product/${product.slug}`} className="flex flex-col flex-grow">
          <h3 className="font-display font-medium text-[15px] sm:text-base text-[#1A1A1A] leading-tight mb-1 group-hover:text-[#C48B80] transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex text-[#C48B80]">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#A1A7AA] font-medium tracking-wide">4.8 (120)</span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-[#C87355] font-bold text-[15px] sm:text-base">
              {formatPrice(product.price, settings?.currency || 'Rs.')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] sm:text-xs text-[#A1A7AA] line-through">
                {formatPrice(product.originalPrice, settings?.currency || 'Rs.')}
              </span>
            )}
          </div>
        </Link>

        <div className="flex gap-2 mt-auto">
          {needsSelection ? (
            <Link
              href={`/product/${product.slug}`}
              className="flex-1 bg-[#C87355] hover:bg-[#A86249] text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase py-3 px-2 rounded-sm transition-colors text-center shadow-sm"
            >
              SELECT OPTIONS
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-[#C87355] hover:bg-[#A86249] disabled:bg-[#A1A7AA] disabled:cursor-not-allowed text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase py-3 px-2 rounded-sm transition-colors text-center shadow-sm"
            >
              {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
            </button>
          )}
          <button 
            onClick={needsSelection ? undefined : handleAddToCart}
            className="w-10 sm:w-12 flex items-center justify-center border border-[#EDE5DC] hover:border-[#C87355] bg-white text-gray-500 hover:text-[#C87355] rounded-sm transition-colors shadow-sm"
            aria-label="Quick Add"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
