const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', '.next', '.git'];

const patterns = [
  /\b(?:bg|text|border|ring|focus:ring|accent|shadow)-(pink|magenta|indigo|blue|sky|cyan|violet|purple|fuchsia|teal)-\d{2,3}\b/g,
  /\b(?:bg|text|border|ring|focus:ring|accent|shadow)-rose-(?!50\b|100\b|200\b)\d{2,3}\b/g,
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
let output = '';
for (const hit of results) {
  output += hit.file + ': line ' + hit.line + ' -> ' + hit.text + '\n';
}
output += '\nTotal matches: ' + results.length;
console.log(output);