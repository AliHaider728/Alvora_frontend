const fs = require('fs');
let text = fs.readFileSync('src/components/common/SeoHead.tsx', 'utf8');

text = text.replace(/finalTitle = \`\$\{cleanTitle\} \| ALVORA\`;/g, "finalTitle = `${cleanTitle} | ALVORA | Glowing & Healthy Skin`;");
text = text.replace(/finalTitle = \`\$\{product\.metaTitle\} \| ALVORA\`;/g, "finalTitle = `${product.metaTitle} | ALVORA | Glowing & Healthy Skin`;");

fs.writeFileSync('src/components/common/SeoHead.tsx', text);
