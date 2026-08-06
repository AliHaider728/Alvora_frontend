import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';
import { getSafeImageSrc } from '../../utils/images';
import { formatProductAgeGroups, getEffectiveProductAvailability, normalizeInventory } from '../../utils/products';
import { ReviewSummary } from './ReviewSummary';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, isInWishlist, settings } = useStore();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const isVariable = product.productType === 'variable';
  const hasVariants = isVariable || Boolean(product.variants?.some(group => group.options.length > 0));
  const isAvailable = getEffectiveProductAvailability(product);

  let validDefaultVariation: any = null;
  if (isVariable && product.variations && product.variations.length > 0) {
    if (product.defaultAttributes && Object.keys(product.defaultAttributes).length > 0) {
      const match = product.variations.find(v => v.enabled && Object.entries(product.defaultAttributes!).every(([k, val]) => v.attributes[k] === val));
      if (match && normalizeInventory(match).inStock) {
        validDefaultVariation = match;
      }
    }
  }
  
  const showAddToCart = !isVariable || (isVariable && validDefaultVariation);


  let displayPrice = product.price;
  let displayOriginalPrice = product.originalPrice;
  let pricePrefix = '';

  if (isVariable && product.variations && product.variations.length > 0) {
    const activeVariations = product.variations.filter(v => v.enabled);
    if (activeVariations.length > 0) {
      const prices = activeVariations.map(v => v.salePrice !== undefined && v.salePrice !== null ? v.salePrice : v.regularPrice);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      displayPrice = minPrice;
      if (minPrice < maxPrice) {
        pricePrefix = 'From ';
      }
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!showAddToCart) {
      navigate(`/product/${product.slug}`);
      return;
    }
    if (validDefaultVariation) {
      addToCart(product, 1, JSON.stringify(validDefaultVariation.attributes), validDefaultVariation.id);
    } else {
      addToCart(product, 1);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full">
      {/* Product Image Container */}
      <div className="relative h-[240px] sm:h-[320px] w-full bg-white overflow-hidden rounded-t-3xl border-b border-slate-100/50 flex-shrink-0">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={getSafeImageSrc(product.images?.[0])}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out p-2"
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
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 min-h-[1.25rem]">
            <span className="font-semibold text-sky-600 uppercase tracking-wider text-[10px]">
              {product.category || 'Uncategorized'}
            </span>
            <span className="font-medium text-slate-400">{product.brand}</span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            className="font-heading font-bold text-sm sm:text-base text-slate-800 hover:text-rose-500 line-clamp-2 transition-colors leading-snug min-h-[2.5rem]"
          >
            {product.name}
          </Link>

          {product.shortDescription && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 min-h-[2.25rem]">
              {product.shortDescription}
            </p>
          )}

          {/* Star Rating */}
          <div className="mt-2"><ReviewSummary rating={product.rating} reviewCount={product.reviewCount} compact /></div>
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-extrabold text-lg sm:text-xl text-slate-900">
                {pricePrefix}{formatPrice(displayPrice, settings.currency)}
              </span>
              {displayOriginalPrice && displayOriginalPrice > displayPrice && !pricePrefix && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatPrice(displayOriginalPrice, settings.currency)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2">
            {/* WhatsApp Button */}
            <a 
              href={`https://wa.me/3276655557?text=${encodeURIComponent(`Hello, I am interested in this product:\nProduct: ${product.name}\nPrice: ${formatPrice(displayPrice, settings.currency)}\nLink: ${window.location.origin}/product/${product.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors shadow-sm"
              title="Order via WhatsApp"
            >
              <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            </a>
            
            {/* Add to Cart / View Button */}
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`relative flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl font-heading font-bold text-xs shadow-sm transition-all duration-300 active:scale-95 ${
                added
                  ? 'bg-emerald-500 text-white shadow-emerald-200'
                  : !isAvailable
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-rose-500 hover:bg-rose-600 text-white hover:shadow-lg hover:shadow-rose-200'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 animate-bounce" />
                  <span className="hidden sm:inline">Added!</span>
                </>
              ) : !isAvailable ? (
                <span className="whitespace-nowrap">Sold Out</span>
              ) : !showAddToCart ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">View</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
