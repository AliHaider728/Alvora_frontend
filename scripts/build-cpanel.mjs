import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const deployDir = join(rootDir, '..', 'deploy', 'playBimboo-frontend');
const standaloneDir = join(rootDir, '.next', 'standalone');

console.log('Building Next.js production bundle...');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

if (!existsSync(standaloneDir)) {
  throw new Error('Standalone build output not found. Check next.config.js output setting.');
}

if (existsSync(deployDir)) {
  rmSync(deployDir, { recursive: true, force: true });
}
mkdirSync(deployDir, { recursive: true });

console.log('Preparing cPanel standalone deployment folder...');
cpSync(standaloneDir, deployDir, { recursive: true });
cpSync(join(rootDir, '.next', 'static'), join(deployDir, '.next', 'static'), { recursive: true });
cpSync(join(rootDir, 'public'), join(deployDir, 'public'), { recursive: true });

if (existsSync(join(rootDir, '.env.production'))) {
  cpSync(join(rootDir, '.env.production'), join(deployDir, '.env'));
}

writeFileSync(
  join(deployDir, 'package.json'),
  JSON.stringify(
    {
      name: 'playbimboo-frontend',
      private: true,
      scripts: {
        start: 'node server.js',
      },
      engines: {
        node: '>=18',
      },
    },
    null,
    2
  )
);

console.log(`cPanel deploy folder ready: ${deployDir}`);
console.log('Startup file: server.js');
