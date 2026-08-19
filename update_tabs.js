const fs = require('fs');
const pdpPath = 'src/app/product/[slug]/ProductDetailPageClient.tsx';
let content = fs.readFileSync(pdpPath, 'utf8');

content = content.replace(/activeTab === 'desc' \? 'Description' : activeTab === 'specs' \? 'Specifications' : activeTab === 'safety' \? 'Safety & Care' : 'Reviews'/g, 
"activeTab === 'desc' ? 'Description' : activeTab === 'specs' ? 'Ingredients' : activeTab === 'safety' ? 'How to Use' : 'Reviews'");

content = content.replace(/>\s*Specifications\s*<\/button>/g, ">Ingredients</button>");
content = content.replace(/>\s*Safety & Care\s*<\/button>/g, ">How to Use</button>");
// Add Shipping & Returns tab manually.
// First, find the reviews tab.
content = content.replace(
  /<button\s+onClick=\{\(\) => setActiveTab\('reviews'\)\}.*?>[\s\S]*?Reviews\s+\(\d+\)\s*<\/button>/g,
  `$&
  <button
    onClick={() => setActiveTab('shipping' as any)}
    className={\`whitespace-nowrap px-1 py-4 text-sm font-bold border-b-2 transition-colors \${activeTab === ('shipping' as any) ? 'border-[#C48B80] text-[#C48B80]' : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:border-[#1A1A1A]/20'}\`}
  >
    Shipping & Returns
  </button>`
);

// Add the rendering block for shipping
content = content.replace(
  /activeTab === 'reviews' && \([\s\S]*?<!-- End Reviews -->\n\s*\)/g,
  `$&
  {activeTab === ('shipping' as any) && (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pt-6">
      <h3 className="font-display text-2xl font-medium text-[#1A1A1A] mb-4">Shipping & Returns</h3>
      <div className="space-y-4 text-sm text-[#1A1A1A]/80 leading-relaxed">
        <p><strong>Free Standard Shipping</strong> on all orders over Rs. 5000.</p>
        <p>Orders are typically processed within 1-2 business days. Delivery within Pakistan takes 3-5 business days depending on your location.</p>
        <p><strong>30-Day Happiness Guarantee:</strong> If you're not completely satisfied with your purchase, you can return it within 30 days for a full refund or exchange. No questions asked.</p>
      </div>
    </div>
  )}`
);

fs.writeFileSync(pdpPath, content);
console.log('tabs updated');
