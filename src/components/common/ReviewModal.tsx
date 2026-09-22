import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';

interface ReviewModalProps {
  productId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({ productId, productName, isOpen, onClose }: ReviewModalProps) {
  const { submitCustomerReview, refreshProducts } = useStore();
  const { showToast } = useToast();

  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newComment) return;
    
    setIsSubmitting(true);
    try {
      const result = await submitCustomerReview({
        productId,
        reviewerName: newUserName,
        rating: newRating,
        content: newComment,
        verifiedPurchase: false,
        title: newTitle
      });
      if (!result.success) throw new Error(result.message || 'Review submission failed.');
      
      await refreshProducts();
      showToast('Thank you! Your review has been submitted and is awaiting approval.', 'success');
      
      setNewTitle('');
      setNewComment('');
      setNewUserName('');
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Review submission failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl border border-[#EDE5DC]">
        <h3 className="font-display font-extrabold text-lg text-[#1A1A1A] mb-4">
          Write a Review for {productName}
        </h3>

        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#1A1A1A]/80 block mb-1">Your Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Jessica M."
              value={newUserName}
              onChange={e => setNewUserName(e.target.value)}
              className="w-full px-3 py-2 text-base sm:text-xs rounded-xl border border-[#EDE5DC] font-sans focus:outline-none focus:ring-2 focus:ring-[#C48B80]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#1A1A1A]/80 block mb-1">Rating</label>
            <div className="flex gap-2 text-[#C48B80]">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star className={`w-6 h-6 ${star <= newRating ? 'fill-[#C48B80]' : 'text-[#EDE5DC]'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#1A1A1A]/80 block mb-1">Review Headline</label>
            <input
              type="text"
              placeholder="e.g. Glowing Skin!"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 text-base sm:text-xs rounded-xl border border-[#EDE5DC] font-sans focus:outline-none focus:ring-2 focus:ring-[#C48B80]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#1A1A1A]/80 block mb-1">Comments</label>
            <textarea
              required
              rows={4}
              placeholder="Share details about the texture, results, how you use it, etc."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="w-full px-3 py-2 text-base sm:text-xs rounded-xl border border-[#EDE5DC] font-sans focus:outline-none focus:ring-2 focus:ring-[#C48B80]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-[#F5EDE4] text-[#1A1A1A]/80 font-display font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-interactive flex-1 py-2.5 rounded-xl bg-gradient-to-br from-[#D4784F] to-[#9C4122] text-white font-display font-bold text-xs hover:bg-black shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
