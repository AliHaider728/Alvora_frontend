const fs = require('fs');

// 1. HeroSection.tsx
let heroPath = 'src/components/home/HeroSection.tsx';
let heroContent = fs.readFileSync(heroPath, 'utf8');
heroContent = heroContent.replace(/src=["']https:\/\/images\.unsplash\.com[^"']+["']/g, 'src="/images/hero/alvora-hero.png"');
fs.writeFileSync(heroPath, heroContent);

console.log('Hero image replaced');
