'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronUp, ChevronDown, ZoomIn } from 'lucide-react';
import { getSafeImageSrc } from '../../utils/images';

export function BundleGallery({ images, name, discountPercent = 0 }: { images: string[]; name: string; discountPercent?: number }) {
  const [selected, setSelected] = useState(0);
  const index = Math.min(selected, Math.max(0, images.length - 1));
  const [zoom, setZoom] = useState<string | null>(null);
  const [edges, setEdges] = useState({ before: false, after: false });
  const rail = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const signature = images.join('|');
  useEffect(() => { setSelected(0); setZoom(null); }, [signature]);
  useEffect(() => {
    const list = rail.current;
    if (!list) return;
    const update = () => setEdges({ before: list.scrollTop > 2, after: list.scrollHeight - list.clientHeight - list.scrollTop > 2 });
    const observer = new ResizeObserver(update);
    observer.observe(list);
    list.addEventListener('scroll', update, { passive: true });
    update();
    return () => { observer.disconnect(); list.removeEventListener('scroll', update); };
  }, [signature]);
  useEffect(() => {
    const list = rail.current, button = buttons.current[index];
    if (!list || !button) return;
    const desktop = matchMedia('(min-width: 1024px)').matches;
    const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    list.scrollTo(desktop ? { top: button.offsetTop - (list.clientHeight - button.clientHeight) / 2, behavior } : { left: button.offsetLeft - (list.clientWidth - button.clientWidth) / 2, behavior });
  }, [index, signature]);
  const choose = (next: number) => { setSelected(Math.max(0, Math.min(images.length - 1, next))); setZoom(null); };
  return <div data-testid="bundle-gallery" className="relative min-w-0">
    <div
      data-testid="bundle-main-image"
      className={`group/gallery relative aspect-square overflow-hidden rounded-3xl bg-white shadow-sm touch-pan-y ${images.length > 1 ? 'lg:ml-[112px]' : ''}`}
      onPointerMove={event => {
        if (event.pointerType !== 'mouse' || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setZoom(`${Math.min(100, Math.max(0, (event.clientX - rect.left) / rect.width * 100))}% ${Math.min(100, Math.max(0, (event.clientY - rect.top) / rect.height * 100))}%`);
      }}
      onPointerLeave={() => setZoom(null)}
      onPointerDown={event => { if (event.pointerType === 'touch') touch.current = { x: event.clientX, y: event.clientY }; }}
      onPointerCancel={() => { touch.current = null; }}
      onPointerUp={event => {
        if (!touch.current) return;
        const dx = event.clientX - touch.current.x, dy = event.clientY - touch.current.y;
        touch.current = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) choose(index + (dx < 0 ? 1 : -1));
      }}
    >
      <Image src={getSafeImageSrc(images[index])} alt={`${name} image ${index + 1}`} fill priority={index === 0} sizes="(max-width: 768px) 100vw, 50vw" draggable={false} className={`object-cover object-center transition-transform duration-200 motion-reduce:transition-none ${zoom ? 'scale-[1.75] cursor-zoom-in' : ''}`} style={{ transformOrigin: zoom || '50% 50%' }} />
      {discountPercent > 0 && <span className="absolute left-4 top-4 rounded-full bg-gradient-to-br from-[#D4784F] to-[#9C4122] px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg">Save {discountPercent}%</span>}
      {images.length > 1 && <span aria-live="polite" aria-label="Gallery image position" className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#9C4122] shadow-sm lg:hidden">{index + 1}/{images.length}</span>}
      <span className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1.5 rounded-full bg-slate-950/70 px-3 py-1.5 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover/gallery:opacity-100 lg:inline-flex"><ZoomIn size={14} />Hover to zoom</span>
    </div>
    {images.length > 1 && <div className="relative mt-3 lg:absolute lg:inset-y-0 lg:left-0 lg:mt-0 lg:w-24" data-testid="bundle-thumbnail-strip">
      <div ref={rail} aria-label="Bundle gallery thumbnails" className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:h-full lg:flex-col lg:snap-y lg:overflow-x-hidden lg:overflow-y-auto lg:pb-0">
        {images.map((src, i) => <button key={`${src}-${i}`} ref={button => { buttons.current[i] = button; }} type="button" aria-label={`View ${name} image ${i + 1}`} aria-pressed={i === index} onClick={() => choose(i)} onKeyDown={event => {
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? images.length - 1 : ['ArrowRight', 'ArrowDown'].includes(event.key) ? Math.min(images.length - 1, i + 1) : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? Math.max(0, i - 1) : null;
          if (next === null) return;
          event.preventDefault(); choose(next); buttons.current[next]?.focus({ preventScroll: true });
        }} className={`relative h-[72px] w-[72px] shrink-0 snap-start overflow-hidden rounded-xl border-2 transition-all motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9C4122] lg:h-24 lg:w-24 ${index === i ? 'border-[#9C4122] opacity-100' : 'border-transparent opacity-70 hover:-translate-y-0.5 hover:opacity-100'}`}>
          <Image src={getSafeImageSrc(src)} alt="" fill sizes="(min-width: 1024px) 96px, 72px" className="object-cover" />
        </button>)}
      </div>
      {edges.before && <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-10 bg-gradient-to-b from-[#FAF6F2] to-transparent lg:block"><button type="button" aria-label="Scroll gallery up" onClick={() => rail.current?.scrollBy({ top: -216, behavior: 'smooth' })} className="pointer-events-auto absolute left-1/2 top-1 -translate-x-1/2 rounded-full border border-[#E7D9D0] bg-white/95 p-1 text-[#9C4122] shadow-sm"><ChevronUp size={18} /></button></div>}
      {edges.after && <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-10 bg-gradient-to-t from-[#FAF6F2] to-transparent lg:block"><button type="button" aria-label="Scroll gallery down" onClick={() => rail.current?.scrollBy({ top: 216, behavior: 'smooth' })} className="pointer-events-auto absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-[#E7D9D0] bg-white/95 p-1 text-[#9C4122] shadow-sm"><ChevronDown size={18} /></button></div>}
    </div>}
  </div>;
}
