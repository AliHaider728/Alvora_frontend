import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  MessageSquarePlus,
  Info
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { ProductCard } from '../../components/common/ProductCard';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SeoHead } from '../../components/common/SeoHead';
import { formatPrice } from '../../utils/formatters';
import { api } from '../../services/api';
import { getProductDeliveryType, isProductVisibleOnStorefront } from '../../utils/products';

const getPlainDescription = (description: string) =>
  description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, categories, reviews, addToCart, toggleWishlist, isInWishlist, addReview, settings } = useStore();
  const { showToast } = useToast();

  const product = products.find(
    p => (p.slug === slug || p.id === slug) && isProductVisibleOnStorefront(p)
  );

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'safety' | 'reviews'>('desc');
  const [added, setAdded] = useState(false);

  // Write review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newUserName, setNewUserName] = useState('');

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-heading font-black text-2xl text-slate-800 mb-2">Toy Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The toy you are looking for might have moved to another playhouse.</p>
        <Link to="/category/all" className="px-6 py-3 rounded-2xl bg-rose-500 text-white font-heading font-bold text-sm">
          Explore All Toys
        </Link>
      </div>
    );
  }

  const flatRate = settings.flatDeliveryRate ?? settings.standardShippingFee;
  const productDeliveryType = getProductDeliveryType(product);
  const deliveryFee = productDeliveryType === 'fixed'
    ? (product.customDeliveryFee ?? flatRate)
    : productDeliveryType === 'free'
    ? 0
    : flatRate;

  const isWishlisted = isInWishlist(product.id);
  const productReviews = reviews.filter(r => r.productId === product.id);
  const relatedProducts = products
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  // Calculate variant price offset
  const totalVariantOffset = product.variants
    ? product.variants.reduce((sum, group) => {
        const selectedOptName = selectedVariants[group.name];
        if (!selectedOptName) return sum;
        const foundOpt = group.options.find(o => o.name === selectedOptName);
        return sum + (foundOpt?.priceOffset || 0);
      }, 0)
    : 0;

  const currentPrice = product.price + totalVariantOffset;
  const variantGroups = (product.variants || []).filter(group => group.options.length > 0);
  const allVariantsSelected = variantGroups.every(group => Boolean(selectedVariants[group.name]));
  const selectedVariantOptions = variantGroups
    .map(group => group.options.find(option => option.name === selectedVariants[group.name]))
    .filter(Boolean);
  const selectedVariantStock = selectedVariantOptions.length > 0
    ? Math.min(...selectedVariantOptions.map(option => option!.stockQuantity ?? product.stockQuantity))
    : product.stockQuantity;
  const canPurchase =
    product.inStock &&
    productDeliveryType !== 'none' &&
    allVariantsSelected &&
    selectedVariantStock > 0 &&
    quantity <= selectedVariantStock;

  const handleVariantSelect = (groupName: string, optionName: string) => {
    setSelectedVariants(prev => ({ ...prev, [groupName]: optionName }));
  };

  const formattedVariantString = Object.entries(selectedVariants)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  const handleAddToCart = () => {
    if (!allVariantsSelected) {
      showToast('Please select every product option before adding to cart.', 'error');
      return;
    }
    if (!canPurchase) {
      showToast('This product option is currently out of stock or unavailable for delivery.', 'error');
      return;
    }
    const productToCart = totalVariantOffset ? { ...product, price: currentPrice } : product;
    addToCart(productToCart, quantity, formattedVariantString || undefined);
    setAdded(true);
    showToast(`Added ${quantity} x ${product.name} to cart!`, 'success');
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    if (!isWishlisted) {
      showToast(`Added ${product.name} to Wishlist!`, 'success');
    } else {
      showToast(`Removed from Wishlist`, 'info');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newComment) return;
    try {
      await api.submitReview({
        productId: product.id,
        productName: product.name,
        authorName: newUserName,
        rating: newRating,
        comment: newComment
      });
      addReview({
        productId: product.id,
        userName: newUserName,
        rating: newRating,
        title: newTitle || 'Great toy!',
        comment: newComment,
        verifiedPurchase: true
      });
      showToast('Thank you! Your review has been submitted.', 'success');
    } catch (err) {
      addReview({
        productId: product.id,
        userName: newUserName,
        rating: newRating,
        title: newTitle || 'Great toy!',
        comment: newComment,
        verifiedPurchase: true
      });
      showToast('Thank you! Your review has been submitted.', 'success');
    } finally {
      setReviewModalOpen(false);
      setNewTitle('');
      setNewComment('');
      setNewUserName('');
    }
  };

  const breadcrumbItems = [
    { label: product.category, path: `/category/${product.categorySlug}` },
    { label: product.name }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-6">
      <SeoHead product={product} />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Top Detail Section: Gallery + Product Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Preview Image with Hover Zoom Effect */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 group">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.discountPercent && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white font-heading font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md">
                  -{product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-square w-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIndex === idx ? 'border-rose-500 scale-95 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & Buy Panel */}
          <div className="lg:col-span-6 flex flex-col">
            <div>
              {/* Category & Brand Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-slate-800 font-extrabold">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mb-4 leading-snug">
                {product.name}
              </h1>

              {/* Price & Stock */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading font-black text-3xl text-slate-900">
                      {formatPrice(currentPrice, settings.currency)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-base text-slate-400 line-through font-semibold">
                        {formatPrice(product.originalPrice, settings.currency)}
                      </span>
                    )}
                  </div>
                  {product.discountPercent && (
                    <span className="text-xs font-bold text-emerald-600">
                      You save {formatPrice(product.originalPrice! - currentPrice, settings.currency)} ({product.discountPercent}% discount)
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${
                    canPurchase || (product.inStock && variantGroups.length > 0 && !allVariantsSelected) ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {!product.inStock
                      ? 'Out of Stock'
                      : variantGroups.length > 0 && !allVariantsSelected
                      ? 'Select options to check stock'
                      : `In Stock (${selectedVariantStock} left)`}
                  </span>
                </div>
              </div>

              {/* Delivery Charge Info Badge */}
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 flex items-center gap-2.5 text-sky-900 text-xs font-semibold mb-6">
                <Truck className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>
                  Delivery Fee:{' '}
                  {productDeliveryType === 'none' ? (
                    <strong className="text-rose-600">Delivery unavailable</strong>
                  ) : deliveryFee === 0 ? (
                    <strong className="text-emerald-600">FREE Delivery</strong>
                  ) : (
                    <strong>{formatPrice(deliveryFee, settings.currency)}</strong>
                  )}
                  {productDeliveryType === 'store_threshold' && settings.freeShippingThreshold > 0 && deliveryFee > 0 && (
                    <span className="block sm:inline text-sky-700 font-normal ml-1">
                      (Free delivery on total orders above {formatPrice(settings.freeShippingThreshold, settings.currency)})
                    </span>
                  )}
                </span>
              </div>

              {/* Description snippet */}
              <p className="text-sm text-slate-600 font-sans leading-relaxed mb-6">
                {product.shortDescription || getPlainDescription(product.description).slice(0, 240)}
              </p>

              {/* Product Variants Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 mb-6 pt-4 border-t border-slate-100">
                  {product.variants.map((vGroup) => (
                    <div key={vGroup.id || vGroup.name} className="space-y-2">
                      <label className="text-xs font-heading font-extrabold text-slate-800 uppercase tracking-wider block">
                        Select {vGroup.name}:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {vGroup.options.map((opt) => {
                          const isSelected = selectedVariants[vGroup.name] === opt.name;
                          const isOptionInStock = opt.inStock !== false && (opt.stockQuantity === undefined || opt.stockQuantity > 0);
                          return (
                            <button
                              key={opt.id || opt.name}
                              type="button"
                              disabled={!isOptionInStock}
                              onClick={() => handleVariantSelect(vGroup.name, opt.name)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                !isOptionInStock
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60 line-through'
                                  : isSelected
                                  ? 'bg-rose-500 text-white ring-2 ring-rose-200 shadow-sm'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {opt.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Stepper & Add to Cart */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="font-heading font-bold text-xs text-slate-700 uppercase">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-slate-600 hover:bg-white rounded-xl transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-heading font-bold text-sm text-slate-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-slate-600 hover:bg-white rounded-xl transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart CTA Button with bounce micro-interaction */}
                <button
                  onClick={handleAddToCart}
                  disabled={!canPurchase}
                  className={`w-full py-4 rounded-2xl font-heading font-extrabold text-base shadow-xl flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 ${
                    added
                      ? 'bg-emerald-500 text-white shadow-emerald-200'
                      : !canPurchase
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200/80 hover:scale-[1.01]'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5 animate-bounce" />
                      <span>Added to Basket!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>{!allVariantsSelected ? 'Select Product Options' : `Add to Cart - ${formatPrice(currentPrice * quantity, settings.currency)}`}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Micro Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-center text-slate-500 text-[11px] sm:text-xs">
              <div className="p-2.5 rounded-2xl bg-slate-50">
                <Truck className="w-4 h-4 mx-auto text-sky-500 mb-1" />
                <span>Cash on Delivery</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50">
                <ShieldCheck className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
                <span>100% Child Safe</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50">
                <RotateCcw className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                <span>Easy 7-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-100 shadow-sm mb-12">
          <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-hide gap-4 sm:gap-8 mb-6">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 font-heading font-bold text-xs sm:text-sm uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'desc' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Description & Features
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 font-heading font-bold text-xs sm:text-sm uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'specs' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className={`pb-3 font-heading font-bold text-xs sm:text-sm uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'safety' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Safety & Material Info
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 font-heading font-bold text-xs sm:text-sm uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'reviews' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer Reviews ({productReviews.length})
            </button>
          </div>

          {/* Tab 1: Description & Features */}
          {activeTab === 'desc' && (
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <div
                className="space-y-3 [&_a]:text-sky-600 [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
              <h4 className="font-heading font-bold text-sm text-slate-900 pt-2">Key Highlights:</h4>
              <ul className="space-y-2 list-disc list-inside text-slate-600">
                {product.features.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 2: Specs */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="p-3.5 rounded-2xl bg-slate-50 flex justify-between">
                  <span className="font-bold text-slate-600">{key}:</span>
                  <span className="text-slate-900 font-medium">{val}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Safety */}
          {activeTab === 'safety' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-950 text-sm space-y-2">
              <div className="flex items-center gap-2 font-heading font-bold text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Certified Child-Safe Standards</span>
              </div>
              <p className="text-emerald-900 leading-relaxed">{product.safetyInfo}</p>
            </div>
          )}

          {/* Tab 4: Reviews Section */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50">
                <div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Customer Experience & Reviews
                  </h4>
                  <p className="text-xs text-slate-500">
                    Average score of {product.rating} / 5 based on verified purchases.
                  </p>
                </div>
                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <MessageSquarePlus className="w-4 h-4 text-amber-400" />
                  <span>Write a Review</span>
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {productReviews.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">
                    Be the first parent to review this toy!
                  </p>
                ) : (
                  productReviews.map(rev => (
                    <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-heading font-bold text-xs text-slate-800 block">
                              {rev.userName}
                            </span>
                            <span className="text-[10px] text-slate-400">{rev.date}</span>
                          </div>
                        </div>

                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <h5 className="font-heading font-bold text-xs text-slate-900">{rev.title}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 mb-16">
            <h3 className="font-heading font-black text-2xl text-slate-900">
              You Might Also Love
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl border border-slate-100">
            <h3 className="font-heading font-extrabold text-lg text-slate-900 mb-4">
              Write a Review for {product.name}
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica M."
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rating</label>
                <div className="flex gap-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Kids love it!"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Comments</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details about durability, play value, etc."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-heading font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-heading font-bold text-xs hover:bg-rose-600 shadow-md"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
