"use client";
import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useDialog } from '../../context/DialogContext';
import { Star, MessageSquare, Plus, Trash2, ShieldCheck, CheckCircle } from 'lucide-react';
import { Review } from '../../types';

interface AdminProductReviewsSectionProps {
  productId?: string; // undefined if product is being created
}

export const AdminProductReviewsSection: React.FC<AdminProductReviewsSectionProps> = ({ productId }) => {
  const { refreshAdminReviews, addAdminReview, deleteReview } = useStore();
  const { showToast } = useToast();
  const { confirm } = useDialog();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [verifiedPurchase, setVerifiedPurchase] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const result = await refreshAdminReviews({ productId, limit: 100 }); // fetch all for this product
      if (result) {
        setReviews(result.reviews);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    if (!reviewerName.trim() || !content.trim()) {
      showToast('Name and review content are required.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const newReview = await addAdminReview({
        productId,
        reviewerName,
        reviewerEmail,
        avatarUrl,
        rating,
        title,
        content,
        verifiedPurchase
      });

      if (newReview) {
        showToast('Review added successfully', 'success');
        setReviews([newReview, ...reviews]);
        setShowAddForm(false);
        // Reset form
        setReviewerName('');
        setReviewerEmail('');
        setRating(5);
        setTitle('');
        setContent('');
        setVerifiedPurchase(true);
        setVerifiedPurchase(true);
        setAvatarUrl('');
      } else {
        showToast('Failed to add review', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to add review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: 'Delete Review',
      description: 'Are you sure you want to permanently delete this review? This action cannot be undone and will affect the product rating.',
      destructive: true,
      confirmLabel: 'Delete',
    });
    
    if (isConfirmed) {
      try {
        const success = await deleteReview(id);
        if (success) {
          showToast('Review deleted successfully', 'success');
          setReviews(reviews.filter(r => r.id !== id));
        } else {
          showToast('Failed to delete review', 'error');
        }
      } catch (e: any) {
        showToast(e.message || 'Failed to delete review', 'error');
      }
    }
  };

  const renderStars = (rating: number, interactive = false, setVal?: (val: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setVal && setVal(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating ? 'fill-amber-400 text-[#C48B80]' : 'fill-slate-100 text-slate-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (!productId) {
    return (
      <div className="rounded-2xl border border-[#E7D9D0] bg-white shadow-sm overflow-hidden mb-6">
        <div className="flex items-center gap-2 border-b border-[#E7D9D0] bg-[#FAF6F2]/50 px-5 py-4">
          <MessageSquare className="h-5 w-5 text-indigo-500" />
          <h2 className="font-heading text-sm font-black text-[#1A1A1A]">Product Reviews</h2>
        </div>
        <div className="p-8 text-center text-[#1A1A1A]/50 text-sm font-semibold">
          <p>Please save the product first before adding reviews.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E7D9D0] bg-white shadow-sm overflow-hidden mb-6">
      <div className="flex items-center justify-between border-b border-[#E7D9D0] bg-[#FAF6F2]/50 px-5 py-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-indigo-500" />
          <h2 className="font-heading text-sm font-black text-[#1A1A1A]">Product Reviews</h2>
          <span className="bg-slate-200 text-[#1A1A1A]/70 text-xs font-bold px-2 py-0.5 rounded-full">{reviews.length}</span>
        </div>
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Review
          </button>
        )}
      </div>

      <div className="p-5">
        {showAddForm && (
          <form onSubmit={handleAddReview} className="mb-6 bg-[#FAF6F2] border border-[#E7D9D0] rounded-xl p-5">
            <h3 className="text-sm font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-500" /> New Manual Review
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label>
                <span className="block text-xs font-bold text-[#1A1A1A]/80 mb-1.5">Reviewer Name <span className="text-[#C48B80]">*</span></span>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E7D9D0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label>
                <span className="block text-xs font-bold text-[#1A1A1A]/80 mb-1.5">Reviewer Avatar URL</span>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E7D9D0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label>
                <span className="block text-xs font-bold text-[#1A1A1A]/80 mb-1.5">Reviewer Email (Optional)</span>
                <input
                  type="email"
                  value={reviewerEmail}
                  onChange={e => setReviewerEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E7D9D0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label>
                <span className="block text-xs font-bold text-[#1A1A1A]/80 mb-1.5">Rating <span className="text-[#C48B80]">*</span></span>
                {renderStars(rating, true, setRating)}
              </label>
              <label className="flex items-center gap-2 h-full mt-2">
                <input
                  type="checkbox"
                  checked={verifiedPurchase}
                  onChange={e => setVerifiedPurchase(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-[#E7D9D0] focus:ring-indigo-500"
                />
                <span className="text-sm font-bold text-[#1A1A1A]/80 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified Purchase
                </span>
              </label>
            </div>

            <label className="block mb-4">
              <span className="block text-xs font-bold text-[#1A1A1A]/80 mb-1.5">Review Title (Optional)</span>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E7D9D0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="block mb-6">
              <span className="block text-xs font-bold text-[#1A1A1A]/80 mb-1.5">Review Content <span className="text-[#C48B80]">*</span></span>
              <textarea
                required
                rows={3}
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E7D9D0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7D9D0]">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm font-bold text-[#1A1A1A]/70 bg-white border border-[#E7D9D0] rounded-lg hover:bg-[#FAF6F2] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? 'Adding...' : 'Add Review'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="py-8 text-center text-[#1A1A1A]/50 text-sm font-semibold">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          !showAddForm && <div className="py-8 text-center text-[#1A1A1A]/50 text-sm font-semibold">No reviews yet for this product.</div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="p-4 border border-[#E7D9D0] rounded-xl bg-[#FAF6F2] flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    {renderStars(review.rating)}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                      ${review.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                        review.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-[#A86249]'}
                    `}>
                      {review.status}
                    </span>
                  </div>
                  {review.title && <h4 className="font-bold text-[#1A1A1A] text-sm mb-1">{review.title}</h4>}
                  <p className="text-[#1A1A1A]/70 text-sm mb-3">{review.content}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#1A1A1A]/50">
                    <span className="text-[#1A1A1A]/80">{review.reviewerName}</span>
                    <span className="text-slate-300">�</span>
                    <span>{new Date(review.createdAt || '').toLocaleDateString()}</span>
                    <span className="text-slate-300">�</span>
                    <span className="uppercase tracking-wider text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-[#1A1A1A]/70">
                      {review.source === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                    {review.verifiedPurchase && (
                      <>
                        <span className="text-slate-300">�</span>
                        <span className="flex items-center gap-1 text-emerald-600">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex sm:flex-col items-center justify-end gap-2 sm:border-l sm:border-[#E7D9D0] sm:pl-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(review.id)}
                    className="p-1.5 text-[#1A1A1A]/40 hover:text-[#A86249] hover:bg-[#FAF6F2] rounded-lg transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

