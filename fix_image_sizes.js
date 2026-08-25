const fs = require('fs');

// BundleSection.tsx
let bs = fs.readFileSync('src/components/home/BundleSection.tsx', 'utf8');
bs = bs.replace(
  '<Image src={p.images[0]} alt={p.name} fill className="object-contain" />',
  '<Image src={p.images[0]} alt={p.name} fill sizes="150px" className="object-contain" />'
);
fs.writeFileSync('src/components/home/BundleSection.tsx', bs);

// OurStory.tsx
let os = fs.readFileSync('src/components/home/OurStory.tsx', 'utf8');
os = os.replace(
  '<Image src="/images/our-story-lifestyle.jpg" alt="Alvora Skincare lifestyle" fill className="object-cover" />',
  '<Image src="/images/our-story-lifestyle.jpg" alt="Alvora Skincare lifestyle" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />'
);
fs.writeFileSync('src/components/home/OurStory.tsx', os);

// QuickViewModal.tsx
let qv = fs.readFileSync('src/components/home/QuickViewModal.tsx', 'utf8');
qv = qv.replace(
  /<Image\s+src=\{image\}\s+alt=\{product\.name\}\s+fill\s+className="object-cover object-center"\s+\/>/g,
  '<Image src={image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-center" />'
);
fs.writeFileSync('src/components/home/QuickViewModal.tsx', qv);

console.log('Fixed Image sizes');
