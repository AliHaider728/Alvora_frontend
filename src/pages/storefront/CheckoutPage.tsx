import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  UserCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { SeoHead } from '../../components/common/SeoHead';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Order } from '../../types';
import { formatPrice, calculateDeliveryFee } from '../../utils/formatters';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    couponDiscountAmount,
    categories,
    settings,
    placeOrder
  } = useStore();
  const { showToast } = useToast();

  // Multi-step state: 1: Shipping & Customer, 2: Payment Review (COD), 3: Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [fullName, setFullName] = useState('Ali Raza');
  const [email, setEmail] = useState('ali.raza@example.com');
  const [phone, setPhone] = useState('+92 300 1234567');
  const [street, setStreet] = useState('House #45, Block C, Gulberg III');
  const [city, setCity] = useState('Lahore');
  const [state, setState] = useState('Punjab');
  const [postalCode, setPostalCode] = useState('54000');
  const [country] = useState('Pakistan');
  const [orderNotes, setOrderNotes] = useState('');

  // Order result state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Calculate highest delivery fee among items or threshold
  let highestDeliveryFee = 0;
  cart.forEach((item) => {
    const flatRate = settings.flatDeliveryRate ?? settings.standardShippingFee;
    const fee = item.product.deliveryChargeType === 'fixed'
      ? (item.product.customDeliveryFee ?? flatRate)
      : (item.product.deliveryChargeType === 'free' ? 0 : flatRate);
    if (fee > highestDeliveryFee) highestDeliveryFee = fee;
  });

  const shippingFee = cartSubtotal >= settings.freeShippingThreshold ? 0 : (highestDeliveryFee || settings.standardShippingFee || 250);
  const taxFee = Math.round(cartSubtotal * settings.taxRate);
  const finalTotal = Math.max(0, cartSubtotal - couponDiscountAmount + shippingFee + taxFee);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && email && phone && street && city) {
      setCurrentStep(2);
    } else {
      showToast('Please fill in all required shipping fields', 'error');
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = placeOrder({
      customerName: fullName,
      email,
      phone,
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images[0],
        selectedVariant: item.selectedVariant
      })),
      subtotal: cartSubtotal,
      discount: couponDiscountAmount,
      shipping: shippingFee,
      total: finalTotal,
      status: 'Pending',
      shippingAddress: {
        fullName,
        phone,
        street,
        city,
        state,
        postalCode,
        country
      },
      paymentMethod: 'Cash on Delivery (COD)',
      trackingNumber: `PB-${Math.floor(10000000 + Math.random() * 90000000)}`
    });

    setCompletedOrder(created);
    setCurrentStep(3);
    showToast('🎉 Order placed successfully with Cash on Delivery!', 'success');
  };

  if (cart.length === 0 && currentStep !== 3) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-black text-2xl text-slate-800 mb-2">Your Basket is Empty</h2>
        <p className="text-sm text-slate-500 mb-6">Add toys to your basket before proceeding to checkout.</p>
        <Link to="/category/all" className="px-6 py-3 rounded-2xl bg-rose-500 text-white font-heading font-bold text-sm">
          Explore Toys & Games
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-8">
      <SeoHead title="Secure Checkout" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Checkout' }]} />

        {/* Step Progress Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-1 z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-black text-xs transition-all ${
                  currentStep >= 1
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {currentStep > 1 ? <Check className="w-5 h-5" /> : 1}
              </div>
              <span className="text-xs font-heading font-bold text-slate-800">Delivery Address</span>
            </div>

            <div className={`flex-1 h-1 mx-2 rounded-full ${currentStep >= 2 ? 'bg-rose-500' : 'bg-slate-200'}`} />

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-1 z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-black text-xs transition-all ${
                  currentStep >= 2
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {currentStep > 2 ? <Check className="w-5 h-5" /> : 2}
              </div>
              <span className="text-xs font-heading font-bold text-slate-800">Cash on Delivery (COD)</span>
            </div>

            <div className={`flex-1 h-1 mx-2 rounded-full ${currentStep === 3 ? 'bg-rose-500' : 'bg-slate-200'}`} />

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-1 z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-black text-xs transition-all ${
                  currentStep === 3
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                3
              </div>
              <span className="text-xs font-heading font-bold text-slate-800">Confirmation</span>
            </div>
          </div>
        </div>

        {/* STEP 3: ORDER CONFIRMATION */}
        {currentStep === 3 && completedOrder ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xl max-w-3xl mx-auto text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <PackageCheck className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-heading font-extrabold text-emerald-600 uppercase tracking-widest">
                Order Placed Successfully!
              </span>
              <h1 className="font-heading font-black text-3xl text-slate-900 mt-1">
                Thank You for Shopping at PlayBimboo!
              </h1>
              <p className="text-sm text-slate-600 mt-2">
                We’ve received your order and sent a confirmation receipt to <strong>{completedOrder.email}</strong>.
              </p>
            </div>

            {/* 24-Hour Cancellation Policy Alert */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3 text-left">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-amber-950">24-Hour Order Cancellation Window:</strong>
                <span>
                  You can cancel or modify this order within 24 hours of placement directly from your account page.
                </span>
              </div>
            </div>

            {/* Order Receipt Box */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold block">Order ID</span>
                  <span className="font-heading font-black text-base text-rose-600">{completedOrder.id}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold block">Tracking Code</span>
                  <span className="font-mono font-bold text-xs text-slate-800">{completedOrder.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold block">Payment Method</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5" />
                    Cash on Delivery (COD)
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-xs text-slate-700 uppercase">Items Ordered:</h4>
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-800 font-medium">
                      {it.quantity}x {it.name} {it.selectedVariant ? `(${it.selectedVariant})` : ''}
                    </span>
                    <span className="font-bold text-slate-900">{formatPrice(it.price * it.quantity, settings.currency)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between font-heading font-black text-slate-900 text-lg">
                <span>Total Payable on Delivery:</span>
                <span className="text-rose-600">{formatPrice(completedOrder.total, settings.currency)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/account"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 text-white font-heading font-bold text-sm shadow-md"
              >
                View Order Status & Cancel (24h Window)
              </Link>
              <Link
                to="/category/all"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-rose-500 text-white font-heading font-bold text-sm shadow-md"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          /* STEP 1 & 2 GRID: FORM + STICKY ORDER SUMMARY */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-7">
              {currentStep === 1 && (
                <form onSubmit={handleShippingSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="font-heading font-black text-xl text-slate-900 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-rose-500" />
                      <span>Delivery Address & Contact</span>
                    </h2>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      Guest or Account Checkout
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ali Raza"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. ali@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone (For COD Delivery) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0300 1234567"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Complete Delivery Street Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="House #, Street name, Sector / Area"
                        value={street}
                        onChange={e => setStreet(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lahore, Karachi, Islamabad"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Province / State</label>
                        <input
                          type="text"
                          value={state}
                          onChange={e => setState(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={e => setPostalCode(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Instructions / Order Notes (Optional)</label>
                      <textarea
                        rows={2}
                        placeholder="Near landmark, call before arrival, etc."
                        value={orderNotes}
                        onChange={e => setOrderNotes(e.target.value)}
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-heading font-extrabold text-base shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Proceed to Cash on Delivery (COD)</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              )}

              {currentStep === 2 && (
                <form onSubmit={handlePaymentSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading font-black text-xl text-slate-900 flex items-center gap-2">
                      <Banknote className="w-6 h-6 text-emerald-600" />
                      <span>Payment Method</span>
                    </h2>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-rose-500 flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" /> Edit Address
                    </button>
                  </div>

                  {/* Strictly Cash on Delivery Only */}
                  <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-500 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Banknote className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-heading font-extrabold text-base text-emerald-950">
                            Cash on Delivery (COD)
                          </h4>
                          <p className="text-xs text-emerald-800">
                            Pay in cash to the rider when your toy package arrives at your doorstep.
                          </p>
                        </div>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span>No advance payment needed! Inspect package upon courier delivery.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-heading font-black text-lg shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <span>Confirm Order & Pay {formatPrice(finalTotal, settings.currency)} on Delivery</span>
                    <Check className="w-6 h-6" />
                  </button>
                </form>
              )}
            </div>

            {/* Sticky Order Summary Column */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-24 space-y-4">
                <h3 className="font-heading font-black text-lg text-slate-900 pb-3 border-b border-slate-100">
                  Order Summary ({cart.length} item(s))
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-12 h-12 object-cover rounded-xl bg-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-xs text-slate-800 truncate">
                          {item.product.name}
                        </h4>
                        <span className="text-xs text-slate-400 block">Qty: {item.quantity} {item.selectedVariant ? `| ${item.selectedVariant}` : ''}</span>
                      </div>
                      <span className="font-heading font-bold text-xs text-slate-900">
                        {formatPrice(item.product.price * item.quantity, settings.currency)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Summary calculation */}
                <div className="space-y-2 text-xs sm:text-sm text-slate-600 pt-3 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-800">{formatPrice(cartSubtotal, settings.currency)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                      <span>-{formatPrice(couponDiscountAmount, settings.currency)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-slate-800">
                      {shippingFee === 0 ? <strong className="text-emerald-600">FREE Shipping</strong> : formatPrice(shippingFee, settings.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span className="font-bold text-slate-800">{formatPrice(taxFee, settings.currency)}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-slate-900 font-heading font-black text-xl">
                    <span>Total Payable</span>
                    <span className="text-rose-600">{formatPrice(finalTotal, settings.currency)}</span>
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

