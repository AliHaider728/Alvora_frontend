import React from 'react';
import { SeoHead } from '../components/common/SeoHead';
import { Product, Category, StoreSettings } from '../types';
import { HeroSection } from '../components/home/HeroSection';
import { BundleSection } from '../components/home/BundleSection';
import { BrandIntro } from '../components/home/BrandIntro';
import { BestSellers } from '../components/home/BestSellers';
import { IngredientSection } from '../components/home/IngredientSection';
import { FeaturedProduct } from '../components/home/FeaturedProduct';
import { Testimonials } from '../components/home/Testimonials';
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
      <BundleSection />
      <BrandIntro />
      <BestSellers products={visibleProducts} sectionSettings={sectionByKey.featuredProducts} />
      <IngredientSection />
      {featuredProduct && <FeaturedProduct product={featuredProduct} />}
      <Testimonials reviews={MOCK_REVIEWS} />
      <AudioReviews />
      <ConcernGrid />
      <FinalCTA />
    </div>
  );
};
