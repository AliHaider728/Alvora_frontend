"use client";
import React from 'react';
import { Plus, Trash2, Tag, Gift } from 'lucide-react';
import { PricingOffers, QuantityBreakTier } from '../../../types';

// Re-use the same fieldClassName constant pattern from AdminProductFormPageClient
const fieldCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100';

const smallFieldCls =
  'w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100';

// ─────────────────────────────────────────────────────────────────────────────
// Toggle — matches the style used elsewhere in the admin panel
// ─────────────────────────────────────────────────────────────────────────────
const Toggle: React.FC<{
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}> = ({ checked, onChange, label, description }) => (
  <label className="flex cursor-pointer items-start gap-3">
    <div className="relative mt-0.5 shrink-0">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <div
        className={`h-5 w-9 rounded-full transition-colors duration-200 ${
          checked ? 'bg-rose-500' : 'bg-slate-200'
        }`}
      />
      <div
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </div>
    <div>
      <span className="text-sm font-bold text-slate-800">{label}</span>
      {description && (
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      )}
    </div>
  </label>
);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const calcSaveAmount = (tier1Price: number, tierPrice: number, minQty: number): number => {
  if (!tier1Price || tierPrice >= tier1Price) return 0;
  return (tier1Price - tierPrice) * minQty;
};

const formatAutoLabel = (minQty: number, saveAmount: number): string => {
  if (saveAmount > 0) return `Buy ${minQty}, Save Rs. ${saveAmount}`;
  return `Buy ${minQty}`;
};

const emptyTier = (): QuantityBreakTier => ({
  minQty: 1,
  pricePerUnit: 0,
  label: '',
  badge: ''
});

const DEFAULT_OFFERS: PricingOffers = {
  quantityBreaks: { enabled: false, tiers: [] },
  bogo: { enabled: false, buyQty: 2, getQty: 1, label: '' }
};

// ─────────────────────────────────────────────────────────────────────────────
// PricingOffersSection
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  value: PricingOffers;
  onChange: (next: PricingOffers) => void;
  /** Base product price (or sale price) used to compute Save % for tier rows */
  basePrice: number;
}

export const PricingOffersSection: React.FC<Props> = ({ value, onChange, basePrice }) => {
  const offers = value || DEFAULT_OFFERS;
  const qb = offers.quantityBreaks;
  const bogo = offers.bogo;

  // Tier 1 price — if there are tiers, use the first one's price; else use basePrice
  const tier1Price =
    qb.tiers.length > 0
      ? qb.tiers[0].pricePerUnit
      : basePrice;

  const setQb = (next: Partial<typeof qb>) =>
    onChange({ ...offers, quantityBreaks: { ...qb, ...next } });

  const setBogo = (next: Partial<typeof bogo>) =>
    onChange({ ...offers, bogo: { ...bogo, ...next } });

  const addTier = () => {
    const lastQty = qb.tiers[qb.tiers.length - 1]?.minQty ?? 0;
    setQb({
      tiers: [
        ...qb.tiers,
        { ...emptyTier(), minQty: lastQty + 1, pricePerUnit: basePrice }
      ]
    });
  };

  const updateTier = (index: number, patch: Partial<QuantityBreakTier>) => {
    const tiers = qb.tiers.map((t, i) => (i === index ? { ...t, ...patch } : t));
    setQb({ tiers });
  };

  const removeTier = (index: number) => {
    setQb({ tiers: qb.tiers.filter((_, i) => i !== index) });
  };

  // Auto-generate BOGO label from numbers when the label field is empty
  const bogoAutoLabel = `Buy ${bogo.buyQty}, Get ${bogo.getQty} Free`;

  return (
    <div className="space-y-8">

      {/* ── Section A: Quantity Breaks ───────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Tag className="h-4 w-4 text-rose-500" />
          <h3 className="font-heading text-sm font-black text-slate-800 uppercase tracking-wider">
            Quantity Breaks
          </h3>
        </div>

        <Toggle
          checked={qb.enabled}
          onChange={enabled => setQb({ enabled })}
          label="Enable Quantity Breaks"
          description="Show tiered pricing cards on the product page. Customers tap a card to select that quantity and see the discounted price."
        />

        {qb.enabled && (
          <div className="space-y-3 pl-0 pt-1">
            {qb.tiers.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-400">
                No tiers yet. Click &ldquo;Add Tier&rdquo; to create your first pricing tier.
              </p>
            )}

            {/* Tier rows */}
            <div className="space-y-2">
              {qb.tiers.map((tier, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[60px_1fr_1fr_1fr_48px_40px] gap-2 items-start rounded-2xl border border-slate-100 bg-slate-50/60 p-3"
                >
                  {/* Min Qty */}
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Min Qty
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={tier.minQty}
                      onChange={e => updateTier(i, { minQty: Number(e.target.value) })}
                      className={smallFieldCls}
                    />
                  </div>

                  {/* Price / Unit */}
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Price/Unit
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={tier.pricePerUnit}
                      onChange={e => updateTier(i, { pricePerUnit: Number(e.target.value) })}
                      className={smallFieldCls}
                    />
                  </div>

                  {/* Label */}
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Label
                    </label>
                    <input
                      type="text"
                      maxLength={120}
                      placeholder={formatAutoLabel(tier.minQty, calcSaveAmount(tier1Price, tier.pricePerUnit, tier.minQty))}
                      value={tier.label}
                      onChange={e => updateTier(i, { label: e.target.value })}
                      className={smallFieldCls}
                    />
                  </div>

                  {/* Badge */}
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Badge
                    </label>
                    <input
                      type="text"
                      maxLength={60}
                      placeholder="e.g. Most Popular"
                      value={tier.badge}
                      onChange={e => updateTier(i, { badge: e.target.value })}
                      className={smallFieldCls}
                    />
                  </div>

                  {/* Save Rs (read-only) */}
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Save
                    </label>
                    <div className="flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-emerald-50 px-2 text-xs font-bold text-emerald-700 whitespace-nowrap">
                      {i === 0 ? 'base' : `Rs. ${calcSaveAmount(tier1Price, tier.pricePerUnit, tier.minQty)}`}
                    </div>
                  </div>

                  {/* Delete */}
                  <div className="pt-5">
                    <button
                      type="button"
                      onClick={() => removeTier(i)}
                      aria-label={`Remove tier ${i + 1}`}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addTier}
              className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:border-rose-400 hover:text-rose-600 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Tier
            </button>
          </div>
        )}
      </div>

      {/* ── Section B: BOGO ──────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Gift className="h-4 w-4 text-emerald-500" />
          <h3 className="font-heading text-sm font-black text-slate-800 uppercase tracking-wider">
            Buy X Get Y Free (BOGO)
          </h3>
        </div>

        <Toggle
          checked={bogo.enabled}
          onChange={enabled => setBogo({ enabled })}
          label="Enable Buy X Get Y Free"
          description="Award free units when a customer buys a qualifying quantity. Repeating — buying 4 on a 'Buy 2 Get 1' offer yields 2 free units."
        />

        {bogo.enabled && (
          <div className="space-y-4 pl-0 pt-1">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {/* Buy Qty */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Buy Qty (paid)
                </label>
                <input
                  type="number"
                  min={1}
                  value={bogo.buyQty}
                  onChange={e => {
                    const buyQty = Math.max(1, Number(e.target.value));
                    // Auto-generate label if it was auto-generated previously
                    const wasAuto = bogo.label === bogoAutoLabel || bogo.label === '';
                    setBogo({
                      buyQty,
                      label: wasAuto ? '' : bogo.label
                    });
                  }}
                  className={fieldCls}
                />
              </div>

              {/* Get Qty */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Get Qty (free)
                </label>
                <input
                  type="number"
                  min={1}
                  value={bogo.getQty}
                  onChange={e => {
                    const getQty = Math.max(1, Number(e.target.value));
                    const wasAuto = bogo.label === bogoAutoLabel || bogo.label === '';
                    setBogo({
                      getQty,
                      label: wasAuto ? '' : bogo.label
                    });
                  }}
                  className={fieldCls}
                />
              </div>

              {/* Live preview */}
              <div className="col-span-2 sm:col-span-1 flex items-end">
                <div className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-800">
                  🎁 {bogoAutoLabel}
                </div>
              </div>
            </div>

            {/* Custom label */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Offer Label{' '}
                <span className="font-normal text-slate-400">
                  (leave empty to use auto-generated: &ldquo;{bogoAutoLabel}&rdquo;)
                </span>
              </label>
              <input
                type="text"
                maxLength={120}
                placeholder={bogoAutoLabel}
                value={bogo.label}
                onChange={e => setBogo({ label: e.target.value })}
                className={fieldCls}
              />
            </div>

            {bogo.buyQty <= bogo.getQty && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
                ⚠ Buy Qty must be greater than Get Qty (e.g. Buy 2, Get 1).
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
