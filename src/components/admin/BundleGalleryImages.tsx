'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';
import { api } from '../../services/api';
import { getSafeImageSrc } from '../../utils/images';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  onUploadingChange: (uploading: boolean) => void;
  disabled?: boolean;
}

// Uses the product gallery's upload API, preview tiles, and left/right ordering UX.
export function BundleGalleryImages({ images, onChange, onUploadingChange, disabled = false }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  const locked = disabled || uploading;
  const upload = async (files: File[], replaceIndex?: number) => {
    if (busy.current || disabled || !files.length) return;
    setError('');
    if (replaceIndex === undefined && files.length > 8 - images.length) {
      setError(`You can add ${8 - images.length} more gallery image(s).`); return;
    }
    if (files.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setError('Use JPG, PNG or WEBP images, up to 5 MB each.'); return;
    }
    busy.current = true;
    setUploading(true);
    onUploadingChange(true);
    const uploaded: string[] = [];
    try {
      // Sequential uploads preserve file selection order, including partial failures.
      for (const file of files) {
        const result = await api.uploadImage(file);
        if (!result?.url) throw new Error(`Could not upload ${file.name}.`);
        uploaded.push(result.url);
      }
    } catch (error) {
      setError(`${(error as Error).message || 'Image upload failed.'} Successfully uploaded images have been kept; retry the remaining files.`);
    } finally {
      if (uploaded.length) {
        const next = [...images];
        if (replaceIndex === undefined) next.push(...uploaded);
        else next[replaceIndex] = uploaded[0];
        onChange(next);
      }
      busy.current = false;
      setUploading(false);
      onUploadingChange(false);
    }
  };
  const move = (index: number, direction: -1 | 1) => {
    const next = [...images];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    onChange(next);
  };
  return <section aria-label="Bundle Gallery Images" className="md:col-span-2 border-t border-[#E7D9D0] pt-5">
    <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold text-gray-900">Bundle Gallery Images</h3><span className="text-xs text-gray-500">{images.length}/8</span></div>
    <p className="mb-4 text-xs leading-5 text-gray-500">Optional extra photos for this bundle only. The bundle thumbnail stays first; gallery images follow in the order below. Save the bundle to publish your changes.</p>
    {error && <p role="alert" className="mb-3 rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</p>}
    <fieldset disabled={locked} className="space-y-3 disabled:opacity-60">
      {images.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{images.map((url, index) => <div key={`${index}-${url}`} data-gallery-index={index} className="overflow-hidden rounded-xl border border-[#E7D9D0] bg-[#FAF6F2]">
        <img src={getSafeImageSrc(url)} alt={`Bundle gallery preview ${index + 1}`} className="aspect-square w-full object-cover" />
        <div className="flex items-center justify-between gap-1 p-2"><span className="text-xs font-semibold text-[#9C4122]">{index + 1}</span>
          <button type="button" disabled={locked || index === 0} onClick={() => move(index, -1)} aria-label={`Move gallery image ${index + 1} left`} className="rounded-md p-1.5 hover:bg-[#F1C9BD]/30 disabled:opacity-30"><ArrowLeft className="h-3.5 w-3.5" /></button>
          <button type="button" disabled={locked || index === images.length - 1} onClick={() => move(index, 1)} aria-label={`Move gallery image ${index + 1} right`} className="rounded-md p-1.5 hover:bg-[#F1C9BD]/30 disabled:opacity-30"><ArrowRight className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={() => onChange(images.filter((_, i) => i !== index))} aria-label={`Remove gallery image ${index + 1}`} className="rounded-md p-1.5 text-[#9C4122] hover:bg-[#F1C9BD]/30"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
        <label className="flex cursor-pointer items-center justify-center gap-1.5 border-t border-[#E7D9D0] px-2 py-2 text-[11px] font-semibold text-[#9C4122]"><Upload size={12} />Replace<input aria-label={`Replace gallery image ${index + 1}`} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={event => { void upload(Array.from(event.target.files || []), index); event.target.value = ''; }} /></label>
      </div>)}</div>}
      <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#E7D9D0] bg-white px-3 py-4 text-xs font-semibold text-[#9C4122] hover:border-[#C48B80] ${images.length >= 8 ? 'pointer-events-none opacity-50' : ''}`}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}{uploading ? 'Uploading gallery images…' : 'Add Gallery Images'}
        <input aria-label="Add bundle gallery images" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={locked || images.length >= 8} className="hidden" onChange={event => { void upload(Array.from(event.target.files || [])); event.target.value = ''; }} />
      </label>
    </fieldset>
  </section>;
}
