import React from 'react';
import { QuantityBreaks, QuantityBreakTier } from '../../types';
import { X } from 'lucide-react';

interface QuantityBreaksSelectorProps {
  quantityBreaks: QuantityBreaks;
  basePrice: number;
  selectedQuantity: number;
  onTierSelect: (tier: QuantityBreakTier, isActive: boolean) => void;
}

export const QuantityBreaksSelector: React.FC<QuantityBreaksSelectorProps> = ({
  quantityBreaks,
  basePrice,
  selectedQuantity,
  onTierSelect
}) => {
  if (!quantityBreaks?.enabled || !quantityBreaks.tiers || quantityBreaks.tiers.length === 0) {
    return null;
  }

  // Sort tiers ascending by minQty to display them in logical order
  const sortedTiers = [...quantityBreaks.tiers].sort((a, b) => a.minQty - b.minQty);
  
  // Find the currently active tier (highest minQty <= selectedQuantity)
  const activeTierIndex = [...sortedTiers].reverse().findIndex(t => selectedQuantity >= t.minQty);
  const activeTier = activeTierIndex !== -1 ? sortedTiers[sortedTiers.length - 1 - activeTierIndex] : null;

  // The base price is considered tier 1 price if there's no tier 1
  const tier1Price = sortedTiers[0]?.pricePerUnit || basePrice;

  return (
    <div className="mt-6 mb-2">
      <h3 className="mb-3 text-sm font-bold text-slate-800">Select Quantity Offer</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sortedTiers.map((tier) => {
          const isActive = activeTier?.minQty === tier.minQty;
          
          let savePct = 0;
          if (tier1Price > 0 && tier.pricePerUnit < tier1Price) {
            savePct = Math.round(((tier1Price - tier.pricePerUnit) / tier1Price) * 100);
          }

          return (
            <button
              key={tier.minQty}
              type="button"
              onClick={() => onTierSelect(tier, isActive)}
              className={`relative flex flex-col items-start rounded-2xl border-2 p-3 text-left transition-all ${
                isActive
                  ? 'border-[#C48B80] bg-rose-50/50 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-rose-200 hover:bg-rose-50/30'
              }`}
            >
              {/* Deselect Indicator / Radio */}
              <div className="absolute right-3 top-3">
                {isActive ? (
                  <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#C48B80] bg-rose-100/50 px-2 py-1 rounded-full border border-[#C48B80]/30 hover:bg-[#C48B80] hover:text-white transition-colors" title="Click to remove selection">
                    <X className="h-3 w-3" /> Remove
                  </div>
                ) : (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-300 transition-colors" />
                )}
              </div>

              {/* Badges */}
              <div className="mb-1.5 flex w-full flex-wrap gap-1.5 pr-8">
                {tier.badge && (
                  <span className={`inline-flex items-center rounded-lg px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                    isActive ? 'bg-[#C48B80] text-white' : 'bg-slate-800 text-white'
                  }`}>
                    {tier.badge}
                  </span>
                )}
                {savePct > 0 && (
                  <span className="inline-flex items-center rounded-lg bg-emerald-100 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700">
                    Save {savePct}%
                  </span>
                )}
              </div>

              {/* Label & Price */}
              <div className="mt-1 flex w-full flex-col">
                <span className={`text-sm font-bold leading-tight ${isActive ? 'text-[#C48B80]' : 'text-slate-700'}`}>
                  {tier.label || (savePct > 0 ? `Buy ${tier.minQty}, Save Rs. ${(tier1Price - tier.pricePerUnit) * tier.minQty}` : `Buy ${tier.minQty}`)}
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className={`text-lg font-black ${isActive ? 'text-[#C48B80]' : 'text-slate-900'}`}>
                    Rs. {tier.pricePerUnit.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-500">/ each</span>
                </div>
                {isActive && (
                  <span className="mt-1 block text-[11px] font-bold text-[#C48B80]">
                    Total: Rs. {(tier.pricePerUnit * tier.minQty).toLocaleString()}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
