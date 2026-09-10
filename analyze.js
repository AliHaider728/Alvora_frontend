const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', '.next', '.git'];

const patterns = [
  /\b(?:bg|text|border|ring|focus:ring|accent|shadow)-pink-\d{2,3}\b/g,
  /\b(?:bg|text|border|ring|focus:ring|accent|shadow)-magenta-\d{2,3}\b/g,
  /\b(?:bg|text|border|ring|focus:ring|accent|shadow)-indigo-\d{2,3}\b/g,
  /\b(?:bg|text|border|ring|focus:ring|accent|shadow)-blue-\d{2,3}\b/g,
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
            const contextStart = Math.max(0, i - 2);
            const contextEnd = Math.min(lines.length - 1, i + 2);
            hits.push({ 
                file: fullPath, 
                line: i + 1, 
                text: lines[i].trim(),
                context: lines.slice(contextStart, contextEnd + 1).join('\n')
            });
            break; 
          }
        }
      }
    }
  }
  return hits;
}

const results = scan('src');

const semanticKeywords = ['delete', 'remove', 'error', 'fail', 'trash', 'invalid', 'warning', 'logout', 'signout'];
let primary = [];
let semantic = [];

for (const hit of results) {
  let isSemantic = false;
  // Heart icons for wishlist are universally red/rose
  if (hit.context.toLowerCase().includes('heart') || hit.context.toLowerCase().includes('wishlist')) {
     isSemantic = true;
  } else if (semanticKeywords.some(kw => hit.context.toLowerCase().includes(kw))) {
     isSemantic = true;
  }
  
  if (isSemantic) {
    semantic.push(hit);
  } else {
    primary.push(hit);
  }
}

fs.writeFileSync('categorization.json', JSON.stringify({
    primary: primary.map(h => ({file: h.file, line: h.line, text: h.text})),
    semantic: semantic.map(h => ({file: h.file, line: h.line, text: h.text}))
}, null, 2));

console.log(`Primary/Brand: ${primary.length}, Semantic/Error: ${semantic.length}`);