const fs = require('fs');
let c = fs.readFileSync('src/app/bundles/build/page.tsx', 'utf8');

// 1. Remove Sort By button
c = c.replace(/<div className="flex items-center gap-2 bg-white px-4 py-2\.5 rounded-full border border-\[\#EDE5DC\] shadow-sm self-start sm:self-auto cursor-pointer">[\s\S]*?<\/div>/, "");

// 2. Remove Progress Pill from Hero
c = c.replace(/\{\/\* Progress Bar Badge \*\/\}[\s\S]*?<\/div>\s*<\/div>/, "");

// 3. Update Hero background glow
c = c.replace(/bg-\[\#E7D6CE\]/g, "bg-gradient-to-b from-[#FAF6F2] to-white");

// 4. Update Main Content background glow
c = c.replace(/<div className="bg-\[\#FAF6F2\] min-h-screen pb-16">/, '<div className="bg-gradient-to-b from-[#FAF6F2] to-white min-h-screen pb-16">');
c = c.replace(/bg-\[\#FAF6F2\]/g, "bg-[#FDFDFD]"); // Soften some hard peach backgrounds inside

// 5. Fix card border (remove border-[1.5px] and ring which might fail in their setup)
c = c.replace(/border-\[1\.5px\] border-\[\#C48B80\] shadow-md ring-2 ring-\[\#C48B80\]\/10/g, "border-[2px] border-[#C48B80] shadow-md rounded-[24px] overflow-hidden");
c = c.replace(/border border-\[\#EDE5DC\] shadow-sm hover:shadow-md hover:-translate-y-0\.5/g, "border border-[#EDE5DC] shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-[24px] overflow-hidden");

fs.writeFileSync('src/app/bundles/build/page.tsx', c, 'utf8');
