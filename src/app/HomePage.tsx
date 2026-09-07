import React from 'react';
import { SeoHead } from '../components/common/SeoHead';
import { Product, Category, StoreSettings } from '../types';
import { HeroSection } from '../components/home/HeroSection';
import { CrissCrossMarquee } from '../components/home/CrissCrossMarquee';
import { BundleSection } from '../components/home/BundleSection';
import { ScrollRevealText } from '../components/common/ScrollRevealText';

import { BestSellers } from '../components/home/BestSellers';
import { IngredientSection } from '../components/home/IngredientSection';
import { FeaturedProduct } from '../components/home/FeaturedProduct';

import { AudioReviews } from '../components/home/AudioReviews';
import { ConcernGrid } from '../components/home/ConcernGrid';
import { FinalCTA } from '../components/home/FinalCTA';
import { MOCK_REVIEWS } from '../data/mock/reviews';

interface Props {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
}

export const HomePage: React.FC<Props> = ({ products, categories, settings }) => {
  const visibleProducts = products.filter(p => p.status === 'published' && p.isVisible !== false);
  const bestsellers = visibleProducts.filter(p => p.isBestseller || p.isFeatured);
  const featuredProduct = visibleProducts.find(p => p.isSpotlight) || bestsellers[0];
  const sectionByKey = Object.fromEntries(settings.homepageSections.map(s => [s.key, s]));

  return (
    <div className="min-h-screen bg-[#FAF6F2] font-sans flex flex-col">
      <SeoHead
        title={settings.metaTitle || "Alvora Skincare"}
        description={settings.metaDescription || "Pure Ingredients. Visible Results."}
      />

      <HeroSection />
      <CrissCrossMarquee />
      <section className="bg-[#FAF6F2]">
        <ScrollRevealText text="At ALVORA, we blend clinically proven ingredients with the best of nature to support your skin's health today and tomorrow. Sustainable choices. Responsible formulas. Beautiful results for you and the world we all share." />
      </section>
      <BundleSection />
      <BestSellers products={visibleProducts} sectionSettings={sectionByKey.featuredProducts} />
      <IngredientSection />
      {featuredProduct && <FeaturedProduct product={featuredProduct} />}
      
      <AudioReviews />
      <ConcernGrid />
      <FinalCTA />
    </div>
  );
};
