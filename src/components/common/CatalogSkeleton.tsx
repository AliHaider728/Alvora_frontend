import React from 'react';
import { SkeletonCard } from './SkeletonCard';

const block = 'alvora-skeleton rounded-lg';

export function CatalogSkeleton() {
  return (
    <div role="status" aria-label="Loading products" className="min-h-screen bg-[#FAF6F2] px-4 pb-32 pt-6 sm:px-6 lg:px-8">
      <div className={`mb-12 h-4 w-40 lg:mb-[52px] ${block}`} />
      <div className="relative mb-8 flex min-h-[250px] items-center overflow-hidden rounded-xl bg-[#E9E1D9] py-10 md:min-h-[300px] lg:min-h-[350px]">
        <div className="w-full max-w-2xl space-y-4 px-8 md:px-16">
          <div className={`h-3 w-24 ${block}`} />
          <div className={`h-10 w-64 max-w-full ${block}`} />
          <div className={`h-4 w-72 max-w-full ${block}`} />
          <div className={`h-4 w-56 max-w-full ${block}`} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="hidden h-fit space-y-5 rounded-2xl border border-[#E7D9D0] bg-white p-6 lg:block">
          <div className={`h-5 w-36 ${block}`} />
          {[0, 1, 2, 3, 4].map(i => <div key={i} className={`h-8 w-full rounded-full ${block}`} />)}
        </aside>
        <main className="space-y-6 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#EDE5DC] bg-white p-4 shadow-sm">
            <div className={`h-9 w-40 rounded-2xl lg:hidden ${block}`} />
            <div className={`h-4 w-40 ${block}`} />
            <div className={`h-9 w-52 rounded-2xl ${block}`} />
          </div>
          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        </main>
      </div>
    </div>
  );
}
