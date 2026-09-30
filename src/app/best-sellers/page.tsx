import React from 'react';
import { Metadata } from 'next';
import BestSellersClient from './BestSellersClient';
import { getCatalogPageData } from '../../lib/getCatalogPageData';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Best Sellers',
  description: 'Shop the most loved skincare products from Alvora Skincare.',
};

export default async function BestSellersPage() {
  const { initialProducts, initialBundles } = await getCatalogPageData();
  return <BestSellersClient initialProducts={initialProducts} initialBundles={initialBundles} />;
}
