const fs = require('fs');
let c = fs.readFileSync('src/components/common/AnimatedButton.tsx', 'utf8');

c = c.replace(/<span className={`relative z-10 flex items-center justify-center gap-2 \$\{![^\}]+\}`}/g, '<span className="relative z-10 flex items-center justify-center gap-2">');

fs.writeFileSync('src/components/common/AnimatedButton.tsx', c, 'utf8');
