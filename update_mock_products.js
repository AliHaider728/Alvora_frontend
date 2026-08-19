const fs = require('fs');
let fileContent = fs.readFileSync('src/data/mock/products.ts', 'utf8');

const imageMap = {
  'prod-radiance-serum': "['https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop']",
  'prod-gentle-face-wash': "['https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=600&auto=format&fit=crop']",
  'prod-hydra-gel-cream': "['https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=600&auto=format&fit=crop']",
  'prod-nourishing-essence': "['https://images.unsplash.com/photo-1614859324967-bdf31c34a211?q=80&w=600&auto=format&fit=crop']",
  'prod-barrier-repair-cream': "['https://images.unsplash.com/photo-1598440947619-2ce1fc7ce3c9?q=80&w=600&auto=format&fit=crop']",
  'prod-vitamin-c-serum': "['https://images.unsplash.com/photo-1601049541289-9b1b7ceb10c5?q=80&w=600&auto=format&fit=crop']",
  'prod-green-tea-toner': "['https://images.unsplash.com/photo-1629198728644-486161a0fb87?q=80&w=600&auto=format&fit=crop']",
  'prod-daily-spf50': "['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop']"
};

Object.entries(imageMap).forEach(([id, img]) => {
  const regex = new RegExp(`(id:\\s*'${id}'.*?images:\\s*)\\[\\]`, 's');
  fileContent = fileContent.replace(regex, `$1${img}`);
});

fs.writeFileSync('src/data/mock/products.ts', fileContent);
console.log('Updated products.ts');
