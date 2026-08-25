const fs = require('fs');
let content = fs.readFileSync('src/components/home/HeroSection.tsx', 'utf8');
content = content.replace(
  'className="object-contain lg:object-cover object-right lg:object-center"',
  'className="object-contain object-center lg:object-right"'
);
fs.writeFileSync('src/components/home/HeroSection.tsx', content);
console.log('Fixed Image object-fit');
