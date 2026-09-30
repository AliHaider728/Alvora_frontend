import React from 'react';
import { SeoHead } from '../components/common/SeoHead';
import { Product, Category, StoreSettings, Bundle } from '../types';
import { HeroSection } from '../components/home/HeroSection';
import dynamic from 'next/dynamic';

const CrissCrossMarquee = dynamic(() => import('../components/home/CrissCrossMarquee').then(mod => mod.CrissCrossMarquee));
const BundleSection = dynamic(() => import('../components/home/BundleSection').then(mod => mod.BundleSection));
const ScrollRevealText = dynamic(() => import('../components/common/ScrollRevealText').then(mod => mod.ScrollRevealText));
const IngredientSection = dynamic(() => import('../components/home/IngredientSection').then(mod => mod.IngredientSection));
const FeaturedProductsGrid = dynamic(() => import('../components/home/FeaturedProductsGrid').then(mod => mod.FeaturedProductsGrid));
const AudioReviews = dynamic(() => import('../components/home/AudioReviews').then(mod => mod.AudioReviews));
const HomeFAQ = dynamic(() => import('../components/home/HomeFAQ').then(mod => mod.HomeFAQ));
const FinalCTA = dynamic(() => import('../components/home/FinalCTA').then(mod => mod.FinalCTA));

interface Props {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  bundles: Bundle[];
}

export const HomePage: React.FC<Props> = ({ products, categories, settings, bundles }) => {
  const visibleProducts = products.filter(p => p.status === 'published' && p.isVisible !== false);
  const featuredProducts = visibleProducts.filter(p => p.isFeatured);
  const bestsellers = visibleProducts.filter(p => p.isBestseller || p.isFeatured);
  const featuredProduct = visibleProducts.find(p => p.isSpotlight) || bestsellers[0];

  return (
    <div className="min-h-[100dvh] font-sans flex flex-col overflow-x-hidden w-full">
      <SeoHead
        title="ALVORA | Glowing & Healthy Skin"
        description={settings.metaDescription || "Pure Ingredients. Visible Results."}
      />

      <HeroSection featuredHref={featuredProduct ? `/product/${featuredProduct.slug}` : '/category/all'} />
      
      <div className="relative z-10 bg-gradient-to-b from-[#e3b5a4] via-[#FAF6F2] to-[#FAF6F2] pt-0">
        <CrissCrossMarquee />
        <section className="bg-transparent">
          <ScrollRevealText text="At ALVORA, we blend clinically proven ingredients with the best of nature to support your skin's health today and tomorrow. Sustainable choices. Responsible formulas. Beautiful results for you and the world we all share." />
        </section>
        <FeaturedProductsGrid products={featuredProducts.slice(0, 4)} />
        <BundleSection initialBundles={bundles} />
        <IngredientSection />
        <AudioReviews />
        <HomeFAQ />
        <FinalCTA />
      </div>
    </div>
  );
};
