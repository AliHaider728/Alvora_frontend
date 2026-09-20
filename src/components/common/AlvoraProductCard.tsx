import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, ArrowLeftRight, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';
import { getSafeImageSrc } from '../../utils/images';
import { AnimatedButton } from './AnimatedButton';

export const AlvoraProductCard = ({ product, layout = 'standard' }: { product: Product, layout?: 'standard' | 'compact' }) => {
  const { addToCart, settings, toggleWishlist, isInWishlist } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.inStock) {
      addToCart(product, 1);
    }
  };

  const needsSelection = (product.variations && product.variations.length > 0) ;

  return (
    <div className="group relative bg-white rounded-2xl flex flex-col h-full border border-[#EDE5DC] hover:shadow-md transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative aspect-square bg-[#F5EDE4] overflow-hidden block rounded-t-2xl">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0">
          <Image
            src={getSafeImageSrc(product.images[0])}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestseller && (
            <span className="bg-[#9C4122] text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-2xl shadow-sm transform-gpu will-change-transform">
              BESTSELLER
            </span>
          )}
          {!product.isBestseller && product.isNewArrival && (
            <span className="bg-[#D4A373] text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-2xl shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* Top Right Action - Wishlist */}
        <button 
          className={`absolute top-3 right-3 z-10 transition-colors drop-shadow-md ${isInWishlist(product.id) ? 'text-[#9C4122]' : 'text-white hover:text-[#9C4122]'}`}
          aria-label="Add to Wishlist"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
        >
          <Heart className="w-6 h-6" strokeWidth={1.5} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
        </button>

        {/* Bottom Right Actions - Add to Cart & View Details */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          <button 
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-[#9C4122] shadow-sm transition-colors" 
            title="Add to Cart" 
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <Link 
            href={`/product/${product.slug}`}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-[#9C4122] shadow-sm transition-colors" 
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-grow text-left">
        <Link href={`/product/${product.slug}`} className="flex flex-col flex-grow">
          <h3 className="font-display font-medium text-sm sm:text-base text-[#1A1A1A] leading-tight mb-1 group-hover:text-[#9C4122] transition-colors">
            {product.name}
          </h3>
          
          {/* Star Rating */}
          {(product.reviewCount ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 mb-2 mt-auto">
              <div className="flex items-center text-[#D4784F]">
                {[...Array(5)].map((_, i) => {
                  const isFilled = i < Math.floor(product.rating || 5);
                  return (
                    <svg key={i} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${isFilled ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  );
                })}
              </div>
              <span className="text-[0.6rem] sm:text-xs text-[#A1A7AA] font-medium tracking-wide">
                {(product.rating || 5).toFixed(1)} ({product.reviewCount})
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-[#9C4122] font-bold text-sm sm:text-base">
              {formatPrice(product.price, settings?.currency || 'Rs.')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs sm:text-sm text-[#A1A7AA] line-through">
                {formatPrice(product.originalPrice, settings?.currency || 'Rs.')}
              </span>
            )}
          </div>
        </Link>

        <div className="flex gap-2 mt-auto">
          {needsSelection ? (
            <AnimatedButton
              href={`/product/${product.slug}`}
              size="full"
              variant="primary"
              className="flex-1 shrink-0"
              aria-label="Options"
            >
              OPTIONS
            </AnimatedButton>
          ) : product.inStock ? (
            <AnimatedButton
              href={`/product/${product.slug}`}
              size="full"
              variant="primary"
              className="flex-1 shrink-0"
              aria-label="View Details"
            >
              DETAILS
            </AnimatedButton>
          ) : (
            <button
              disabled
              className="flex-1 bg-[#A1A7AA] cursor-not-allowed text-white text-[0.6rem] sm:text-[0.7rem] font-bold tracking-widest uppercase py-3 px-1 rounded-xl transition-colors text-center shadow-sm shrink-0"
            >
              OUT OF STOCK
            </button>
          )}
          <button 
            onClick={needsSelection ? undefined : handleAddToCart}
            className="w-10 sm:w-12 shrink-0 flex items-center justify-center border border-[#EDE5DC] hover:border-[#9C4122] bg-white text-gray-500 hover:text-[#9C4122] rounded-xl transition-colors shadow-sm"
            aria-label="Quick Add"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );




};
