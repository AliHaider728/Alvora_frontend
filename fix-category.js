const fs = require('fs');
let text = fs.readFileSync('src/app/category/[slug]/page.tsx', 'utf8');
text = text.replace(/title: 'All Products '/g, "title: 'All Products'");
fs.writeFileSync('src/app/category/[slug]/page.tsx', text);
