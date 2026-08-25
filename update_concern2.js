const fs = require('fs');

let content = fs.readFileSync('src/components/home/ConcernGrid.tsx', 'utf8');

// Update concerns array
const oldConcerns = `  const concerns = [
    {
      id: 'hydration',
      name: 'Hydration',
      link: '/category/all?tags=hydrating',
      bgClass: 'bg-[#8C989C]' // A muted cool-warm tone
    },
    {
      id: 'brightening',
      name: 'Brightening',
      link: '/category/all?tags=brightening',
      bgClass: 'bg-[#D9A092]' // Soft terracotta
    },
    {
      id: 'acne',
      name: 'Acne & Blemishes',
      link: '/category/all?tags=acne',
      bgClass: 'bg-[#7A7D75]' // Muted sage/charcoal
    },
    {
      id: 'barrier',
      name: 'Skin Barrier',
      link: '/category/all?tags=barrier',
      bgClass: 'bg-[#EADED2]' // Warm beige
    }
  ];`;

const newConcerns = `  const concerns = [
    {
      id: 'hydration',
      name: 'Hydration',
      link: '/category/all?tags=hydrating',
      bgClass: 'bg-[#C48B80]' // Terracotta
    },
    {
      id: 'brightening',
      name: 'Brightening',
      link: '/category/all?tags=brightening',
      bgClass: 'bg-[#B8664C]' // Deeper Terracotta
    },
    {
      id: 'acne',
      name: 'Acne & Blemishes',
      link: '/category/all?tags=acne',
      bgClass: 'bg-[#8C6B61]' // Muted Warm Brown
    },
    {
      id: 'barrier',
      name: 'Skin Barrier',
      link: '/category/all?tags=barrier',
      bgClass: 'bg-[#EADED2]' // Warm beige
    }
  ];`;

content = content.replace(oldConcerns, newConcerns);
fs.writeFileSync('src/components/home/ConcernGrid.tsx', content);
console.log('ConcernGrid refined updated!');
