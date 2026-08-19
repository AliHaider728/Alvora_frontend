const fs = require('fs');

const pdpPath = 'src/app/product/[slug]/ProductDetailPageClient.tsx';
let content = fs.readFileSync(pdpPath, 'utf8');

// Replace ProductCard with AlvoraProductCard in related products
content = content.replace(/import \{ ProductCard \}.*/g, "import { AlvoraProductCard } from '../../../components/common/AlvoraProductCard';");
content = content.replace(/<ProductCard key=\{relatedProduct.id\} product=\{relatedProduct\} \/>/g, "<AlvoraProductCard key={relatedProduct.id} product={relatedProduct} />");

// Let's do some targeted regex replaces for the styling.
content = content.replace(/bg-slate-50/g, "bg-[#FAF6F2]");
content = content.replace(/bg-white/g, "bg-white");
content = content.replace(/border-slate-100/g, "border-[#EDE5DC]");
content = content.replace(/border-slate-200/g, "border-[#EDE5DC]");
content = content.replace(/border-rose-500/g, "border-[#C48B80]");
content = content.replace(/bg-rose-500/g, "bg-[#C48B80]");
content = content.replace(/bg-rose-50/g, "bg-[#F1C9BD]");
content = content.replace(/text-rose-500/g, "text-[#C48B80]");
content = content.replace(/text-slate-900/g, "text-[#1A1A1A]");
content = content.replace(/text-slate-800/g, "text-[#1A1A1A]/90");
content = content.replace(/text-slate-700/g, "text-[#1A1A1A]/80");
content = content.replace(/text-slate-600/g, "text-[#1A1A1A]/60");
content = content.replace(/text-slate-500/g, "text-[#1A1A1A]/50");
content = content.replace(/ring-rose-400/g, "ring-[#C48B80]");
content = content.replace(/focus:ring-rose-100/g, "focus:ring-[#F5EDE4]");
content = content.replace(/font-heading text-2xl font-black/g, "font-display text-3xl font-medium");
content = content.replace(/font-heading/g, "font-display");
content = content.replace(/shadow-rose-500\/30/g, "shadow-[#C48B80]/30");

// Update Add to Cart button styles: Make it pill shaped, black
// Existing Add To cart uses bg-rose-500
// Wait, I replaced bg-rose-500 globally, so it's bg-[#C48B80].
// The request asks: "Quantity selector + "ADD TO CART" pill button + "BUY WITH shopPay" outline button (matching homepage FeaturedProduct styling exactly)"
// Featured product styling:
// <button onClick={handleAddToCart} className="w-full bg-[#1A1A1A] text-white rounded-full py-4 text-xs font-bold tracking-widest hover:bg-black transition-colors mb-3">ADD TO CART</button>
// <button className="w-full border border-black/20 rounded-full py-3.5 flex items-center justify-center gap-2 hover:bg-black/5 transition-colors group">
//    <span className="text-xs font-bold tracking-widest text-[#1A1A1A]">BUY WITH</span>
//    <span className="font-serif italic font-bold text-lg text-[#1A1A1A] group-hover:scale-105 transition-transform">shopPay</span>
// </button>

// Let's find the ADD TO CART button block and replace it.
// The ADD TO CART button in ProductDetailPageClient.tsx is around:
// <button
//   type="button"
//   onClick={handleAddToCart}
//   disabled={cartActionLocked.current || (isVariable && !currentVariation) || (variantGroups.length > 0 && !allVariantsSelected) || !effectiveAvailable}
//   ...
const addToCartRegex = /(<button[^>]*onClick=\{handleAddToCart\}[^>]*>[\s\S]*?)<\/button>/g;
content = content.replace(addToCartRegex, (match, buttonOpen) => {
  if (match.includes('ShoppingBag') || match.includes('ADD TO CART') || match.includes('cartActionState')) {
    return `<button
  type="button"
  onClick={handleAddToCart}
  disabled={cartActionLocked.current || (isVariable ? (product.attributes?.length || 0) > 0 && !allVariantsSelected : variantGroups.length > 0 && !allVariantsSelected) || !effectiveAvailable}
  className="w-full bg-[#1A1A1A] text-white rounded-full py-4 text-xs font-bold tracking-widest hover:bg-black transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {cartActionState === 'adding' ? (
    <><Loader2 className="h-4 w-4 animate-spin" /> ADDING...</>
  ) : cartActionState === 'added' ? (
    <><Check className="h-4 w-4" /> ADDED</>
  ) : (
    <>ADD TO CART</>
  )}
</button>
<button 
  type="button"
  className="w-full border border-black/20 rounded-full py-3.5 flex items-center justify-center gap-2 hover:bg-black/5 transition-colors group"
>
  <span className="text-xs font-bold tracking-widest text-[#1A1A1A]">BUY WITH</span>
  <span className="font-serif italic font-bold text-lg text-[#1A1A1A] group-hover:scale-105 transition-transform">shopPay</span>
</button>`;
  }
  return match;
});

// For image gallery style matching FeaturedProduct: bg-[#F1C9BD]
content = content.replace(/group\/gallery relative flex aspect-square w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-\[#EDE5DC\] bg-\[#FAF6F2\]/g, 
"group/gallery relative flex aspect-square w-full cursor-zoom-in items-center justify-center overflow-hidden bg-[#F1C9BD]");


fs.writeFileSync(pdpPath, content);
console.log('pdp updated');
