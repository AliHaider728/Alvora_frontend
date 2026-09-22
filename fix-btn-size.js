const fs = require('fs');
let c = fs.readFileSync('src/components/common/AnimatedButton.tsx', 'utf8');

c = c.replace(/<span className={`relative z-10 flex items-center justify-center gap-2 \$\{\!hideLeaves \? "px-6 sm:px-8" : ""\}`}/g, '<span className="relative z-10 flex items-center justify-center gap-2"');

// Fix SVG positioning so they don't overlap the text
// icon-1 (right-bottom): was right-[40px]
c = c.replace(/right-\[40px\]/g, 'right-[12px] sm:right-[16px]');
// icon-2 (left-top): was left-[25px]
c = c.replace(/left-\[25px\]/g, 'left-[8px] sm:left-[12px]');

fs.writeFileSync('src/components/common/AnimatedButton.tsx', c, 'utf8');
