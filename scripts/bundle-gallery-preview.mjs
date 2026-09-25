import next from 'next';
import { createServer } from 'node:http';
import config from '../next.config.js';
import { mkdtempSync, symlinkSync, copyFileSync, writeFileSync, cpSync, readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
process.env.NEXT_PUBLIC_ALVORA_API_URL = 'http://127.0.0.1:5108/api';
process.env.NEXT_PUBLIC_ALVORA_USE_MOCK_DATA = 'false';
const source = process.cwd();
mkdirSync(path.join(source, '.next'), { recursive: true });
const previewDir = mkdtempSync(path.join(source, '.next', 'gallery-preview-'));
for (const directory of ['src', 'public', 'components', 'lib', 'assets']) cpSync(path.join(source, directory), path.join(previewDir, directory), { recursive: true });
symlinkSync(path.join(source, 'node_modules'), path.join(previewDir, 'node_modules'), 'junction');
for (const file of ['package.json', 'tsconfig.json', 'postcss.config.mjs']) copyFileSync(path.join(source, file), path.join(previewDir, file));
const previewConfig = {
  ...config,
  distDir: '.next',
  images: { ...config.images, dangerouslyAllowLocalIP: true, remotePatterns: [...config.images.remotePatterns, { protocol: 'http', hostname: '127.0.0.1', port: '5108' }] },
};
writeFileSync(path.join(previewDir, 'next.config.mjs'), readFileSync(path.join(source, 'next.config.js'), 'utf8').replace('export default nextConfig;', `nextConfig.images = ${JSON.stringify(previewConfig.images)}; export default nextConfig;`));
const app = next({ dir: previewDir, dev: true, webpack: true, hostname: '127.0.0.1', port: 3108, conf: previewConfig });
await app.prepare();
createServer(app.getRequestHandler()).listen(3108, '127.0.0.1', () => console.log('Isolated gallery preview ready on 127.0.0.1:3108'));
