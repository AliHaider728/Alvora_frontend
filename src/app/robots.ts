import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/product/*',
        '/bundles/*',
        '/category/*',
        '/about',
        '/contact',
        '/faq',
        '/return-policy',
        '/best-sellers'
      ],
      disallow: [
        '/admin/',
        '/api/',
        '/checkout/',
        '/cart/',
        '/account/',
        '/login/',
        '/register/',
        '/reset-password/',
        '/wishlist/',
        '/search/'
      ],
    },
    sitemap: 'https://alvora.pk/sitemap.xml',
  };
}
