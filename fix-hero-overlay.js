const fs = require('fs');
let c = fs.readFileSync('src/app/about/AboutPageClient.tsx', 'utf8');

c = c.replace(/className="absolute inset-0 bg-gradient-to-r from-\[\#FAF6F2\]\/90 via-\[\#FAF6F2\]\/70 md:via-\[\#FAF6F2\]\/40 to-transparent" \/>/, 'className="absolute inset-0 bg-gradient-to-r from-[#FAF6F2]/95 via-[#FAF6F2]/80 md:via-[#FAF6F2]/50 to-transparent md:to-transparent/10" />');

fs.writeFileSync('src/app/about/AboutPageClient.tsx', c, 'utf8');
