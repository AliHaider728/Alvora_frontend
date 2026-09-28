import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const deployDir = join(rootDir, '..', 'deploy', 'playBimboo-frontend');
const standaloneDir = join(rootDir, '.next', 'standalone');
const zipPath = join(rootDir, '..', 'alvora-frontend-cpanel.zip');

console.log('Building Next.js production bundle...');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

if (!existsSync(standaloneDir)) {
  throw new Error('Standalone build output not found. Check next.config.js output setting.');
}

if (existsSync(deployDir)) {
  rmSync(deployDir, { recursive: true, force: true });
}
mkdirSync(deployDir, { recursive: true });

console.log('Preparing cPanel standalone deployment folder (excluding node_modules)...');
// Copy standalone dir
cpSync(standaloneDir, deployDir, { recursive: true });

// Delete node_modules if Next.js put it inside standalone
if (existsSync(join(deployDir, 'node_modules'))) {
  rmSync(join(deployDir, 'node_modules'), { recursive: true, force: true });
}

// Copy static files
cpSync(join(rootDir, '.next', 'static'), join(deployDir, '.next', 'static'), { recursive: true });
cpSync(join(rootDir, 'public'), join(deployDir, 'public'), { recursive: true });

if (existsSync(join(rootDir, '.env'))) {
  cpSync(join(rootDir, '.env'), join(deployDir, '.env'));
}

writeFileSync(
  join(deployDir, 'CPANEL-README.txt'),
  [
    '1. Delete ALL old files in the app root, including node_modules.',
    '2. Upload this zip and extract into the app root (flat, no subfolder).',
    '3. IMPORTANT: Go to cPanel Node.js Selector and click "Run NPM Install" (because node_modules is NOT included).',
    '4. Startup file = server.js',
    '5. Node version = 18.x or 20.x preferred.',
    '6. Start the app.',
  ].join('\n')
);

if (existsSync(zipPath)) {
  rmSync(zipPath, { force: true });
}

console.log('Creating lightweight flat zip with tar (excluding node_modules)...');
execSync(`tar -a -c -f "${zipPath}" -C "${deployDir}" .`, { stdio: 'inherit' });

console.log(`cPanel deploy folder ready: ${deployDir}`);
console.log(`cPanel zip ready: ${zipPath}`);
console.log('Startup file: server.js');
console.log('IMPORTANT: You MUST click Run NPM Install on cPanel after extracting this zip.');
