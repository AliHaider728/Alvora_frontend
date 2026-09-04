"use client";
import React, { useState, useMemo } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";

import { Filter, SlidersHorizontal, Star, X, Check, ChevronDown, RotateCcw } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { AlvoraProductCard } from '../../../components/common/AlvoraProductCard';
import { SkeletonCard } from '../../../components/common/SkeletonCard';
import { Breadcrumbs } from '../../../components/common/Breadcrumbs';

import { formatPrice } from '../../../utils/formatters';
import { AGE_GROUPS } from '../../../data/mockData';
import { AgeGroupCategory } from '../../../types';
import { getProductAgeGroups, isProductVisibleOnStorefront } from '../../../utils/products';
import { useScrollLock } from '../../../hooks/useScrollLock';

const parseMultiValueParam = (value: string | null) =>
  value
    ? Array.from(new Set(value.split(',').map(item => item.trim()).filter(item => item && item !== 'all')))
    : [];

const sameSelections = (left: string[], right: string[]) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

export const CategoryPageClient: React.FC = () => {
  const { slug: categorySlug } = useParams<{ slug?: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const setSearchParams = (newParams: URLSearchParams, options?: { replace?: boolean }) => {
    const search = newParams.toString();
    const query = search ? '?' + search : '';
    if (options?.replace) {
      router.replace(pathname + query, { scroll: false });
    } else {
      router.push(pathname + query, { scroll: false });
    }
  };
  const { products, categories } = useStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useScrollLock(mobileFilterOpen);

  // Filter States initialized from URL params
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam !== null) return parseMultiValueParam(categoryParam);
    return categorySlug && categorySlug !== 'all' ? [categorySlug] : [];
  });
  const [selectedAges, setSelectedAges] = useState<string[]>(() => parseMultiValueParam(searchParams.get('age')));
  const [priceRange, setPriceRange] = useState<number>(15000);
  const [minRating, setMinRating] = useState<number>(0);

  // Sort state
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');

  // Sync direct navigation and browser back/forward changes.
  React.useEffect(() => {
    const categoryParam = searchParams.get('category');
    const nextCategories = categoryParam !== null
      ? parseMultiValueParam(categoryParam)
      : categorySlug && categorySlug !== 'all'
        ? [categorySlug]
        : [];
    const nextAges = parseMultiValueParam(searchParams.get('age'));

    setSelectedCategories(current => sameSelections(current, nextCategories) ? current : nextCategories);
    setSelectedAges(current => sameSelections(current, nextAges) ? current : nextAges);
  }, [categorySlug, searchParams]);

  const syncFilterParams = (categoriesToSync: string[], agesToSync: string[]) => {
    const nextParams = new URLSearchParams(searchParams);
    if (categoriesToSync.length > 0) {
      nextParams.set('category', categoriesToSync.join(','));
    } else if (categorySlug && categorySlug !== 'all') {
      nextParams.set('category', 'all');
    } else {
      nextParams.delete('category');
    }
    if (agesToSync.length > 0) {
      nextParams.set('age', agesToSync.join(','));
    } else {
      nextParams.delete('age');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const toggleCategory = (category: string) => {
    const nextCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(value => value !== category)
      : [...selectedCategories, category];
    setSelectedCategories(nextCategories);
    syncFilterParams(nextCategories, selectedAges);
  };

  const selectAllCategories = () => {
    setSelectedCategories([]);
    syncFilterParams([], selectedAges);
  };

  const toggleAge = (age: string) => {
    const nextAges = selectedAges.includes(age)
      ? selectedAges.filter(value => value !== age)
      : [...selectedAges, age];
    setSelectedAges(nextAges);
    syncFilterParams(selectedCategories, nextAges);
  };

  const selectAllAges = () => {
    setSelectedAges([]);
    syncFilterParams(selectedCategories, []);
  };

  // Current active category object
  const currentCategoryObj = selectedCategories.length === 1
    ? categories.find(c => c.slug === selectedCategories[0])
    : undefined;

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!isProductVisibleOnStorefront(p)) return false;
      // Category match
      const productCategorySlugs = p.categorySlugs?.length ? p.categorySlugs : p.categorySlug ? [p.categorySlug] : [];
      if (selectedCategories.length > 0 && !selectedCategories.some(slug => productCategorySlugs.includes(slug))) {
        return false;
      }
      // Age group match
      const productAgeGroups = getProductAgeGroups(p);
      if (selectedAges.length > 0 && !selectedAges.some(age => productAgeGroups.includes(age as AgeGroupCategory))) {
        return false;
      }
      // Price filter
      if (p.price > priceRange) {
        return false;
      }
      // Rating filter
      if (p.rating < minRating) {
        return false;
      }
      return true;
    });
  }, [products, selectedCategories, selectedAges, priceRange, minRating]);

  // Sort Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedAges([]);
    setPriceRange(15000);
    setMinRating(0);
    setSortBy('featured');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('age');
    if (categorySlug && categorySlug !== 'all') nextParams.set('category', 'all');
    else nextParams.delete('category');
    setSearchParams(nextParams, { replace: true });
  };

  const breadcrumbItems = [
    { label: 'Shop', path: '/category/all' },
    { label: currentCategoryObj ? currentCategoryObj.name : 'All Products' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F2] font-sans py-6">
      

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="relative w-full h-[280px] mb-8 bg-[#F5EDE4] overflow-hidden flex items-center justify-center text-center border-b border-t border-[#EDE5DC]">
          <Image src="/images/shop-banner.png" alt="Skincare Collection" fill className="object-cover object-center opacity-90" />
          <div className="absolute inset-0 bg-[#F5EDE4]/30 z-10"></div>
          <div className="relative z-20 px-6 max-w-2xl">
            <span className="text-[10px] tracking-widest uppercase text-[#1A1A1A] font-bold mb-3 block drop-shadow-sm">
              COLLECTION
            </span>
            <h1 className="font-display text-4xl lg:text-5xl text-[#1A1A1A] font-medium leading-tight mb-4 drop-shadow-sm">
              {currentCategoryObj ? currentCategoryObj.name : 'All Products'}
            </h1>
            <p className="text-[#1A1A1A]/90 text-sm font-medium leading-relaxed max-w-lg mx-auto drop-shadow-sm">
              {currentCategoryObj
                ? currentCategoryObj.description
                : 'Explore our full spectrum of premium skincare, serums, moisturizers, and cleansers.'}
            </p>
          </div>
        </div>

        {/* Layout Grid: Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-sm border border-[#E7D9D0] shadow-sm h-fit sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE5DC]">
              <div className="font-display font-extrabold text-[#1A1A1A] text-xs tracking-widest uppercase">
                FILTER PRODUCTS
              </div>
              <SlidersHorizontal className="w-4 h-4 text-[#1A1A1A]/60" />
            </div>
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xs uppercase tracking-widest text-[#1A1A1A] flex justify-between items-center cursor-pointer">
                <span>CATEGORY</span>
                <ChevronDown className="w-4 h-4 text-[#1A1A1A]/60 rotate-180" />
              </h3>
              <div className="space-y-3 pt-2">
                <button
                  onClick={selectAllCategories}
                  className="w-full flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]/80 group-hover:text-[#C87355] transition-colors">
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedCategories.length === 0 ? 'border-[#C87355] bg-white' : 'border-[#A1A7AA]'}`}>
                      {selectedCategories.length === 0 && <div className="w-1.5 h-1.5 rounded-full bg-[#C87355]" />}
                    </div>
                    <span className={selectedCategories.length === 0 ? "text-[#C87355]" : ""}>All Categories</span>
                  </div>
                  <span className="text-[10px] text-[#A1A7AA]">({products.length})</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.slug)}
                    className="w-full flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]/80 group-hover:text-[#C87355] transition-colors">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedCategories.includes(cat.slug) ? 'border-[#C87355] bg-white' : 'border-[#A1A7AA]'}`}>
                        {selectedCategories.includes(cat.slug) && <div className="w-1.5 h-1.5 rounded-full bg-[#C87355]" />}
                      </div>
                      <span className={selectedCategories.includes(cat.slug) ? "text-[#C87355]" : ""}>{cat.name}</span>
                    </div>
                    <span className="text-[10px] text-[#A1A7AA]">({cat.itemCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Age Group Filter */}
            <div className="space-y-2 pt-4 border-t border-[#EDE5DC]">
              <h3 className="font-display font-bold text-xs uppercase tracking-widest text-[#1A1A1A] flex justify-between items-center">
                Age Recommendation
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={selectAllAges}
                  aria-pressed={selectedAges.length === 0}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold text-center transition-colors ${
                    selectedAges.length === 0
                      ? 'bg-[#C48B80] text-white'
                      : 'bg-[#F5EDE4] text-[#241916]/80 hover:bg-slate-200'
                  }`}
                >
                  All Ages
                </button>
                {AGE_GROUPS.map(age => (
                  <button
                    key={age.id}
                    onClick={() => toggleAge(age.id)}
                    aria-pressed={selectedAges.includes(age.id)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold text-center transition-colors ${
                      selectedAges.includes(age.id)
                        ? 'bg-[#C48B80] text-white'
                        : 'bg-[#F5EDE4] text-[#241916]/80 hover:bg-slate-200'
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 pt-4 border-t border-[#EDE5DC]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-[#1A1A1A]/60">
                    Max Price
                  </h3>
                  <span className="font-display font-extrabold text-xs text-[#1A1A1A]">
                    {formatPrice(priceRange)}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="500"
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#C48B80] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>{formatPrice(500)}</span>
                  <span>{formatPrice(15000)}</span>
                </div>
            </div>


            {/* Minimum Rating Filter */}
            <div className="space-y-2 pt-4 border-t border-[#EDE5DC]">
              <h3 className="font-display font-bold text-xs uppercase tracking-widest text-[#1A1A1A] flex justify-between items-center">
                Minimum Rating
              </h3>
              <div className="space-y-1">
                {[0, 4, 4.5, 4.8].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`w-full flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      minRating === r ? 'bg-[#F1C9BD] text-[#241916] font-bold' : 'text-[#1A1A1A]/80 hover:bg-[#F5EDE4]'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{r === 0 ? 'All Ratings' : `${r}+ Stars`}</span>
                  </button>
                ))}
              </div>
            </div>
          <div className="pt-4 border-t border-[#EDE5DC]">
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-[#1A1A1A]/60 hover:text-[#C87355] flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Controls Bar: Mobile Filter Button + Results Count + Sort Dropdown */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EDE5DC] mb-6">
              <span className="text-xs font-medium text-[#1A1A1A]/60">
                Showing {sortedProducts.length} products
              </span>
              
              <div className="flex-1 max-w-sm relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery || ''}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs py-2 px-4 rounded-sm border border-[#EDE5DC] bg-white focus:outline-none focus:border-[#C87355] text-[#1A1A1A]"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#1A1A1A]/60 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="py-1.5 px-3 text-xs font-semibold rounded-sm border border-[#EDE5DC] bg-white text-[#1A1A1A] focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};
