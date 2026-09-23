const fs = require('fs');
let code = fs.readFileSync('src/app/bundles/[slug]/BundleDetailPageClient.tsx', 'utf8');

if (!code.includes('import { ZoomIn } from')) {
    code = code.replace("import { Star, Check, Plus, Minus", "import { Star, Check, Plus, Minus, ZoomIn");
}

code = code.replace(/const \[activeImage, setActiveImage\] = useState\(.*\);/, const [activeImage, setActiveImage] = useState(allImages[0] || '/images/hero/alvora-hero.png');
  const [isZooming, setIsZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const handleZoomPointerMove = (event) => {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100));
    setZoomOrigin(\\% \%\);
    setIsZooming(true);
  };);

code = code.replace(/<div className="relative aspect-square overflow-hidden rounded-3xl border border-\[\#EDE5DC\] bg-white shadow-sm">/,
<div 
className="group/gallery relative aspect-square overflow-hidden rounded-3xl border border-[#EDE5DC] bg-white shadow-sm cursor-zoom-in"
onPointerMove={handleZoomPointerMove}
onPointerLeave={() => { setIsZooming(false); setZoomOrigin('50% 50%'); }}
>
<span className="pointer-events-none absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 px-3 py-1.5 text-[10px] font-bold text-white opacity-0 backdrop-blur transition-opacity group-hover/gallery:opacity-100"><ZoomIn className="h-3.5 w-3.5" /> Hover to zoom</span>
);

code = code.replace(/className="object-cover object-center"/g, "className={object-cover object-center transition-transform duration-200 ease-out motion-reduce:transition-none } style={{ transformOrigin: zoomOrigin }}");

fs.writeFileSync('src/app/bundles/[slug]/BundleDetailPageClient.tsx', code);
