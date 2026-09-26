const fs = require('fs');
const glob = require('glob');

// Fix layout.tsx specifically
const layoutPath = 'src/app/layout.tsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
layoutContent = layoutContent.replace(/template:\s*'%s\s*\|\s*ALVORA',/g, "template: '%s | ALVORA | Glowing & Healthy Skin',");
fs.writeFileSync(layoutPath, layoutContent);

const files = glob.sync('src/app/**/page.tsx');
files.push('src/app/HomePage.tsx');
files.push('src/app/best-sellers/BestSellersClient.tsx'); // Has title attribute, but wait, maybe not needed.
files.push('src/components/common/SeoHead.tsx');

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace exact occurrences
  content = content.replace(/\|\s*Alvora Skincare Admin/gi, '');
  content = content.replace(/\|\s*Alvora Admin/gi, '');
  content = content.replace(/\|\s*Admin\s*\|\s*Alvora/gi, '| Admin');
  content = content.replace(/\|\s*Alvora Skincare/gi, '');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log("Updated: " + file);
  }
}

// Special fix for About page
const aboutPage = 'src/app/about/page.tsx';
if (fs.existsSync(aboutPage)) {
    let text = fs.readFileSync(aboutPage, 'utf8');
    text = text.replace(/title:\s*'About\s+Store'/g, "title: 'About'");
    text = text.replace(/title:\s*'About\s+'/g, "title: 'About'");
    fs.writeFileSync(aboutPage, text);
}
