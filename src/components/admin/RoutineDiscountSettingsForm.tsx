'use client';

import { useEffect, useState } from 'react';
import { Plus, Save, Trash2, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api, getLastApiError } from '../../services/api';
import { normalizeRoutineSettings, validateRoutineSettings, type RoutineDiscountSettings } from '../../lib/routineDiscount';

export function RoutineDiscountSettingsForm() {
  const { settings, saveRoutineDiscountSettings } = useStore();
  const [draft, setDraft] = useState<RoutineDiscountSettings>(() => normalizeRoutineSettings(settings.routineDiscount));
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const load = async () => {
    setLoading(true);
    const result = await api.getRoutineSettings();
    if (result) { setDraft(result); setError(''); setLoaded(true); }
    else setError(getLastApiError() || 'Could not load routine settings. Retry before editing.');
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);
  const change = (next: RoutineDiscountSettings) => { setDraft(next); setSaved(false); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(false);
    let validated;
    try { validated = validateRoutineSettings(draft); }
    catch (error) { setError((error as Error).message); return; }
    setSaving(true);
    const success = await saveRoutineDiscountSettings(validated);
    setSaving(false);
    if (success) { setDraft(validated); setError(''); setSaved(true); }
    else setError(getLastApiError() || 'Could not save routine discounts.');
  };
  const field = 'w-full rounded-xl border border-[#E7D9D0] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48B80]';

  return <div className="max-w-4xl space-y-6">
    <div><h1 className="text-2xl font-bold">Build Your Routine</h1><p className="mt-2 text-sm text-[#74665C]">Configure savings for the routine builder, cart and checkout.</p></div>
    {error && <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-800">{error} <button type="button" onClick={load} className="ml-2 underline">Reload saved settings</button></div>}
    {saved && <p role="status" className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">Routine discounts saved. New calculations use these settings.</p>}
    {loading ? <p role="status">Loading saved discounts…</p> : loaded && <form onSubmit={submit} className="space-y-6">
      <fieldset disabled={saving} className="space-y-6 disabled:opacity-60">
        <section className="rounded-3xl border border-[#E7D9D0] bg-gradient-to-br from-[#F7E5DE] to-[#FFFCF8] p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><Sparkles size={19} className="text-[#9C4122]" />Unlocking the discount</h2>
          <label htmlFor="routine-minimum" className="mb-2 block text-sm font-medium">Minimum distinct products</label>
          <input id="routine-minimum" type="number" required min="1" max="100" step="1" value={draft.minimumDistinctProducts} onChange={e => change({ ...draft, minimumDistinctProducts: Number(e.target.value) })} className={`${field} max-w-xs`} />
          <p className="mt-3 text-xs leading-relaxed text-[#74665C]">Different quantities or variants of the same product count as one distinct product. Below this minimum, neither the tier discount nor the quantity bonus applies.</p>
        </section>
        <section className="rounded-3xl border border-[#E7D9D0] bg-white p-6">
          <h2 className="font-semibold">Discount tiers</h2>
          <p className="mb-5 mt-2 text-sm text-[#74665C]">The highest qualifying product-count tier applies. Each tier continues until the next threshold.</p>
          <div className="space-y-3">{draft.tiers.map((tier, index) => <div key={index} className="flex items-end gap-3 rounded-2xl bg-[#FAF6F2] p-3">
            <label className="flex-1 text-xs font-medium">Distinct products (at least)<input aria-label={`Tier ${index + 1} product count`} type="number" required min="1" max="100" step="1" value={tier.minProducts} onChange={e => change({ ...draft, tiers: draft.tiers.map((item, i) => i === index ? { ...item, minProducts: Number(e.target.value) } : item) })} className={`${field} mt-2`} /></label>
            <label className="flex-1 text-xs font-medium">Discount (%)<input aria-label={`Tier ${index + 1} discount`} type="number" required min="0" max="100" step="0.1" value={tier.discountPercent} onChange={e => change({ ...draft, tiers: draft.tiers.map((item, i) => i === index ? { ...item, discountPercent: Number(e.target.value) } : item) })} className={`${field} mt-2`} /></label>
            <button type="button" aria-label={`Remove tier ${index + 1}`} disabled={draft.tiers.length === 1} onClick={() => change({ ...draft, tiers: draft.tiers.filter((_, i) => i !== index) })} className="rounded-xl p-3 text-[#9C4122] hover:bg-[#F1C9BD]/30 disabled:opacity-30"><Trash2 size={18} /></button>
          </div>)}</div>
          <button type="button" onClick={() => change({ ...draft, tiers: [...draft.tiers, { minProducts: Math.max(...draft.tiers.map(t => t.minProducts)) + 1, discountPercent: 0 }] })} className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#9C4122]"><Plus size={17} />Add tier</button>
        </section>
        <section className="rounded-3xl border border-[#E7D9D0] bg-white p-6">
          <h2 className="mb-4 font-semibold">Flat quantity bonus</h2>
          <label className="mb-5 flex items-center gap-3 text-sm"><input type="checkbox" checked={draft.quantityBonusEnabled} onChange={e => change({ ...draft, quantityBonusEnabled: e.target.checked })} className="h-5 w-5 accent-[#9C4122]" />Enable extra savings for duplicate quantities</label>
          <label htmlFor="routine-bonus" className="mb-2 block text-sm font-medium">Additional discount (%)</label>
          <input id="routine-bonus" type="number" required min="0" max="100" step="0.1" disabled={!draft.quantityBonusEnabled} value={draft.quantityBonusPercent} onChange={e => change({ ...draft, quantityBonusPercent: Number(e.target.value) })} className={`${field} max-w-xs disabled:opacity-50`} />
          <p className="mt-3 text-xs leading-relaxed text-[#74665C]">Added once when total paid quantity exceeds the distinct product count. More duplicates never multiply the bonus. The tier plus bonus cannot exceed 100%.</p>
        </section>
        <button type="submit" className="flex items-center gap-2 rounded-xl bg-[#9C4122] px-6 py-3 text-sm font-semibold text-white hover:bg-[#80351C]"><Save size={18} />{saving ? 'Saving…' : 'Save routine discounts'}</button>
      </fieldset>
    </form>}
  </div>;
}
