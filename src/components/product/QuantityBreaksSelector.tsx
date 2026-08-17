import React from 'react';
import { QuantityBreaks, QuantityBreakTier } from '../../types';

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
              className={`relative flex flex-col items-start rounded-2xl border-2 p-4 text-left transition-all ${
                isActive
                  ? 'border-rose-500 bg-rose-50/50 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-rose-200 hover:bg-rose-50/30'
              }`}
            >
              {/* Radio Indicator */}
              <div className="absolute right-4 top-4">
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                  isActive ? 'border-rose-500' : 'border-slate-300'
                }`}>
                  {isActive && <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />}
                </div>
              </div>

              {/* Badges */}
              <div className="mb-2 flex w-full flex-wrap gap-2 pr-8">
                {tier.badge && (
                  <span className={`inline-flex items-center rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wider ${
                    isActive ? 'bg-rose-500 text-white' : 'bg-slate-800 text-white'
                  }`}>
                    {tier.badge}
                  </span>
                )}
                {savePct > 0 && (
                  <span className="inline-flex items-center rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Save {savePct}%
                  </span>
                )}
              </div>

              {/* Label & Price */}
              <div className="mt-1 flex w-full flex-col">
                <span className={`text-base font-bold leading-tight ${isActive ? 'text-rose-950' : 'text-slate-700'}`}>
                  {tier.label || (savePct > 0 ? `Buy ${tier.minQty}, Save Rs. ${(tier1Price - tier.pricePerUnit) * tier.minQty}` : `Buy ${tier.minQty}`)}
                </span>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className={`text-xl font-black ${isActive ? 'text-rose-600' : 'text-slate-900'}`}>
                    Rs. {tier.pricePerUnit.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-500">/ each</span>
                </div>
                {isActive && (
                  <span className="mt-1.5 block text-xs font-bold text-rose-500">
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
