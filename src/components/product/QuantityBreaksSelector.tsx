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
    <div className="mt-5 mb-2">
      <h3 className="mb-2 text-sm font-bold text-slate-800">Select Quantity Offer</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
              className={`relative flex flex-col items-start rounded-xl p-2.5 text-left transition-all duration-200 ${
                isActive
                  ? 'border-2 border-[#9C4122] bg-[#FAF3F0] shadow-sm'
                  : 'border border-[#EDE5DC] bg-white hover:border-[#C48B80] hover:shadow-sm'
              }`}
            >
              {/* Radio Indicator */}
              <div className="absolute right-2.5 top-2.5">
                {isActive ? (
                  <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-[#9C4122]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#9C4122]" />
                  </div>
                ) : (
                  <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-slate-300" />
                )}
              </div>

              {/* Badges */}
              <div className="mb-1.5 flex w-full flex-wrap gap-1.5 pr-6">
                {tier.badge && (
                  <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider ${
                    isActive ? 'bg-[#9C4122] text-white' : 'bg-[#9C4122] text-white'
                  }`}>
                    {tier.badge}
                  </span>
                )}
                {savePct > 0 && (
                  <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-100/50">
                    Save {savePct}%
                  </span>
                )}
                {/* Fallback to keep layout stable if no badges */}
                {!tier.badge && savePct === 0 && <div className="h-[18px]"></div>}
              </div>

              {/* Content */}
              <div className="flex w-full flex-col">
                <div className="flex items-baseline gap-1">
                  <span className={`text-[15px] font-black ${isActive ? 'text-[#9C4122]' : 'text-slate-900'}`}>
                    Rs. {tier.pricePerUnit.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">/each</span>
                </div>
                <span className={`mt-0.5 text-[11px] font-semibold ${isActive ? 'text-[#9C4122]/90' : 'text-slate-500'}`}>
                  {tier.label || (savePct > 0 ? `Buy ${tier.minQty}, Save Rs. ${(tier1Price - tier.pricePerUnit) * tier.minQty}` : `Buy ${tier.minQty}`)}
                </span>
                
                {isActive && (
                  <div className="mt-1.5 w-full border-t border-[#9C4122]/15 pt-1.5 flex items-center justify-between">
                    <span className="block text-[10px] font-bold text-[#9C4122]">
                      Total: Rs. {(tier.pricePerUnit * tier.minQty).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {activeTier && (
        <div className="mt-2 flex justify-start">
          <button 
            type="button"
            onClick={() => onTierSelect(activeTier, true)}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-[#9C4122] transition-colors"
          >
            <X className="h-3 w-3" /> Clear selection
          </button>
        </div>
      )}
    </div>
  );
};
