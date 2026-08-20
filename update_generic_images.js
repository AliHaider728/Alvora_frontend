const fs = require('fs');

// Replace Unsplash URLs showing actual products with TEMP_PLACEHOLDER
function replaceInFile(filePath, searchRegex, replacement) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(searchRegex, replacement);
        fs.writeFileSync(filePath, content);
    }
}

// BrandIntro - replace the "Product in water" photo as it likely shows a brand
replaceInFile('src/components/home/BrandIntro.tsx', 
  /https:\/\/images\.unsplash\.com\/photo-1629198728644-486161a0fb87[^\"\'\`]*/g, 
  '/images/temp/TEMP_PLACEHOLDER.svg'
);

// SeoHead - Replace with the new hero image
replaceInFile('src/components/common/SeoHead.tsx', 
  /https:\/\/images\.unsplash\.com\/photo-1587654780291-39c9404d746b[^\"\'\`]*/g, 
  '/images/hero/alvora-hero.png'
);

// PDP page fallback OG image
replaceInFile('src/app/product/[slug]/page.tsx', 
  /https:\/\/images\.unsplash\.com\/photo-1587654780291-39c9404d746b[^\"\'\`]*/g, 
  '/images/hero/alvora-hero.png'
);

// StoreContext - default store image
replaceInFile('src/context/StoreContext.tsx', 
  /https:\/\/images\.unsplash\.com\/photo-1534528741775-53994a69daeb[^\"\'\`]*/g, 
  '/images/hero/alvora-hero.png'
);

console.log('Images replaced');
