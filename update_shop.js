const fs = require('fs');

const shopPath = 'src/app/category/[slug]/CategoryPageClient.tsx';
let content = fs.readFileSync(shopPath, 'utf8');

// Replace ProductCard with AlvoraProductCard
content = content.replace(/import \{ ProductCard \}.*/g, "import { AlvoraProductCard } from '../../../components/common/AlvoraProductCard';");
content = content.replace(/<ProductCard key=\{product.id\} product=\{product\} \/>/g, "<AlvoraProductCard key={product.id} product={product} />");

// Let's do some targeted regex replaces for the styling.
content = content.replace(/bg-white border-r/g, "bg-[#FAF6F2] border-r");
content = content.replace(/text-slate-900/g, "text-[#1A1A1A]");
content = content.replace(/text-slate-500/g, "text-[#1A1A1A]/60");
content = content.replace(/text-slate-600/g, "text-[#1A1A1A]/80");
content = content.replace(/text-indigo-600/g, "text-[#C48B80]");
content = content.replace(/text-indigo-50/g, "text-[#FAF6F2]");
content = content.replace(/bg-indigo-600/g, "bg-[#1A1A1A]");
content = content.replace(/hover:bg-indigo-700/g, "hover:bg-[#C48B80]");
content = content.replace(/bg-indigo-50/g, "bg-[#F5EDE4]");
content = content.replace(/border-indigo-200/g, "border-[#C48B80]");
content = content.replace(/border-indigo-600/g, "border-[#1A1A1A]");
content = content.replace(/ring-indigo-600/g, "ring-[#C48B80]");
content = content.replace(/focus:ring-indigo-500/g, "focus:ring-[#C48B80]");
content = content.replace(/bg-slate-50/g, "bg-[#FAF6F2]");
content = content.replace(/bg-slate-100/g, "bg-[#F5EDE4]");
content = content.replace(/border-slate-200/g, "border-[#EDE5DC]");
content = content.replace(/border-slate-100/g, "border-[#EDE5DC]");

// The sorting dropdown uses standard Tailwind.
// Replace standard fonts with font-display
content = content.replace(/font-heading font-black text-3xl/g, "font-display font-medium text-4xl uppercase tracking-widest");
content = content.replace(/font-heading font-bold/g, "font-display font-medium text-2xl uppercase tracking-widest");
content = content.replace(/font-heading/g, "font-display");

fs.writeFileSync(shopPath, content);
console.log('updated');
