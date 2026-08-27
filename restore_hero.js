const fs = require('fs');

let c = fs.readFileSync('src/components/home/HeroSection.tsx', 'utf8');

c = c.replace(/<div className="absolute inset-0 z-10">/, 
`<div className="absolute inset-0 z-10 overflow-hidden" style={{ borderRadius: "45% 0% 0% 55% / 60% 0% 0% 40%" }}>`);

c = c.replace(/src="\/images\/hero\/alvora-hero\.jpg"/, 'src="/images/hero/alvora-hero.png"');

fs.writeFileSync('src/components/home/HeroSection.tsx', c);
console.log('Restored alvora-hero.png and border-radius.');
