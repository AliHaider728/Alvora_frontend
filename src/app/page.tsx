import React from 'react';
import { HomePage } from './HomePage';
import { USE_MOCK_DATA, MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_SETTINGS } from '../data/mock';

export const metadata = {
  title: 'Alvora Skincare - Premium Skincare Products',
  description: 'Discover premium skincare with Alvora. Shop our collection for glowing and healthy skin.',
};

const API_URL = process.env.NEXT_PUBLIC_ALVORA_API_URL || 'http://localhost:6000/api';

async function fetchData() {
  if (USE_MOCK_DATA) {
    return { products: MOCK_PRODUCTS, categories: MOCK_CATEGORIES, settings: MOCK_SETTINGS };
  }

  // Using next: { revalidate: 60 } to cache the homepage for 60 seconds.
  const fetchOpts = { next: { revalidate: 60 } };
  
  try {
    const [productsRes, categoriesRes, settingsRes] = await Promise.all([
      fetch(`${API_URL}/products?isVisible=true`, fetchOpts),
      fetch(`${API_URL}/categories`, fetchOpts),
      fetch(`${API_URL}/settings`, fetchOpts)
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
    
    return { products, categories, settings };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return { products: [], categories: [], settings: null };
  }
}

export default async function Page() {
  const { products, categories, settings } = await fetchData();
  
  if (!settings && !USE_MOCK_DATA) {
    return <div className="p-8 text-center text-red-500">Error: Unable to connect to the store backend. Please try again later.</div>;
  }

  // Use settings directly (it will be MOCK_SETTINGS if USE_MOCK_DATA is true, else from API)
  return <HomePage products={products} categories={categories} settings={settings!} />;
}
