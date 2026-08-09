const fs = require('fs');

// 1. Fix Footer.tsx
const footerPath = 'D:/playbimboo-backend/play-bimboo/src/components/common/Footer.tsx';
let footerContent = fs.readFileSync(footerPath, 'utf8');
footerContent = footerContent.replace(
  'src={playBimbooLogo}',
  "src={typeof playBimbooLogo === 'string' ? playBimbooLogo : playBimbooLogo.src}"
);
fs.writeFileSync(footerPath, footerContent);

// 2. Fix HomePageClient.tsx
const homePath = 'D:/playbimboo-backend/play-bimboo/src/app/HomePageClient.tsx';
let homeContent = fs.readFileSync(homePath, 'utf8');
homeContent = homeContent.replace(
  /style=\{\{\s*backgroundImage:\s*`url\(\$\{discover_banner\}\)`\s*\}\}/g,
  "style={{ backgroundImage: `url(${typeof discover_banner === 'string' ? discover_banner : discover_banner.src})` }}"
);

// Fix <Link to= in HomePageClient.tsx
homeContent = homeContent.replace(/<Link([^>]*)to=/g, '<Link$1href=');
fs.writeFileSync(homePath, homeContent);

console.log('Fixed Footer and HomePageClient');
