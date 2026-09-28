import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const deployDir = join(rootDir, '..', 'ALVORA-CPANEL');
const zipPath = join(rootDir, '..', 'ALVORA-CPANEL.zip');
const standaloneDir = join(rootDir, '.next', 'standalone');

console.log('--- PHASE 2: BUILDING NEXT.JS STANDALONE ---');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

if (!existsSync(standaloneDir)) {
  throw new Error('Standalone directory not found. Ensure output: "standalone" is in next.config.js.');
}

console.log('--- PHASE 3 & 4: CREATING CPANEL DEPLOYMENT FOLDER ---');
if (existsSync(deployDir)) {
  rmSync(deployDir, { recursive: true, force: true });
}
mkdirSync(deployDir, { recursive: true });

// 1. Copy the standalone contents directly into deployDir (this forms the root of the app)
cpSync(standaloneDir, deployDir, { recursive: true });

// 2. IMPORTANT: Remove node_modules
const deployNodeModules = join(deployDir, 'node_modules');
if (existsSync(deployNodeModules)) {
  rmSync(deployNodeModules, { recursive: true, force: true });
  console.log('Deleted node_modules from deployment package.');
}

// 3. Copy the static files into .next/static
const staticTarget = join(deployDir, '.next', 'static');
if (!existsSync(staticTarget)) mkdirSync(staticTarget, { recursive: true });
cpSync(join(rootDir, '.next', 'static'), staticTarget, { recursive: true });

// 4. Copy public files into public
const publicTarget = join(deployDir, 'public');
if (!existsSync(publicTarget)) mkdirSync(publicTarget, { recursive: true });
cpSync(join(rootDir, 'public'), publicTarget, { recursive: true });

// 5. Copy package-lock.json
if (existsSync(join(rootDir, 'package-lock.json'))) {
  cpSync(join(rootDir, 'package-lock.json'), join(deployDir, 'package-lock.json'));
}

console.log('--- PHASE 5: PACKAGE.JSON VERIFICATION ---');
const pkgPath = join(deployDir, 'package.json');
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts.start = "node server.js";
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('Verified package.json has start script.');
} else {
  throw new Error('package.json missing from standalone build');
}

// Remove any accidentally included documentation files or fluff just in case
const fluffFiles = ['CPANEL-INSTALLATION.txt', 'CPANEL-DEPLOYMENT.txt', 'README.md', '.git'];
for (const file of fluffFiles) {
  const p = join(deployDir, file);
  if (existsSync(p)) rmSync(p, { recursive: true, force: true });
}

console.log('--- PHASE 7: GENERATING FINAL ZIP ---');
if (existsSync(zipPath)) {
  rmSync(zipPath, { force: true });
}

// Zip the contents flat (ALVORA-CPANEL.zip)
execSync(`tar -a -c -f "${zipPath}" -C "${deployDir}" .`, { stdio: 'inherit' });

console.log('--- PHASE 8: FINAL VERIFICATION ---');
if (!existsSync(join(deployDir, 'server.js'))) throw new Error('Missing server.js');
if (!existsSync(join(deployDir, 'package.json'))) throw new Error('Missing package.json');
if (!existsSync(join(deployDir, 'package-lock.json'))) throw new Error('Missing package-lock.json');
if (!existsSync(join(deployDir, '.next', 'static'))) throw new Error('Missing .next/static');
if (!existsSync(join(deployDir, 'public'))) throw new Error('Missing public');
if (existsSync(join(deployDir, 'node_modules'))) throw new Error('node_modules STILL EXISTS! Failing.');
if (existsSync(join(deployDir, 'CPANEL-DEPLOYMENT.txt'))) throw new Error('Docs exist! Failing.');

console.log(`\nSUCCESS:`);
console.log(`Package Folder: ${deployDir}`);
console.log(`Final ZIP: ${zipPath}`);
