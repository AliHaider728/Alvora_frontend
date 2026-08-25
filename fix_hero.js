const fs = require('fs');
let c = fs.readFileSync('src/components/home/HeroSection.tsx', 'utf8');
c = c.replace(
  'className="relative min-h-[470px] overflow-hidden lg:min-h-[690px]"',
  'className="relative min-h-[470px] lg:min-h-[690px]"'
);
fs.writeFileSync('src/components/home/HeroSection.tsx', c);
console.log('Removed overflow-hidden');
