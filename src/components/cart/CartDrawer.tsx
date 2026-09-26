"use client";
import { RoutineContents } from '../common/RoutineContents';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';
import { getSafeImageSrc } from '../../utils/images';
import { getVariationDisplayLabel } from '../../utils/products';
import { useScrollLock } from '../../hooks/useScrollLock';
import { trackInitiateCheckout } from "../../lib/metaPixel";
import { trackTikTokInitiateCheckout } from "../../lib/tiktokPixel";
import { AnimatedButton } from '../common/AnimatedButton';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponDiscountAmount,
    routineDiscountAmount,
    routineDiscountPercent,
    settings
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; message: string } | null>(null);

  useScrollLock(isCartOpen);

  const router = useRouter();

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput) return;
    const res = await applyCoupon(couponCodeInput);
    setCouponMsg(res);
    if (res.success) {
      setCouponCodeInput('');
    }
  };

  const finalTotal = Math.max(0, cartSubtotal - couponDiscountAmount - routineDiscountAmount);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1A1A]/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="relative w-[92vw] sm:w-[400px] max-w-[420px] bg-white shadow-2xl flex flex-col h-[100dvh] rounded-l-3xl overflow-hidden border-l border-[#EDE5DC]">
        {/* Drawer Header */}
        <div className="shrink-0 p-4 sm:p-5 bg-[#FAF6F2] border-b border-[#EDE5DC]/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 sm:p-2 bg-[#1A1A1A] text-white rounded-xl sm:rounded-2xl shadow-md">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-[15px] sm:text-lg text-[#1A1A1A]">Your Shopping Bag</h2>
              <p className="text-[10px] sm:text-xs text-[#1A1A1A]/60 font-sans">
                {cart.length === 0 ? 'Basket is currently empty' : `${cart.length} item(s) in your bag`}
              </p>
            </div>
          </div>

          <button
            aria-label="Close shopping bag"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white text-[#1A1A1A]/60 hover:text-[#1A1A1A]/90 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#1A1A1A]/40">
                <div className="w-20 h-20 rounded-full bg-[#F5EDE4] flex items-center justify-center text-[#9C4122]/60 mb-4 animate-bounce">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#1A1A1A]/80 mb-1">Your Basket is Empty</h3>
                <p className="text-xs text-[#1A1A1A]/60 mb-6 max-w-xs">
                  Discover our thoughtful formulas for radiant skin.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-interactive px-6 py-3 rounded-full bg-gradient-to-r from-[#1A1A1A] to-[#333333] hover:from-[#D4784F] hover:to-[#9C4122] text-white tracking-widest font-display font-bold text-sm shadow-md transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const variation = item.product.productType === 'variable' && item.variationId
                  ? item.product.variations?.find(v => String(v.id) === String(item.variationId))
                  : undefined;
                  
                let itemPrice = item.product.price;
                if (item.resolvedUnitPrice !== undefined) {
                  itemPrice = item.resolvedUnitPrice;
                } else if (variation) {
                  itemPrice = variation.salePrice !== undefined && variation.salePrice !== null ? variation.salePrice : variation.regularPrice;
                } else if (item.selectedVariant && item.product.variants) {
                  const selections = new Map(
                    item.selectedVariant.split(',').map(part => {
                      const separator = part.indexOf(':');
                      return separator === -1 ? ['', part.trim()] : [part.slice(0, separator).trim(), part.slice(separator + 1).trim()];
                    })
                  );
                  const variantOffset = item.product.variants.reduce((sum, group) => {
                    const optionName = selections.get(group.name);
                    const option = group.options?.find(opt => opt.name === optionName);
                    return sum + Number(option?.priceOffset || 0);
                  }, 0);
                  itemPrice += variantOffset;
                }

                return (
                <div
                  key={`${item.product.id}-${item.selectedVariant || ''}-${item.variationId || ''}`}
                  className="flex gap-2.5 sm:gap-3.5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FAF6F2] border border-[#EDE5DC] hover:border-[#EDE5DC] transition-all"
                >
                  <img
                    src={getSafeImageSrc(
                      variation?.image?.url ||
                      item.product.imageThumbnailUrls?.[0] ||
                      item.product.images?.[0] ||
                      item.product.bundleData?.customImage ||
                      item.product.bundleData?.image ||
                      item.product.bundleData?.products?.[0]?.product?.images?.[0]
                    )}
                    alt={variation?.image?.alt || item.product.name}
                    className="h-[72px] w-[72px] sm:h-20 sm:w-20 flex-shrink-0 rounded-lg sm:rounded-xl bg-white object-contain p-1"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          href={item.product.productType === 'bundle' ? '#' : `/product/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-display font-bold text-[11px] sm:text-[13px] text-[#1A1A1A]/90 leading-snug hover:text-[#9C4122] line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant, item.variationId)}
                          className="text-[#1A1A1A]/40 hover:text-[#9C4122] transition-colors p-1"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.product.productType === 'bundle' && item.product.bundleData?.products && (
                        <div className="mt-1 mb-1">
                          <details className="text-xs text-[#1A1A1A]/60">
                            <summary className="cursor-pointer font-medium hover:text-[#9C4122] transition-colors">Includes: {item.product.bundleData.products.length} items</summary>
                            <ul className="mt-1.5 pl-3 list-disc space-y-0.5 border-l-2 border-[#EDE5DC] ml-1">
                              {item.product.bundleData.products.map((bp: any, idx: number) => (
                                <li key={idx} className="pl-1">{bp.name} (x{bp.bundle_quantity || 1})</li>
                              ))}
                            </ul>
                          </details>
                        </div>
                      )}

                      <RoutineContents components={item.routineComponents} />
                      {item.routineComponents && <p className="mt-1 text-xs font-semibold text-[#9C4122]">{item.routineDiscountPercent}% routine savings included</p>}
                      {item.product.category && item.product.category !== "Uncategorized" && (<span className="text-[10px] text-[#9C4122] font-semibold uppercase block tracking-wider mt-0.5">{item.product.category}</span>)}
                        {item.isRoutine && (<span className="text-[10px] bg-[#C48B80] text-white px-1.5 py-0.5 rounded uppercase tracking-wider mt-1 inline-block">Custom Routine</span>)}
                      
                      {variation && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="text-[10px] font-bold text-[#1A1A1A]/60 bg-slate-200 px-1.5 py-0.5 rounded">
                            {getVariationDisplayLabel(variation, item.product.attributes || [], 0)}
                          </span>
                        </div>
                      )}
                      {!variation && item.selectedVariant && (
                        <span className="text-[10px] text-[#1A1A1A]/60 block mt-1">
                          {item.selectedVariant}
                        </span>
                      )}

                      {/* Pricing Offer Badges */}
                      {!!(item.appliedOfferLabel || item.freeUnits) && (
                        <div className="mt-1 flex flex-col gap-1">
                          {item.appliedOfferLabel && (
                            <span className="inline-flex w-fit items-center rounded bg-[#F5EDE4] px-1.5 py-0.5 text-[10px] font-bold text-[#9C4122]">
                              <Tag className="mr-1 h-3 w-3" />
                              {item.appliedOfferLabel}
                            </span>
                          )}
                          {item.freeUnits ? (
                            <span className="inline-flex w-fit items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                              <Gift className="mr-1 h-3 w-3" />
                              +{item.freeUnits} Free Unit{item.freeUnits > 1 ? 's' : ''} Included
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>


                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#EDE5DC] rounded-lg sm:rounded-xl bg-white h-8 sm:h-9">
                        <button
                          aria-label={`Decrease quantity of ${item.product.name}`}
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariant, item.variationId)}
                          className="w-8 sm:w-9 h-full flex items-center justify-center text-[#1A1A1A]/70 hover:bg-[#EDE5DC] rounded-l-lg sm:rounded-l-xl transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 sm:w-8 text-center text-[11px] sm:text-xs font-bold text-[#1A1A1A]/90">{item.quantity}</span>
                        <button
                          aria-label={`Increase quantity of ${item.product.name}`}
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariant, item.variationId)}
                          className="w-8 sm:w-9 h-full flex items-center justify-center text-[#1A1A1A]/70 hover:bg-[#EDE5DC] rounded-r-lg sm:rounded-r-xl transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-display font-extrabold text-[13px] sm:text-sm text-[#1A1A1A]">
                        {formatPrice(itemPrice * item.quantity, settings.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer Summary */}
        {cart.length > 0 && (
          <div className="shrink-0 p-4 sm:p-5 border-t border-[#EDE5DC]/80 bg-[#FAF6F2]/50 space-y-2.5 sm:space-y-3 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            {/* Promo Code Input */}
            <div className="space-y-1.5">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    Code: {appliedCoupon.code} (-{formatPrice(couponDiscountAmount, settings.currency)})
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-emerald-900 font-bold text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 top-2 sm:top-2.5 text-[#1A1A1A]/40" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. PLAYFUL10)"
                      value={couponCodeInput}
                      onChange={e => setCouponCodeInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-[13px] sm:text-xs rounded-lg sm:rounded-xl border border-[#EDE5DC] bg-white font-sans focus:outline-none focus:ring-2 focus:ring-[#C48B80] uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-slate-800 text-white font-display font-bold text-[11px] sm:text-xs hover:bg-[#1A1A1A] transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMsg && (
                <p className={`text-[11px] ${couponMsg.success ? 'text-emerald-600' : 'text-[#9C4122]'}`}>
                  {couponMsg.message}
                </p>
              )}
            </div>

            {/* Subtotal & Totals */}
            <div className="space-y-1 text-[11px] sm:space-y-1.5 sm:text-xs text-[#1A1A1A]/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#1A1A1A]/90">{formatPrice(cartSubtotal, settings.currency)}</span>
              </div>

              {routineDiscountAmount > 0 && (
                <div className="flex justify-between gap-3 text-[#9C4122] font-semibold">
                  <span>Routine Savings ({routineDiscountPercent}%)</span>
                  <span>-{formatPrice(routineDiscountAmount, settings.currency)}</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(couponDiscountAmount, settings.currency)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#1A1A1A]/60 text-[11px]">
                <span>Shipping & Taxes</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-[#EDE5DC] text-[#1A1A1A] font-display font-extrabold text-[15px] sm:text-lg">
                <span>Total</span>
                <span className="text-[#9C4122]">{formatPrice(finalTotal, settings.currency)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col gap-2">
              <AnimatedButton
                onClick={() => {
                  trackInitiateCheckout({
                    items: cart.map((item) => ({
                      id: item.product.id,
                      quantity: item.quantity,
                      price: item.resolvedUnitPrice ?? item.product.price,
                    })),
                    value: cartSubtotal,
                    currency: "PKR",
                  });
                  trackTikTokInitiateCheckout({
                    items: cart.map((item) => ({
                      id: item.product.id,
                      quantity: item.quantity,
                      price: item.resolvedUnitPrice ?? item.product.price,
                    })),
                    value: cartSubtotal,
                    currency: "PKR",
                  });
                  setIsCartOpen(false);
                  router.push('/checkout');
                }}
                className="shadow-sm overflow-hidden text-[12px] sm:text-[14px]"
                variant="primary"
                size="full"
              >
                <span className="sm:hidden">CHECKOUT</span>
                <span className="hidden sm:inline">PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </AnimatedButton>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#1A1A1A]/40 font-sans pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>30-Day Happiness Guarantee & Safe Checkout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};





