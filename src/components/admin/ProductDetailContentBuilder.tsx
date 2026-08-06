import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowDown, ArrowUp, ChevronDown, ChevronUp, Code2, Copy, ImagePlus,
  Loader2, Minus, Plus, Text, Trash2
} from 'lucide-react';
import { ProductDetailBlock, ProductDetailBlockType } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useDialog } from '../../context/DialogContext';

type Props = {
  blocks: ProductDetailBlock[];
  customCss: string;
  isSuperAdmin: boolean;
  onBlocksChange: (blocks: ProductDetailBlock[]) => void;
  onCustomCssChange: (css: string) => void;
};

const newId = () => `block-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
const ordered = (blocks: ProductDetailBlock[]) => blocks.map((block, order) => ({ ...block, order }));

const createBlock = (type: ProductDetailBlockType): ProductDetailBlock => ({
  id: newId(),
  type,
  enabled: true,
  order: 0,
  ...(type === 'richText' ? { heading: '', content: '<p></p>' } : {}),
  ...(type === 'html' ? { content: '<section class="product-highlight"><h2>Product highlight</h2><p>Add your content here.</p></section>' } : {}),
  settings: { width: 'full', alignment: 'center' }
});

export const ProductDetailContentBuilder: React.FC<Props> = ({
  blocks, customCss, isSuperAdmin, onBlocksChange, onCustomCssChange
}) => {
  const { showToast } = useToast();
  const { confirm } = useDialog();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [uploadingBlock, setUploadingBlock] = useState<string>();
  const [selectedBlockType, setSelectedBlockType] = useState<ProductDetailBlockType>('richText');
  const sorted = useMemo(() => [...blocks].sort((a, b) => a.order - b.order), [blocks]);

  const update = (id: string, changes: Partial<ProductDetailBlock>) =>
    onBlocksChange(ordered(sorted.map(block => block.id === id ? { ...block, ...changes } : block)));
  const add = (type: ProductDetailBlockType) => {
    if ((type === 'html') && !isSuperAdmin) return;
    onBlocksChange(ordered([...sorted, createBlock(type)]));
    showToast(`${type === 'richText' ? 'Rich text' : type === 'html' ? 'Custom HTML' : type === 'image' ? 'Image' : 'Divider'} block added.`, 'info');
  };
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];
    onBlocksChange(ordered(next));
    showToast('Product content blocks reordered.', 'info');
  };
  const duplicate = (block: ProductDetailBlock) => {
    if (block.type === 'html' && !isSuperAdmin) return;
    const index = sorted.findIndex(item => item.id === block.id);
    const next = [...sorted];
    next.splice(index + 1, 0, { ...block, id: newId(), image: block.image ? { ...block.image } : undefined });
    onBlocksChange(ordered(next));
    showToast('Product content block duplicated.', 'success');
  };
  const remove = async (block: ProductDetailBlock) => {
    if (!await confirm({ title: 'Delete this content block?', description: block.image ? 'The block will be removed. A temporary uploaded image may also be removed from Cloudinary.' : 'The block and its unsaved content will be removed.', cancelLabel: 'Keep Block', confirmLabel: 'Delete Block', destructive: true })) return;
    const isStillReferenced = sorted.some(item => item.id !== block.id && item.image?.publicId === block.image?.publicId);
    if (block.image?.newlyUploaded && block.image.publicId && !isStillReferenced) {
      void api.deleteImage(block.image.publicId).then(result => {
        if (!result) showToast('Block removed, but temporary Cloudinary cleanup failed.', 'error');
      });
    }
    onBlocksChange(ordered(sorted.filter(item => item.id !== block.id)));
    showToast('Product content block deleted.', 'info');
  };
  const upload = async (block: ProductDetailBlock, file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Detail images must be JPG, PNG, or WebP.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Detail images cannot exceed 5 MB.', 'error');
      return;
    }
    setUploadingBlock(block.id);
    try {
      const result = await api.uploadDetailContentImage(file);
      if (!result.secureUrl || !result.publicId) throw new Error('Cloudinary returned an incomplete image response.');
      const oldImage = block.image;
      update(block.id, {
        image: { secureUrl: result.secureUrl, publicId: result.publicId, alt: oldImage?.alt || '', caption: oldImage?.caption, newlyUploaded: true }
      });
      const oldStillReferenced = sorted.some(item => item.id !== block.id && item.image?.publicId === oldImage?.publicId);
      if (oldImage?.newlyUploaded && oldImage.publicId && !oldStillReferenced) void api.deleteImage(oldImage.publicId);
      showToast('Product detail image uploaded.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Detail image upload failed.', 'error');
    } finally {
      setUploadingBlock(undefined);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="font-heading text-base font-black text-slate-900">Product Description & Page Content</h2>
        <p className="mt-1 text-xs text-slate-500">Build responsive content below the main product information. The server sanitizes every block before publishing.</p>
      </div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <select value={selectedBlockType} onChange={e => setSelectedBlockType(e.target.value as ProductDetailBlockType)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
          <option value="heading">Heading</option>
          <option value="richText">Rich Text</option>
          <option value="image">Image</option>
          <option value="imageText">Image + Text</option>
          <option value="fullWidthImage">Full-width Image</option>
          <option value="gallery">Gallery</option>
          <option value="featureCards">Feature Cards</option>
          <option value="iconText">Icon + Text</option>
          <option value="benefitsList">Benefits List</option>
          <option value="whatsIncluded">What's Included</option>
          <option value="recommendedAge">Recommended Age</option>
          <option value="giftBadges">Gift Badges</option>
          <option value="divider">Divider</option>
          <option value="spacer">Spacer</option>
          <option value="ctaBanner">CTA Banner</option>
          {isSuperAdmin && <option value="html">Custom HTML</option>}
        </select>
        <button type="button" onClick={() => add(selectedBlockType)} className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100">
          <Plus className="h-4 w-4" /> Add Block
        </button>
      </div>

      <div className="space-y-3">
        {sorted.map((block, index) => {
          const isCollapsed = collapsed.has(block.id);
          const codeLocked = block.type === 'html' && !isSuperAdmin;
          return (
            <article key={block.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white p-3">
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-black uppercase text-indigo-600">{block.type}</span>
                <label className="mr-auto flex items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" disabled={codeLocked} checked={block.enabled} onChange={event => update(block.id, { enabled: event.target.checked })} /> Enabled</label>
                <IconButton label="Move up" disabled={codeLocked || index === 0} onClick={() => move(index, -1)} icon={ArrowUp} />
                <IconButton label="Move down" disabled={codeLocked || index === sorted.length - 1} onClick={() => move(index, 1)} icon={ArrowDown} />
                <IconButton label="Duplicate block" disabled={codeLocked} onClick={() => duplicate(block)} icon={Copy} />
                <IconButton label="Delete block" disabled={codeLocked} onClick={() => { void remove(block); }} icon={Trash2} danger />
                <IconButton label={isCollapsed ? 'Expand block' : 'Collapse block'} onClick={() => setCollapsed(current => { const next = new Set(current); isCollapsed ? next.delete(block.id) : next.add(block.id); return next; })} icon={isCollapsed ? ChevronDown : ChevronUp} />
              </div>
              {!isCollapsed && <div className="space-y-4 p-4">
                {block.type === 'richText' && <>
                  <label className="block text-xs font-bold text-slate-600">Optional heading<input maxLength={140} value={block.heading || ''} onChange={event => update(block.id, { heading: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" /></label>
                  <BlockRichEditor value={block.content || ''} onChange={content => update(block.id, { content })} />
                </>}
                {['heading', 'featureCards', 'iconText', 'benefitsList', 'whatsIncluded', 'recommendedAge', 'giftBadges', 'spacer', 'ctaBanner', 'imageText', 'fullWidthImage', 'gallery'].includes(block.type) && <>
                  <label className="block text-xs font-bold text-slate-600">Heading<input maxLength={140} value={block.heading || ''} onChange={event => update(block.id, { heading: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" placeholder="Block heading" /></label>
                  <label className="block text-xs font-bold text-slate-600 mt-3">Content (optional)<textarea rows={4} maxLength={2000} value={block.content || ''} onChange={event => update(block.id, { content: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" placeholder="Block text content" /></label>
                </>}
                {['image', 'imageText', 'fullWidthImage', 'gallery', 'ctaBanner'].includes(block.type) && <>
                  {block.image?.secureUrl && <img src={block.image.secureUrl} alt={block.image.alt || 'Product detail preview'} className="max-h-72 w-full rounded-xl bg-white object-contain" />}
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-300 bg-white px-4 py-3 text-xs font-bold text-indigo-600 mt-3">
                    {uploadingBlock === block.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}{block.image ? 'Replace image' : 'Upload primary media'}
                    <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" disabled={uploadingBlock === block.id} onChange={event => { void upload(block, event.target.files?.[0]); event.target.value = ''; }} />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2 mt-3">
                    <label className="text-xs font-bold text-slate-600">Alt text *<input maxLength={180} value={block.image?.alt || ''} onChange={event => block.image && update(block.id, { image: { ...block.image, alt: event.target.value } })} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" /></label>
                    <label className="text-xs font-bold text-slate-600">Caption<input maxLength={300} value={block.image?.caption || ''} onChange={event => block.image && update(block.id, { image: { ...block.image, caption: event.target.value } })} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" /></label>
                  </div>
                </>}
                {block.type === 'html' && isSuperAdmin && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600">Custom HTML<textarea rows={10} maxLength={30000} spellCheck={false} value={block.content || ''} onChange={event => update(block.id, { content: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-950 p-3 font-mono text-xs text-emerald-200" /></label>
                    <p className="mt-2 text-[11px] font-semibold text-amber-600">Paste only the product-section HTML. Remove &lt;html&gt;, &lt;head&gt;, &lt;body&gt;, and &lt;style&gt; tags.</p>
                  </div>
                )}
                {codeLocked && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800 mt-3">This custom HTML block is read-only. A Super Admin can edit, reorder, disable, duplicate, or remove it.</p>}
                {block.type === 'divider' && <div className="py-6"><hr className="border-slate-300" /></div>}
                {block.type !== 'divider' && <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-bold text-slate-600">Width<select value={block.settings?.width || 'full'} onChange={event => update(block.id, { settings: { ...block.settings, width: event.target.value as 'full' | 'large' | 'medium' } })} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"><option value="full">Full</option><option value="large">Large</option><option value="medium">Medium</option></select></label>
                  <label className="text-xs font-bold text-slate-600">Alignment<select value={block.settings?.alignment || 'center'} onChange={event => update(block.id, { settings: { ...block.settings, alignment: event.target.value as 'left' | 'center' | 'right' } })} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>
                </div>}
              </div>}
            </article>
          );
        })}
        {sorted.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs font-medium text-slate-400">No custom product-page blocks yet.</div>}
      </div>

      {isSuperAdmin && <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <label className="text-xs font-black text-amber-900">Scoped custom CSS<textarea rows={8} maxLength={10000} spellCheck={false} value={customCss} onChange={event => onCustomCssChange(event.target.value)} placeholder=".product-highlight { background: #fff7ed; padding: 2rem; }" className="mt-2 w-full rounded-xl border border-amber-200 bg-slate-950 p-3 font-mono text-xs text-amber-100" /></label>
        <p className="mt-2 text-[11px] text-amber-800">CSS is validated and automatically scoped to this product content wrapper. Global selectors, external URLs, imports, scripts, and protected checkout/admin selectors are blocked.</p>
        <span className="block text-right text-[10px] font-bold text-amber-700">{customCss.length}/10000</span>
      </div>}

      {sorted.length > 0 && <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-slate-500">Isolated preview</h3>
        <iframe title="Product content preview" sandbox="" className="min-h-72 w-full rounded-xl border border-slate-200" srcDoc={makePreviewDocument(sorted, isSuperAdmin ? customCss : '')} />
      </div>}
    </section>
  );
};

const IconButton: React.FC<{ icon: React.ComponentType<{ className?: string }>; label: string; disabled?: boolean; danger?: boolean; onClick: () => void }> = ({ icon: Icon, label, disabled, danger, onClick }) => <button type="button" title={label} aria-label={label} disabled={disabled} onClick={onClick} className={`rounded-lg border p-2 disabled:opacity-30 ${danger ? 'border-rose-200 text-rose-500' : 'border-slate-200 text-slate-500'}`}><Icon className="h-3.5 w-3.5" /></button>;

const BlockRichEditor: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { prompt } = useDialog();
  const { showToast } = useToast();
  const command = (name: string, commandValue?: string) => { ref.current?.focus(); document.execCommand(name, false, commandValue); onChange(ref.current?.innerHTML || ''); };
  return <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <div className="flex flex-wrap gap-1 border-b bg-slate-50 p-2">
      {[['formatBlock', 'p', 'Paragraph'], ['formatBlock', 'h2', 'Heading'], ['bold', '', 'Bold'], ['italic', '', 'Italic'], ['insertUnorderedList', '', 'Bullets'], ['insertOrderedList', '', 'Numbers'], ['justifyLeft', '', 'Left'], ['justifyCenter', '', 'Center'], ['justifyRight', '', 'Right']].map(([name, commandValue, label]) => <button key={`${name}-${commandValue}`} type="button" onMouseDown={event => event.preventDefault()} onClick={() => command(name, commandValue || undefined)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-600">{label}</button>)}
      <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => { void prompt({ title: 'Add a link', description: 'Enter a complete http:// or https:// destination.', inputLabel: 'Link URL', placeholder: 'https://example.com', confirmLabel: 'Add Link' }).then(url => { if (!url) return; if (!/^https?:\/\//i.test(url)) { showToast('Please enter a complete http:// or https:// URL.', 'error'); return; } command('createLink', url); }); }} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-600">Link</button>
    </div>
    <div ref={ref} contentEditable suppressContentEditableWarning onInput={event => onChange(event.currentTarget.innerHTML)} dangerouslySetInnerHTML={{ __html: value }} className="min-h-36 p-3 text-sm leading-6 outline-none [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5" />
  </div>;
};

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const sanitizePreviewHtml = (value: string) => {
  const template = document.createElement('template');
  const looksLikeDocument = /<!doctype|<html\b|<head\b|<body\b/i.test(value);
  const fragment = looksLikeDocument
    ? new DOMParser().parseFromString(value, 'text/html').body.innerHTML
    : value;
  template.innerHTML = fragment;
  template.content
    .querySelectorAll('script,style,iframe,object,embed,form,input,button,textarea,select,link,meta')
    .forEach(node => node.remove());
  template.content.querySelectorAll('*').forEach(node => {
    for (const attribute of [...node.attributes]) {
      if (/^on/i.test(attribute.name) || attribute.name.toLowerCase() === 'srcdoc') {
        node.removeAttribute(attribute.name);
        continue;
      }
      if (
        ['href', 'src', 'action', 'formaction'].includes(attribute.name.toLowerCase()) &&
        /^(?:javascript|data|vbscript):/i.test(attribute.value.trim())
      ) {
        node.removeAttribute(attribute.name);
      }
    }
  });
  return template.innerHTML;
};

const sanitizePreviewCss = (value: string) => value
  .replace(/@import[\s\S]*?(?:;|$)/gi, '')
  .replace(/url\s*\([^)]*\)/gi, 'none')
  .replace(/<\/style/gi, '');

const makePreviewDocument = (blocks: ProductDetailBlock[], css: string) => `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#1e293b;padding:18px;line-height:1.6}img{max-width:100%;height:auto}table{display:block;max-width:100%;overflow:auto}hr{border:0;border-top:1px solid #cbd5e1}${sanitizePreviewCss(css)}</style></head><body>${blocks.filter(block => block.enabled).map(block => block.type === 'divider' ? '<hr>' : block.type === 'image' && block.image ? `<figure><img src="${escapeHtml(block.image.secureUrl)}" alt="${escapeHtml(block.image.alt)}"><figcaption>${escapeHtml(block.image.caption || '')}</figcaption></figure>` : `<section>${block.heading ? `<h2>${escapeHtml(block.heading)}</h2>` : ''}${sanitizePreviewHtml(block.content || '')}</section>`).join('')}</body></html>`;
