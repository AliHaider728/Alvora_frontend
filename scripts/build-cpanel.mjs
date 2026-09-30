import { execFileSync, execSync } from 'node:child_process';
import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');

console.log('Building Next.js production bundle...');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

const standaloneDir = join(rootDir, '.next', 'standalone');
const buildIdPath = join(rootDir, '.next', 'BUILD_ID');
if (!existsSync(standaloneDir) || !existsSync(buildIdPath)) {
  throw new Error('Standalone build output not found.');
}

const buildId = readFileSync(buildIdPath, 'utf8').trim();
if (!/^[a-zA-Z0-9_-]+$/.test(buildId)) throw new Error('Invalid build identifier.');
const zipPath = join(rootDir, '..', `ALVORA-FRONTEND-CPANEL-${buildId}.zip`);
if (existsSync(zipPath)) throw new Error(`Release package already exists: ${zipPath}`);

// Complete generated standalone output in place; existing cPanel releases stay untouched.
cpSync(join(rootDir, '.next', 'static'), join(standaloneDir, '.next', 'static'), { recursive: true });
cpSync(join(rootDir, 'public'), join(standaloneDir, 'public'), { recursive: true });
cpSync(join(rootDir, 'package-lock.json'), join(standaloneDir, 'package-lock.json'));

if (existsSync(join(rootDir, '.env'))) {
  cpSync(join(rootDir, '.env'), join(standaloneDir, '.env'));
}

writeFileSync(join(standaloneDir, 'CPANEL-README.txt'), [
  'Upload and extract this package into the existing frontend cPanel application root.',
  'Install dependencies with npm in cPanel. The package excludes node_modules.',
  'Startup file: server.js. Use Node.js 20.9 or newer.',
  'Restart the frontend application and verify https://www.alvora.pk/shop.',
].join('\n'));

execFileSync('tar', [
  '-a', '-c', '-f', zipPath,
  '--exclude=./node_modules',
  '-C', standaloneDir, '.'
], { stdio: 'inherit' });

console.log(`cPanel release package ready: ${zipPath}`);
console.log('The existing deployment directory and previous release packages were not changed.');
