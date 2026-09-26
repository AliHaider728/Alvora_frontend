'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Plus, Minus, X, ShoppingBag, Sparkles, ArrowRight, Leaf, ShieldCheck, FlaskConical } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { Product } from '../../../types';
import { getSafeImageSrc } from '../../../utils/images';
import { formatPrice } from '../../../utils/formatters';
import { isProductVisibleOnStorefront } from '../../../utils/products';
import { calculateRoutineDiscount, normalizeRoutineSettings } from '../../../lib/routineDiscount';
import { resolveCartLine } from '../../../lib/pricingOffers';

type Selection = { quantity: number; variationId?: string };

function RoutinePhoto({ product, variationId, small = false }: { product: Product; variationId?: string; small?: boolean }) {
  const [failed, setFailed] = useState(false);
  const variation = product.variations?.find(v => v.id === variationId);
  // Use the same canonical images array as the Shop grid, not product.image.
  const source = variation?.image?.url || product.images?.[0] || product.imageThumbnailUrls?.[0];
  return <Image src={getSafeImageSrc(failed ? undefined : source)} alt={product.name} fill sizes={small ? '64px' : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'} onError={() => setFailed(true)} className="object-cover transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transition-none" />;
}

function getChoice(product: Product, selection?: Selection) {
  const variations = product.variations?.filter(v => v.enabled && v.stockStatus !== 'out_of_stock' && (!v.manageStock || Number(v.stockQuantity) > 0)) || [];
  const variation = variations.find(v => v.id === selection?.variationId) || variations.find(v => v.id === product.defaultVariationId) || variations[0];
  const available = product.productType === 'variable' ? Boolean(variation) : product.inStock;
  const max = variation?.manageStock ? Number(variation.stockQuantity) : product.trackInventory ? Number(product.stockQuantity) : Infinity;
  const basePrice = variation ? (variation.salePrice ?? variation.regularPrice) : product.price;
  return { variations, variation, available, max, basePrice };
}

function QuantityControl({ name, quantity, onChange, max }: { name: string; quantity: number; onChange: (quantity: number) => void; max: number }) {
  return <div className="inline-flex items-center rounded-full border border-[#DDB9AC] bg-white shadow-sm">
    <button type="button" aria-label={`Decrease ${name} quantity`} onClick={() => onChange(quantity - 1)} className="flex h-9 w-9 items-center justify-center rounded-full text-[#9C4122] hover:bg-[#F7E5DE]"><Minus size={14} /></button>
    <span aria-label={`${name} quantity`} className="min-w-7 text-center text-sm font-semibold tabular-nums">{quantity}</span>
    <button type="button" aria-label={`Increase ${name} quantity`} disabled={quantity >= max} onClick={() => onChange(quantity + 1)} className="flex h-9 w-9 items-center justify-center rounded-full text-[#9C4122] hover:bg-[#F7E5DE] disabled:opacity-30"><Plus size={14} /></button>
  </div>;
}

export function RoutineBuilder() {
  const { products, productsLoading, settings, addRoutineToCart } = useStore();
  const config = normalizeRoutineSettings(settings.routineDiscount);
  const [selected, setSelected] = useState<Record<string, Selection>>({});
  const [added, setAdded] = useState(false);
  const catalog = products.filter(p => isProductVisibleOnStorefront(p) && p.productType !== 'bundle');
  const selectedProducts = catalog.filter(p => (selected[p.id]?.quantity || 0) > 0);
  const lines = selectedProducts.map(product => {
    const choice = getChoice(product, selected[product.id]);
    const quantity = selected[product.id].quantity;
    const pricing = resolveCartLine(product.pricingOffers, choice.basePrice, quantity);
    return { product, choice, quantity, productId: product.id, unitPrice: pricing.unitPrice };
  });
  const totals = calculateRoutineDiscount(lines, config);
  const unlockCount = Math.max(config.minimumDistinctProducts, config.tiers[0].minProducts);
  const remaining = Math.max(0, unlockCount - totals.distinctCount);
  const maximumDiscount = Math.max(...config.tiers.map(t => t.discountPercent)) + (config.quantityBonusEnabled ? config.quantityBonusPercent : 0);
  const invalidSelection = lines.some(line => !line.choice.available || line.quantity > line.choice.max);
  const setQuantity = (product: Product, quantity: number) => {
    setAdded(false);
    setSelected(current => {
      const next = { ...current };
      if (quantity <= 0) delete next[product.id];
      else {
        const choice = getChoice(product, current[product.id]);
        if (!choice.available) return current;
        next[product.id] = { quantity: Math.min(quantity, choice.max), variationId: choice.variation?.id };
      }
      return next;
    });
  };
  const addRoutine = () => {
    if (invalidSelection || !lines.length) return;
    addRoutineToCart(lines.map(({ product, choice, quantity, unitPrice }) => ({
      productId: product.id, name: product.name, quantity, unitPrice,
      image: choice.variation?.image?.url || product.images?.[0], variationId: choice.variation?.id,
      selectedVariant: choice.variation ? Object.entries(choice.variation.attributes).map(([key, value]) => `${key}: ${value}`).join(', ') : undefined,
    })));
    setAdded(true);
  };

  return <div className="bg-[#FAF6F2] text-[#241916]">
    <section className="relative isolate overflow-hidden border-b border-[#E7D9D0] bg-[#F5EDE4]">
      <Image src="/images/shop-banner-new.jpg" alt="Alvora skincare essentials" fill priority sizes="100vw" className="-z-20 object-cover object-right opacity-40 lg:opacity-100" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#F8EBE4] via-[#FAF6F2]/90 to-[#FAF6F2]/10" />
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[#9C4122]">A little care. A daily ritual.</p>
        <h1 className="max-w-xl text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl lg:text-[56px]">Build Your<br /><span className="text-[#9C4122]">Routine</span></h1>
        <p className="mt-5 max-w-md text-sm leading-7 text-[#66564D] sm:text-base">Your skin, your essentials. Choose the products you love and let your everyday ritual give a little back.</p>
        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#DDB9AC] bg-white/70 px-4 py-2.5 text-xs font-semibold text-[#9C4122]"><Sparkles size={15} />Choose {unlockCount}+ distinct products · save up to {maximumDiscount}%</div>
      </div>
    </section>

    <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-10">
        <section aria-label="Choose your routine products">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9C4122]">01 / Make it yours</p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">Good skin starts with the essentials.</h2>
          <p className="mb-6 mt-3 text-sm leading-6 text-[#7A695F]">Mix, match and find your everyday favourites.</p>
          <div className="mb-7 flex flex-wrap gap-2" aria-label="Routine discount tiers">
            {config.tiers.filter(t => t.minProducts >= config.minimumDistinctProducts).map(tier => <span key={tier.minProducts} className={`rounded-full border px-3 py-2 text-xs ${totals.eligible && totals.tierPercent === tier.discountPercent && totals.distinctCount >= tier.minProducts ? 'border-[#9C4122] bg-[#F7E5DE] font-semibold text-[#9C4122]' : 'border-[#E7D9D0] bg-white text-[#74665C]'}`}>{tier.minProducts}+ products · {tier.discountPercent}% off</span>)}
            {config.quantityBonusEnabled && config.quantityBonusPercent > 0 && <span className="rounded-full border border-[#E7D9D0] bg-[#F5EDE4] px-3 py-2 text-xs text-[#74665C]">Extra quantity · +{config.quantityBonusPercent}% once</span>}
          </div>
          {productsLoading && !catalog.length ? <div role="status" className="grid grid-cols-2 gap-4">{[0, 1, 2, 3].map(i => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-[#F0E5DD]" />)}<span className="sr-only">Loading products</span></div> : !catalog.length ? <div className="rounded-2xl border border-[#E7D9D0] p-8 text-sm">Products are unavailable right now. Please refresh and try again.</div> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 xl:gap-5">
            {catalog.map(product => {
              const quantity = selected[product.id]?.quantity || 0;
              const choice = getChoice(product, selected[product.id]);
              const needsOptions = product.productType === 'variable' && !choice.variations.length;
              return <article key={product.id} data-routine-product={product.id} data-selected={quantity > 0} className={`group flex min-w-0 flex-col overflow-hidden rounded-2xl border-2 transition-colors ${quantity ? 'border-[#9C4122] bg-gradient-to-b from-white to-[#FBEBE4] shadow-[0_6px_24px_-12px_#9C412260]' : 'border-transparent bg-white shadow-[0_4px_22px_-12px_#4D3D2D25] ring-1 ring-[#E7D9D0] hover:ring-[#C48B80]'}`}>
                {/* fill images require a positioned container with an explicit aspect ratio. */}
                <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#F5EDE4]">
                  <RoutinePhoto key={`${product.id}-${choice.variation?.id || ''}`} product={product} variationId={choice.variation?.id} />
                  {quantity > 0 && <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-[#9C4122] px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-sm"><Check size={12} />In your routine</span>}
                </div>
                <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                  <Link href={`/product/${product.slug}`} className="text-xs font-semibold leading-5 hover:text-[#9C4122] sm:text-sm">{product.name}</Link>
                  <p className="mt-2 text-sm font-semibold text-[#9C4122]">{formatPrice(resolveCartLine(product.pricingOffers, choice.basePrice, quantity || 1).unitPrice, settings.currency)}</p>
                  <p className="mb-4 mt-2 line-clamp-2 text-[11px] leading-5 text-[#7A695F]">{(product.shortDescription || '').replace(/<[^>]*>/g, '')}</p>
                  {choice.variations.length > 0 && <select aria-label={`${product.name} option`} value={choice.variation?.id || ''} onChange={e => { setAdded(false); setSelected(current => ({ ...current, [product.id]: { quantity: 1, variationId: e.target.value } })); }} className="mb-3 w-full rounded-lg border border-[#E7D9D0] bg-white px-2 py-2 text-xs">{choice.variations.map(v => <option key={v.id} value={v.id}>{Object.values(v.attributes).join(' / ') || v.sku}</option>)}</select>}
                  <div className="mt-auto flex justify-center pt-1">
                    {quantity > 0 ? <QuantityControl name={product.name} quantity={quantity} onChange={q => setQuantity(product, q)} max={choice.max} /> : needsOptions ? <Link href={`/product/${product.slug}`} className="text-xs font-semibold text-[#9C4122]">View options <ArrowRight className="inline" size={13} /></Link> : <button type="button" disabled={!choice.available} onClick={() => setQuantity(product, 1)} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#E7D9D0] bg-[#FAF6F2] px-2 py-2.5 text-[11px] font-semibold hover:border-[#C48B80] hover:bg-[#F7E5DE] disabled:opacity-40"><Plus size={14} />{choice.available ? 'Add to Routine' : 'Out of stock'}</button>}
                  </div>
                  {quantity > 0 && <button type="button" aria-label={`Remove ${product.name} from selection`} onClick={() => setQuantity(product, 0)} className="mt-3 flex min-h-9 w-full items-center justify-center gap-1 rounded-lg border border-[#DDB9AC] bg-white/80 text-xs font-semibold text-[#9C4122] hover:bg-[#F7E5DE]"><X size={14} />Remove</button>}
                </div>
              </article>;
            })}
          </div>}
        </section>

        <aside aria-label="Your Routine" className="rounded-3xl border border-[#DFC3B6] bg-gradient-to-br from-[#F6DED3] via-[#FBF0E8] to-[#FFFDF9] p-5 shadow-[0_12px_40px_-24px_#9C412250] sm:p-6 lg:sticky lg:top-28">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9C4122]">02 / Your daily ritual</p>
          <div className="mb-5 mt-3 flex items-center justify-between gap-3"><h2 className="text-2xl font-medium tracking-tight">Your Routine</h2><span className="rounded-full border border-[#DFC3B6] bg-white/70 px-3 py-1 text-xs text-[#74665C]">{totals.distinctCount} products</span></div>
          <div aria-live="polite" className="mb-5 rounded-2xl border border-white/80 bg-white/60 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#9C4122]"><Sparkles size={16} />{totals.percent ? `Routine unlocked · ${totals.percent}% saved` : 'Your next good-skin day starts here'}</p>
            <p className="mt-2 text-xs leading-5 text-[#74665C]">{remaining > 0 ? `Choose at least ${unlockCount} distinct products to unlock savings. Add ${remaining} more ${remaining === 1 ? 'product' : 'products'}.` : totals.bonusPercent ? `${totals.tierPercent}% tier savings + ${totals.bonusPercent}% quantity bonus. A little more care, a little more saved.` : config.quantityBonusEnabled && config.quantityBonusPercent > 0 ? `Increase any selected product’s quantity to unlock an extra ${config.quantityBonusPercent}% off, once.` : 'Your qualifying tier is applied automatically.'}</p>
          </div>
          <div className="space-y-4">
            {!lines.length && <div className="py-7 text-center text-[#8B776B]"><ShoppingBag size={32} strokeWidth={1} className="mx-auto mb-3" /><p className="text-sm">A routine made just for you.</p><p className="mt-2 text-xs">Add your first essential to get started.</p></div>}
            {lines.map(({ product, choice, quantity, unitPrice }) => <div key={product.id} className="flex gap-3 border-b border-[#DFC3B6]/50 pb-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white bg-[#F5EDE4]"><RoutinePhoto key={choice.variation?.id} product={product} variationId={choice.variation?.id} small /></div>
              <div className="min-w-0 flex-1"><p className="text-xs font-semibold leading-5">{product.name}</p><p className="mb-2 mt-1 text-xs text-[#74665C]">{formatPrice(unitPrice * quantity, settings.currency)}{choice.variation && ` · ${Object.values(choice.variation.attributes).join(' / ')}`}</p><QuantityControl name={product.name} quantity={quantity} onChange={q => setQuantity(product, q)} max={choice.max} /></div>
              <button aria-label={`Remove ${product.name}`} onClick={() => setQuantity(product, 0)} type="button" className="flex min-h-9 shrink-0 items-center gap-1 self-start rounded-lg border border-[#DDB9AC] px-2 text-xs text-[#9C4122] hover:bg-white"><X size={14} /><span>Remove</span></button>
            </div>)}
          </div>
          <div aria-live="polite" className="mt-5 space-y-3" data-testid="routine-totals">
            <div className="flex justify-between text-sm text-[#74665C]"><span>Subtotal</span><span data-testid="routine-subtotal">{formatPrice(totals.subtotal, settings.currency)}</span></div>
            <div className="flex justify-between gap-2 rounded-xl bg-white/75 px-3 py-3 text-sm font-semibold text-[#9C4122]"><span>Routine Savings ({totals.percent}%)</span><span data-testid="routine-savings">− {formatPrice(totals.savings, settings.currency)}</span></div>
            <div className="flex items-baseline justify-between gap-3 pt-2"><span className="text-base font-semibold">Total</span><strong data-testid="routine-total" className="text-3xl font-semibold tracking-tight text-[#9C4122]">{formatPrice(totals.total, settings.currency)}</strong></div>
            <p className="text-right text-[10px] text-[#8B776B]">Delivery & taxes calculated at checkout</p>
          </div>
          {invalidSelection && <p role="alert" className="mt-3 text-xs text-red-700">Availability changed. Reduce the quantity or remove the unavailable product.</p>}
          <button type="button" disabled={!lines.length || invalidSelection} onClick={addRoutine} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#9C4122] to-[#B86343] px-4 py-4 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-shadow hover:shadow-md disabled:opacity-50"><ShoppingBag size={16} />{added ? 'Add routine again' : 'Add routine to cart'}<ArrowRight size={16} /></button>
          <p className="mt-3 text-center text-[10px] text-[#8B776B]">{totals.totalQuantity} {totals.totalQuantity === 1 ? 'item' : 'items'} · Thoughtfully chosen by you</p>
        </aside>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-5 border-t border-[#E7D9D0] pt-8 sm:grid-cols-3">{[{ Icon: Leaf, title: 'Clean ingredients', text: 'Thoughtfully formulated essentials.' }, { Icon: FlaskConical, title: 'Science meets nature', text: 'Care that fits your everyday ritual.' }, { Icon: ShieldCheck, title: 'Made for your skin', text: 'Your favourites, your way.' }].map(({ Icon, title, text }) => <div key={title} className="flex items-center gap-3"><span className="rounded-full border border-[#DFC3B6] bg-white p-3 text-[#B86343]"><Icon size={19} strokeWidth={1.5} /></span><div><p className="text-xs font-semibold">{title}</p><p className="mt-1 text-[11px] text-[#8B776B]">{text}</p></div></div>)}</div>
      <div className="mt-12 rounded-3xl border border-[#E7D9D0] bg-gradient-to-r from-[#F7E5DE] via-[#FFFCF8] to-[#F5EDE4] px-6 py-12 text-center"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9C4122]">Small rituals. Lasting care.</p><h2 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">Your skin deserves a routine of its own.</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#7A695F]">The essentials you reach for. The care you look forward to. Build something beautifully yours.</p></div>
    </div>
  </div>;
}
