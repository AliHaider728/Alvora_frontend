const fs = require('fs');
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/from '\.\.\/\.\.\//g, "from '../../../");
  content = content.replace(/from "\.\.\/\.\.\//g, "from \"../../../");
  fs.writeFileSync(filePath, content);
}
fixImports('D:/playbimboo-backend/play-bimboo/src/app/product/[slug]/ProductDetailPageClient.tsx');
fixImports('D:/playbimboo-backend/play-bimboo/src/app/category/[slug]/CategoryPageClient.tsx');
