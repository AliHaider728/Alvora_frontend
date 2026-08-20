const fs = require('fs');

let content = fs.readFileSync('src/components/home/IngredientSection.tsx', 'utf8');

content = content.replace(/import \{ Sparkles, Droplets, Leaf, ShieldCheck \} from 'lucide-react';/g, "import Image from 'next/image';");

content = content.replace(/<Sparkles className="w-6 h-6" \/>/g, `<Image src="/images/icons/icon-niacinamide.svg" alt="Niacinamide" width={24} height={24} className="opacity-70" />`);

content = content.replace(/<Droplets className="w-6 h-6" \/>/g, `<Image src="/images/icons/icon-hyaluronic-acid.svg" alt="Hyaluronic Acid" width={24} height={24} className="opacity-70" />`);

content = content.replace(/<Leaf className="w-6 h-6" \/>/g, `<Image src="/images/icons/icon-centella.svg" alt="Centella Asiatica" width={24} height={24} className="opacity-70" />`);

content = content.replace(/<ShieldCheck className="w-6 h-6" \/>/g, `<Image src="/images/icons/icon-ceramides.svg" alt="Ceramides" width={24} height={24} className="opacity-70" />`);

fs.writeFileSync('src/components/home/IngredientSection.tsx', content);
console.log('IngredientSection updated');
