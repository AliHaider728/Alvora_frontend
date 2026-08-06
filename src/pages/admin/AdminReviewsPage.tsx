import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  MessageSquare, Search, Filter, Trash2, CheckCircle, 
  XCircle, MoreVertical, Edit, Star, StarHalf, ShieldCheck, 
  ShoppingBag, Clock, AlertTriangle 
} from 'lucide-react';
import { Review } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useDialog } from '../../context/DialogContext';
import { formatPrice } from '../../utils/formatters';

export const AdminReviewsPage: React.FC = () => {
  const { refreshAdminReviews, approveReview, rejectReview, deleteReview } = useStore();
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

  const limit = 20;

  useEffect(() => {
    fetchReviews();
  }, [page, statusFilter, sourceFilter, ratingFilter, searchQuery]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (statusFilter) params.status = statusFilter;
      if (sourceFilter) params.source = sourceFilter;
      if (ratingFilter) params.rating = ratingFilter;
      if (searchQuery) params.search = searchQuery;

      const result = await refreshAdminReviews(params);
      if (result) {
        setReviews(result.reviews);
        setTotal(result.total);
        setCounts(result.counts || { pending: 0, approved: 0, rejected: 0 });
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to fetch reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id);
      showToast('Review approved successfully', 'success');
      fetchReviews();
    } catch (e) {
      showToast('Failed to approve review', 'error');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectReview(id);
      showToast('Review rejected', 'success');
      fetchReviews();
    } catch (e) {
      showToast('Failed to reject review', 'error');
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
        await deleteReview(id);
        showToast('Review deleted successfully', 'success');
        fetchReviews();
      } catch (e) {
        showToast('Failed to delete review', 'error');
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 relative">
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-full flex flex-col">
        {/* Header & Metrics */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-rose-500 rounded-xl shadow-lg shadow-rose-500/20 text-white">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight">Review Moderation</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">Manage customer feedback and ratings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between group">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Reviews</p>
                <div className="text-2xl font-black text-slate-900">{total}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between group">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">Pending Approval</p>
                <div className="text-2xl font-black text-amber-600">{counts.pending || 0}</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-amber-500 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between group">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1">Approved</p>
                <div className="text-2xl font-black text-emerald-600">{counts.approved || 0}</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between group">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">Rejected</p>
                <div className="text-2xl font-black text-rose-600">{counts.rejected || 0}</div>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl text-rose-500 group-hover:scale-110 transition-transform">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reviews by name, content, or product..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-rose-500 transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={ratingFilter}
              onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-rose-500 transition-colors"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-rose-500 transition-colors"
            >
              <option value="">All Sources</option>
              <option value="customer">Customer Submitted</option>
              <option value="admin">Admin Created</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex-1">
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-semibold flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin mb-4" />
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-16 text-center text-slate-500 font-semibold flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">No reviews found</h3>
              <p className="text-sm font-medium">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400">Review & Product</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400">Rating</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reviews.map(review => (
                    <tr key={review.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                            {(review as any).productThumbnail ? (
                              <img src={(review as any).productThumbnail} alt="Product" className="w-full h-full object-cover" />
                            ) : (
                              <ShoppingBag className="w-5 h-5 text-slate-300 m-auto mt-3" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                              {review.title ? `"${review.title}"` : review.content}
                            </div>
                            <div className="text-xs text-slate-500 mb-1.5 line-clamp-2 pr-4">{review.content}</div>
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                              <span className="text-slate-700">{review.reviewerName}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500">{(review as any).productName || 'Product'}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-400">{new Date(review.createdAt || '').toLocaleDateString()}</span>
                              {review.verifiedPurchase && (
                                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                                  <ShieldCheck className="w-3 h-3" /> Verified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1.5">
                          {renderStars(review.rating)}
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {review.source === 'admin' ? 'Admin' : 'Customer'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                          ${review.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                            review.status === 'rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                            'bg-amber-50 text-amber-600 border border-amber-100'}
                        `}>
                          {review.status === 'approved' ? <CheckCircle className="w-3.5 h-3.5" /> : 
                           review.status === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> : 
                           <Clock className="w-3.5 h-3.5" />}
                          <span className="capitalize">{review.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {review.status !== 'approved' && (
                            <button
                              onClick={() => handleApprove(review.id)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve Review"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          {review.status !== 'rejected' && (
                            <button
                              onClick={() => handleReject(review.id)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Reject Review"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          )}
                          <div className="w-px h-5 bg-slate-200 mx-1"></div>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {!loading && total > limit && (
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} reviews
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Previous
                </button>
                <button
                  disabled={page * limit >= total}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
