const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', '.next', '.git'];

const patterns = [
  /\b(?:bg|text|border|ring|focus:ring|accent)-pink-\d{2,3}\b/g,
  /\b(?:bg|text|border|ring|focus:ring|accent)-magenta-\d{2,3}\b/g,
  /\b(?:bg|text|border|ring|focus:ring|accent)-indigo-\d{2,3}\b/g,
  /\b(?:bg|text|border|ring|focus:ring|accent)-blue-\d{2,3}\b/g,
  /\b(?:bg|text|border|ring|focus:ring|accent)-rose-(?!50\b|100\b)\d{2,3}\b/g,
  /#[eE]91[eE]63/gi,
  /#[fF][fF]4081/gi,
  /#[eE][cC]4899/gi
];

function scan(dir) {
  let hits = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        hits = hits.concat(scan(fullPath));
      }
    } else if (/\.(tsx|ts|css|html)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        for (const regex of patterns) {
          if (regex.test(lines[i])) {
            hits.push({ file: fullPath, line: i + 1, text: lines[i].trim() });
            break; 
          }
        }
      }
    }
  }
  return hits;
}

const results = scan('src');
for (const hit of results) {
  console.log(hit.file + ':' + hit.line + ' -> ' + hit.text.substring(0, 100) + '...');
}
console.log('\nFound ' + results.length + ' matched lines.');