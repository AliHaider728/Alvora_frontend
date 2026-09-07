import React from 'react';
import { Metadata } from 'next';
import BestSellersClient from './BestSellersClient';

export const metadata: Metadata = {
  title: 'Best Sellers',
  description: 'Shop the most loved skincare products from Alvora Skincare.',
};

export default function BestSellersPage() {
  return <BestSellersClient />;
}
