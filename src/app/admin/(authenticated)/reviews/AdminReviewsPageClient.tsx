"use client";
import React, { useState, useEffect } from 'react';
import { useStore } from '../../../../context/StoreContext';
import { api } from '../../../../services/api';
import { 
  MessageSquare, Search, Filter, Trash2, CheckCircle, 
  XCircle, MoreVertical, Edit, Star, StarHalf, ShieldCheck, 
  ShoppingBag, Clock, AlertTriangle, Plus, ImagePlus, Loader2
} from 'lucide-react';
import { Review } from '../../../../types';
import { useToast } from '../../../../context/ToastContext';
import { useDialog } from '../../../../context/DialogContext';
import { formatPrice } from '../../../../utils/formatters';
import { getSafeImageSrc } from '../../../../utils/images';

export const AdminReviewsPageClient: React.FC = () => {
  const { refreshAdminReviews, addAdminReview, approveReview, rejectReview, deleteReview } = useStore();
  const { showToast } = useToast();
  const { confirm } = useDialog();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Review Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    productId: '',
    reviewerName: '',
    rating: 5,
    title: '',
    content: '',
    verifiedPurchase: true
  });
  const [reviewImageFile, setReviewImageFile] = useState<File | null>(null);
  const [reviewImagePreview, setReviewImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const limit = 20;

  useEffect(() => {
    fetchReviews();
  }, [page, statusFilter, sourceFilter, ratingFilter, searchQuery]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReviewImageFile(file);
      setReviewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.productId || !newReview.reviewerName || !newReview.content) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await addAdminReview({ ...newReview }, reviewImageFile || undefined);
      showToast('Review added successfully', 'success');
      setIsAddModalOpen(false);
      setNewReview({ productId: '', reviewerName: '', rating: 5, title: '', content: '', verifiedPurchase: true });
      setReviewImageFile(null);
      setReviewImagePreview('');
      fetchReviews();
    } catch (err: any) {
      showToast(err.message || 'Failed to add review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (statusFilter) params.status = statusFilter;
      if (sourceFilter) params.source = sourceFilter;
      if (ratingFilter) params.rating = Number(ratingFilter);
      if (searchQuery) params.search = searchQuery;

      const res = await api.getAdminReviews(params);
      if (res && res.reviews) {
        setReviews(res.reviews);
        setTotal(res.total || 0);
        if (res.counts) setCounts(res.counts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id);
      showToast('Review approved', 'success');
      fetchReviews();
    } catch (err: any) {
      showToast(err.message || 'Failed to approve', 'error');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectReview(id);
      showToast('Review rejected', 'info');
      fetchReviews();
    } catch (err: any) {
      showToast(err.message || 'Failed to reject', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    confirm({
      title: 'Delete Review',
      message: 'Are you sure you want to permanently delete this review?',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await deleteReview(id);
          showToast('Review deleted', 'success');
          fetchReviews();
        } catch (err: any) {
          showToast(err.message || 'Failed to delete', 'error');
        }
      }
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating ? 'fill-amber-400 text-amber-500' : 'fill-slate-100 text-slate-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-heading pb-10">
      
      {/* Clean Modern Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">Review Moderation</h1>
          <p className="text-sm text-[#1A1A1A]/60 mt-2 max-w-2xl">Manage customer feedback, approve testimonials, and add manual reviews.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#9C4122] to-[#B34E28] hover:to-[#7A321A] shadow-md transition-all text-sm shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Review
        </button>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Reviews Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7D9D0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5EDE4] rounded-bl-full -mr-10 -mt-10 opacity-50 transition-transform group-hover:scale-110" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[11px] font-bold text-[#1A1A1A]/50 uppercase tracking-wider block">Total Reviews</span>
              <span className="font-heading font-black text-3xl text-[#1A1A1A] mt-2 block tracking-tight">{total}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F5EDE4] text-[#9C4122] shadow-inner">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7D9D0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-10 -mt-10 opacity-50 transition-transform group-hover:scale-110" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[11px] font-bold text-[#1A1A1A]/50 uppercase tracking-wider block">Pending Approval</span>
              <span className="font-heading font-black text-3xl text-amber-600 mt-2 block tracking-tight">{counts.pending || 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 text-amber-700 shadow-inner">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Approved Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7D9D0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 opacity-50 transition-transform group-hover:scale-110" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[11px] font-bold text-[#1A1A1A]/50 uppercase tracking-wider block">Approved</span>
              <span className="font-heading font-black text-3xl text-emerald-600 mt-2 block tracking-tight">{counts.approved || 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 shadow-inner">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Rejected Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7D9D0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -mr-10 -mt-10 opacity-50 transition-transform group-hover:scale-110" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-[11px] font-bold text-[#1A1A1A]/50 uppercase tracking-wider block">Rejected</span>
              <span className="font-heading font-black text-3xl text-rose-600 mt-2 block tracking-tight">{counts.rejected || 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-100 text-rose-700 shadow-inner">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Slim Inline Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-[#1A1A1A]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews by name, content, or product..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full max-w-md pl-10 pr-4 py-2.5 bg-white border border-[#E7D9D0] shadow-sm rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#9C4122]/20 focus:border-[#9C4122] outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 bg-white border border-[#E7D9D0] shadow-sm rounded-xl text-sm font-semibold text-[#1A1A1A]/80 outline-none focus:border-[#9C4122] transition-colors cursor-pointer">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={ratingFilter} onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 bg-white border border-[#E7D9D0] shadow-sm rounded-xl text-sm font-semibold text-[#1A1A1A]/80 outline-none focus:border-[#9C4122] transition-colors cursor-pointer">
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 bg-white border border-[#E7D9D0] shadow-sm rounded-xl text-sm font-semibold text-[#1A1A1A]/80 outline-none focus:border-[#9C4122] transition-colors cursor-pointer">
            <option value="">All Sources</option>
            <option value="organic">Organic</option>
            <option value="admin">Admin Added</option>
            <option value="voice">Voice Review</option>
          </select>
        </div>
      </div>

      {/* Main Table / Empty State Area */}
      <div className="bg-white rounded-2xl border border-[#E7D9D0] shadow-sm overflow-hidden min-h-[300px] relative">
        {loading ? (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-[#9C4122]" />
          </div>
        ) : null}

        {!loading && reviews.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
            <div className="w-16 h-16 bg-[#FAF6F2] rounded-full flex items-center justify-center text-[#1A1A1A]/20 mb-4 border border-[#E7D9D0]">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-[#1A1A1A] mb-1">No reviews found</h3>
            <p className="text-sm text-[#1A1A1A]/50">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#FAF6F2] border-b border-[#E7D9D0]">
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]/50">Review & Product</th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]/50 w-32">Rating</th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]/50 w-32">Status</th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]/50 text-right w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7D9D0]/50">
                  {reviews.map(review => (
                    <tr key={review.id} className="hover:bg-[#FAF6F2]/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-[#FAF6F2] rounded-xl overflow-hidden flex-shrink-0 border border-[#E7D9D0]">
                            {(review as any).productThumbnail ? (
                              <img src={getSafeImageSrc((review as any).productThumbnail)} alt="Product" className="w-full h-full object-cover" />
                            ) : (
                              <ShoppingBag className="w-5 h-5 text-[#1A1A1A]/20 m-auto mt-3.5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-[#1A1A1A] line-clamp-1 mb-1">
                              {review.title ? `"${review.title}"` : review.content}
                            </div>
                            <div className="text-xs text-[#1A1A1A]/60 mb-2 line-clamp-2 pr-4">{review.content}</div>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                              <span className="text-[#1A1A1A]/80">{review.reviewerName}</span>
                              <span className="text-[#1A1A1A]/20">•</span>
                              <span className="text-[#1A1A1A]/50">{(review as any).productName || 'Product'}</span>
                              <span className="text-[#1A1A1A]/20">•</span>
                              <span className="text-[#1A1A1A]/40">{new Date(review.createdAt || '').toLocaleDateString()}</span>
                              {review.verifiedPurchase && (
                                <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 ml-1">
                                  <ShieldCheck className="w-2.5 h-2.5" /> Verified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top pt-5">
                        {renderStars(review.rating)}
                      </td>
                      <td className="py-4 px-6 align-top pt-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${
                          review.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          review.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {review.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                          {review.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {review.status === 'pending' && <Clock className="w-3 h-3" />}
                          {review.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 align-top pt-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {review.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleApprove(review.id!)}
                                className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-100"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleReject(review.id!)}
                                className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-100"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleDelete(review.id!)}
                            className="p-2 text-[#1A1A1A]/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {!loading && total > limit && (
              <div className="px-6 py-4 border-t border-[#E7D9D0] bg-[#FAF6F2]/50 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1A1A1A]/50">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} reviews
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1.5 text-sm font-bold text-[#1A1A1A]/70 bg-white border border-[#E7D9D0] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAF6F2] transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page * limit >= total}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1.5 text-sm font-bold text-[#1A1A1A]/70 bg-white border border-[#E7D9D0] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAF6F2] transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E7D9D0] flex items-center justify-between">
              <h2 className="font-heading font-black text-lg text-[#1A1A1A]">Add Customer Review</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto font-heading">
              <form id="addReviewForm" onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A]/80 mb-1">Product ID or Slug <span className="text-rose-500">*</span></label>
                  <input type="text" required value={newReview.productId} onChange={e => setNewReview({...newReview, productId: e.target.value})} className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-[#E7D9D0] focus:outline-none focus:ring-2 focus:ring-[#9C4122] transition-shadow" placeholder="e.g. magnetic-building-blocks or 60d5ecb..." />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A]/80 mb-1">Customer Name <span className="text-rose-500">*</span></label>
                    <input type="text" required value={newReview.reviewerName} onChange={e => setNewReview({...newReview, reviewerName: e.target.value})} className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-[#E7D9D0] focus:outline-none focus:ring-2 focus:ring-[#9C4122] transition-shadow" placeholder="e.g. Sarah M." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A]/80 mb-1">Rating</label>
                    <select value={newReview.rating} onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})} className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-[#E7D9D0] focus:outline-none focus:ring-2 focus:ring-[#9C4122] transition-shadow">
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A]/80 mb-1">Review Title</label>
                  <input type="text" value={newReview.title} onChange={e => setNewReview({...newReview, title: e.target.value})} className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-[#E7D9D0] focus:outline-none focus:ring-2 focus:ring-[#9C4122] transition-shadow" placeholder="e.g. My kids love this!" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A]/80 mb-1">Review Content <span className="text-rose-500">*</span></label>
                  <textarea required rows={4} value={newReview.content} onChange={e => setNewReview({...newReview, content: e.target.value})} className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-[#E7D9D0] focus:outline-none focus:ring-2 focus:ring-[#9C4122] transition-shadow" placeholder="Write the review text here..."></textarea>
                </div>
                
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="verifiedPurchase" checked={newReview.verifiedPurchase} onChange={e => setNewReview({...newReview, verifiedPurchase: e.target.checked})} className="rounded text-[#9C4122] focus:ring-[#9C4122]" />
                  <label htmlFor="verifiedPurchase" className="text-sm font-bold text-[#1A1A1A]/80">Verified Purchase</label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A]/80 mb-1">Review Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    {reviewImagePreview ? (
                      <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-[#E7D9D0]">
                        <img src={getSafeImageSrc(reviewImagePreview)} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => { setReviewImageFile(null); setReviewImagePreview(''); }} className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 text-rose-500 hover:bg-white"><XCircle className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#E7D9D0] bg-[#FAF6F2] text-[#1A1A1A]/40 hover:border-[#9C4122] hover:text-[#9C4122] transition-colors">
                        <ImagePlus className="h-6 w-6" />
                        <span className="text-[10px] font-bold">Upload</span>
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>

              </form>
            </div>
            
            <div className="px-6 py-4 bg-[#FAF6F2] border-t border-[#E7D9D0] flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-[#1A1A1A]/70 hover:bg-[#E7D9D0] transition">Cancel</button>
              <button type="submit" form="addReviewForm" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-[#9C4122] to-[#B34E28] hover:to-[#7A321A] text-white border-transparent shadow-sm text-sm font-bold transition disabled:opacity-70">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Save Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};