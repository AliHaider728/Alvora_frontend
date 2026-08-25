const fs = require('fs');

let f = fs.readFileSync('src/components/common/Footer.tsx', 'utf8');
f = f.replace(/<li key=\{.*?-\}>/g, '<li key={l.href + l.label}>');
fs.writeFileSync('src/components/common/Footer.tsx', f);

console.log('Fixed Footer');
