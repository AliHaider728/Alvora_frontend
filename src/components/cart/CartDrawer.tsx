import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';

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
    settings
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; message: string } | null>(null);

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput) return;
    const res = applyCoupon(couponCodeInput);
    setCouponMsg(res);
    if (res.success) {
      setCouponCodeInput('');
    }
  };

  const finalTotal = Math.max(0, cartSubtotal - couponDiscountAmount);
  const freeShippingNeeded = Math.max(0, settings.freeShippingThreshold - cartSubtotal);
  const shippingProgress = Math.min(100, (cartSubtotal / settings.freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-[85vw] max-w-md bg-white shadow-2xl flex flex-col justify-between rounded-l-3xl overflow-hidden border-l border-slate-100">
          {/* Drawer Header */}
          <div className="p-5 bg-gradient-to-r from-amber-50 via-rose-50 to-sky-50 border-b border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-500 text-white rounded-2xl shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-lg text-slate-900">Your Toy Basket</h2>
                <p className="text-xs text-slate-500 font-sans">
                  {cart.length === 0 ? 'Basket is currently empty' : `${cart.length} item(s) ready for fun`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-white text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="bg-amber-50/70 border-b border-amber-100 p-3 px-5">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1.5">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {freeShippingNeeded === 0 ? (
                    <span className="text-emerald-700 font-bold">🎉 You qualify for FREE Shipping!</span>
                  ) : (
                    <span>Add <strong className="text-rose-600">{formatPrice(freeShippingNeeded)}</strong> more for FREE Shipping</span>
                  )}
                </span>
              </div>
              <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-rose-500 h-full transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-300 mb-4 animate-bounce">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-heading font-bold text-lg text-slate-700 mb-1">Your Basket is Empty</h3>
                <p className="text-xs text-slate-500 mb-6 max-w-xs">
                  Discover our magical collection of toys, action figures, and educational games!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 rounded-2xl bg-rose-500 text-white font-heading font-bold text-sm hover:bg-rose-600 shadow-md transition-all"
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
                if (variation) {
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
                  className="flex gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl bg-white flex-shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-heading font-bold text-xs sm:text-sm text-slate-800 hover:text-rose-500 line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant, item.variationId)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[10px] text-sky-600 font-semibold uppercase block">
                        {item.product.category}
                      </span>
                      
                      {variation && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Object.entries(variation.attributes).map(([key, val]) => (
                            <span key={key} className="text-[9px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                              {val}
                            </span>
                          ))}
                        </div>
                      )}
                      {!variation && item.selectedVariant && (
                        <span className="text-[10px] text-slate-500 block mt-1">
                          {item.selectedVariant}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariant, item.variationId)}
                          className="p-1 sm:p-1.5 text-slate-600 hover:bg-slate-100 rounded-l-xl transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariant, item.variationId)}
                          className="p-1 sm:p-1.5 text-slate-600 hover:bg-slate-100 rounded-r-xl transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-heading font-extrabold text-sm text-slate-900">
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
            <div className="p-5 border-t border-slate-200/80 bg-slate-50/50 space-y-3">
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
                      <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Promo code (e.g. PLAYFUL10)"
                        value={couponCodeInput}
                        onChange={e => setCouponCodeInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-base sm:text-xs rounded-xl border border-slate-200 bg-white font-sans focus:outline-none focus:ring-2 focus:ring-rose-400 uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-slate-800 text-white font-heading font-bold text-xs hover:bg-slate-900 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponMsg && (
                  <p className={`text-[11px] ${couponMsg.success ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {couponMsg.message}
                  </p>
                )}
              </div>

              {/* Subtotal & Totals */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">{formatPrice(cartSubtotal, settings.currency)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(couponDiscountAmount, settings.currency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Shipping & Taxes</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-slate-900 font-heading font-extrabold text-base sm:text-lg">
                  <span>Total</span>
                  <span className="text-rose-600">{formatPrice(finalTotal, settings.currency)}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-heading font-extrabold text-sm shadow-lg shadow-rose-200/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-sans pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>30-Day Happiness Guarantee & Safe Checkout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
