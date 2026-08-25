const fs = require('fs');
let content = fs.readFileSync('src/components/home/FinalCTA.tsx', 'utf8');

content = content.replace(
  '{/* Background soft pattern */}\n      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-black/10 to-transparent mix-blend-overlay"></div>',
  ''
);

fs.writeFileSync('src/components/home/FinalCTA.tsx', content);
console.log('FinalCTA updated');
