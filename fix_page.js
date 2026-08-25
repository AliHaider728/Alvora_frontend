const fs = require('fs');
let c = fs.readFileSync('src/app/bundles/build/page.tsx', 'utf8');
c = c.replace(/\\`/g, '`');
c = c.replace(/\\\$/g, '$');
fs.writeFileSync('src/app/bundles/build/page.tsx', c);
console.log('Fixed page.tsx');
