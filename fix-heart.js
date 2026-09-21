const fs = require('fs');
let c = fs.readFileSync('src/app/bundles/build/page.tsx', 'utf8');

// 1. Remove Heart button
c = c.replace(/<button className="absolute top-4 right-4 z-20 w-7 h-7 bg-white\/90 backdrop-blur-sm rounded-full flex items-center justify-center text-\[\#1A1A1A\]\/40 hover:text-\[\#C48B80\] shadow-sm transition-colors border border-gray-100">[\s\S]*?<\/button>/, "");

// 2. Make image container rounded-[24px] to match card
c = c.replace(/rounded-\[16px\]/g, "rounded-[24px]");

// 3. Move the Checkmark badge to top-4 right-4 since the heart is gone
c = c.replace(/right-14/g, "right-4");

fs.writeFileSync('src/app/bundles/build/page.tsx', c, 'utf8');
