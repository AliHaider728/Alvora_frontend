import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2, X } from 'lucide-react';
import { Category } from '../../types';
import { api, getLastApiError } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

type Props = {
  category?: Category | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: Partial<Category>) => Promise<Category | null>;
  onSaved?: (category: Category) => void;
  compact?: boolean;
};

export const CategoryFormModal: React.FC<Props> = ({ category, categories, onClose, onSave, onSaved, compact }) => {
  const { toast } = useToast();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [name, setName] = useState(category?.name || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [slugEdited, setSlugEdited] = useState(Boolean(category));
  const [shortDescription, setShortDescription] = useState(category?.shortDescription || '');
  const [description, setDescription] = useState(category?.description || '');
  const [image, setImage] = useState(category?.image || '');
  const [imagePublicId, setImagePublicId] = useState(category?.imagePublicId || '');
  const [newUploadId, setNewUploadId] = useState('');
  const [isActive, setIsActive] = useState(category?.isActive !== false);
  const [isFeatured, setIsFeatured] = useState(category?.isFeatured === true);
  const [showInNavigation, setShowInNavigation] = useState(category?.showInNavigation !== false);
  const [navigationLabel, setNavigationLabel] = useState(category?.navigationLabel || '');
  const [displayOrder, setDisplayOrder] = useState(category?.displayOrder ?? categories.length);
  const [parentCategoryId, setParentCategoryId] = useState(category?.parentCategoryId || '');
  const [seoTitle, setSeoTitle] = useState(category?.seoTitle || '');
  const [metaDescription, setMetaDescription] = useState(category?.metaDescription || '');
  const [desktopVisible, setDesktopVisible] = useState(category?.desktopVisible !== false);
  const [mobileVisible, setMobileVisible] = useState(category?.mobileVisible !== false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement;
    firstRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving && !uploading) onClose();
      if (event.key !== 'Tab') return;
      const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button,input,textarea,select,[tabindex]:not([tabindex="-1"])');
      if (!controls?.length) return;
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previousFocus.current?.focus(); };
  }, [onClose, saving, uploading]);

  const safeClose = async () => {
    if (saving || uploading) return;
    if (newUploadId) await api.deleteCategoryImage(newUploadId);
    onClose();
  };

  const uploadImage = async (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setErrors(v => ({ ...v, image: 'Use a JPG, PNG, or WebP image.' })); return; }
    if (file.size > 5 * 1024 * 1024) { setErrors(v => ({ ...v, image: 'Image must be 5 MB or smaller.' })); return; }
    setUploading(true);
    const loadingId = toast.loading('Uploading category image…');
    try {
      const uploaded = await api.uploadCategoryImage(file);
      if (newUploadId) await api.deleteCategoryImage(newUploadId);
      setImage(uploaded.secureUrl);
      setImagePublicId(uploaded.publicId);
      setNewUploadId(uploaded.publicId);
      setErrors(v => ({ ...v, image: '' }));
      toast.update(loadingId, 'Category image uploaded.', 'success');
    } catch (error) {
      toast.update(loadingId, error instanceof Error ? error.message : 'Category image upload failed.', 'error');
    } finally { setUploading(false); }
  };

  const removeSelectedImage = async () => {
    if (newUploadId) {
      const result = await api.deleteCategoryImage(newUploadId);
      if (!result) { toast.error(getLastApiError() || 'Could not remove the temporary category image.'); return; }
      setNewUploadId('');
    }
    setImage(''); setImagePublicId('');
    toast.info('Category image removed from the form.');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'Category name is required.';
    const normalizedSlug = slugify(slug || name);
    if (!normalizedSlug) nextErrors.slug = 'Enter a valid category slug.';
    if (categories.some(item => item.id !== category?.id && item.slug.toLowerCase() === normalizedSlug)) nextErrors.slug = 'This category slug is already in use.';
    if (categories.some(item => item.id !== category?.id && item.name.trim().toLowerCase() === name.trim().toLowerCase())) nextErrors.name = 'This category name is already in use.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    const saved = await onSave({
      name: name.trim(), slug: normalizedSlug, shortDescription: shortDescription.trim(), description: description.trim(),
      image, imagePublicId, isActive, isFeatured, showInNavigation, navigationLabel: navigationLabel.trim(),
      displayOrder: Math.max(0, Math.trunc(displayOrder || 0)), parentCategoryId: parentCategoryId || undefined,
      seoTitle: seoTitle.trim(), metaDescription: metaDescription.trim(), desktopVisible, mobileVisible
    });
    setSaving(false);
    if (!saved) {
      toast.error(getLastApiError() || 'Could not save the category.');
      return;
    }
    setNewUploadId('');
    toast.success(`Category ${category ? 'updated' : 'created'} successfully.`);
    onSaved?.(saved);
    onClose();
  };

  const input = 'mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100';
  return <div className="fixed inset-0 z-[105] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 sm:p-5" onMouseDown={event => { if (event.target === event.currentTarget) void safeClose(); }}>
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="category-form-title" className={`my-auto max-h-[calc(100vh-1.5rem)] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl ${compact ? 'max-w-2xl' : 'max-w-4xl'}`}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
        <div><h2 id="category-form-title" className="font-heading text-lg font-black text-slate-900">{category ? 'Edit Category' : 'Add New Category'}</h2><p className="text-xs text-slate-500">Saved to the live category database.</p></div>
        <button type="button" onClick={() => void safeClose()} disabled={saving || uploading} aria-label="Close category form" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
      </div>
      <form onSubmit={submit} className="grid gap-5 p-5 md:grid-cols-2">
        <label className="text-xs font-bold text-slate-700">Category Name *<input ref={firstRef} value={name} maxLength={80} onChange={e => { setName(e.target.value); if (!slugEdited) setSlug(slugify(e.target.value)); }} className={input} />{errors.name && <span className="mt-1 block text-rose-600">{errors.name}</span>}</label>
        <label className="text-xs font-bold text-slate-700">Slug *<input value={slug} maxLength={90} onChange={e => { setSlug(e.target.value); setSlugEdited(true); }} className={input} />{errors.slug && <span className="mt-1 block text-rose-600">{errors.slug}</span>}</label>
        <label className="text-xs font-bold text-slate-700 md:col-span-2">Short Description<textarea rows={2} maxLength={240} value={shortDescription} onChange={e => setShortDescription(e.target.value)} className={input} /></label>
        {!compact && <label className="text-xs font-bold text-slate-700 md:col-span-2">Description<textarea rows={3} maxLength={1200} value={description} onChange={e => setDescription(e.target.value)} className={input} /></label>}
        <div className="md:col-span-2">
          <span className="text-xs font-bold text-slate-700">Category Image <span className="font-medium text-slate-400">(optional, JPG/PNG/WebP, max 5 MB)</span></span>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {image ? <img src={image} alt="Category preview" className="h-20 w-20 rounded-2xl border object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed text-slate-300"><ImagePlus /></div>}
            <label className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50">{uploading ? 'Uploading…' : image ? 'Replace Image' : 'Upload Image'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading || saving} onChange={e => void uploadImage(e.target.files?.[0])} className="sr-only" /></label>
            {image && <button type="button" onClick={() => { void removeSelectedImage(); }} className="flex items-center gap-1 rounded-xl px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /> Remove</button>}
          </div>{errors.image && <span className="mt-1 block text-xs font-semibold text-rose-600">{errors.image}</span>}
        </div>
        <label className="text-xs font-bold text-slate-700">Navigation Label<input value={navigationLabel} maxLength={60} onChange={e => setNavigationLabel(e.target.value)} className={input} placeholder="Defaults to category name" /></label>
        <label className="text-xs font-bold text-slate-700">Display Order<input type="number" min="0" value={displayOrder} onChange={e => setDisplayOrder(Number(e.target.value))} className={input} /></label>
        {!compact && <label className="text-xs font-bold text-slate-700">Parent Category<select value={parentCategoryId} onChange={e => setParentCategoryId(e.target.value)} className={input}><option value="">No parent</option>{categories.filter(item => item.id !== category?.id && !item.parentCategoryId).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
        <div className="grid grid-cols-2 gap-3 md:col-span-2 sm:grid-cols-3">
          {[[isActive, setIsActive, 'Active'], [showInNavigation, setShowInNavigation, 'In Navigation'], [isFeatured, setIsFeatured, 'Featured'], [desktopVisible, setDesktopVisible, 'Desktop'], [mobileVisible, setMobileVisible, 'Mobile']] .map(([checked, setter, label]) => <label key={String(label)} className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-700"><input type="checkbox" checked={checked as boolean} onChange={e => (setter as React.Dispatch<React.SetStateAction<boolean>>)(e.target.checked)} />{String(label)}</label>)}
        </div>
        {!compact && <><label className="text-xs font-bold text-slate-700">SEO Title<input value={seoTitle} maxLength={120} onChange={e => setSeoTitle(e.target.value)} className={input} /></label><label className="text-xs font-bold text-slate-700">Meta Description<textarea rows={2} value={metaDescription} maxLength={320} onChange={e => setMetaDescription(e.target.value)} className={input} /></label></>}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 md:col-span-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => void safeClose()} disabled={saving || uploading} className="rounded-xl bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700">Cancel</button>
          <button type="submit" disabled={saving || uploading} className="flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{saving ? 'Saving…' : 'Save Category'}</button>
        </div>
      </form>
    </div>
  </div>;
};
