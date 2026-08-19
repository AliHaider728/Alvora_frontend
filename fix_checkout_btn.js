const fs = require('fs');

const cartPath = 'src/components/cart/CartDrawer.tsx';
let content = fs.readFileSync(cartPath, 'utf8');

content = content.replace(/rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-display font-extrabold text-sm shadow-lg shadow-rose-200\/60 flex items-center justify-center gap-2 transition-all hover:scale-\[1\.02\] active:scale-95/g, 
"rounded-full bg-[#1A1A1A] hover:bg-[#C48B80] text-white font-display font-bold tracking-widest text-sm shadow-md flex items-center justify-center gap-2 transition-all");

content = content.replace(/text-rose-600/g, "text-[#C48B80]");

fs.writeFileSync(cartPath, content);
console.log('fixed');
