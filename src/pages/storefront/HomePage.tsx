import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Boxes,
  Shield,
  GraduationCap,
  Heart,
  Sun,
  Dices,
  Star,
  Baby,
  Blocks,
  Rocket,
  Gamepad2,
  Gift,
  Flame,
  Percent
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/common/ProductCard';
import { TrustBadges } from '../../components/common/TrustBadges';
import { SeoHead } from '../../components/common/SeoHead';
import { AGE_GROUPS } from '../../data/mockData';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import playBimbooVideo from '../../assets/newplaybimboo.mp4';

export const HomePage: React.FC = () => {
  const { products, categories, settings } = useStore();
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);

  const visibleProducts = products.filter(p => p.isVisible !== false);
  const featuredProducts = visibleProducts.filter(p => p.isFeatured).slice(0, 4);
  const bestSellers = visibleProducts.filter(p => p.isBestseller).slice(0, 4);
  const newArrivals = visibleProducts.filter(p => p.isNewArrival).slice(0, 4);

  const categoryIcons: Record<string, React.ReactNode> = {
    'building-sets': <Boxes className="w-6 h-6 text-amber-500" />,
    'action-figures': <Shield className="w-6 h-6 text-rose-500" />,
    'educational-stem': <GraduationCap className="w-6 h-6 text-sky-500" />,
    'soft-toys': <Heart className="w-6 h-6 text-pink-500" />,
    'outdoor-toys': <Sun className="w-6 h-6 text-emerald-500" />,
    'board-games': <Dices className="w-6 h-6 text-purple-500" />
  };

  const ageIcons: Record<string, React.ReactNode> = {
    '0-2': <Baby className="w-6 h-6 text-amber-600" />,
    '3-5': <Blocks className="w-6 h-6 text-rose-600" />,
    '6-8': <Rocket className="w-6 h-6 text-sky-600" />,
    '8+': <Gamepad2 className="w-6 h-6 text-purple-600" />
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <SeoHead
        title="Playful Toys & Games Store"
        description="Shop top-rated STEM toys, building sets, action figures, soft plushies, and board games for kids of all ages. Safe, non-toxic & fast delivery!"
      />

      {/* Hero Banner Section */}
      <section className="relative w-full min-h-[650px] lg:h-[700px] overflow-visible flex flex-col justify-center pt-8 pb-32 lg:py-0 mt-0">
        {/* Full Background Video */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#E2F1F8]">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-[42%_center]"
          >
            <source src={playBimbooVideo} type="video/mp4" />
          </video>
        </div>

        {/* Left Readability Gradient Overlay */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(255,253,248,1) 0%, rgba(255,253,248,0.98) 20%, rgba(255,253,248,0.88) 30%, rgba(255,253,248,0.55) 38%, rgba(255,253,248,0.15) 47%, rgba(255,253,248,0) 55%)'
          }}
        />

        {/* Mobile-only dark overlay for readability on small screens */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-white/70 lg:hidden block" />

        {/* Hero Content */}
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-12 w-full relative z-20 flex flex-col justify-center h-full">
          <div className="max-w-[620px] space-y-6 text-center lg:text-left mt-8 lg:mt-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 text-rose-600 text-xs sm:text-sm font-heading font-extrabold">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>⭐ Over 1,000+ Magical Toys for Curious Minds!</span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-[72px] text-slate-900 leading-[1.1] tracking-tight drop-shadow-sm">
              Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-400 to-sky-400">Imagination</span><br /> Comes to Play!
            </h1>

            <p className="text-slate-800 lg:text-slate-600 font-sans text-base sm:text-lg max-w-[500px] mx-auto lg:mx-0 leading-relaxed font-medium">
              Discover award-winning toys, STEM sets, plushies, action figures, and more that spark curiosity, inspire learning, and bring families closer together through the power of play.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/category/all"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-heading font-extrabold text-base shadow-[0_8px_20px_-8px_rgba(244,63,94,0.5)] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>Explore All Toys &rarr;</span>
              </Link>

              <Link
                to="/category/educational-stem"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-heading font-extrabold text-base border border-slate-200 shadow-[0_4px_14px_rgba(0,0,0,0.05)] flex items-center justify-center gap-2 transition-all"
              >
                <Gift className="w-5 h-5 text-sky-500" />
                <span>Shop STEM & Learning</span>
              </Link>
            </div>

            {/* Social Proof Badges */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Parent 1" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Parent 2" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&q=80" alt="Parent 3" />
              </div>
              <div className="flex flex-col text-xs text-slate-600 font-medium text-left">
                <div className="flex text-amber-400 gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-slate-900">4.9/5 from 12,000+ happy parents</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Trust Bar overlapping hero bottom */}
        <div className="lg:absolute lg:bottom-0 lg:left-0 lg:w-full lg:translate-y-1/2 z-30 px-4 sm:px-6 lg:px-8 mt-12 lg:mt-0">
          <div className="max-w-[1200px] mx-auto">
            <TrustBadges />
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-500 font-heading">
              Browse Collections
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/category/all"
            className="mt-2 sm:mt-0 font-heading font-bold text-xs sm:text-sm text-rose-500 hover:text-rose-600 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group bg-white rounded-3xl p-4 border border-slate-100 shadow-xs hover:shadow-xl hover:shadow-rose-100 hover:-translate-y-1.5 transition-all text-center flex flex-col items-center justify-between h-52"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors" />
                <div className="absolute top-2 right-2 p-2 rounded-xl bg-white/90 backdrop-blur-md shadow-sm">
                  {categoryIcons[cat.slug] || <Boxes className="w-5 h-5 text-amber-500" />}
                </div>
              </div>

              <div>
                <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-800 group-hover:text-rose-500 line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">
                  {cat.itemCount} items
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop by Age Group Section */}
      <section className="py-12 bg-gradient-to-r from-amber-50/70 via-rose-50/50 to-sky-50/70 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 font-heading">
              Tailored for Every Stage
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-1">
              Shop by Age Group
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Find perfectly developmental & age-appropriate toys designed for your child’s growth.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {AGE_GROUPS.map(age => (
              <Link
                key={age.id}
                to={`/category/all?age=${age.id}`}
                className={`group p-5 rounded-3xl border ${age.color} bg-white hover:shadow-lg transition-all text-center flex flex-col items-center justify-between gap-3`}
              >
                <div className="p-4 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform">
                  {ageIcons[age.id]}
                </div>

                <div>
                  <span className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 block">
                    {age.label}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{age.name}</span>
                </div>

                <span className="text-xs font-heading font-bold text-rose-500 group-hover:underline inline-flex items-center gap-1">
                  Explore Toys &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Bestseller Products Section */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-500 font-heading flex items-center gap-1">
              <Flame className="w-4 h-4 fill-rose-500" />
              Hot Picks
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-1">
              Featured Toys & Bestsellers
            </h2>
          </div>
          <Link
            to="/category/all"
            className="mt-2 sm:mt-0 font-heading font-bold text-xs sm:text-sm text-rose-500 hover:text-rose-600 flex items-center gap-1"
          >
            <span>Shop All Bestsellers &rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={prod => setSelectedQuickViewProduct(prod)}
            />
          ))}
        </div>
      </section>

      {/* Promotional / Sale Banner Section */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Background shapes */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl text-center md:text-left space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
              <Percent className="w-3.5 h-3.5" />
              Limited Time Special Offer
            </span>
            <h3 className="font-heading font-black text-3xl sm:text-4xl text-white">
              Get Up to 25% OFF STEM Coding & Building Kits!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Spark early curiosity with our top-rated STEM robots and magnetic building tiles. Use code <strong className="text-amber-400 font-mono">SUMMERTOYS</strong> at checkout.
            </p>

            <div className="pt-2">
              <Link
                to="/category/educational-stem"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-extrabold text-sm shadow-lg transition-all hover:scale-105"
              >
                <span>Shop STEM Deals Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=500&q=80"
              alt="STEM Sale Promo"
              className="w-56 h-56 sm:w-64 sm:h-64 object-cover rounded-2xl border-4 border-white/20 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* New Arrivals Grid */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 font-heading">
              Fresh In Store
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-1">
              New Arrivals & Restocks
            </h2>
          </div>
          <Link
            to="/category/all"
            className="mt-2 sm:mt-0 font-heading font-bold text-xs sm:text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>Browse New Additions &rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={prod => setSelectedQuickViewProduct(prod)}
            />
          ))}
        </div>
      </section>

      {/* Quick View Product Modal */}
      {selectedQuickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500"
            >
              &times;
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <img
                src={selectedQuickViewProduct.images[0]}
                alt={selectedQuickViewProduct.name}
                className="w-full h-64 object-cover rounded-2xl bg-slate-100"
              />
              <div className="space-y-3">
                <span className="text-xs font-bold text-sky-600 uppercase">
                  {selectedQuickViewProduct.category}
                </span>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  {selectedQuickViewProduct.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-2xl text-rose-600">
                    {formatPrice(selectedQuickViewProduct.price, settings.currency)}
                  </span>
                  {selectedQuickViewProduct.originalPrice && (
                    <span className="text-sm font-bold text-slate-400 line-through">
                      {formatPrice(selectedQuickViewProduct.originalPrice, settings.currency)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 line-clamp-3">
                  {selectedQuickViewProduct.description}
                </p>
                <div className="pt-2">
                  <Link
                    to={`/product/${selectedQuickViewProduct.slug}`}
                    onClick={() => setSelectedQuickViewProduct(null)}
                    className="w-full inline-block text-center py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-heading font-bold text-xs"
                  >
                    View Full Product Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
