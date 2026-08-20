const fs = require('fs');

function findText(dir, term) {
    let filesFound = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.next' || file === '.git' || file === 'public') continue;
        const fullPath = dir + '/' + file;
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            filesFound = filesFound.concat(findText(fullPath, term));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.toLowerCase().includes(term.toLowerCase())) {
                filesFound.push(fullPath);
            }
        }
    }
    return filesFound;
}

const res = findText('src', 'playbimboo');
console.log('Found PlayBimboo in:', res.join('\n'));
