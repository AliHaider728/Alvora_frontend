const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('D:/Alvora/Alvora/src/**/*.{tsx,ts}');

let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  content = content.replace(/title:\s*['"](.*)\s+['"]/gi, "title: '$1'");
  content = content.replace(/title:\s*`(.*)\s+`/gi, "title: `$1`");

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Trimmed spaces: ${path.relative('D:/Alvora/Alvora', file)}`);
    updatedCount++;
  }
}
console.log(`Total files trimmed: ${updatedCount}`);
