"use client";
import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
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
    <div className="group bg-white border border-[#EDE5DC] hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] bg-[#F5EDE4] overflow-hidden">
        {hasImage ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#F5EDE4] to-[#F1C9BD]">
            <span className="text-[#C48B80] font-display text-5xl opacity-40">
              {product.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Badges */}
        {product.isBestseller && (
          <div className="absolute top-3 left-3 bg-[#C48B80] text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 z-10">
            Best Seller
          </div>
        )}
        {!product.isBestseller && product.isNewArrival && (
          <div className="absolute top-3 left-3 bg-[#4D3D2D] text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 z-10">
            New
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-[#FAF6F2] transition-colors z-10"
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#C48B80] text-[#C48B80]' : 'text-[#4D3D2D]'}`} />
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`} className="flex flex-col flex-grow">
          <h3 className="font-display text-base font-semibold text-[#1A1A1A] leading-snug mb-1 group-hover:text-[#C48B80] transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-[#A1A7AA] mb-2 line-clamp-1">
            {product.shortDescription || product.category}
          </p>
          
          <div className="flex items-center gap-1 mb-2 mt-auto">
            <div className="flex text-[#C48B80] text-[10px]">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>{star <= (product.rating || 5) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-[10px] text-[#A1A7AA]">
              ({product.reviewCount || 0})
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[#C48B80] font-bold text-base">
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
            className="w-full bg-[#1A1A1A] hover:bg-[#C48B80] text-white text-xs font-semibold tracking-wide uppercase py-2.5 transition-colors text-center"
          >
            Select Options
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#C48B80] disabled:bg-[#A1A7AA] disabled:cursor-not-allowed text-white text-xs font-semibold tracking-wide uppercase py-2.5 transition-colors"
          >
            {product.inStock ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </>
            ) : 'Out of Stock'}
          </button>
        )}
      </div>
    </div>
  );
};
