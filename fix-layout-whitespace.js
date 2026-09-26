const fs = require('fs');
const filePath = 'D:/Alvora/Alvora/src/app/layout.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the whitespace between <head> and {GA_MEASUREMENT_ID
content = content.replace(/<head>\s*\{GA_MEASUREMENT_ID/g, '<head>\n        {GA_MEASUREMENT_ID');

// Also remove it if it's completely empty or has too much whitespace
content = content.replace(/<head>[\s\r\n]+{/g, '<head>{');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Cleaned whitespace in layout.tsx");
