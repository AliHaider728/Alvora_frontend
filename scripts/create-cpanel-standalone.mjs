import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const deployDir = join(rootDir, '..', 'ALVORA-CPANEL-STANDALONE');
const zipPath = join(rootDir, '..', 'ALVORA-CPANEL-STANDALONE.zip');
const standaloneDir = join(rootDir, '.next', 'standalone');

console.log('--- PHASE 3: BUILDING NEXT.JS STANDALONE ---');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

if (!existsSync(standaloneDir)) {
  throw new Error('Standalone directory not found. Ensure output: "standalone" is in next.config.js.');
}

console.log('--- PHASE 4: CREATING CPANEL-READY PACKAGE ---');
if (existsSync(deployDir)) {
  rmSync(deployDir, { recursive: true, force: true });
}
mkdirSync(deployDir, { recursive: true });

// 1. Copy the standalone contents directly into deployDir (this forms the root of the app)
cpSync(standaloneDir, deployDir, { recursive: true });

// 2. Copy the static files into .next/static
const staticTarget = join(deployDir, '.next', 'static');
if (!existsSync(staticTarget)) mkdirSync(staticTarget, { recursive: true });
cpSync(join(rootDir, '.next', 'static'), staticTarget, { recursive: true });

// 3. Copy public files into public
const publicTarget = join(deployDir, 'public');
if (!existsSync(publicTarget)) mkdirSync(publicTarget, { recursive: true });
cpSync(join(rootDir, 'public'), publicTarget, { recursive: true });

// 4. Copy .env.example
if (existsSync(join(rootDir, '.env.example'))) {
  cpSync(join(rootDir, '.env.example'), join(deployDir, '.env.example'));
}

// 5. Create CPANEL-DEPLOYMENT.txt
writeFileSync(
  join(deployDir, 'CPANEL-DEPLOYMENT.txt'),
  `ALVORA FRONTEND - CPANEL NODE.JS DEPLOYMENT GUIDE

This package is a self-contained Next.js standalone application.

1. DEPLOYMENT STEPS:
   a. Go to cPanel File Manager.
   b. Delete existing files in your target domain's document root or application folder.
   c. Upload ALVORA-CPANEL-STANDALONE.zip.
   d. Extract the ZIP file directly into the application folder (Extract Here).

2. CPANEL NODE.JS APP SETUP:
   a. Go to "Setup Node.js App" in cPanel.
   b. Create Application.
   c. Node.js Version: 18.x or 20.x
   d. Application mode: Production
   e. Application root: <path-where-you-extracted>
   f. Application startup file: server.js
   g. Application URL: <your-domain>

3. ENVIRONMENT VARIABLES:
   Scroll down in the Node.js App setup and add the variables listed in .env.example.
   Required variables include:
   - NEXT_PUBLIC_ALVORA_API_URL
   - PORT (Usually automatically provided by cPanel Passenger)
   
4. STARTING THE APP:
   a. You DO NOT need to run NPM Install (traced node_modules are included for standalone).
   b. Click "Start App" or "Restart".
`
);

console.log('--- PHASE 7: GENERATING FINAL ZIP ---');
if (existsSync(zipPath)) {
  rmSync(zipPath, { force: true });
}

// Zip the contents flat
execSync(`tar -a -c -f "${zipPath}" -C "${deployDir}" .`, { stdio: 'inherit' });

console.log('--- PHASE 8: FINAL VALIDATION ---');
if (!existsSync(join(deployDir, 'server.js'))) throw new Error('Missing server.js');
if (!existsSync(join(deployDir, 'package.json'))) throw new Error('Missing package.json');
if (!existsSync(join(deployDir, '.next', 'static'))) throw new Error('Missing .next/static');
if (!existsSync(join(deployDir, 'public'))) throw new Error('Missing public');

console.log(`\nSUCCESS:`);
console.log(`Package Folder: ${deployDir}`);
console.log(`Final ZIP: ${zipPath}`);
