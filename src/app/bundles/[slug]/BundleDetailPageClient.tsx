"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Plus, Minus, Info, BadgeCheck, Check, ShoppingCart, MessageSquarePlus, ZoomIn } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { formatPrice } from '../../../utils/formatters';
import { getBundleOriginalPrice } from '../../../utils/products';
import { ReviewSummary } from '../../../components/common/ReviewSummary';
import { AlvoraProductCard } from '../../../components/common/AlvoraProductCard';
import { ReviewModal } from '../../../components/common/ReviewModal';
import { Product } from '../../../types';
import { getBundleImages } from '../../../utils/bundleImages';
import { getSafeImageSrc } from '../../../utils/images';

export function BundleDetailPageClient({ initialBundle, initialReviews, relatedBundles }: any) {
  const { addToCart, setIsCartOpen } = useStore();
  const bundle = initialBundle;
  const [reviews, setReviews] = useState(initialReviews || []);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  
  // Gallery
  const allImages = useMemo(() => getBundleImages(bundle), [bundle]);
  const [selectedImage, setActiveImage] = useState<string | undefined>(undefined);
  const activeImage = selectedImage && allImages.includes(selectedImage) ? selectedImage : getSafeImageSrc(allImages[0]);
  useEffect(() => { setActiveImage(undefined); }, [bundle.id]);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const handleZoomPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100));
    setZoomOrigin(`${x}% ${y}%`);
    setIsZooming(true);
  };
  
  // Review Modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Bundle to Product mapper for cart
  const { products } = useStore();
  const mapBundleToProduct = (b: any): Product => {
    const bundleImg = getBundleImages(b)[0];
    return {
      id: String(b.id),
      productType: 'bundle',
      bundleData: b,
      name: b.name,
      slug: b.slug,
      price: Number(b.currentPrice || 0),
      originalPrice: Number(getBundleOriginalPrice(b) || 0),
      images: bundleImg ? [bundleImg] : [],
      inStock: true,
      category: 'Bundles',
      categorySlug: 'bundles',
      sku: `BUNDLE-${b.id}`,
      rating: Number(b.rating || 5),
      reviewCount: Number(b.reviewCount || 0),
      tags: [],
      features: [],
      safetyInfo: '',
      specifications: {},
      ageGroups: [],
      brand: 'Alvora',
      description: b.description || '',
      shortDescription: b.shortDescription || b.description || '',
      variantGroups: [] as any,
      attributes: [],
      variations: [],
      defaultAttributes: {},
      defaultVariationId: '',
      isVisible: true,
      status: 'published',
      productDetailBlocks: [],
      productDetailCustomCss: '',
      categoryNames: ['Bundles'],
      categorySlugs: ['bundles'],
      isFeatured: false,
      isNewArrival: false,
      isBestseller: Boolean(b.isBestseller),
      isSpotlight: false,
      soldCount: 0,
      metaTitle: b.name,
      metaDescription: b.description || '',
      priceBreaks: undefined as any,
    } as Product;
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    setTimeout(() => {
      addToCart(mapBundleToProduct(bundle), 1);
      setAddingToCart(false);
      setAdded(true);
      setIsCartOpen(true);
      setTimeout(() => setAdded(false), 2000);
    }, 600);
  };

  const staggerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const approvedReviews = reviews.filter((r: any) => r.status === 'approved' || r.status === 'published');
  const bundleRating = approvedReviews.length > 0 
    ? approvedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / approvedReviews.length 
    : 5;

  return (
    <div className="min-h-screen bg-[#FAF6F2] font-sans pb-24">
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
                    {/* Gallery */}
          <div data-testid="bundle-gallery" className="flex min-w-0 flex-col-reverse sm:flex-row gap-4">
            {allImages.length > 1 && (
              <div aria-label="Bundle gallery thumbnails" className="flex gap-3 overflow-x-auto pb-2 sm:max-h-[600px] sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden sm:pb-0 sm:pr-1">
                {allImages.map((img, idx) => (
                <button 
                  key={idx}
                  type="button"
                  aria-label={`View ${bundle.name} image ${idx + 1}`}
                  aria-pressed={activeImage === img}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#9C4122]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <Image src={getSafeImageSrc(img)} alt={`${bundle.name} gallery image ${idx + 1}`} fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
            )}
            <motion.div 
              className="group/gallery relative w-full aspect-square rounded-3xl overflow-hidden bg-white shadow-sm cursor-zoom-in"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              onPointerMove={handleZoomPointerMove}
              onPointerLeave={() => { setIsZooming(false); setZoomOrigin('50% 50%'); }}
            >
              <Image src={activeImage} alt={bundle.name} fill sizes="(max-width: 768px) 100vw, 50vw" className={`object-cover object-center transition-transform duration-200 ease-out motion-reduce:transition-none ${isZooming ? 'scale-[1.75]' : 'scale-100'}`} style={{ transformOrigin: zoomOrigin }} priority />
              <span className="pointer-events-none absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 px-3 py-1.5 text-[10px] font-bold text-white opacity-0 backdrop-blur transition-opacity group-hover/gallery:opacity-100"><ZoomIn className="h-3.5 w-3.5" /> Hover to zoom</span>
              {bundle.discountPercent > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute top-6 left-6 bg-gradient-to-br from-[#D4784F] to-[#9C4122] text-white text-[11px] font-bold px-4 py-2 uppercase tracking-widest rounded-full shadow-lg"
                >
                  Save {bundle.discountPercent}%
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center space-y-6">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.span variants={staggerVariants} className="text-xs tracking-[0.25em] uppercase text-[#9C4122] font-bold block mb-2">
                Curated Bundle
              </motion.span>
              <motion.h1 variants={staggerVariants} className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] font-medium leading-tight mb-4">
                {bundle.name}
              </motion.h1>
              <motion.div variants={staggerVariants} className="mb-6">
                <ReviewSummary rating={bundleRating} reviewCount={approvedReviews.length} />
              </motion.div>
              <motion.p variants={staggerVariants} className="text-[#1A1A1A]/70 text-base md:text-lg leading-relaxed mb-8">
                {bundle.description}
              </motion.p>
              
                            <motion.div variants={staggerVariants} className="flex flex-col gap-2 mb-8">
                <div className="flex items-end gap-4">
                  <span className="text-3xl font-medium text-[#9C4122]">{formatPrice(bundle.currentPrice || 0)}</span>
                  {getBundleOriginalPrice(bundle) > (bundle.currentPrice || 0) && (
                    <span className="text-xl text-[#1A1A1A]/40 line-through mb-1">{formatPrice(getBundleOriginalPrice(bundle))}</span>
                  )}
                </div>
                {getBundleOriginalPrice(bundle) > (bundle.currentPrice || 0) && (
                  <span className="text-sm font-bold text-[#9C4122] bg-[#FAF6F2] self-start px-3 py-1 rounded-md">
                    You Save {formatPrice(getBundleOriginalPrice(bundle) - (bundle.currentPrice || 0))} ({Math.round(((getBundleOriginalPrice(bundle) - (bundle.currentPrice || 0)) / getBundleOriginalPrice(bundle)) * 100)}%)
                  </span>
                )}
              </motion.div>

              <motion.button 
                variants={staggerVariants}
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 px-8 py-4 bg-[#1A1A1A] hover:bg-[#333] text-white text-xs font-bold tracking-widest uppercase transition-all rounded-full disabled:opacity-80"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {addingToCart ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : added ? (
                  <><Check className="w-5 h-5" /> Added</>
                ) : (
                  <>Add Bundle to Cart</>
                )}
              </motion.button>

              <motion.div variants={staggerVariants} className="mt-12 pt-10 border-t border-[#E7D9D0] grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Value Breakdown */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E7D9D0]">
                  <h3 className="font-display text-xl text-[#1A1A1A] mb-4">Value Breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-[#1A1A1A]/70">
                      <span>Buying Separately:</span>
                      <span className="line-through">{formatPrice(getBundleOriginalPrice(bundle))}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#1A1A1A] text-base border-t border-gray-100 pt-3">
                      <span>Bundle Price:</span>
                      <span>{formatPrice(bundle.currentPrice || 0)}</span>
                    </div>
                    <div className="flex justify-between text-[#9C4122] font-bold bg-[#FAF6F2] p-3 rounded-xl mt-3">
                      <span>You Save:</span>
                      <span>{formatPrice(getBundleOriginalPrice(bundle) - (bundle.currentPrice || 0))}</span>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div>
                  <h3 className="font-display text-xl text-[#1A1A1A] mb-4">What's Included</h3>
                  <div className="flex flex-col gap-3">
                    {bundle.products?.map((prod: any, idx: number) => (
                      <div key={idx} className="flex gap-4 p-3 bg-white rounded-2xl border border-[#E7D9D0] shadow-sm">
                        <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden relative bg-[#FAF6F2]">
                          <Image src={products?.find(p => p.id === (prod.product?.id || prod.productId || prod.id))?.images?.[0] || prod.product?.images?.[0] || prod.images?.[0] || '/images/hero/alvora-hero.png'} alt={products?.find(p => p.id === (prod.product?.id || prod.productId || prod.id))?.name || prod.product?.name || prod.name} fill sizes="64px" className="object-cover" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="text-[9px] uppercase tracking-widest text-[#1A1A1A]/50 font-bold mb-0.5">Full Size</span>
                          <h4 className="font-display text-sm text-[#1A1A1A] leading-tight mb-1">{products?.find(p => p.id === (prod.product?.id || prod.productId || prod.id))?.name || prod.product?.name || prod.name}</h4>
                          <span className="text-xs font-medium text-[#9C4122]">{(() => { const realP = products?.find(p => p.id === (prod.product?.id || prod.productId || prod.id)); const pPrice = realP?.price || prod.product?.price || prod.price; return pPrice ? formatPrice(pPrice) : "Included"; })()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Layer */}
      {bundle.products && bundle.products.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto border-t border-[#E7D9D0]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A] mb-4">How To Layer</h2>
            <p className="text-[#1A1A1A]/70 text-lg">Your complete routine, step by step.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bundle.products.map((prod: any, idx: number) => (
              <motion.div 
                key={idx}
                className="flex flex-col items-center text-center relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4784F] to-[#9C4122] text-white flex items-center justify-center font-display text-xl mb-6 shadow-md z-10">
                  {idx + 1}
                </div>
                {idx !== bundle.products.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-[#E7D9D0] -z-10" />
                )}
                <div className="w-32 h-32 rounded-full overflow-hidden relative mb-6 border-4 border-white shadow-sm">
                  <Image src={products?.find(p => p.id === (prod.product?.id || prod.productId || prod.id))?.images?.[0] || prod.product?.images?.[0] || prod.images?.[0] || '/images/hero/alvora-hero.png'} alt={products?.find(p => p.id === (prod.product?.id || prod.productId || prod.id))?.name || prod.product?.name || prod.name} fill className="object-cover" />
                </div>
                <h4 className="font-bold text-[#1A1A1A] mb-2">{products?.find(p => p.id === (prod.product?.id || prod.productId || prod.id))?.name || prod.product?.name || prod.name}</h4>
                <p className="text-sm text-[#1A1A1A]/70">{prod.product?.shortDescription || prod.shortDescription || 'Apply evenly to clean skin.'}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto border-t border-[#E7D9D0]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-white shadow-sm mb-8">
          <div>
            <h4 className="font-display font-bold text-2xl text-[#1A1A1A]">
              Customer Experience
            </h4>
            <div className="mt-2"><ReviewSummary rating={bundleRating} reviewCount={approvedReviews.length} /></div>
          </div>
          <button
            onClick={() => setReviewModalOpen(true)}
            className="px-6 py-3 rounded-full bg-[#1A1A1A] hover:bg-[#333] text-white font-bold text-xs flex items-center gap-2 transition-colors uppercase tracking-widest"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        <div className="space-y-4">
          {approvedReviews.length === 0 ? (
            <p className="text-[#1A1A1A]/50 text-center py-12 bg-white rounded-3xl border border-[#EDE5DC]">
              Be the first to review this bundle!
            </p>
          ) : (
            approvedReviews.map((review: any) => (
              <div key={review.id} className="p-4 rounded-2xl border border-[#EDE5DC] bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#F5EDE4]">
                      <Image src={review.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewerName)}&background=random`} alt={review.reviewerName} fill sizes="40px" className="object-cover" unoptimized />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1A1A1A]/90">{review.reviewerName}</span>
                        {review.verifiedPurchase && (
                          <span className="flex items-center text-[10px] text-[#C48B80] font-semibold">
                            <BadgeCheck className="w-3.5 h-3.5 mr-0.5" /> Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400' : 'text-[#EDE5DC]'}`}
                      />
                    ))}
                  </div>
                </div>

                <h5 className="font-display font-bold text-xs text-[#1A1A1A]">{review.title}</h5>
                <p className="text-xs text-[#1A1A1A]/60 leading-relaxed">{review.content}</p>
                
                {review.imageUrl && (
                  <div className="mt-3">
                    <div className="relative w-24 h-24">
                      <Image src={review.imageUrl} alt="Customer review photo" fill sizes="96px" className="object-cover rounded-xl border border-[#EDE5DC] cursor-pointer hover:opacity-90 transition-opacity shadow-sm" onClick={() => window.open(review.imageUrl, `_blank`)} unoptimized />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Bundles */}
      {relatedBundles.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto border-t border-[#E7D9D0]">
          <h2 className="font-display text-3xl text-[#1A1A1A] mb-10 text-center">More Curated Sets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedBundles.map((b: any) => (
              <AlvoraProductCard key={b.id} product={mapBundleToProduct(b)} />
            ))}
          </div>
        </section>
      )}

      <ReviewModal 
        productId={bundle.id}
        productName={bundle.name}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />
    </div>
  );
}




