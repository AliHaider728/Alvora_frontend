import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const deployDir = join(rootDir, '..', 'deploy', 'playBimboo-frontend');
const standaloneDir = join(rootDir, '.next', 'standalone');

const cpanelServerWrapper = `'use strict';

const fs = require('fs');
const path = require('path');
const Module = require('module');

const appRoot = __dirname;
const localModules = path.join(appRoot, 'node_modules');
const nextEntry = path.join(localModules, 'next', 'dist', 'server', 'next.js');

process.chdir(appRoot);

process.env.NODE_PATH = [localModules, process.env.NODE_PATH]
  .filter(Boolean)
  .join(path.delimiter);
Module._initPaths();

if (!fs.existsSync(nextEntry)) {
  console.error('Missing bundled Next.js runtime:', nextEntry);
  console.error('Re-upload the full zip and do NOT click Run NPM Install on cPanel.');
  process.exit(1);
}

require('./next-server.js');
`;

const cpanelNextServer = `'use strict';

const fs = require('fs');
const path = require('path');

const appRoot = __dirname;
process.env.NODE_ENV = 'production';
process.chdir(appRoot);

const currentPort = parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';
let keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT, 10);

const requiredFiles = JSON.parse(
  fs.readFileSync(path.join(appRoot, '.next', 'required-server-files.json'), 'utf8')
);
const nextConfig = requiredFiles.config;
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(nextConfig);

const startServerPath = path.join(
  appRoot,
  'node_modules',
  'next',
  'dist',
  'server',
  'lib',
  'start-server.js'
);

if (!fs.existsSync(startServerPath)) {
  console.error('Missing bundled Next.js start-server:', startServerPath);
  console.error('Re-upload the full zip and do NOT click Run NPM Install on cPanel.');
  process.exit(1);
}

const { startServer } = require(startServerPath);

if (Number.isNaN(keepAliveTimeout) || !Number.isFinite(keepAliveTimeout) || keepAliveTimeout < 0) {
  keepAliveTimeout = undefined;
}

startServer({
  dir: appRoot,
  isDev: false,
  config: nextConfig,
  hostname,
  port: currentPort,
  allowRetry: false,
  keepAliveTimeout,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
`;

const runtimePackages = ['next', 'react', 'react-dom', 'scheduler', 'styled-jsx'];

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

console.log('Copying full runtime packages (prevents incomplete cPanel npm installs)...');
for (const pkg of runtimePackages) {
  const source = join(rootDir, 'node_modules', pkg);
  if (!existsSync(source)) continue;
  cpSync(source, join(deployDir, 'node_modules', pkg), { recursive: true });
}

writeFileSync(join(deployDir, 'server.js'), cpanelServerWrapper);
writeFileSync(join(deployDir, 'next-server.js'), cpanelNextServer);

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

writeFileSync(join(deployDir, '.npmrc'), 'engine-strict=false\n');

const requiredFiles = [
  join(deployDir, 'node_modules', 'next', 'dist', 'server', 'next.js'),
  join(deployDir, 'node_modules', 'next', 'dist', 'server', 'lib', 'start-server.js'),
  join(deployDir, '.next', 'required-server-files.json'),
];

for (const filePath of requiredFiles) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing deployment file: ${filePath}`);
  }
}

const zipPath = join(rootDir, '..', 'playBimboo-frontend-cpanel.zip');
if (existsSync(zipPath)) {
  rmSync(zipPath, { force: true });
}

console.log('Creating flat cPanel zip (no subfolder)...');
if (process.platform === 'win32') {
  const psDeployDir = deployDir.replace(/'/g, "''");
  const psZipPath = zipPath.replace(/'/g, "''");
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${psDeployDir}\\*' -DestinationPath '${psZipPath}' -Force"`,
    { stdio: 'inherit' }
  );
} else {
  execSync(`cd "${deployDir}" && zip -r "${zipPath}" .`, { stdio: 'inherit' });
}

console.log(`cPanel deploy folder ready: ${deployDir}`);
console.log(`cPanel zip ready: ${zipPath}`);
console.log('Startup file: server.js');
console.log('Do NOT click Run NPM Install after extracting this zip.');
