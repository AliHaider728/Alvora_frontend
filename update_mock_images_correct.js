const fs = require('fs');
const mockPath = 'src/data/mock/products.ts';
let content = fs.readFileSync(mockPath, 'utf8');

function replaceProductImage(content, productId, newImagePath) {
    const regex = new RegExp(`(id:\\s*'${productId}'[\\s\\S]*?images:\\s*\\[\\s*)'[^']+'`, 'g');
    return content.replace(regex, `$1'${newImagePath}'`);
}

content = replaceProductImage(content, 'prod-nourishing-essence', '/images/products/hydrating-essence.jpg');
content = replaceProductImage(content, 'prod-hydra-gel-cream', '/images/products/restore-moisture-cream.jpg');

fs.writeFileSync(mockPath, content);
console.log('updated correctly');
