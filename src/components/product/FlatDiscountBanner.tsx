import React from 'react';
import { BadgePercent } from 'lucide-react';
import { FlatDiscount } from '../../types';

interface FlatDiscountBannerProps {
  flatDiscount: FlatDiscount | undefined;
  selectedQuantity: number;
  isOverridden?: boolean;
}

export const FlatDiscountBanner: React.FC<FlatDiscountBannerProps> = ({ flatDiscount, selectedQuantity, isOverridden = false }) => {
  if (!flatDiscount?.enabled || flatDiscount.minQty < 1 || isOverridden) {
    return null;
  }

  const isApplied = selectedQuantity >= flatDiscount.minQty;
  const flatAutoLabel = flatDiscount.discountType === 'percentage'
    ? `Buy ${flatDiscount.minQty}+, Save ${flatDiscount.discountValue}%/unit`
    : `Buy ${flatDiscount.minQty}+, Save Rs. ${flatDiscount.discountValue}/unit`;
  const displayLabel = flatDiscount.label || flatAutoLabel;

  return (
    <div className={`mt-5 w-full overflow-hidden rounded-2xl border ${isApplied ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-slate-50'}`}>
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
        <div className={`flex shrink-0 items-center justify-center rounded-xl p-2 ${isApplied ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
          <BadgePercent className="h-5 w-5" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className={`truncate text-sm font-black ${isApplied ? 'text-indigo-900' : 'text-slate-700'}`}>
            {displayLabel}
          </span>
          <span className={`truncate text-xs font-bold ${isApplied ? 'text-indigo-700' : 'text-slate-500'}`}>
            {isApplied
              ? `Offer active for ${selectedQuantity} units`
              : `Add ${flatDiscount.minQty - selectedQuantity} more to unlock this discount`}
          </span>
        </div>
      </div>
      {isApplied && (
        <div className="bg-indigo-600 px-4 py-2 text-center text-[10px] font-black uppercase tracking-wider text-white">
          Offer applied successfully
        </div>
      )}
    </div>
  );
};
