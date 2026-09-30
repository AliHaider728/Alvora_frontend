import { fetchWithRetry } from '../lib/fetchWithRetry';
import React from 'react';
import { HomePage } from './HomePage';
import { USE_MOCK_DATA, MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_SETTINGS } from '../data/mock';
import { MOCK_BUNDLES } from '../data/mock/bundles';

export const metadata = {
  title: 'ALVORA | Glowing & Healthy Skin',
  description: 'Discover premium skincare with Alvora. Shop our collection for glowing and healthy skin.',
};

const rawApiUrl = process.env.NEXT_PUBLIC_ALVORA_API_URL || 'https://alvora-backend.vercel.app/api';
const firstApiUrl = rawApiUrl.split(',')[0].trim();
const API_URL = firstApiUrl.startsWith('http') ? firstApiUrl : `https://${firstApiUrl}`;

async function fetchData() {
  if (USE_MOCK_DATA) {
    return { products: MOCK_PRODUCTS, categories: MOCK_CATEGORIES, settings: MOCK_SETTINGS, bundles: MOCK_BUNDLES };
  }

  // Using next: { revalidate: 60 } to cache the homepage for 60 seconds.
  const fetchOpts = { next: { revalidate: 60 } };
  
  try {
    const bundleRequest = fetchWithRetry(`${API_URL}/bundles`, fetchOpts)
      .then(async response => response.ok ? response.json() : { bundles: [] })
      .catch(() => ({ bundles: [] }));
    const [productsRes, categoriesRes, settingsRes, rawBundles] = await Promise.all([
      fetchWithRetry(`${API_URL}/products?isVisible=true`, fetchOpts),
      fetchWithRetry(`${API_URL}/categories`, fetchOpts),
      fetchWithRetry(`${API_URL}/settings`, fetchOpts),
      bundleRequest,
    ]);
    
    const rawProducts = productsRes.ok ? await productsRes.json() : [];
    const products = Array.isArray(rawProducts) ? rawProducts.map((p: any) => {
      const id = p.id || p._id || p.slug;
      if (!id || String(id).trim() === '' || String(id) === 'undefined') {
        console.error('[page.tsx] Error: Product missing valid identifier:', p.name || 'Unknown');
      }
      return { ...p, id: String(id || '') };
    }).filter((p: any) => p.id && p.id.trim() !== '' && p.id !== 'undefined') : [];
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];
    const settings = settingsRes.ok ? await settingsRes.json() : null;
    
    const bundles = Array.isArray(rawBundles) ? rawBundles : rawBundles?.bundles || [];
    return { products, categories, settings, bundles };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    throw error;
  }
}

export default async function Page() {
  const { products, categories, settings, bundles } = await fetchData();
  
  if (!settings && !USE_MOCK_DATA) {
    throw new Error(`Failed to load settings`);

    return <div className="p-8 text-center text-red-500">Error: Unable to connect to the store backend. Please try again later.</div>;
  }

  // Use settings directly (it will be MOCK_SETTINGS if USE_MOCK_DATA is true, else from API)
  return <HomePage products={products} categories={categories} settings={settings!} bundles={bundles} />;
}
