const fs = require('fs');
let content = fs.readFileSync('src/components/common/Header.tsx', 'utf8');

const oldLogoBlock = `{/* CENTER LOGO */}
            <Link href="/" aria-label="ALVORA home" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Logo size="md" className="block" />
            </Link>`;

const newLogoBlock = `{/* CENTER LOGO */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Logo size="md" className="block" />
            </div>`;

content = content.replace(oldLogoBlock, newLogoBlock);

fs.writeFileSync('src/components/common/Header.tsx', content);
console.log('Fixed nested anchor tags in Header');
