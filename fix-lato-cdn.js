const fs = require('fs');
let content = fs.readFileSync('src/app/layout.tsx', 'utf8');

// Remove next/font for Lato
content = content.replace(/const lato = Lato\(\{[\s\S]*?\}\);\n/, "");
content = content.replace(/import \{ Playfair_Display, Lato \} from 'next\/font\/google';/, "import { Playfair_Display } from 'next/font/google';");

// Remove lato.variable from html
content = content.replace(/className=\{`\$\{playfairDisplay\.variable\} \$\{lato\.variable\}`\}/, "className={playfairDisplay.variable}");

// Inject Google Fonts link
content = content.replace(/<head>/, `<head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet" />`);

fs.writeFileSync('src/app/layout.tsx', content);