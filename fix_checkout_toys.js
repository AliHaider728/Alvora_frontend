const fs = require('fs');

const checkoutPath = 'src/app/checkout/CheckoutPageClient.tsx';
let content = fs.readFileSync(checkoutPath, 'utf8');

content = content.replace(/Explore Toys & Games/g, "Explore Bestsellers");

// Check for gradients or other un-replaced pink/rose classes
content = content.replace(/bg-gradient-to-r from-rose-500 to-amber-500/g, "bg-[#1A1A1A]");
content = content.replace(/hover:from-rose-600 hover:to-amber-600/g, "hover:bg-[#C48B80]");
content = content.replace(/shadow-rose-200\/60/g, "shadow-black/10");
content = content.replace(/text-rose-600/g, "text-[#C48B80]");
content = content.replace(/bg-rose-500/g, "bg-[#1A1A1A]"); // Just in case any are left

fs.writeFileSync(checkoutPath, content);
console.log('checkout fixed');
