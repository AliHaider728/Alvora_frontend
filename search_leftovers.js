const fs = require('fs');
const path = require('path');

const terms = /\b(PlayBimboo|toy|toys|game|games)\b/i;
const dollars = /\$/;
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
        } else if (stat.isFile() && /\.(tsx|ts|js|jsx|json)$/.test(file)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            let lines = content.split('\n');
            lines.forEach((line, idx) => {
                if (terms.test(line)) {
                    results.push(`[TERM] ${fullPath}:${idx + 1}: ${line.trim().substring(0, 80)}`);
                }
                // Only log $ if it looks like a price (e.g., $10) or hardcoded string, ignore template literals
                if (/\$\d+/.test(line) || /['">]\$[\d]/.test(line)) {
                    results.push(`[DOLLAR] ${fullPath}:${idx + 1}: ${line.trim().substring(0, 80)}`);
                }
            });
        }
    }
    return results;
}

const frontendRes = searchFiles('d:\\Alvora\\Alvora\\src');
console.log('--- FRONTEND ---');
console.log(frontendRes.join('\n'));

const backendRes = searchFiles('d:\\Alvora\\backend\\src');
console.log('\n--- BACKEND ---');
console.log(backendRes.join('\n'));
