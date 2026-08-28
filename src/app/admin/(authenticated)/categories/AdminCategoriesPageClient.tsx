"use client";
import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Edit2, Image as ImageIcon, Loader2, Plus, Search, ShieldAlert, Trash2, X } from 'lucide-react';
import { useStore } from '../../../../context/StoreContext';
import { useToast } from '../../../../context/ToastContext';
import { Category } from '../../../../types';

import { CategoryFormModal } from '../../../../components/admin/CategoryFormModal';
import { api, getLastApiError, isSuperAdmin } from '../../../../services/api';
import { getSafeImageSrc } from '../../../../utils/images';

type Filter = 'all' | 'active' | 'hidden' | 'featured';
type DeleteState = { category: Category; productCount: number; navigationCount: number; navigationItems: { id: string; label: string }[] };

export const AdminCategoriesPageClient: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Category | null | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null);
  const [checkingDelete, setCheckingDelete] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [productResolution, setProductResolution] = useState<'uncategorized' | 'reassign'>('uncategorized');
  const [navigationResolution, setNavigationResolution] = useState<'remove' | 'reassign'>('remove');
  const [targetCategoryId, setTargetCategoryId] = useState('');
  const allowed = isSuperAdmin();

  const visibleCategories = useMemo(() => categories
    .filter(category => `${category.name} ${category.slug} ${category.shortDescription || ''}`.toLowerCase().includes(search.trim().toLowerCase()))
    .filter(category => filter === 'all' || (filter === 'active' ? category.isActive !== false : filter === 'hidden' ? category.isActive === false : category.isFeatured === true))
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)), [categories, filter, search]);

  const requestDelete = async (category: Category) => {
    setCheckingDelete(category.id);
    const impact = await api.getCategoryDeleteImpact(category.id);
    setCheckingDelete('');
    if (!impact) { toast.error(getLastApiError() || 'Could not inspect category references.'); return; }
    setProductResolution('uncategorized'); setNavigationResolution('remove'); setTargetCategoryId('');
    setDeleteState({ category, productCount: impact.productCount || 0, navigationCount: impact.navigationCount || 0, navigationItems: impact.navigationItems || [] });
  };

  const confirmDelete = async () => {
    if (!deleteState || ((productResolution === 'reassign' || navigationResolution === 'reassign') && !targetCategoryId)) { toast.warning('Choose a replacement category first.'); return; }
    setDeleting(true);
    const result = await deleteCategory(deleteState.category.id, { resolution: productResolution, navigationResolution, targetCategoryId });
    setDeleting(false);
    if (!result) { toast.error(getLastApiError() || 'Category could not be deleted.'); return; }
    const detail = result.productsReassigned ? ` ${result.productsReassigned} product${result.productsReassigned === 1 ? '' : 's'} reassigned.` : '';
    toast.success(`Category deleted.${detail}`);
    setDeleteState(null);
  };

  const move = async (category: Category, direction: -1 | 1) => {
    const ordered = [...categories].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    const index = ordered.findIndex(item => item.id === category.id); const target = index + direction;
    if (target < 0 || target >= ordered.length) return;
    const loading = toast.loading('Saving category order…');
    const other = ordered[target];
    const [first, second] = await Promise.all([
      updateCategory(category.id, { displayOrder: other.displayOrder ?? target }),
      updateCategory(other.id, { displayOrder: category.displayOrder ?? index })
    ]);
    toast.update(loading, first && second ? 'Category order updated.' : (getLastApiError() || 'Could not update category order.'), first && second ? 'success' : 'error');
  };

  const toggle = async (category: Category, field: 'isActive' | 'isFeatured' | 'showInNavigation') => {
    const saved = await updateCategory(category.id, { [field]: !category[field] });
    if (!saved) toast.error(getLastApiError() || 'Could not update the category.');
    else toast.success(field === 'isActive' ? `Category ${saved.isActive ? 'shown' : 'hidden'}.` : field === 'isFeatured' ? `Category ${saved.isFeatured ? 'featured' : 'unfeatured'}.` : `Category ${saved.showInNavigation ? 'added to' : 'removed from'} navigation.`);
  };

  if (!allowed) return <div className="max-w-xl rounded-3xl border border-amber-200 bg-amber-50 p-8"><ShieldAlert className="mb-3 h-8 w-8 text-amber-600" /><h1 className="font-heading text-xl font-black text-slate-900">Super Admin access required</h1><p className="mt-2 text-sm text-slate-600">Normal Admins can assign existing categories from the product editor, but cannot change category structure.</p></div>;

  return <div className="space-y-6 font-sans">
    
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="font-heading text-2xl font-black text-slate-900">Categories</h1><p className="text-xs font-medium text-slate-500">Database-driven collections used across products, filters, homepage and navigation.</p></div><button type="button" onClick={() => setEditing(null)} className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-2.5 text-xs font-bold text-white shadow-md"><Plus className="h-4 w-4" /> Add Category</button></div>
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
      <label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories…" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm" /></label>
      <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">{(['all', 'active', 'hidden', 'featured'] as Filter[]).map(value => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-lg px-3 py-2 text-xs font-bold capitalize ${filter === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{value}</button>)}</div>
    </div>
    {visibleCategories.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visibleCategories.map((category, index) => <article key={category.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex gap-4">{category.image ? <img src={getSafeImageSrc(category.image)} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-300"><ImageIcon /></div>}<div className="min-w-0 flex-1"><h2 className="truncate font-heading text-base font-black text-slate-900">{category.name}</h2><p className="truncate text-[11px] text-slate-400">/{category.slug}</p><p className="mt-1 text-xs font-bold text-sky-700">{category.itemCount || 0} products</p></div><div className="flex flex-col gap-1"><button type="button" disabled={index === 0} onClick={() => void move(category, -1)} aria-label={`Move ${category.name} up`} className="rounded-lg border p-1.5 disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button><button type="button" disabled={index === visibleCategories.length - 1} onClick={() => void move(category, 1)} aria-label={`Move ${category.name} down`} className="rounded-lg border p-1.5 disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button></div></div>
      <p className="mt-4 min-h-10 text-xs leading-5 text-slate-600 line-clamp-2">{category.shortDescription || category.description || 'No description added.'}</p>
      <div className="mt-4 flex flex-wrap gap-2">{([['isActive', category.isActive !== false, 'Active', 'Hidden'], ['isFeatured', category.isFeatured === true, 'Featured', 'Not Featured'], ['showInNavigation', category.showInNavigation !== false, 'In Nav', 'Off Nav']] as const).map(([field, checked, yes, no]) => <button key={field} type="button" onClick={() => void toggle(category, field)} className={`rounded-full px-2.5 py-1 text-[10px] font-black ${checked ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{checked ? yes : no}</button>)}</div>
      <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3"><button type="button" onClick={() => setEditing(category)} aria-label={`Edit ${category.name}`} className="rounded-xl p-2 text-sky-600 hover:bg-sky-50"><Edit2 className="h-4 w-4" /></button><button type="button" disabled={checkingDelete === category.id} onClick={() => void requestDelete(category)} aria-label={`Delete ${category.name}`} className="rounded-xl p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50">{checkingDelete === category.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button></div>
    </article>)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm font-semibold text-slate-500">No categories match this view.</div>}

    {editing !== undefined && <CategoryFormModal category={editing} categories={categories} onClose={() => setEditing(undefined)} onSave={data => editing ? updateCategory(editing.id, data) : addCategory(data)} />}

    {deleteState && <div className="fixed inset-0 z-[108] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4" onMouseDown={e => { if (e.target === e.currentTarget && !deleting) setDeleteState(null); }}><div role="dialog" aria-modal="true" aria-labelledby="delete-category-title" className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4"><div><h2 id="delete-category-title" className="font-heading text-lg font-black text-slate-900">Delete this category?</h2><p className="mt-2 text-sm leading-6 text-slate-600"><strong>{deleteState.category.name}</strong> has {deleteState.productCount} affected product(s) and {deleteState.navigationCount} affected navigation item(s). Products will never be deleted.</p></div><button type="button" disabled={deleting} onClick={() => setDeleteState(null)} aria-label="Close" className="p-1 text-slate-400"><X className="h-5 w-5" /></button></div>
      {deleteState.productCount > 0 && <fieldset className="mt-5 space-y-2"><legend className="text-xs font-black text-slate-700">Products</legend><label className="flex gap-2 rounded-xl border p-3 text-xs font-semibold"><input type="radio" checked={productResolution === 'uncategorized'} onChange={() => setProductResolution('uncategorized')} /> Move products to Uncategorized</label><label className="flex gap-2 rounded-xl border p-3 text-xs font-semibold"><input type="radio" checked={productResolution === 'reassign'} onChange={() => setProductResolution('reassign')} /> Move products to another category</label></fieldset>}
      {deleteState.navigationCount > 0 && <fieldset className="mt-5 space-y-2"><legend className="text-xs font-black text-slate-700">Navigation links ({deleteState.navigationItems.map(item => item.label).join(', ')})</legend><label className="flex gap-2 rounded-xl border p-3 text-xs font-semibold"><input type="radio" checked={navigationResolution === 'remove'} onChange={() => setNavigationResolution('remove')} /> Remove affected navigation links</label><label className="flex gap-2 rounded-xl border p-3 text-xs font-semibold"><input type="radio" checked={navigationResolution === 'reassign'} onChange={() => setNavigationResolution('reassign')} /> Reassign links to another category</label></fieldset>}
      {(productResolution === 'reassign' || navigationResolution === 'reassign') && <label className="mt-4 block text-xs font-black text-slate-700">Replacement Category<select value={targetCategoryId} onChange={e => setTargetCategoryId(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="">Choose a category</option>{categories.filter(item => item.id !== deleteState.category.id).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" disabled={deleting} onClick={() => setDeleteState(null)} className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700">Cancel</button><button type="button" disabled={deleting} onClick={() => void confirmDelete()} className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">{deleting && <Loader2 className="h-4 w-4 animate-spin" />}{productResolution === 'reassign' ? 'Reassign and Delete' : 'Move to Uncategorized and Delete'}</button></div>
    </div></div>}
  </div>;
};
