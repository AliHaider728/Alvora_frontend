const fs = require('fs');
let c = fs.readFileSync('src/app/bundles/[slug]/BundleDetailPageClient.tsx', 'utf8');

if (!c.includes('const { products } = useStore();')) {
  c = c.replace(/const mapBundleToProduct = \(b: any\) => \{/, 'const { products } = useStore();\n    const mapBundleToProduct = (b: any) => {');
}

// In what's included section
const oldWhatsIncluded = '{(prod.product?.price || prod.price) ? formatPrice(prod.product?.price || prod.price) : "Included"}';
const newWhatsIncluded = '{(() => { const realP = products?.find(p => p.id === (prod.product?.id || prod.productId || prod.id)); const pPrice = realP?.price || prod.product?.price || prod.price; return pPrice ? formatPrice(pPrice) : "Included"; })()}';
c = c.replace(oldWhatsIncluded, newWhatsIncluded);

const oldImageStr = "src={prod.product?.images?.[0] || prod.images?.[0] || '/images/hero/alvora-hero.png'} alt={prod.product?.name || prod.name}";
const newImageStr = "src={products?.find(p => p.id === (prod.product?.id || prod.productId || prod.id))?.images?.[0] || prod.product?.images?.[0] || prod.images?.[0] || '/images/hero/alvora-hero.png'} alt={products?.find(p => p.id === (prod.product?.id || prod.productId || prod.id))?.name || prod.product?.name || prod.name}";
c = c.replaceAll(oldImageStr, newImageStr);

const oldNameStr = '{prod.product?.name || prod.name}';
const newNameStr = '{products?.find(p => p.id === (prod.product?.id || prod.productId || prod.id))?.name || prod.product?.name || prod.name}';
c = c.replaceAll(oldNameStr, newNameStr);

fs.writeFileSync('src/app/bundles/[slug]/BundleDetailPageClient.tsx', c);
