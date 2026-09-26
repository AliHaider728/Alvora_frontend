const fs = require('fs');
let text = fs.readFileSync('src/app/about/page.tsx', 'utf8');
text = text.replace(/title:\s*'About Alvora Skincare Store',/g, "title: 'About',");
fs.writeFileSync('src/app/about/page.tsx', text);
