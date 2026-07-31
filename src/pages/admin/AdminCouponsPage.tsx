import React, { useState } from 'react';
import { Plus, Tag, Trash2, X, Percent, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';
import { SeoHead } from '../../components/common/SeoHead';
import { formatPrice } from '../../utils/formatters';

export const AdminCouponsPage: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [amount, setAmount] = useState(10);
  const [minSpend, setMinSpend] = useState(30);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon({
      code: code.toUpperCase(),
      discountType,
      amount: Number(amount),
      minSpend: Number(minSpend),
      expiryDate,
      usageLimit: 500,
      isActive: true
    });
    setIsModalOpen(false);
    setCode('');
  };

  return (
    <div className="space-y-6 font-sans">
      <SeoHead title="Manage Coupons & Discounts" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-2xl text-slate-900">Promo Coupons & Deals</h1>
          <p className="text-xs text-slate-500 font-medium">Create promotional discount codes and percentage vouchers.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-rose-500 text-white font-heading font-bold text-xs flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map(coup => (
          <div key={coup.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono font-black text-base text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                {coup.code}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${coup.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                {coup.isActive ? 'Active' : 'Disabled'}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-heading font-black text-xl text-rose-500 block">
                {coup.discountType === 'percentage' ? `${coup.amount}% OFF` : `${formatPrice(coup.amount)} OFF`}
              </span>
              <p className="text-slate-500 font-medium">Min spend: {formatPrice(coup.minSpend)}</p>
              <p className="text-slate-400 text-[11px]">Used {coup.usedCount} times &bull; Expires {coup.expiryDate}</p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => deleteCoupon(coup.id)}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs flex items-center gap-1 font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-lg text-slate-900">Create Promo Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TOYFUN20"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Amount</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Min Spend (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={minSpend}
                    onChange={e => setMinSpend(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-md"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
