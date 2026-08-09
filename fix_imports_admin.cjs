const fs = require('fs');
const path = require('path');

const ADMIN_DIR = 'D:/playbimboo-backend/play-bimboo/src/app/admin';

function getTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getTsxFiles(fullPath, fileList);
    } else if (file.endsWith('.tsx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const files = getTsxFiles(ADMIN_DIR);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  const relativeToSrc = path.relative('D:/playbimboo-backend/play-bimboo/src', path.dirname(file)).split(path.sep).length;
  const prefix = '../'.repeat(relativeToSrc);
  
  content = content.replace(/from ['"](?:\.\.\/)+(components|context|services|utils|types|data|hooks|assets)(.*?)['"]/g, (match, p1, p2) => {
    return `from '${prefix}${p1}${p2}'`;
  });
  
  // also handle standard imports like Types if they don't fall under a folder, but it looks like they do.
  fs.writeFileSync(file, content);
}
console.log('Fixed admin imports');
