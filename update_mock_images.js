const fs = require('fs');

const mockPath = 'src/data/mock/products.ts';
let content = fs.readFileSync(mockPath, 'utf8');

// We need to carefully replace the images for specific products
// Nourishing Essence is prod-4
// Hydra Comfort Gel Cream is prod-3
// Also we need to make sure we don't break the array syntax.
// A safe way is to regex replace the block for that specific product ID

function replaceProductImage(content, productId, newImagePath) {
    const regex = new RegExp(`(id:\\s*'${productId}'[\\s\\S]*?images:\\s*\\[\\s*)'[^']+'`, 'g');
    return content.replace(regex, `$1'${newImagePath}'`);
}

content = replaceProductImage(content, 'prod-4', '/images/products/hydrating-essence.jpg');
content = replaceProductImage(content, 'prod-3', '/images/products/restore-moisture-cream.jpg');

fs.writeFileSync(mockPath, content);
console.log('mock updated');
