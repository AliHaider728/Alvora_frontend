import React from 'react';
import { HomePage } from './HomePage';

export const metadata = {
  title: 'Play Bimboo - Magical Toys, Games & Playland',
  description: 'Discover endless play with Play Bimboo! Shop action figures, educational toys, board games, plush soft toys, and outdoor play.',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchData() {
  // Using next: { revalidate: 60 } to cache the homepage for 60 seconds.
  // This ensures fast loads for users while keeping products fresh shortly after admin updates.
  const fetchOpts = { next: { revalidate: 60 } };
  
  try {
    const [productsRes, categoriesRes, settingsRes] = await Promise.all([
      fetch(`${API_URL}/products?isVisible=true`, fetchOpts),
      fetch(`${API_URL}/categories`, fetchOpts),
      fetch(`${API_URL}/settings`, fetchOpts)
    ]);
    
    const products = productsRes.ok ? await productsRes.json() : [];
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
  
  if (!settings) {
    return <div className="p-8 text-center">Unable to load store settings.</div>;
  }

  return <HomePage products={products} categories={categories} settings={settings} />;
}
