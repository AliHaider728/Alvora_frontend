import { CategoryPageClient } from '../category/[slug]/CategoryPageClient';
import { getCatalogPageData } from '../../lib/getCatalogPageData';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shop',
  description: 'Explore all products and bundles at Alvora Skincare.',
};

export default async function ShopPage() {
  const catalog = await getCatalogPageData();
  return <CategoryPageClient {...catalog} />;
}
