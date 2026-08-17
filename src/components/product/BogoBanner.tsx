import React from 'react';
import { Gift } from 'lucide-react';
import { Bogo } from '../../types';

interface BogoBannerProps {
  bogo: Bogo;
  selectedQuantity: number;
}

export const BogoBanner: React.FC<BogoBannerProps> = ({ bogo, selectedQuantity }) => {
  if (!bogo?.enabled || bogo.buyQty < 1 || bogo.getQty < 1) {
    return null;
  }

  const freeUnits = Math.floor(selectedQuantity / bogo.buyQty) * bogo.getQty;
  const autoLabel = `Buy ${bogo.buyQty}, Get ${bogo.getQty} Free`;
  const displayLabel = bogo.label || autoLabel;

  return (
    <div className="mt-5 w-full overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
        <div className="flex shrink-0 items-center justify-center rounded-xl bg-emerald-100 p-2 text-emerald-600">
          <Gift className="h-5 w-5" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-black text-emerald-900">
            {displayLabel}
          </span>
          <span className="truncate text-xs font-bold text-emerald-700">
            {freeUnits > 0
              ? `Currently: ${freeUnits} free unit${freeUnits === 1 ? '' : 's'} applied`
              : `Add ${bogo.buyQty - (selectedQuantity % bogo.buyQty)} more to get ${bogo.getQty} free`}
          </span>
        </div>
      </div>
      {freeUnits > 0 && (
        <div className="bg-emerald-600 px-4 py-2 text-center text-[10px] font-black uppercase tracking-wider text-white">
          Offer applied successfully
        </div>
      )}
    </div>
  );
};
