"use client";
import React, { useState, useEffect } from 'react';
import { api } from '../../../../services/api';
import { Plus, Edit2, Trash2, Search, Loader2, Package, Check, X } from 'lucide-react';
import { Product } from '../../../../types';

export const AdminBundlesPageClient = () => {
  const [bundles, setBundles] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bundlesRes, productsRes] = await Promise.all([
        api.getBundles(),
        api.getProducts()
      ]);
      setBundles(bundlesRes.bundles || []);
      setProducts(productsRes.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteBundle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return;
    try {
      await api.deleteBundle(id);
      fetchData();
    } catch (e) {
      alert('Failed to delete bundle');
    }
  };

  const filteredBundles = bundles.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black text-slate-900">Bundles</h1>
          <p className="text-xs font-medium text-slate-500">Manage curated product sets and discounts.</p>
        </div>
        <button type="button" onClick={() => setEditing({})} className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-2.5 text-xs font-bold text-white shadow-md">
          <Plus className="h-4 w-4" /> Add Bundle
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bundles..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm" />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
      ) : filteredBundles.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredBundles.map(bundle => (
            <article key={bundle.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h2 className="font-heading text-lg font-black text-slate-900">{bundle.name}</h2>
                <p className="text-xs text-slate-500">/{bundle.slug}</p>
                <div className="mt-3 text-sm font-semibold text-rose-500">{bundle.discountPercent}% OFF</div>
                <div className="mt-2 text-xs text-slate-600">{bundle.products?.length || 0} product(s)</div>
                <div className={`mt-2 text-[10px] inline-block px-2 py-1 rounded-full font-bold ${bundle.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {bundle.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button type="button" onClick={() => setEditing(bundle)} className="rounded-xl p-2 text-sky-600 hover:bg-sky-50">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => deleteBundle(bundle.id)} className="rounded-xl p-2 text-rose-600 hover:bg-rose-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm font-semibold text-slate-500">
          No bundles found.
        </div>
      )}

      {editing && (
        <BundleModal bundle={editing} products={products} onClose={() => setEditing(null)} onRefresh={fetchData} />
      )}
    </div>
  );
};

const BundleModal = ({ bundle, products, onClose, onRefresh }: { bundle: any, products: Product[], onClose: () => void, onRefresh: () => void }) => {
  const isNew = !bundle.id;
  const [formData, setFormData] = useState({
    name: bundle.name || '',
    slug: bundle.slug || '',
    description: bundle.description || '',
    discountPercent: bundle.discountPercent || 0,
    isActive: bundle.isActive !== false,
    displayOrder: bundle.displayOrder || 0,
    products: bundle.products ? bundle.products.map((p: any) => ({ product_id: p.id, quantity: p.bundle_quantity || 1 })) : []
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await api.createBundle(formData);
      } else {
        await api.updateBundle(bundle.id, formData);
      }
      onRefresh();
      onClose();
    } catch (e: any) {
      alert(e.message || 'Failed to save bundle');
    } finally {
      setSaving(false);
    }
  };

  const toggleProduct = (id: string) => {
    setFormData(prev => {
      const exists = prev.products.find((p: any) => p.product_id === id);
      if (exists) {
        return { ...prev, products: prev.products.filter((p: any) => p.product_id !== id) };
      }
      return { ...prev, products: [...prev.products, { product_id: id, quantity: 1 }] };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-xl my-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black font-heading">{isNew ? 'Create Bundle' : 'Edit Bundle'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-xs font-bold">
              Name
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 w-full rounded-xl border p-2 text-sm" />
            </label>
            <label className="block text-xs font-bold">
              Slug
              <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="mt-1 w-full rounded-xl border p-2 text-sm" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-xs font-bold">
              Discount Percent (%)
              <input type="number" required value={formData.discountPercent} onChange={e => setFormData({...formData, discountPercent: Number(e.target.value)})} className="mt-1 w-full rounded-xl border p-2 text-sm" />
            </label>
            <label className="flex items-center gap-2 text-xs font-bold mt-6">
              <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded text-rose-500" />
              Active
            </label>
          </div>
          <div>
            <label className="block text-xs font-bold mb-2">Select Products</label>
            <div className="max-h-60 overflow-y-auto border rounded-xl p-2 space-y-2">
              {products.map(p => (
                <label key={p.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <input type="checkbox" checked={formData.products.some((fp: any) => fp.product_id === p.id)} onChange={() => toggleProduct(p.id)} className="rounded" />
                  <span className="text-sm font-semibold">{p.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl font-bold text-white bg-rose-500 text-sm flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Bundle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
