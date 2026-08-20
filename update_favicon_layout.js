const fs = require('fs');
let layoutPath = 'src/app/layout.tsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
layoutContent = layoutContent.replace(/\/favicon\.ico/g, '/alvora-logo.png');
fs.writeFileSync(layoutPath, layoutContent);
console.log('layout updated');
