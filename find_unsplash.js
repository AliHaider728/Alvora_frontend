const fs = require('fs');

function findUnsplashUrls(dir) {
    let urls = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.next' || file === '.git' || file === 'public') continue;
        const fullPath = dir + '/' + file;
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            urls = urls.concat(findUnsplashUrls(fullPath));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const matches = content.match(/https:\/\/images\.unsplash\.com[^\"\'\`]*/g);
            if (matches) {
                matches.forEach(m => urls.push(fullPath + ' : ' + m));
            }
        }
    }
    return urls;
}

const res = findUnsplashUrls('src');
console.log(res.join('\n'));
