import React from 'react';
import { SeoHead } from '../components/common/SeoHead';
import { Product, Category, StoreSettings } from '../types';
import { HeroSection } from '../components/home/HeroSection';
import { CrissCrossMarquee } from '../components/home/CrissCrossMarquee';
import { BundleSection } from '../components/home/BundleSection';
import { ScrollRevealText } from '../components/common/ScrollRevealText';
import { IngredientSection } from '../components/home/IngredientSection';
import { FeaturedProductsGrid } from '../components/home/FeaturedProductsGrid';
import { AudioReviews } from '../components/home/AudioReviews';
import { HomeFAQ } from '../components/home/HomeFAQ';
import { FinalCTA } from '../components/home/FinalCTA';

interface Props {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
}

export const HomePage: React.FC<Props> = ({ products, categories, settings }) => {
  const visibleProducts = products.filter(p => p.status === 'published' && p.isVisible !== false);
  const featuredProducts = visibleProducts.filter(p => p.isFeatured);
  const bestsellers = visibleProducts.filter(p => p.isBestseller || p.isFeatured);
  const featuredProduct = visibleProducts.find(p => p.isSpotlight) || bestsellers[0];

  return (
    <div className="min-h-[100dvh] bg-[#FAF6F2] font-sans flex flex-col overflow-x-hidden w-full">
      <SeoHead
        title={settings.metaTitle || "Alvora Skincare"}
        description={settings.metaDescription || "Pure Ingredients. Visible Results."}
      />

      <HeroSection featuredHref={featuredProduct ? `/product/${featuredProduct.slug}` : '/category/all'} />
      <CrissCrossMarquee />
      <section className="bg-[#FAF6F2]">
        <ScrollRevealText text="At ALVORA, we blend clinically proven ingredients with the best of nature to support your skin's health today and tomorrow. Sustainable choices. Responsible formulas. Beautiful results for you and the world we all share." />
      </section>
      <FeaturedProductsGrid products={featuredProducts} />
      <BundleSection />
      <IngredientSection />
      <AudioReviews />
      <HomeFAQ />
      <FinalCTA />
    </div>
  );
};
