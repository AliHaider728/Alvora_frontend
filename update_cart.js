const fs = require('fs');

function styleReplacer(content) {
  let c = content;
  // Font
  c = c.replace(/font-heading/g, 'font-display');
  // Copy
  c = c.replace(/Your Toy Basket/g, 'Your Shopping Bag');
  c = c.replace(/item\(s\) ready for fun/g, 'item(s) in your bag');
  c = c.replace(/Discover our premium collection of toys and learning materials!/g, 'Discover our premium collection of skincare and beauty products!');
  // The cart empty state text might differ:
  c = c.replace(/Discover our premium collection of skincare and beauty products!/g, 'Discover our thoughtful formulas for radiant skin.');
  
  // Backgrounds
  c = c.replace(/bg-gradient-to-r from-amber-50 via-rose-50 to-sky-50/g, 'bg-[#FAF6F2]');
  c = c.replace(/bg-rose-500/g, 'bg-[#1A1A1A]'); // Buttons to black, pill shape
  c = c.replace(/hover:bg-rose-600/g, 'hover:bg-[#C48B80]');
  c = c.replace(/bg-rose-50/g, 'bg-[#F5EDE4]');
  c = c.replace(/bg-rose-100/g, 'bg-[#F1C9BD]');
  c = c.replace(/bg-slate-50/g, 'bg-[#FAF6F2]');
  c = c.replace(/bg-slate-100/g, 'bg-[#EDE5DC]');
  c = c.replace(/bg-slate-900/g, 'bg-[#1A1A1A]');
  
  // Text
  c = c.replace(/text-rose-500/g, 'text-[#C48B80]');
  c = c.replace(/text-rose-300/g, 'text-[#C48B80]/60');
  c = c.replace(/text-slate-900/g, 'text-[#1A1A1A]');
  c = c.replace(/text-slate-800/g, 'text-[#1A1A1A]/90');
  c = c.replace(/text-slate-700/g, 'text-[#1A1A1A]/80');
  c = c.replace(/text-slate-600/g, 'text-[#1A1A1A]/70');
  c = c.replace(/text-slate-500/g, 'text-[#1A1A1A]/60');
  c = c.replace(/text-slate-400/g, 'text-[#1A1A1A]/40');
  
  // Borders
  c = c.replace(/border-rose-500/g, 'border-[#C48B80]');
  c = c.replace(/border-slate-100/g, 'border-[#EDE5DC]');
  c = c.replace(/border-slate-200/g, 'border-[#EDE5DC]');
  
  // Rings
  c = c.replace(/ring-rose-500/g, 'ring-[#C48B80]');
  c = c.replace(/ring-rose-200/g, 'ring-[#F1C9BD]');
  
  // Rounded corners for primary buttons (pill shape)
  // E.g., rounded-2xl to rounded-full for checkout buttons
  c = c.replace(/rounded-2xl bg-rose-500 text-white/g, 'rounded-full bg-[#1A1A1A] text-white tracking-widest');
  c = c.replace(/rounded-2xl bg-\[#1A1A1A\] text-white/g, 'rounded-full bg-[#1A1A1A] text-white tracking-widest');
  c = c.replace(/rounded-xl bg-\[#1A1A1A\] text-white/g, 'rounded-full bg-[#1A1A1A] text-white tracking-widest');
  
  return c;
}

const cartDrawerPath = 'src/components/cart/CartDrawer.tsx';
let cartDrawerContent = fs.readFileSync(cartDrawerPath, 'utf8');
cartDrawerContent = styleReplacer(cartDrawerContent);
fs.writeFileSync(cartDrawerPath, cartDrawerContent);

const checkoutPath = 'src/app/checkout/CheckoutPageClient.tsx';
let checkoutContent = fs.readFileSync(checkoutPath, 'utf8');
checkoutContent = styleReplacer(checkoutContent);
fs.writeFileSync(checkoutPath, checkoutContent);

console.log('Cart and Checkout styled');
