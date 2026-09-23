const fs = require('fs');
let code = fs.readFileSync('src/components/common/Footer.tsx', 'utf8');

const oldArray = `const SHOP_LINKS = [
  { label: 'Our Collection', href: '/category/all' },
  { label: 'About',          href: '/about' },
  { label: 'Best Sellers',   href: '/best-sellers' },
  { label: 'Wishlist',       href: '/wishlist' },
];`;

const newArray = `const SHOP_LINKS = [
  { label: 'About',          href: '/about' },
  { label: 'Our Collection', href: '/category/all' },
  { label: 'Best Sellers',   href: '/best-sellers' },
  { label: 'Wishlist',       href: '/wishlist' },
];`;

code = code.replace(oldArray, newArray);
fs.writeFileSync('src/components/common/Footer.tsx', code);
