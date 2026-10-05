"use client";
import { CartThumbnail } from '../../components/common/CartThumbnail';
import { getCartImageSource } from '../../utils/cartImages';
import { RoutineContents } from '../../components/common/RoutineContents';
import { AnimatedButton } from "../../components/common/AnimatedButton";
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from "next/link";

import {
  Check,
  Truck,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  PackageCheck,
  Banknote,
  Clock,
  UserCheck,
  Minus,
  Plus,
  Tag,
  Gift
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SeoHead } from '../../components/common/SeoHead';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Order } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { validatePakistaniPhone } from '../../utils/validation';
import { getProductDeliveryType } from '../../utils/products';
import { trackInitiateCheckout } from "../../lib/metaPixel";
import { trackTikTokInitiateCheckout, trackTikTokAddPaymentInfo, trackTikTokPurchase, trackTikTokPlaceAnOrder } from "../../lib/tiktokPixel";

type OrderReceipt = Pick<Order, 'id' | 'items' | 'subtotal' | 'discount' | 'shipping' | 'shippingKnown' | 'total' | 'trackingNumber' | 'paymentMethod' | 'email' | 'confirmationEmailSentAt' | 'confirmationEmailAccepted'>;
const receiptStorageKey = 'alvora_checkout_receipt';

const toReceipt = (order: Order): OrderReceipt => ({
  id: order.id,
  items: order.items,
  subtotal: order.subtotal,
  discount: order.discount,
  shipping: order.shipping,
  shippingKnown: order.shippingKnown,
  total: order.total,
  trackingNumber: order.trackingNumber,
  paymentMethod: order.paymentMethod,
  email: order.email,
  confirmationEmailSentAt: order.confirmationEmailSentAt,
  confirmationEmailAccepted: order.confirmationEmailAccepted,
});

export const CheckoutPageClient: React.FC<{ receiptId?: string }> = ({ receiptId }) => {
  const [checkoutRequestId, setCheckoutRequestId] = useState<string>('');
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let existing: string | null = null;
    try { existing = sessionStorage.getItem('pb_checkout_request_id'); } catch {}
    if (existing) {
      setCheckoutRequestId(existing);
    } else {
      const generated = typeof globalThis.crypto?.randomUUID === 'function'
        ? globalThis.crypto.randomUUID()
        : `pb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      try { sessionStorage.setItem('pb_checkout_request_id', generated); } catch {}
      setCheckoutRequestId(generated);
    }
  }, []);
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    couponDiscountAmount,
    routineDiscountAmount,
    routineDiscountPercent,
    categories,
    products,
    settings,
    placeOrder,
    updateCartQuantity
  } = useStore();
  const { showToast } = useToast();
  const { customerProfile } = useAuth();

  useEffect(() => {
    if (cart.length === 0) return;
    trackInitiateCheckout({
      items: cart.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
      })),
      value: cartSubtotal,
      currency: "PKR",
    });
    trackTikTokInitiateCheckout({
      items: cart.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
      })),
      value: cartSubtotal,
      currency: "PKR",
    });
  }, []);

  // Multi-step state: 1: Shipping & Customer, 2: Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (customerProfile) {
      setEmail(prev => prev || customerProfile.email || '');
      setFullName(prev => prev || customerProfile.name || '');
    }
  }, [customerProfile]);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country] = useState('Pakistan');
  const [orderNotes, setOrderNotes] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Order result state
  const [completedOrder, setCompletedOrder] = useState<OrderReceipt | null>(null);
  const [receiptChecked, setReceiptChecked] = useState(!receiptId);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (!receiptId) return;
    try {
      const saved = sessionStorage.getItem(receiptStorageKey);
      const receipt = saved ? JSON.parse(saved) as OrderReceipt : null;
      if (receipt?.id === receiptId && Array.isArray(receipt.items) &&
          Number.isFinite(receipt.subtotal) && Number.isFinite(receipt.total)) {
        setCompletedOrder(receipt);
        setCurrentStep(2);
      }
    } catch {
      // A missing or invalid tab receipt must never create a new order.
    } finally {
      setReceiptChecked(true);
    }
  }, [receiptId]);

  useLayoutEffect(() => {
    if (currentStep !== 2 || !completedOrder) return;
    const previousBehavior = document.documentElement.style.scrollBehavior;
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    successHeadingRef.current?.focus({ preventScroll: true });
    document.documentElement.style.scrollBehavior = previousBehavior;
    return () => { window.history.scrollRestoration = previousRestoration; };
  }, [currentStep, completedOrder?.id]);

  // Product overrides take priority; otherwise the store threshold applies.
  let highestOverrideFee = 0;
  let hasShippingOverride = false;
  let hasDefaultShippingItem = false;
  let deliveryUnavailable = false;
  const deliveryItems = cart.flatMap(item => item.routineComponents?.length
    ? item.routineComponents.map(component => ({ product: products.find(product => product.id === component.productId) }))
    : [{ product: item.product }]);
  deliveryItems.forEach((item) => {
    const product = item.product;
    if (!product) { deliveryUnavailable = true; return; }
    const flatRate = settings.flatDeliveryRate ?? settings.standardShippingFee;
    const deliveryType = getProductDeliveryType(product);
    if (deliveryType === 'none') {
      deliveryUnavailable = true;
      return;
    }
    if (deliveryType === 'fixed') {
      hasShippingOverride = true;
      highestOverrideFee = Math.max(highestOverrideFee, Number(product.customDeliveryFee) || flatRate);
      return;
    }
    if (deliveryType === 'free') {
      return;
    }
    if (deliveryType === 'category') {
      const category = categories.find(candidate => candidate.slug === (product.categorySlug || ''));
      const categoryType = category?.deliveryType || category?.deliveryChargeType;
      if (categoryType === 'none') {
        deliveryUnavailable = true;
      } else if (categoryType === 'free') {
        return;
      } else if (categoryType === 'fixed' || category?.deliveryCharge !== undefined) {
        const categoryFee = category ? Number(category.customDeliveryFee ?? category.deliveryFee ?? category.deliveryCharge ?? flatRate) : flatRate;
        hasShippingOverride = true;
        highestOverrideFee = Math.max(highestOverrideFee, categoryFee || flatRate);
      } else {
        hasDefaultShippingItem = true;
      }
      return;
    }
    hasDefaultShippingItem = true;
  });

  const defaultShippingFee =
    hasDefaultShippingItem && cartSubtotal < settings.freeShippingThreshold
      ? settings.standardShippingFee || 250
      : 0;
  let shippingFee = Math.max(hasShippingOverride ? highestOverrideFee : 0, defaultShippingFee);
  if (cartSubtotal >= settings.freeShippingThreshold) {
    shippingFee = 0;
  }
  const taxFee = Math.round(cartSubtotal * settings.taxRate);
  const finalTotal = Math.max(0, cartSubtotal - couponDiscountAmount - routineDiscountAmount + shippingFee + taxFee);

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    let errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = "Full name is required";
    if (!phone.trim()) errors.phone = "Phone number is required";
    if (!street.trim()) errors.street = "Street address is required";
    if (!city.trim()) errors.city = "City is required";

    if (deliveryUnavailable) {
      showToast('One or more products are not available for delivery.', 'error');
      return;
    }

    let finalPhone = phone;
    if (phone.trim()) {
      const phoneValidation = validatePakistaniPhone(phone);
      if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error || "Invalid phone number";
      } else {
        finalPhone = phoneValidation.normalized || phone;
        setPhone(finalPhone);
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast('Please correct the errors in the form before proceeding.', 'error');
      return;
    }

    await handlePaymentSubmit(finalPhone);
  };

  const handlePaymentSubmit = async (finalPhoneOverride?: string) => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    
    trackTikTokAddPaymentInfo();

    let orderError = '';
    const created = await placeOrder({
      customerName: fullName.trim(),
      email: email.trim(),
      phone: (finalPhoneOverride || phone.trim()),
      items: cart.map(item => {
        let price = item.product.price;
        let image = item.product.images[0];
        let sku = item.product.sku;
        let attributes: Record<string, string> | undefined = undefined;

        if (item.product.productType === 'variable' && item.variationId) {
           const variation = item.product.variations?.find(v => String(v.id) === String(item.variationId));
           if (variation) {
             price = variation.salePrice !== undefined && variation.salePrice !== null ? variation.salePrice : variation.regularPrice;
             if (variation.image?.url) image = variation.image.url;
             if (variation.sku) sku = variation.sku;
             attributes = variation.attributes;
           }
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
           price += variantOffset;
        }

        return {
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.resolvedUnitPrice ?? price,
          image: image,
          selectedVariant: item.selectedVariant,
          variationId: item.variationId,
          productType: item.product.productType || 'simple',
            isRoutine: item.isRoutine,
          routineComponents: item.routineComponents,
          sku: sku,
          selectedAttributes: attributes
        };
      }),
      subtotal: cartSubtotal,
      discount: couponDiscountAmount + routineDiscountAmount,
      shipping: shippingFee,
      total: finalTotal,
      status: 'Pending',
      shippingAddress: {
        fullName: fullName.trim(),
        phone: finalPhoneOverride || phone.trim(),
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country
      },
      paymentMethod: 'Cash on Delivery (COD)',
      trackingNumber: `PB-${Math.floor(10000000 + Math.random() * 90000000)}`,
      checkoutRequestId
    }, error => { orderError = error; });

    setIsPlacingOrder(false);
    if (!created) {
      const message = /failed to fetch|networkerror|load failed|aborterror|request failed after/i.test(orderError)
        ? 'Connection problem. Check your internet and try placing the order again.'
        : orderError || 'The order could not be placed. Please try again.';
      showToast(message, 'error');
      return;
    }


    // Meta Pixel - Purchase
    const metaEventId = `purchase_${created.id}`;

    if (typeof window !== "undefined" && window.fbq) {
      try {
        window.fbq(
          "track",
          "Purchase",
          {
            content_ids: created.items.map((item) => item.productId),

            contents: created.items.map((item) => ({
              id: item.productId,
              quantity: item.quantity,
              item_price: item.price,
            })),

            content_type: "product",

            num_items: created.items.reduce(
              (total, item) => total + item.quantity,
              0
            ),

            value: created.total,
            currency: "PKR",
          }, { eventID: metaEventId });
      } catch (err) {
        console.error("Meta Pixel tracking error:", err);
      }
    }
    try {
      trackTikTokPlaceAnOrder({
        items: created.items.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
        })),
        value: created.total,
        currency: "PKR",
        eventId: metaEventId,
      });

      trackTikTokPurchase({
        items: created.items.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
        })),
        value: created.total,
        currency: "PKR",
        eventId: metaEventId,
      });
    } catch (err) {
      console.error("TikTok tracking error:", err);
    }

    if (typeof window !== "undefined" && (window as any).gtag) {
      try {
        (window as any).gtag("event", "purchase", {
          transaction_id: created.id,
          value: created.total,
          currency: "PKR",
          items: created.items.map((item) => ({
            item_id: item.productId,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        });
      } catch (err) {
        console.error("GA4 tracking error:", err);
      }
    }

    try { sessionStorage.removeItem('pb_checkout_request_id'); } catch {}
    const receipt = toReceipt(created);
    try {
      sessionStorage.setItem(receiptStorageKey, JSON.stringify(receipt));
      const url = new URL(window.location.href);
      url.searchParams.set('order', receipt.id);
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    } catch {
      // The current confirmation remains available even if tab storage is blocked.
    }
    setCompletedOrder(receipt);
    setCurrentStep(2);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    showToast(!email.trim() ? 'Order confirmed successfully.' : 'Order confirmed. A confirmation email has been sent.', 'success');
  };

  if (!receiptChecked) {
    return <div className="min-h-[60vh] bg-[#FAF6F2] p-6 text-center text-sm text-[#1A1A1A]/70">Loading your order receipt…</div>;
  }

  if (cart.length === 0 && currentStep !== 2) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F5EDE4] text-[#C48B80] flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-display font-black text-2xl text-[#1A1A1A]/90 mb-2">Your Basket is Empty</h2>
        <p className="text-sm text-[#1A1A1A]/60 mb-6">Add items to your bag before proceeding to checkout.</p>
        <Link href="/category/all" className="px-6 py-3 rounded-full bg-[#1A1A1A] text-white tracking-widest font-display font-bold text-sm">
          Explore Bestsellers
        </Link>
      </div>
    );
  }

  const showSuccess = currentStep === 2 && Boolean(completedOrder);

  return (
    <div className="min-h-screen bg-[#FAF6F2] font-sans py-5 sm:py-8">
      <SeoHead title="Secure Checkout" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showSuccess && <Breadcrumbs items={[{ label: 'Checkout' }]} />}

        {/* Step Progress Bar */}
        {!showSuccess && <div className="bg-white rounded-3xl px-3 py-5 sm:p-6 border border-[#EDE5DC] shadow-sm mb-6 sm:mb-8 overflow-hidden">
          <div className="flex items-start justify-between max-w-2xl mx-auto relative">
            {/* Step 1 */}
            <div className="flex w-[72px] shrink-0 flex-col items-center gap-1 z-10 sm:w-auto">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-display font-black text-xs transition-all ${
                  currentStep >= 1
                    ? 'bg-[#1A1A1A] text-white shadow-md shadow-rose-200'
                    : 'bg-[#EDE5DC] text-[#1A1A1A]/40'
                }`}
              >
                {currentStep > 1 ? <Check className="w-5 h-5" /> : 1}
              </div>
              <span className="text-center text-[10px] leading-tight sm:text-xs font-display font-bold text-[#1A1A1A]/90">Delivery Address</span>
            </div>

            <div className={`mt-3.5 sm:mt-[18px] min-w-2 flex-1 h-1 mx-1 sm:mx-2 rounded-full ${currentStep === 2 ? 'bg-[#1A1A1A]' : 'bg-slate-200'}`} />

            {/* Step 2 */}
            <div className="flex w-[72px] shrink-0 flex-col items-center gap-1 z-10 sm:w-auto">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-display font-black text-xs transition-all ${
                  currentStep === 2
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                    : 'bg-[#EDE5DC] text-[#1A1A1A]/40'
                }`}
              >
                2
              </div>
              <span className="text-center text-[10px] leading-tight sm:text-xs font-display font-bold text-[#1A1A1A]/90">Confirmation</span>
            </div>
          </div>
        </div>}

        {/* STEP 2: ORDER CONFIRMATION */}
        {currentStep === 2 && completedOrder ? (
          <div className="bg-white rounded-2xl p-4 sm:p-8 border border-[#EDE5DC] shadow-lg max-w-2xl mx-auto text-center space-y-4 sm:space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <PackageCheck className="w-8 h-8" />
            </div>

            <div>
              <span role="status" className="text-[11px] font-display font-extrabold text-emerald-600 uppercase tracking-wider sm:tracking-widest">
                Order Placed Successfully!
              </span>
              <h1 ref={successHeadingRef} tabIndex={-1} className="font-display font-black text-[clamp(1.45rem,5vw,2rem)] leading-tight text-[#1A1A1A] mt-1 outline-none">
                Thank You for Shopping at Alvora Skincare!
              </h1>
              <p className="text-sm leading-relaxed text-[#1A1A1A]/70 mt-2">
                {!completedOrder.email ? <>Your order is safely recorded. Our team will contact you before dispatch.</> : <>We've received your order and sent a confirmation receipt to <strong>{completedOrder.email}</strong>.</>}
              </p>
            </div>

            {/* Order Receipt Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#FAF6F2] border border-[#EDE5DC]/80 text-left space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#EDE5DC] pb-3">
                <div className="min-w-0">
                  <span className="text-xs text-[#1A1A1A]/40 uppercase font-bold block">Order ID</span>
                  <span className="block break-all font-display font-black text-sm text-[#9C4122] sm:text-base">{completedOrder.id}</span>
                </div>
                {completedOrder.trackingNumber?.trim() && <div>
                  <span className="text-xs text-[#1A1A1A]/40 uppercase font-bold block">Tracking Code</span>
                  <span className="font-mono font-bold text-xs text-[#1A1A1A]/90">{completedOrder.trackingNumber}</span>
                </div>}
                <div>
                  <span className="text-xs text-[#1A1A1A]/40 uppercase font-bold block">Payment Method</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5" />
                    Cash on Delivery (COD)
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-2">
                <h4 className="font-display font-bold text-xs text-[#1A1A1A]/80 uppercase">Items Ordered:</h4>
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 text-sm">
                    <span className="min-w-0 break-words text-[#1A1A1A]/90 font-medium">
                      {it.quantity}x {it.name} {it.selectedVariant ? `(${it.selectedVariant})` : ''}<RoutineContents components={it.routineComponents} />
                    </span>
                    <span className="shrink-0 font-bold text-[#1A1A1A]">{formatPrice(it.price * it.quantity, settings.currency)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-[#EDE5DC] pt-3 text-sm text-[#1A1A1A]/80">
                <div className="flex items-start justify-between gap-3">
                  <span>Items Subtotal</span>
                  <span className="shrink-0 font-bold text-[#1A1A1A]">{Number.isFinite(completedOrder.subtotal) ? formatPrice(completedOrder.subtotal, settings.currency) : 'Unavailable'}</span>
                </div>
                {completedOrder.discount > 0 && <div className="flex items-start justify-between gap-3 text-[#9C4122]">
                  <span>Discount</span>
                  <span className="shrink-0 font-bold">−{formatPrice(completedOrder.discount, settings.currency)}</span>
                </div>}
                <div className="flex items-start justify-between gap-3">
                  <span>Shipping Charges</span>
                  <span className="shrink-0 font-bold text-[#1A1A1A]">{completedOrder.shippingKnown && Number.isFinite(completedOrder.shipping)
                    ? completedOrder.shipping === 0 ? 'Free' : formatPrice(completedOrder.shipping, settings.currency)
                    : 'Unavailable'}</span>
                </div>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 border-t border-[#EDE5DC] pt-3 font-display font-black text-[#1A1A1A] text-base sm:text-lg">
                <span>Total Payable on Delivery:</span>
                <span className="whitespace-nowrap text-[#9C4122]">{Number.isFinite(completedOrder.total) ? formatPrice(completedOrder.total, settings.currency) : 'Unavailable'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {completedOrder.email && (
                <Link href="/account"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1A1A1A] text-white tracking-widest font-display font-bold text-sm shadow-md"
                >
                  Track Order & Account
                </Link>
              )}
              <Link href="/category/all"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1A1A1A] text-white tracking-widest font-display font-bold text-sm shadow-md"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          /* STEP 1 & 2 GRID: FORM + STICKY ORDER SUMMARY */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              {currentStep === 1 && (
                <form onSubmit={handleShippingSubmit} className="bg-white rounded-3xl p-4 sm:p-8 border border-[#EDE5DC] shadow-sm space-y-6">
                  <div className="flex flex-col items-start gap-3 border-b border-[#EDE5DC] pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-display font-black text-xl text-[#1A1A1A] flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#9C4122]" />
                      <span>Delivery Address & Contact</span>
                    </h2>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      Guest or Account Checkout
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-[#1A1A1A]/80 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ali Raza"
                        value={fullName}
                          onChange={e => { setFullName(e.target.value); setFieldErrors(p => ({...p, fullName: ''})); }}
                          className={`w-full px-4 py-2.5 text-base sm:text-sm rounded-xl border ${fieldErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-[#EDE5DC] focus:ring-[#C48B80]'} font-sans focus:outline-none focus:ring-2`}
                        />
                        {fieldErrors.fullName && <p className="text-red-500 text-xs mt-1 font-sans">{fieldErrors.fullName}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#1A1A1A]/80 block mb-1">Mobile Phone (For COD Delivery) *</label>
                      <input
                        type="tel"
                        required
                        inputMode="tel"
                        placeholder="e.g. +923001234567 or 03001234567"
                          value={phone}
                          onChange={e => { setPhone(e.target.value); setFieldErrors(p => ({...p, phone: ''})); }}
                          className={`w-full px-4 py-2.5 text-base sm:text-sm rounded-xl border ${fieldErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-[#EDE5DC] focus:ring-[#C48B80]'} font-sans focus:outline-none focus:ring-2`}
                        />
                        {fieldErrors.phone && <p className="text-red-500 text-xs mt-1 font-sans">{fieldErrors.phone}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-[#1A1A1A]/80 block mb-1">Complete Delivery Street Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="House #, Street name, Sector / Area"
                        value={street}
                        onChange={e => { setStreet(e.target.value); setFieldErrors(p => ({...p, street: ''})); }}
                        className={`w-full px-4 py-2.5 text-base sm:text-sm rounded-xl border ${fieldErrors.street ? 'border-red-500 focus:ring-red-500' : 'border-[#EDE5DC] focus:ring-[#C48B80]'} font-sans focus:outline-none focus:ring-2`}
                      />
                      {fieldErrors.street && <p className="text-red-500 text-xs mt-1 font-sans">{fieldErrors.street}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#1A1A1A]/80 block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Gujranwala, Karachi, Islamabad"
                        value={city}
                          onChange={e => { setCity(e.target.value); setFieldErrors(p => ({...p, city: ''})); }}
                          className={`w-full px-4 py-2.5 text-base sm:text-sm rounded-xl border ${fieldErrors.city ? 'border-red-500 focus:ring-red-500' : 'border-[#EDE5DC] focus:ring-[#C48B80]'} font-sans focus:outline-none focus:ring-2`}
                        />
                        {fieldErrors.city && <p className="text-red-500 text-xs mt-1 font-sans">{fieldErrors.city}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2">
                      <div>
                        <label className="text-xs font-bold text-[#1A1A1A]/80 block mb-1">Province (Optional)</label>
                        <input
                          type="text"
                          value={state}
                          onChange={e => setState(e.target.value)}
                          className="w-full px-3 py-2.5 text-base sm:text-sm rounded-xl border border-[#EDE5DC] font-sans focus:outline-none focus:ring-2 focus:ring-[#C48B80]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#1A1A1A]/80 block mb-1">Postal Code (Optional)</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={postalCode}
                          onChange={e => setPostalCode(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full px-3 py-2.5 text-base sm:text-sm rounded-xl border border-[#EDE5DC] font-sans focus:outline-none focus:ring-2 focus:ring-[#C48B80]"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-[#1A1A1A]/80 block mb-1">Delivery Instructions / Order Notes (Optional)</label>
                      <textarea
                        rows={2}
                        placeholder="Near landmark, call before arrival, etc."
                        value={orderNotes}
                        onChange={e => setOrderNotes(e.target.value)}
                        className="w-full px-4 py-2 text-base sm:text-sm rounded-xl border border-[#EDE5DC] font-sans focus:outline-none focus:ring-2 focus:ring-[#C48B80]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-[#1A1A1A]/80 block mb-1">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="e.g. ali@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 text-base sm:text-sm rounded-xl border border-[#EDE5DC] font-sans focus:outline-none focus:ring-2 focus:ring-[#C48B80]"
                      />
                    </div>
                  </div>

                  <AnimatedButton
                    type="submit"
                    disabled={isPlacingOrder}
                    variant="primary"
                    size="full"
                    className="py-4 text-lg"
                  >
                    <span>{isPlacingOrder ? 'Placing Order…' : `Confirm Order & Pay ${formatPrice(finalTotal, settings.currency)} on Delivery`}</span>
                    {isPlacingOrder ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent ml-2" /> : <Check className="w-6 h-6 ml-2" />}
                  </AnimatedButton>
                </form>
              )}

            </div>

            {/* Sticky Order Summary Column */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EDE5DC] shadow-sm lg:sticky lg:top-24 space-y-4">
                <h3 className="font-display font-black text-lg text-[#1A1A1A] pb-3 border-b border-[#EDE5DC]">
                  Order Summary ({cart.length} item(s))
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map(item => {
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
                      <div key={`${item.product.id}-${item.variationId || item.selectedVariant || ''}`} className="flex items-start gap-3 rounded-2xl border border-[#EDE5DC] bg-[#FAF6F2]/60 p-2.5">
                        <CartThumbnail src={getCartImageSource(item.product, item.variationId)} alt={variation?.image?.alt || item.product.name} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-bold text-xs text-[#1A1A1A]/90 truncate">
                          {item.product.name}
                        </h4>
                        <RoutineContents components={item.routineComponents} />
                        {item.routineComponents && <p className="mt-1 text-xs text-[#9C4122]">{item.routineDiscountPercent}% routine savings included</p>}
                        {variation && (
                          <div className="mt-0.5 flex flex-wrap gap-1">
                            {Object.entries(variation.attributes).map(([key, val]) => (
                              <span key={key} className="text-[9px] font-bold text-[#1A1A1A]/60 bg-[#EDE5DC] px-1.5 py-0.5 rounded">
                                {val}
                              </span>
                            ))}
                          </div>
                        )}
                        {!variation && item.selectedVariant && (
                           <span className="text-xs text-[#1A1A1A]/40 block truncate">{item.selectedVariant}</span>
                        )}

                        {/* Pricing Offer Badges */}
                        {!!(item.appliedOfferLabel || item.freeUnits) && (
                          <div className="mt-1 flex flex-col gap-1">
                            {item.appliedOfferLabel && (
                              <span className="inline-flex w-fit items-center rounded bg-[#F5EDE4] px-1.5 py-0.5 text-[9px] font-bold text-[#9C4122]">
                                <Tag className="mr-1 h-3 w-3" />
                                {item.appliedOfferLabel}
                              </span>
                            )}
                            {item.freeUnits ? (
                              <span className="inline-flex w-fit items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                                <Gift className="mr-1 h-3 w-3" />
                                +{item.freeUnits} Free Unit{item.freeUnits > 1 ? 's' : ''}
                              </span>
                            ) : null}
                          </div>
                        )}

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">

                          <div className="flex items-center rounded-xl border border-[#EDE5DC] bg-white">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariant, item.variationId)}
                              aria-label={`Decrease quantity of ${item.product.name}`}
                              className="rounded-l-2xl p-1.5 text-[#1A1A1A]/70 transition-colors hover:bg-[#EDE5DC]"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-7 px-1 text-center text-xs font-bold text-[#1A1A1A]/90">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariant, item.variationId)}
                              aria-label={`Increase quantity of ${item.product.name}`}
                              className="rounded-r-2xl p-1.5 text-[#1A1A1A]/70 transition-colors hover:bg-[#EDE5DC]"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-display font-bold text-xs text-[#1A1A1A]">
                            {formatPrice(itemPrice * item.quantity, settings.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );})}
                </div>

                {/* Summary calculation */}
                <div className="space-y-2 text-xs sm:text-sm text-[#1A1A1A]/70 pt-3 border-t border-[#EDE5DC]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#1A1A1A]/90">{formatPrice(cartSubtotal, settings.currency)}</span>
                  </div>

                  {routineDiscountAmount > 0 && (
                    <div className="flex justify-between gap-3 font-semibold text-[#9C4122]">
                      <span>Routine Savings ({routineDiscountPercent}%)</span>
                      <span>-{formatPrice(routineDiscountAmount, settings.currency)}</span>
                    </div>
                  )}
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                      <span>-{formatPrice(couponDiscountAmount, settings.currency)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-[#1A1A1A]/90">
                      {shippingFee === 0 ? <strong className="text-emerald-600">FREE Shipping</strong> : formatPrice(shippingFee, settings.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span className="font-bold text-[#1A1A1A]/90">{formatPrice(taxFee, settings.currency)}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-[#EDE5DC] text-[#1A1A1A] font-display font-black text-xl">
                    <span>Total Payable</span>
                    <span className="text-[#9C4122]">{formatPrice(finalTotal, settings.currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
