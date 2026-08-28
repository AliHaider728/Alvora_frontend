const fs = require('fs');
const path = require('path');

const terms = /\b(playbimboo|toy|toys|game|games)\b/i;
const excludeDirs = ['node_modules', '.next', '.git'];

function searchFiles(dir) {
    const results = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                results.push(...searchFiles(fullPath));
            }
        } else if (stat.isFile() && /\.(tsx|ts|json)$/.test(file) && !file.includes('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            let lines = content.split('\n');
            lines.forEach((line, idx) => {
                if (terms.test(line) && !line.includes('//') && !line.includes('eslint-disable')) {
                    // Ignore internal keys if possible, but let's just log them all first
                    results.push(`[TERM] ${fullPath}:${idx + 1}: ${line.trim().substring(0, 80)}`);
                }
            });
        }
    }
    return results;
}

const frontendRes = searchFiles('d:\\Alvora\\Alvora\\src');
console.log('--- FRONTEND ---');
console.log(frontendRes.length ? frontendRes.join('\n') : 'Clean');

const backendRes = searchFiles('d:\\Alvora\\backend\\src');
console.log('\n--- BACKEND ---');
console.log(backendRes.length ? backendRes.join('\n') : 'Clean');
