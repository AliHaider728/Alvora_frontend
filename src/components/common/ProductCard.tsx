import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';
import { getSafeImageSrc } from '../../utils/images';
import { formatProductAgeGroups } from '../../utils/products';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, isInWishlist, settings } = useStore();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const hasVariants = Boolean(product.variants?.some(group => group.options.length > 0));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants) {
      navigate(`/product/${product.slug}`);
      return;
    }
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-slate-100/70 overflow-hidden rounded-t-3xl">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={getSafeImageSrc(product.images?.[0])}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="px-2.5 py-1 text-xs font-heading font-extrabold bg-rose-500 text-white rounded-full shadow-sm">
              -{product.discountPercent}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="px-2.5 py-1 text-[11px] font-heading font-bold bg-amber-400 text-amber-950 rounded-full shadow-sm">
              BESTSELLER
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 text-[11px] font-heading font-bold bg-sky-500 text-white rounded-full shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all duration-200 z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white scale-110'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500 hover:scale-110'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Age Group Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-900/70 text-white backdrop-blur-sm">
            {formatProductAgeGroups(product)}
          </span>
        </div>

        {/* Quick View Hover Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-white text-slate-700 shadow-md opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all duration-200 z-10"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-sky-600 uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <span className="font-medium text-slate-400">{product.brand}</span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            className="font-heading font-bold text-sm sm:text-base text-slate-800 hover:text-rose-500 line-clamp-2 transition-colors leading-snug"
          >
            {product.name}
          </Link>

          {product.shortDescription && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
              {product.shortDescription}
            </p>
          )}

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating}</span>
            <span className="text-xs text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-extrabold text-lg sm:text-xl text-slate-900">
                {formatPrice(product.price, settings.currency)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatPrice(product.originalPrice, settings.currency)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Micro-interaction Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`relative overflow-hidden flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-heading font-bold text-xs shadow-sm transition-all duration-300 active:scale-95 ${
              added
                ? 'bg-emerald-500 text-white shadow-emerald-200'
                : !product.inStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-rose-500 hover:bg-rose-600 text-white hover:shadow-lg hover:shadow-rose-200'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                <span>Added!</span>
              </>
            ) : !product.inStock ? (
              <span>Out of Stock</span>
            ) : hasVariants ? (
              <span>Choose Options</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
