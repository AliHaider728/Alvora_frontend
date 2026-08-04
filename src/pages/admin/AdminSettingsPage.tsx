import React, { useState } from 'react';
import { Save, CheckCircle2, ShieldCheck, DollarSign, Globe, Sliders } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { SeoHead } from '../../components/common/SeoHead';
import { getLastApiError } from '../../services/api';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const { showToast } = useToast();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [currency, setCurrency] = useState(settings.currency);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold);
  const [standardShippingFee, setStandardShippingFee] = useState(settings.standardShippingFee);
  const [taxRate, setTaxRate] = useState(settings.taxRate * 100);
  const [metaTitle, setMetaTitle] = useState(settings.metaTitle);
  const [metaDescription, setMetaDescription] = useState(settings.metaDescription);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const saved = await updateSettings({
      storeName,
      email,
      phone,
      address,
      currency,
      freeShippingThreshold: Number(freeShippingThreshold),
      standardShippingFee: Number(standardShippingFee),
      taxRate: Number(taxRate) / 100,
      metaTitle,
      metaDescription
    });
    setSaving(false);
    showToast(saved ? 'Store settings updated successfully.' : getLastApiError() || 'Could not save store settings.', saved ? 'success' : 'error');
  };

  return (
    <div className="space-y-6 font-sans">
      <SeoHead title="Store Settings & Configuration" />

      <div>
        <h1 className="font-heading font-black text-2xl text-slate-900">Store Settings & Delivery Rates</h1>
        <p className="text-xs text-slate-500 font-medium">Configure store details, free shipping threshold in PKR, delivery charges, and SEO defaults.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Profile */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-rose-500" />
            <span>General Store Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Store Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Currency Code / Symbol</label>
              <input
                type="text"
                required
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Support Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone / WhatsApp Contact</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Store Location Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Taxes */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <span>Shipping & Tax Rates</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Free Shipping Minimum (Rs.)</label>
              <input
                type="number"
                required
                value={freeShippingThreshold}
                onChange={e => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Standard Flat Delivery Fee (Rs.)</label>
              <input
                type="number"
                step="1"
                required
                value={standardShippingFee}
                onChange={e => setStandardShippingFee(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Estimated Sales Tax (%)</label>
              <input
                type="number"
                step="0.1"
                required
                value={taxRate}
                onChange={e => setTaxRate(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Default SEO Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-500" />
            <span>Global SEO Default Meta</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Default Title Template</label>
              <input
                type="text"
                required
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Default Meta Description</label>
              <textarea
                rows={2}
                required
                value={metaDescription}
                onChange={e => setMetaDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-extrabold text-xs shadow-md flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-amber-400" />
          <span>{saving ? 'Saving…' : 'Save Store Settings'}</span>
        </button>
      </form>
    </div>
  );
};
