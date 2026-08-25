const fs = require('fs');

let c = fs.readFileSync('src/services/api.ts', 'utf8');

const importMock = `
import { MOCK_PRODUCTS } from '../data/mock/products';
import { MOCK_CATEGORIES } from '../data/mock/categories';
import { MOCK_SETTINGS } from '../data/mock/settings';
import { MOCK_REVIEWS } from '../data/mock/reviews';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_ALVORA_USE_MOCK_DATA === 'true';
`;

c = c.replace('export const API_BASE_URL', importMock + '\nexport const API_BASE_URL');

c = c.replace(
  'getProduct: (idOrSlug: string) => fetchJson<any>(`/products/${idOrSlug}`),',
  `getProduct: async (idOrSlug: string) => {
    if (USE_MOCK_DATA) {
      const p = MOCK_PRODUCTS.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      return p ? Promise.resolve(p) : Promise.resolve(null);
    }
    return fetchJson<any>(\`/products/\${idOrSlug}\`);
  },`
);

c = c.replace(
  'getProducts: (params?: any) => {',
  `getProducts: async (params?: any) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ products: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length, page: 1, pages: 1 });
    }
`
);

c = c.replace(
  'getCategories: () => fetchJson<any[]>(\'/categories\'),',
  `getCategories: async () => {
    if (USE_MOCK_DATA) return Promise.resolve(MOCK_CATEGORIES);
    return fetchJson<any[]>('/categories');
  },`
);

c = c.replace(
  'getSettings: () => fetchJson<any>(\'/settings\'),',
  `getSettings: async () => {
    if (USE_MOCK_DATA) return Promise.resolve(MOCK_SETTINGS);
    return fetchJson<any>('/settings');
  },`
);

fs.writeFileSync('src/services/api.ts', c);
console.log('Patched api.ts');
