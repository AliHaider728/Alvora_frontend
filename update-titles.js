const fs = require('fs');
const glob = require('glob');
const path = require('path');

const layoutPath = 'D:/Alvora/Alvora/src/app/layout.tsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
layoutContent = layoutContent.replace(/template:\s*'%s\s*\|\s*ALVORA',/g, "template: '%s | ALVORA | Glowing & Healthy Skin',");
fs.writeFileSync(layoutPath, layoutContent);
console.log("Updated layout.tsx template");

// Find all tsx/ts files in src
const files = glob.sync('D:/Alvora/Alvora/src/**/*.{tsx,ts}');

let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace various hardcoded suffixes in metadata title strings
  // e.g. "Checkout | Alvora Skincare" -> "Checkout"
  // "About Alvora Skincare Store" -> "About"
  
  // Specific replacements
  content = content.replace(/title:\s*['"](.*)\s*\|\s*Alvora\s*Skincare\s*Admin['"]/gi, "title: '$1'");
  content = content.replace(/title:\s*['"](.*)\s*\|\s*Alvora\s*Admin['"]/gi, "title: '$1'");
  content = content.replace(/title:\s*['"](.*)\s*\|\s*Admin\s*\|\s*Alvora['"]/gi, "title: '$1 | Admin'");
  content = content.replace(/title:\s*['"](.*)\s*\|\s*Alvora\s*Skincare['"]/gi, "title: '$1'");
  content = content.replace(/title:\s*`(.*)\s*\|\s*Alvora\s*Skincare`/gi, "title: `$1`");
  
  // Some edge cases
  content = content.replace(/title:\s*['"]About Alvora Skincare Store['"]/g, "title: 'About'");
  
  // SeoHead title
  content = content.replace(/<SeoHead\s+title=['"](.*)\s*-\s*Alvora\s*Skincare['"]/gi, "<SeoHead title=\"$1\"");

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated: ${path.relative('D:/Alvora/Alvora', file)}`);
    updatedCount++;
  }
}
console.log(`Total files updated: ${updatedCount}`);
