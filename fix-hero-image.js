const fs = require('fs');
let c = fs.readFileSync('src/app/about/AboutPageClient.tsx', 'utf8');

// 1. Replace the image source
c = c.replace(/\/images\/Alvora_hero_background\.avif/g, "/images/about-hero.png");

// 2. Remove mix-blend-multiply and increase opacity so the beautiful image is clearly visible
c = c.replace(/<div className="absolute inset-0 z-0 opacity-60 mix-blend-multiply">/g, '<div className="absolute inset-0 z-0 opacity-100">');

// 3. Make sure the overlay gradient is subtle but provides enough contrast for text
// It was: className="absolute inset-0 bg-gradient-to-r from-[#FAF6F2] via-[#FAF6F2]/80 to-transparent"
// I will keep it similar but maybe softer so it doesn't wash out the image too much.
// Actually, the current gradient is quite strong (solid on left, fading to right). It's probably perfect for text legibility!

fs.writeFileSync('src/app/about/AboutPageClient.tsx', c, 'utf8');
