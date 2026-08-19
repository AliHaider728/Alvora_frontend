import React from 'react';
import Link from 'next/link';
import { Quote, CheckCircle2 } from 'lucide-react';
import { Review } from '../../types';

interface Props {
  reviews: Review[];
}

export const Testimonials: React.FC<Props> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  const displayReviews = reviews.slice(0, 3);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="alvora-container">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex text-[#C48B80] text-sm">
                ★★★★★
              </div>
              <span className="text-sm font-semibold text-[#1A1A1A]">4.9 (1,235 Reviews)</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A] font-medium">
              Loved By Thousands
            </h2>
          </div>
          <Link 
            href="/category/all#reviews" 
            className="text-xs font-semibold tracking-widest text-[#1A1A1A] hover:text-[#C48B80] transition-colors border-b border-[#1A1A1A] hover:border-[#C48B80] pb-1 uppercase whitespace-nowrap"
          >
            VIEW ALL REVIEWS &rarr;
          </Link>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.map((review) => (
            <div key={review.id} className="bg-[#FAF6F2] p-8 flex flex-col h-full">
              <Quote className="w-8 h-8 text-[#C48B80]/40 mb-6" />
              
              <p className="text-[#4D3D2D] leading-relaxed text-sm flex-grow mb-8 italic">
                "{review.content}"
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#EDE5DC]">
                <div>
                  <p className="font-semibold text-[#1A1A1A] text-sm mb-1">- {review.reviewerName}</p>
                  <div className="flex text-[#C48B80] text-[10px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>{star <= review.rating ? '★' : '☆'}</span>
                    ))}
                  </div>
                </div>
                {review.verifiedPurchase && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-[10px] uppercase tracking-wider text-[#A1A7AA] font-semibold">Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
