import React, { useEffect, useState } from 'react';
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
import { ReviewSummary } from '../../components/common/ReviewSummary';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SeoHead } from '../../components/common/SeoHead';
import { formatPrice } from '../../utils/formatters';
import { api, getLastApiError } from '../../services/api';
import {
  getEffectiveAvailableQuantity,
  getEffectiveProductAvailability,
  getProductAgeGroups,
  getProductDeliveryType,
  isProductVisibleOnStorefront,
  isVariantOptionAvailable
} from '../../utils/products';
import { ProductDetailContent } from '../../components/product/ProductDetailContent';
import { Review } from '../../types';
import { getSafeImageSrc } from '../../utils/images';

const getPlainDescription = (description: string) =>
  description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, addToCart, toggleWishlist, isInWishlist, refreshProducts, settings, submitCustomerReview } = useStore();
  const { showToast } = useToast();

  const product = products.find(
    p => (p.slug === slug || p.id === slug) && isProductVisibleOnStorefront(p)
  );

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [overrideImage, setOverrideImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'safety' | 'reviews'>('desc');
  const [added, setAdded] = useState(false);

  // Write review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [sizeGuideModalOpen, setSizeGuideModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [productReviews, setProductReviews] = useState<Review[]>([]);

  const loadProductReviews = async (productId: string) => {
    const result = await api.getProductReviews(productId);
    if (!result) return;
    setProductReviews(result.map(review => ({
      ...review,
      id: String(review.id || review._id || ''),
      productId: String(review.productId || productId),
      reviewerName: String(review.reviewerName || review.authorName || 'PlayBimboo customer'),
      rating: Number(review.rating || 0),
      createdAt: String((review as any).createdAt || (review as any).date || '').slice(0, 10),
      title: String(review.title || ''),
      status: review.status || 'approved',
      content: String(review.content || review.comment || ''),
      verifiedPurchase: Boolean(review.verifiedPurchase),
      source: review.source || 'customer'
    })));
  };

  useEffect(() => {
    if (product?.id) void loadProductReviews(product.id);
  }, [product?.id]);

  const hasDesc = Boolean(product?.productDetailBlocks?.length || product?.description || product?.productDetailCustomCss);
  const hasSpecs = Boolean(Object.keys(product?.specifications || {}).length > 0 || (product?.productType === 'variable' && product?.attributes?.some(a => a.visible && a.terms?.length)));
  const hasSafety = Boolean(product?.ageGroups?.length || product?.safetyWarnings?.length);
  const approvedReviews = productReviews.filter(r => r.status === 'approved');
  const hasReviews = Boolean(approvedReviews.length > 0);
  
  const availableTabs = [
    hasDesc && 'desc',
    hasSpecs && 'specs',
    hasSafety && 'safety',
    hasReviews && 'reviews'
  ].filter(Boolean) as string[];

  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0] as any);
    }
  }, [hasDesc, hasSpecs, hasSafety, hasReviews, activeTab]);

  // Size Guide Focus Trap
  const sizeGuideRef = React.useRef<HTMLDivElement>(null);
  const sizeGuideTriggerRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (sizeGuideModalOpen) {
      const modal = sizeGuideRef.current;
      if (!modal) return;
      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      modal.addEventListener('keydown', handleKeyDown);
      firstElement?.focus();
      document.body.style.overflow = 'hidden';

      return () => {
        modal.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        sizeGuideTriggerRef.current?.focus();
      };
    }
  }, [sizeGuideModalOpen]);

  useEffect(() => {
    if (product?.productType === 'variable' && product.defaultAttributes) {
      setSelectedAttributes(product.defaultAttributes);
    }
  }, [product?.id]);

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
  const relatedProducts = products
    .filter(p => Boolean(product.categorySlug) && p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const isVariable = product.productType === 'variable';

  // Find active variation
  const currentVariation = isVariable
    ? product.variations?.find(v => {
        if (!v.enabled) return false;
        return Object.entries(selectedAttributes).every(([key, val]) => v.attributes[key] === val);
      })
    : undefined;

  let currentPrice = product.price;
  let currentOriginalPrice = product.originalPrice;
  let totalVariantOffset = 0;

  if (isVariable) {
    if (currentVariation) {
      currentPrice = currentVariation.salePrice !== undefined && currentVariation.salePrice !== null ? currentVariation.salePrice : currentVariation.regularPrice;
      currentOriginalPrice = currentVariation.salePrice !== undefined && currentVariation.salePrice !== null ? currentVariation.regularPrice : undefined;
    } else {
       // Find minimum price for 'From Rs. X' display later
       const allPrices = (product.variations || []).map(v => v.salePrice !== undefined && v.salePrice !== null ? v.salePrice : v.regularPrice);
       currentPrice = allPrices.length > 0 ? Math.min(...allPrices) : product.price;
    }
  } else {
    totalVariantOffset = product.variants
      ? product.variants.reduce((sum, group) => {
          const selectedOptName = selectedVariants[group.name];
          if (!selectedOptName) return sum;
          const foundOpt = group.options.find(o => o.name === selectedOptName);
          return sum + (foundOpt?.priceOffset || 0);
        }, 0)
      : 0;
    currentPrice = product.price + totalVariantOffset;
  }

  const variantGroups = (product.variants || []).filter(group => group.options.length > 0);
  const allVariantsSelected = isVariable
    ? (product.attributes || []).every(attr => Boolean(selectedAttributes[attr.slug]))
    : variantGroups.every(group => Boolean(selectedVariants[group.name]));

  const effectiveAvailable = isVariable
    ? (currentVariation ? (currentVariation.manageStock ? (currentVariation.stockQuantity || 0) > 0 : true) : false)
    : getEffectiveProductAvailability(product, selectedVariants);

  const selectedVariantStock = isVariable
    ? (currentVariation?.manageStock ? (currentVariation.stockQuantity ?? undefined) : undefined)
    : getEffectiveAvailableQuantity(product, selectedVariants);

  const canPurchase =
    effectiveAvailable &&
    productDeliveryType !== 'none' &&
    allVariantsSelected &&
    (selectedVariantStock === undefined || quantity <= selectedVariantStock);

  const handleVariantSelect = (groupName: string, optionName: string) => {
    setSelectedVariants(prev => ({ ...prev, [groupName]: optionName }));
  };

  const handleAttributeSelect = (slug: string, value: string) => {
    setSelectedAttributes(prev => ({ ...prev, [slug]: value }));
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
    if (isVariable) {
      addToCart({ ...product, price: currentPrice }, quantity, undefined, currentVariation?.id);
    } else {
      const productToCart = totalVariantOffset ? { ...product, price: currentPrice } : product;
      addToCart(productToCart, quantity, formattedVariantString || undefined);
    }
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
      const result = await submitCustomerReview({
        productId: product.id,
        reviewerName: newUserName,
        rating: newRating,
        content: newComment,
        verifiedPurchase: false, // Defaulting to false for public submissions
        title: newTitle
      });
      if (!result.success) throw new Error(result.message || 'Review submission failed.');
      // After submission, it goes to pending, so it won't show up immediately for customers anyway
      // But we still refresh the products to update any stats if needed
      await refreshProducts();
      showToast('Thank you! Your review has been submitted and is awaiting approval.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Review submission failed.', 'error');
      return;
    } finally {
      setReviewModalOpen(false);
      setNewTitle('');
      setNewComment('');
      setNewUserName('');
    }
  };

  const breadcrumbItems = [
    ...(product.category && product.categorySlug
      ? [{ label: product.category, path: `/category/${product.categorySlug}` }]
      : []),
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
                src={getSafeImageSrc(overrideImage || product.images[activeImageIndex] || product.images[0])}
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
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setOverrideImage(null);
                    }}
                    className={`relative aspect-square w-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      (!overrideImage && activeImageIndex === idx) ? 'border-rose-500 scale-95 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={getSafeImageSrc(img)} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
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
                <ReviewSummary rating={product.rating} reviewCount={product.reviewCount} />
              </div>

              {/* Product Title */}
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mb-4 leading-snug">
                {product.name}
              </h1>

              <div className="mb-4 flex flex-wrap gap-2" aria-label="Recommended age groups">
                {getProductAgeGroups(product).map(age => (
                  <span key={age} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700">Ages {age}</span>
                ))}
              </div>

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
                    effectiveAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${effectiveAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {!effectiveAvailable
                      ? 'Out of Stock'
                      : variantGroups.length > 0 && !allVariantsSelected
                      ? 'Select options to check stock'
                      : selectedVariantStock === undefined ? 'In Stock' : `In Stock (${selectedVariantStock} left)`}
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

              {/* Product Attributes (New Variable Workflow) */}
              {isVariable && product.attributes && product.attributes.length > 0 && (
                <div className="space-y-4 mb-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-slate-900">Options</h4>
                    {product.sizeGuide && (
                      <button 
                        ref={sizeGuideTriggerRef}
                        onClick={() => setSizeGuideModalOpen(true)} 
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Info className="w-3.5 h-3.5" /> Size Guide
                      </button>
                    )}
                  </div>
                  {product.attributes.map((attr) => {
                    if (!attr.visible) return null;
                    const displayType = attr.source === 'global' ? (attr.displayTypeOverride || attr.displayType) : attr.displayType;
                    const terms = attr.source === 'global' 
                      ? attr.terms.filter(t => (attr.selectedTermIds || []).includes(t.id))
                      : attr.terms;

                    return (
                      <div key={attr.id || attr.slug} className="space-y-2">
                        <label className="text-xs font-heading font-extrabold text-slate-800 uppercase tracking-wider block">
                          Select {attr.name}: <span className="text-slate-500 font-medium normal-case ml-1">{selectedAttributes[attr.slug]}</span>
                        </label>

                        {displayType === 'dropdown' ? (
                          <select
                            value={selectedAttributes[attr.slug] || ''}
                            onChange={(e) => handleAttributeSelect(attr.slug, e.target.value)}
                            className="w-full sm:w-64 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                          >
                            <option value="" disabled>Choose {attr.name}</option>
                            {terms.map(t => <option key={t.id} value={t.value}>{t.label}</option>)}
                          </select>
                        ) : displayType === 'radio' ? (
                          <div className="space-y-1">
                            {terms.map((t) => (
                              <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={attr.slug}
                                  value={t.value}
                                  checked={selectedAttributes[attr.slug] === t.value}
                                  onChange={() => handleAttributeSelect(attr.slug, t.value)}
                                  className="text-rose-500 focus:ring-rose-500"
                                />
                                <span className="text-sm font-medium text-slate-700">{t.label}</span>
                              </label>
                            ))}
                          </div>
                        ) : displayType === 'color_swatches' ? (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {terms.map((t) => {
                              const isSelected = selectedAttributes[attr.slug] === t.value;
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  title={t.label}
                                  onClick={() => handleAttributeSelect(attr.slug, t.value)}
                                  className={`w-9 h-9 rounded-full border-2 transition-all ${
                                    isSelected
                                      ? 'border-slate-900 scale-110 shadow-sm'
                                      : 'border-transparent hover:scale-105 shadow-sm'
                                  }`}
                                  style={{ backgroundColor: t.colorValue || '#ccc' }}
                                />
                              );
                            })}
                          </div>
                        ) : displayType === 'image_swatches' ? (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {terms.map((t) => {
                              const isSelected = selectedAttributes[attr.slug] === t.value;
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  title={t.label}
                                  onClick={() => handleAttributeSelect(attr.slug, t.value)}
                                  className={`w-12 h-12 rounded-xl border-2 overflow-hidden transition-all bg-slate-100 ${
                                    isSelected
                                      ? 'border-rose-500 shadow-md ring-2 ring-rose-200 ring-offset-1'
                                      : 'border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  {t.imageUrl ? (
                                    <img src={t.imageUrl} alt={t.label} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-[10px] font-bold text-slate-400 block p-1 text-center leading-tight">No Img</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          // Default to Text Buttons
                          <div className="flex flex-wrap gap-2">
                            {terms.map((t) => {
                              const isSelected = selectedAttributes[attr.slug] === t.value;
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => handleAttributeSelect(attr.slug, t.value)}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    isSelected
                                      ? 'bg-slate-800 text-white shadow-sm ring-2 ring-slate-800 ring-offset-1'
                                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                  }`}
                                >
                                  {t.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Legacy Product Variants Selection */}
              {!isVariable && product.variants && product.variants.length > 0 && (
                <div className="space-y-4 mb-6 pt-4 border-t border-slate-100">
                  {product.variants.map((vGroup) => (
                    <div key={vGroup.id || vGroup.name} className="space-y-2">
                      <label className="text-xs font-heading font-extrabold text-slate-800 uppercase tracking-wider block">
                        Select {vGroup.name}:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {vGroup.options.map((opt) => {
                          const isSelected = selectedVariants[vGroup.name] === opt.name;
                          const isOptionInStock = isVariantOptionAvailable(opt);
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

        <ProductDetailContent product={product} />

        {/* Product Information Tabs */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-100 shadow-sm mb-12">
          {availableTabs.length > 1 && (
            <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-hide gap-4 sm:gap-8 mb-6">
              {availableTabs.includes('desc') && (
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-3 font-heading font-bold text-xs sm:text-sm uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === 'desc' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Description & Features
                </button>
              )}
              {availableTabs.includes('specs') && (
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-3 font-heading font-bold text-xs sm:text-sm uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === 'specs' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Specifications
                </button>
              )}
              {availableTabs.includes('safety') && (
                <button
                  onClick={() => setActiveTab('safety')}
                  className={`pb-3 font-heading font-bold text-xs sm:text-sm uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === 'safety' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Safety & Material Info
                </button>
              )}
              {availableTabs.includes('reviews') && (
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 font-heading font-bold text-xs sm:text-sm uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === 'reviews' ? 'border-rose-500 text-rose-500' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Customer Reviews ({approvedReviews.length})
                </button>
              )}
            </div>
          )}

          {/* Tab 1: Description & Features */}
          {activeTab === 'desc' && (
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <div
                className="max-w-none space-y-4 leading-7 [&_a]:text-sky-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_h1]:mt-7 [&_h1]:text-2xl [&_h1]:font-black [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-black [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-bold [&_img]:h-auto [&_img]:max-w-full [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-6"
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
                  <div className="mt-1"><ReviewSummary rating={product.rating} reviewCount={product.reviewCount} /></div>
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
                  productReviews.map(review => (
                    <div key={review.id} className="p-4 rounded-2xl border border-slate-100 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-slate-100">
                            <img src={review.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewerName)}&background=random`} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-800">{review.reviewerName}</span>
                              {review.verifiedPurchase && (
                                <span className="flex items-center text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium">
                                  <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">{review.createdAt}</span>
                          </div>
                        </div>

                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <h5 className="font-heading font-bold text-xs text-slate-900">{review.title}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{review.content}</p>
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

      {/* Size Guide Modal */}
      {sizeGuideModalOpen && product.sizeGuide && (
        <div 
          ref={sizeGuideRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSizeGuideModalOpen(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSizeGuideModalOpen(false);
          }}
          tabIndex={-1}
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <h3 id="size-guide-title" className="font-heading font-extrabold text-xl text-slate-900">
                Size Guide
              </h3>
              <button 
                onClick={() => setSizeGuideModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 rounded-lg p-1"
                aria-label="Close Size Guide"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div 
              className="prose prose-sm prose-slate max-w-none [&_table]:w-full [&_table]:min-w-[400px] overflow-x-auto [&_th]:bg-slate-50 [&_th]:text-left [&_th]:p-3 [&_td]:p-3 [&_td]:border-t [&_td]:border-slate-100"
              dangerouslySetInnerHTML={{ __html: product.sizeGuide }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
