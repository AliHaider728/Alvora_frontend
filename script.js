const fs = require('fs');
function replaceFetch(file, oldStr, newStr, importStr) {
  let text = fs.readFileSync(file, 'utf8');
  if (!text.includes('fetchWithRetry')) {
    text = importStr + '\n' + text;
  }
  text = text.replace(oldStr, newStr);
  fs.writeFileSync(file, text);
}

replaceFetch('src/app/page.tsx', 'fetch(`${API_URL}/products?isVisible=true`', 'fetchWithRetry(`${API_URL}/products?isVisible=true`', "import { fetchWithRetry } from '../lib/fetchWithRetry';");
replaceFetch('src/app/page.tsx', 'fetch(`${API_URL}/categories`', 'fetchWithRetry(`${API_URL}/categories`', '');
replaceFetch('src/app/page.tsx', 'fetch(`${API_URL}/settings`', 'fetchWithRetry(`${API_URL}/settings`', '');

let pageText = fs.readFileSync('src/app/page.tsx', 'utf8');
pageText = pageText.replace('return { products: [], categories: [], settings: null };', 'throw error;');
pageText = pageText.replace('if (!settings && !USE_MOCK_DATA) {', 'if (!settings && !USE_MOCK_DATA) {\n    throw new Error(`Failed to load settings`);\n');
fs.writeFileSync('src/app/page.tsx', pageText);

replaceFetch('src/app/sitemap.ts', 'fetch(`${API_BASE_URL}/products', 'fetchWithRetry(`${API_BASE_URL}/products', "import { fetchWithRetry } from '../lib/fetchWithRetry';");
replaceFetch('src/app/sitemap.ts', 'fetch(`${API_BASE_URL}/bundles', 'fetchWithRetry(`${API_BASE_URL}/bundles', '');
replaceFetch('src/app/sitemap.ts', 'fetch(`${API_BASE_URL}/categories', 'fetchWithRetry(`${API_BASE_URL}/categories', '');

replaceFetch('src/lib/tiktokPixel.ts', "fetch('/api/tiktok-events'", "fetchWithRetry('/api/tiktok-events'", "import { fetchWithRetry } from './fetchWithRetry';");
replaceFetch('src/lib/tiktokEventsApi.ts', "fetch('https://business-api.tiktok.com", "fetchWithRetry('https://business-api.tiktok.com", "import { fetchWithRetry } from './fetchWithRetry';");
