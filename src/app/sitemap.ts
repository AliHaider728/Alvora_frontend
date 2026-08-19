import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apiUrl = process.env.NEXT_PUBLIC_ALVORA_API_URL || 'http://localhost:6000/api';
  
  let products = [];
  try {
    const res = await fetch(`${apiUrl}/products`, { cache: 'no-store' });
    if (res.ok) {
      products = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  const productUrls = products.map((product: any) => ({
    url: `https://alvora.pk/product/${product.slug}`,
    lastModified: new Date(product.updatedAt || Date.now()),
  }));

  const staticUrls = [
    { url: 'https://alvora.pk', lastModified: new Date() },
    { url: 'https://alvora.pk/shop', lastModified: new Date() },
    { url: 'https://alvora.pk/about', lastModified: new Date() },
    { url: 'https://alvora.pk/contact', lastModified: new Date() },
  ];

  return [...staticUrls, ...productUrls];
}
