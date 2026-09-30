import React from 'react';

const shimmer = 'alvora-skeleton rounded-lg';

export const SkeletonCard = ({ compact = false }: { compact?: boolean }) => (
  <div aria-hidden="true" className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#EDE5DC] bg-white">
    <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-[#F5EDE4]">
      <div className={`absolute inset-0 ${shimmer}`} />
      <div className={`absolute left-3 top-3 h-6 w-20 ${shimmer}`} />
      <div className={`absolute right-3 top-3 h-7 w-7 rounded-full ${shimmer}`} />
    </div>
    <div className="flex flex-1 flex-col p-4 text-left">
      <div className={`h-4 w-4/5 ${shimmer}`} />
      <div className={`mt-4 h-3 w-24 ${shimmer}`} />
      <div className={`mb-2 mt-3 h-5 w-20 ${shimmer}`} />
      <div className="mt-auto flex gap-2">
        <div className={`h-10 flex-1 rounded-xl ${shimmer}`} />
        <div className={`${compact ? 'hidden sm:block' : ''} h-10 flex-1 rounded-xl ${shimmer}`} />
      </div>
    </div>
  </div>
);

export const SkeletonDetail = () => (
  <div role="status" aria-label="Loading product details" className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 md:py-10">
    <div className={`mb-8 h-4 w-1/3 max-w-52 ${shimmer}`} />
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="space-y-4 lg:col-span-6">
        <div className={`aspect-square w-full rounded-3xl ${shimmer}`} />
        <div className="flex gap-4">{[0, 1, 2].map(i => <div key={i} className={`aspect-square w-16 sm:w-20 rounded-xl ${shimmer}`} />)}</div>
      </div>
      <div className="space-y-6 lg:col-span-6 lg:py-8">
        <div className={`h-4 w-1/3 ${shimmer}`} />
        <div className={`h-10 w-4/5 ${shimmer}`} />
        <div className={`h-4 w-28 ${shimmer}`} />
        <div className={`h-8 w-1/3 ${shimmer}`} />
        <div className="space-y-3 border-t border-[#EDE5DC] pt-6">
          <div className={`h-4 w-full ${shimmer}`} />
          <div className={`h-4 w-5/6 ${shimmer}`} />
          <div className={`h-4 w-4/6 ${shimmer}`} />
        </div>
        <div className="flex gap-3 pt-4"><div className={`h-12 w-32 rounded-full ${shimmer}`} /><div className={`h-12 flex-1 rounded-full ${shimmer}`} /></div>
        <div className={`h-14 w-full rounded-full ${shimmer}`} />
      </div>
    </div>
  </div>
);

export const FeaturedProductsSkeleton = () => (
  <section role="status" aria-label="Loading featured products" className="bg-[#FAF6F2] py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className={`mx-auto mb-12 h-12 w-64 max-w-full ${shimmer}`} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
        {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} compact />)}
      </div>
      <div className={`mx-auto mt-12 h-12 w-48 rounded-full md:mt-16 ${shimmer}`} />
    </div>
  </section>
);

export const BundleSectionSkeleton = () => (
  <section role="status" aria-label="Loading bundles" className="bg-white">
    <div className="bg-[#FAF6F2] px-4 py-12 text-center md:py-16">
      <div className={`mx-auto mb-4 h-3 w-24 ${shimmer}`} />
      <div className={`mx-auto mb-6 h-12 w-64 ${shimmer}`} />
      <div className={`mx-auto h-4 w-80 max-w-full ${shimmer}`} />
    </div>
    <div className="flex min-h-[500px] w-full flex-col md:flex-row">
      <div className={`aspect-square w-full md:w-1/2 md:aspect-auto ${shimmer}`} />
      <div className="flex w-full flex-col justify-center space-y-6 p-8 md:w-1/2 md:p-16 lg:p-24">
        <div className={`h-4 w-24 ${shimmer}`} />
        <div className={`h-10 w-3/4 ${shimmer}`} />
        <div className={`h-4 w-full ${shimmer}`} />
        <div className={`h-4 w-5/6 ${shimmer}`} />
        <div className={`h-8 w-32 ${shimmer}`} />
        <div className={`h-12 w-40 rounded-full ${shimmer}`} />
      </div>
    </div>
  </section>
);
