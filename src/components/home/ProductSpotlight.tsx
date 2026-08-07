import React from 'react';
import { ArrowRight, Check, PackageCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { getSafeImageSrc } from '../../utils/images';
import { formatProductAgeGroups, getEffectiveProductAvailability, normalizeInventory } from '../../utils/products';

export const ProductSpotlight: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, settings } = useStore();
  const navigate = useNavigate();
  const isAvailable = getEffectiveProductAvailability(product);
  const isVariable = product.productType === 'variable';
  const defaultVariation = isVariable
    ? product.variations?.find(variation =>
        variation.enabled &&
        normalizeInventory(variation).inStock &&
        Object.entries(product.defaultAttributes || {}).every(
          ([key, value]) => variation.attributes[key] === value
        )
      )
    : undefined;
  const canAddDirectly = !isVariable || Boolean(defaultVariation);
  const hasDiscount = Number(product.originalPrice) > Number(product.price) && Number(product.originalPrice) > 0;
  const discountPercentage = hasDiscount
    ? Math.round(((Number(product.originalPrice) - product.price) / Number(product.originalPrice)) * 100)
    : 0;
  const savings = hasDiscount ? Number(product.originalPrice) - product.price : 0;
  const highlights = product.features?.filter(Boolean).slice(0, 3) || [];
  const categories = product.categoryNames?.length ? product.categoryNames : product.category ? [product.category] : [];

  const handlePrimaryAction = () => {
    if (!isAvailable || !canAddDirectly) {
      navigate(`/product/${product.slug}`);
      return;
    }
    if (defaultVariation) {
      addToCart(product, 1, JSON.stringify(defaultVariation.attributes), defaultVariation.id);
    } else {
      addToCart(product, 1);
    }
  };

  return (
    <section aria-labelledby="product-spotlight-heading" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="relative overflow-hidden rounded-[32px] border border-indigo-100 bg-gradient-to-br from-indigo-950 via-indigo-900 to-fuchsia-900 p-5 shadow-[0_28px_70px_-30px_rgba(49,46,129,0.65)] sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-rose-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <Link to={`/product/${product.slug}`} className="group flex min-h-[300px] items-center justify-center overflow-hidden rounded-[26px] bg-white p-4 shadow-xl sm:min-h-[420px] sm:p-6" aria-label={`View ${product.name}`}>
            <img src={getSafeImageSrc(product.images?.[0])} alt={product.name} className="max-h-[500px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.025]" />
          </Link>

          <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.18em] backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-300" /> Featured pick
            </span>
            <h2 id="product-spotlight-heading" className="mt-5 font-heading text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">{product.name}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">{product.shortDescription || product.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}</p>

            <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-2">
              <span className="font-heading text-3xl font-black text-white sm:text-4xl">{formatPrice(product.price, settings.currency)}</span>
              {hasDiscount && <span className="pb-1 text-base font-bold text-indigo-200 line-through">{formatPrice(Number(product.originalPrice), settings.currency)}</span>}
              {discountPercentage > 0 && <span className="mb-1 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-indigo-950">Save {discountPercentage}% · {formatPrice(savings, settings.currency)}</span>}
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-indigo-100">
              {categories.slice(0, 2).map(category => <span key={category} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">{category}</span>)}
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">{formatProductAgeGroups(product)}</span>
              <span className={`rounded-full px-3 py-1.5 ${isAvailable ? 'bg-emerald-400/20 text-emerald-100' : 'bg-rose-400/20 text-rose-100'}`}>{isAvailable ? 'In stock' : 'Currently unavailable'}</span>
            </div>

            {highlights.length > 0 && <ul className="mt-5 grid gap-2 text-sm text-indigo-50 sm:grid-cols-2">{highlights.map(highlight => <li key={highlight} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />{highlight}</li>)}</ul>}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button type="button" disabled={!isAvailable && canAddDirectly} onClick={handlePrimaryAction} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-rose-500 px-6 text-sm font-black text-white shadow-lg shadow-rose-950/30 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60">
                {canAddDirectly ? <ShoppingBag className="h-5 w-5" /> : <PackageCheck className="h-5 w-5" />}
                {canAddDirectly ? isAvailable ? 'Add to Cart' : 'Out of Stock' : 'Choose Options'}
              </button>
              <Link to={`/product/${product.slug}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 text-sm font-black text-white backdrop-blur transition hover:bg-white/20">View Product <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
