"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Plus, Minus, Info, BadgeCheck, Check, ShoppingCart, MessageSquarePlus } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { formatPrice } from '../../../utils/formatters';
import { ReviewSummary } from '../../../components/common/ReviewSummary';
import { AlvoraProductCard } from '../../../components/common/AlvoraProductCard';

export function BundleDetailPageClient({ initialBundle, initialReviews, relatedBundles }: any) {
  const { addToCart, setIsCartOpen, submitCustomerReview } = useStore();
  const [bundle] = useState(initialBundle);
  const [reviews, setReviews] = useState(initialReviews || []);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  
  // Gallery
  const allImages = [bundle.image, ...(bundle.products || []).flatMap((p: any) => p.images || [])].filter(Boolean);
  const [activeImage, setActiveImage] = useState(allImages[0] || '/images/hero/alvora-hero.png');
  
  // Review Modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newUserName, setNewUserName] = useState('');

  // Bundle to Product mapper for cart
  const mapBundleToProduct = (b: any) => ({
    id: b.id,
    productType: 'bundle',
    bundleData: b,
    name: b.name,
    slug: b.slug,
    price: b.currentPrice || 0,
    originalPrice: b.originalTotalPrice || 0,
    images: b.image ? [b.image] : [],
    inStock: true,
    category: 'Bundles',
    categorySlug: 'bundles',
    sku: "BUNDLE-" + b.id,
    rating: b.rating || 5,
    reviewCount: b.reviewCount || 0,
    tags: [],
    features: [],
    safetyInfo: '',
    specifications: {},
    ageGroups: []
  });

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

  const handleReviewSubmit = async (e: any) => {
    e.preventDefault();
    if (!newUserName || !newComment) return;
    try {
      await submitCustomerReview({
        productId: bundle.id,
        reviewerName: newUserName,
        rating: newRating,
        content: newComment,
        verifiedPurchase: false,
        title: newTitle
      });
      alert('Review submitted for approval.');
      setReviewModalOpen(false);
      setNewTitle('');
      setNewComment('');
      setNewUserName('');
    } catch (err) {
      alert('Review submission failed.');
    }
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
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible no-scrollbar pb-2 sm:pb-0">
              {allImages.slice(0, 5).map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#C48B80]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
            <motion.div 
              className="relative w-full aspect-square rounded-[2rem] overflow-hidden bg-white shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image src={activeImage} alt={bundle.name} fill className="object-cover" priority />
              {bundle.discountPercent > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute top-6 left-6 bg-[#C48B80] text-white text-[11px] font-bold px-4 py-2 uppercase tracking-widest rounded-full shadow-lg"
                >
                  Save {bundle.discountPercent}%
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center space-y-6">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.span variants={staggerVariants} className="text-xs tracking-[0.25em] uppercase text-[#C87355] font-bold block mb-2">
                Curated Bundle
              </motion.span>
              <motion.h1 variants={staggerVariants} className="font-display text-4xl lg:text-5xl text-[#1A1A1A] font-medium leading-tight mb-4">
                {bundle.name}
              </motion.h1>
              <motion.div variants={staggerVariants} className="mb-6">
                <ReviewSummary rating={bundleRating} reviewCount={approvedReviews.length} />
              </motion.div>
              <motion.p variants={staggerVariants} className="text-[#1A1A1A]/70 text-base md:text-lg leading-relaxed mb-8">
                {bundle.description}
              </motion.p>
              
              <motion.div variants={staggerVariants} className="flex items-center gap-4 mb-8">
                <span className="text-3xl font-medium text-[#C48B80]">{formatPrice(bundle.currentPrice || 0)}</span>
                {(bundle.originalTotalPrice || 0) > (bundle.currentPrice || 0) && (
                  <span className="text-xl text-[#1A1A1A]/40 line-through">{formatPrice(bundle.originalTotalPrice || 0)}</span>
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Breakdown & What's Included */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E7D9D0]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-4">
            <motion.div 
              className="bg-white rounded-3xl p-8 shadow-sm border border-[#E7D9D0] sticky top-24"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display text-2xl text-[#1A1A1A] mb-6">Value Breakdown</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-[#1A1A1A]/70">
                  <span>Buying Separately:</span>
                  <span className="line-through">{formatPrice(bundle.originalTotalPrice || 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#1A1A1A] text-base border-t border-gray-100 pt-4">
                  <span>Bundle Price:</span>
                  <span>{formatPrice(bundle.currentPrice || 0)}</span>
                </div>
                <div className="flex justify-between text-[#C48B80] font-bold bg-[#FAF6F2] p-3 rounded-xl mt-4">
                  <span>You Save:</span>
                  <span>{formatPrice((bundle.originalTotalPrice || 0) - (bundle.currentPrice || 0))}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-8">
            <h2 className="font-display text-3xl text-[#1A1A1A] mb-8">What's Included</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {bundle.products?.map((prod: any, idx: number) => (
                <motion.div 
                  key={idx}
                  className="flex gap-4 p-4 bg-white rounded-2xl border border-transparent hover:border-[#E7D9D0] hover:shadow-md transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden relative bg-[#FAF6F2]">
                    <Image src={prod.images?.[0] || '/images/hero/alvora-hero.png'} alt={prod.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A]/50 font-bold mb-1">Full Size</span>
                    <h4 className="font-display text-lg text-[#1A1A1A] mb-1">{prod.name}</h4>
                    <span className="text-sm font-medium text-[#C48B80]">{formatPrice(prod.price)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Layer */}
      {bundle.products && bundle.products.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E7D9D0]">
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
                <div className="w-12 h-12 rounded-full bg-[#C48B80] text-white flex items-center justify-center font-display text-xl mb-6 shadow-md z-10">
                  {idx + 1}
                </div>
                {idx !== bundle.products.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-[#E7D9D0] -z-10" />
                )}
                <div className="w-32 h-32 rounded-full overflow-hidden relative mb-6 border-4 border-white shadow-sm">
                  <Image src={prod.images?.[0] || '/images/hero/alvora-hero.png'} alt={prod.name} fill className="object-cover" />
                </div>
                <h4 className="font-bold text-[#1A1A1A] mb-2">{prod.name}</h4>
                <p className="text-sm text-[#1A1A1A]/70">{prod.shortDescription || 'Apply evenly to clean skin.'}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#E7D9D0]">
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
              <div key={review.id} className="p-6 rounded-3xl bg-white shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#F5EDE4]">
                      <Image src={review.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewerName)}&background=random`} alt={review.reviewerName} fill className="object-cover" unoptimized />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1A1A1A]">{review.reviewerName}</span>
                        {review.verifiedPurchase && (
                          <span className="flex items-center text-[10px] text-emerald-600 font-bold uppercase tracking-wide">
                            <BadgeCheck className="w-3.5 h-3.5 mr-0.5" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-[#EDE5DC]'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <h5 className="font-display font-bold text-[#1A1A1A]">{review.title}</h5>
                <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">{review.content}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Bundles */}
      {relatedBundles.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E7D9D0]">
          <h2 className="font-display text-3xl text-[#1A1A1A] mb-10 text-center">More Curated Sets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedBundles.map((b: any) => (
              <AlvoraProductCard key={b.id} product={mapBundleToProduct(b)} />
            ))}
          </div>
        </section>
      )}

      {/* Write Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 relative shadow-2xl">
            <h3 className="font-display text-2xl text-[#1A1A1A] mb-6">
              Write a Review
            </h3>
            <form onSubmit={handleReviewSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/80 block mb-2">Your Name</label>
                <input type="text" required value={newUserName} onChange={e => setNewUserName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#FAF6F2] border-none focus:ring-2 focus:ring-[#C48B80] outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/80 block mb-2">Headline</label>
                <input type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#FAF6F2] border-none focus:ring-2 focus:ring-[#C48B80] outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/80 block mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button type="button" key={star} onClick={() => setNewRating(star)}>
                      <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/80 block mb-2">Review</label>
                <textarea required rows={4} value={newComment} onChange={e => setNewComment(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#FAF6F2] border-none focus:ring-2 focus:ring-[#C48B80] outline-none resize-none"></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setReviewModalOpen(false)} className="flex-1 py-4 rounded-full bg-[#FAF6F2] text-[#1A1A1A] font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 rounded-full bg-[#C48B80] text-white font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
