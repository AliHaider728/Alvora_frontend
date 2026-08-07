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
  const thumbnailUrl = product.imageThumbnailUrls?.[0]?.trim();
  const cardImageUrl = thumbnailUrl || product.images?.[0];
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
    <article className="group relative flex h-auto w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_34px_rgba(15,23,42,0.12)]">
      <div className={`relative w-full shrink-0 border-b border-slate-100 bg-slate-50/60 ${thumbnailUrl ? 'aspect-square' : ''}`}>
        <Link
          to={`/product/${product.slug}`}
          className="block h-full w-full"
          aria-label={`View ${product.name}`}
        >
          <img
            src={getSafeImageSrc(cardImageUrl)}
            alt={product.name}
            loading="lazy"
            className={thumbnailUrl ? 'block h-full w-full' : 'block h-auto w-full'}
          />
        </Link>

        {/* Top Badges */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex flex-col items-start gap-1.5">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="rounded-full bg-rose-500 px-2.5 py-1 font-heading text-[10px] font-extrabold text-white shadow-sm">
              -{product.discountPercent}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="rounded-full bg-amber-400 px-2.5 py-1 font-heading text-[10px] font-bold text-amber-950 shadow-sm">
              BESTSELLER
            </span>
          )}
          {product.isNewArrival && (
            <span className="rounded-full bg-sky-500 px-2.5 py-1 font-heading text-[10px] font-bold text-white shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute right-2.5 top-2.5 z-10 rounded-full p-2 shadow-sm transition-all duration-200 ${
            isWishlisted
              ? 'scale-105 bg-rose-500 text-white'
              : 'bg-white/95 text-slate-600 hover:scale-105 hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Age Group Badge */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[9px] font-bold text-white">
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
            className="absolute bottom-2.5 right-2.5 z-10 rounded-full bg-white p-2 text-slate-700 opacity-0 shadow-md transition-all duration-200 hover:bg-rose-500 hover:text-white group-hover:opacity-100 focus:opacity-100"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="min-w-0">
          <div className="mb-1.5 flex min-h-4 items-center justify-between gap-2 text-slate-400">
            <span className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-sky-600">
              {product.category || 'Uncategorized'}
            </span>
            <span className="shrink-0 text-[10px] font-medium text-slate-400">{product.brand}</span>
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="line-clamp-2 min-h-10 font-heading text-sm font-bold leading-5 text-slate-900 transition-colors hover:text-rose-500"
          >
            {product.name}
          </Link>

          <div className="mt-2 min-h-5">
            <ReviewSummary rating={product.rating} reviewCount={product.reviewCount} compact />
          </div>
        </div>

        <div className="mt-auto flex min-h-[72px] items-end justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="min-w-0 pb-0.5">
            <div className="flex flex-col items-start">
              <span className="whitespace-nowrap font-heading text-[15px] font-extrabold leading-5 text-slate-900 sm:text-base">
                {pricePrefix}{formatPrice(displayPrice, settings.currency)}
              </span>
              {displayOriginalPrice && displayOriginalPrice > displayPrice && !pricePrefix && (
                <span className="text-[10px] font-medium text-slate-400 line-through">
                  {formatPrice(displayOriginalPrice, settings.currency)}
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <a 
              href={`https://wa.me/3276655557?text=${encodeURIComponent(`Hello, I am interested in this product:\nProduct: ${product.name}\nPrice: ${formatPrice(displayPrice, settings.currency)}\nLink: ${window.location.origin}/product/${product.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366] shadow-sm transition-colors hover:bg-[#25D366] hover:text-white"
              title="Order via WhatsApp"
            >
              <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            </a>

            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`relative flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-xl px-2.5 font-heading text-xs font-bold shadow-sm transition-all duration-300 active:scale-95 ${
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
                  <span className="hidden lg:inline">Added</span>
                </>
              ) : !isAvailable ? (
                <span className="whitespace-nowrap">Sold Out</span>
              ) : !showAddToCart ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="hidden lg:inline">View</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden lg:inline">Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
