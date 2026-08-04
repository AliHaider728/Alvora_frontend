import React from 'react';
import { Star } from 'lucide-react';

type ReviewSummaryProps = {
  rating: number;
  reviewCount: number;
  compact?: boolean;
};

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({ rating, reviewCount, compact = false }) => {
  const count = Math.max(0, Number(reviewCount) || 0);
  const average = count > 0 ? Math.min(5, Math.max(0, Number(rating) || 0)) : 0;

  if (count === 0) {
    return (
      <div className="flex items-center gap-1.5 text-slate-400" aria-label="No reviews yet">
        <Star className="h-3.5 w-3.5" />
        <span className="text-xs">No reviews yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5" aria-label={`${average.toFixed(1)} out of 5 from ${count} reviews`}>
      <div className="flex gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map(index => {
          const fill = Math.max(0, Math.min(1, average - index)) * 100;
          return (
            <span key={index} className="relative h-3.5 w-3.5 text-slate-200">
              <Star className="absolute inset-0 h-3.5 w-3.5" />
              <span className="absolute inset-0 overflow-hidden text-amber-400" style={{ width: `${fill}%` }}>
                <Star className="h-3.5 w-3.5 fill-amber-400" />
              </span>
            </span>
          );
        })}
      </div>
      <span className="text-xs font-bold text-slate-700">{average.toFixed(1)}</span>
      <span className="text-xs text-slate-400">{compact ? `(${count})` : `(${count} ${count === 1 ? 'review' : 'reviews'})`}</span>
    </div>
  );
};
