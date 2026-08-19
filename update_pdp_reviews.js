const fs = require('fs');

const pdpPath = 'src/app/product/[slug]/ProductDetailPageClient.tsx';
let content = fs.readFileSync(pdpPath, 'utf8');

// Update Review Modal placeholders
content = content.replace(/e\.g\. Kids love it!/g, "e.g. Glowing Skin!");
content = content.replace(/Share details about durability, play value, etc\./g, "Share details about the texture, results, how you use it, etc.");
content = content.replace(/bg-slate-100/g, "bg-[#F5EDE4]");
content = content.replace(/text-slate-200/g, "text-[#EDE5DC]");
content = content.replace(/text-slate-300/g, "text-[#EDE5DC]");
content = content.replace(/bg-slate-200/g, "bg-[#EDE5DC]");
content = content.replace(/text-slate-400/g, "text-[#1A1A1A]/40");
content = content.replace(/text-slate-700/g, "text-[#1A1A1A]/70");
content = content.replace(/hover:bg-rose-600/g, "hover:bg-black");

fs.writeFileSync(pdpPath, content);
console.log('review modal updated');
