import { fetchWithRetry } from '../lib/fetchWithRetry';
import { MetadataRoute } from 'next';
import { API_BASE_URL } from '../services/api';
import { Product, Category } from '../types';

export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alvora.pk';
  
  // Sensible static date for non-dynamic routes
  const staticLastModified = new Date('2026-09-01T00:00:00Z');

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: staticLastModified, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/category/all`, lastModified: staticLastModified, priority: 0.9, changeFrequency: 'daily' },
    { url: `${baseUrl}/best-sellers`, lastModified: staticLastModified, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/bundles/build`, lastModified: staticLastModified, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/about`, lastModified: staticLastModified, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${baseUrl}/contact`, lastModified: staticLastModified, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${baseUrl}/faq`, lastModified: staticLastModified, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${baseUrl}/return-policy`, lastModified: staticLastModified, priority: 0.5, changeFrequency: 'yearly' },
  ];

  let products: Product[] = [];
  let bundles: any[] = [];
  let categories: Category[] = [];

  // Fetch directly using next: { revalidate: 3600 } to avoid the api.ts no-store constraints during build
  const fetchOpts = { next: { revalidate: 3600 } };
  
  try {
    const [prodRes, bundRes, catRes] = await Promise.all([
      fetchWithRetry(`${API_BASE_URL}/products?isVisible=true`, fetchOpts).catch(() => null),
      fetchWithRetry(`${API_BASE_URL}/bundles`, fetchOpts).catch(() => null),
      fetchWithRetry(`${API_BASE_URL}/categories`, fetchOpts).catch(() => null)
    ]);

    if (prodRes?.ok) {
      const fetchedProducts = await prodRes.json();
      products = Array.isArray(fetchedProducts) ? fetchedProducts.filter(p => p.status === 'published' && p.isVisible !== false) : [];
    }

    if (bundRes?.ok) {
      const fetchedBundlesRes = await bundRes.json();
      bundles = fetchedBundlesRes?.bundles && Array.isArray(fetchedBundlesRes.bundles) ? fetchedBundlesRes.bundles : [];
    }

    if (catRes?.ok) {
      const fetchedCategories = await catRes.json();
      categories = Array.isArray(fetchedCategories) ? fetchedCategories : [];
    }
  } catch (error) {
    console.error('[sitemap] Error fetching dynamic data:', error);
  }

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug || product.id}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : staticLastModified,
    priority: 0.8,
    changeFrequency: 'weekly',
  }));

  const bundleUrls: MetadataRoute.Sitemap = bundles.map((bundle) => ({
    url: `${baseUrl}/bundles/${bundle.slug || bundle.id}`,
    lastModified: bundle.updatedAt ? new Date(bundle.updatedAt) : staticLastModified,
    priority: 0.9,
    changeFrequency: 'weekly',
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories
    .filter((cat) => cat.slug !== 'all')
    .map((category) => ({
      url: `${baseUrl}/category/${category.slug || category.id}`,
      lastModified: staticLastModified,
      priority: 0.7,
      changeFrequency: 'weekly',
    }));

  return [...staticRoutes, ...categoryUrls, ...bundleUrls, ...productUrls];
}
