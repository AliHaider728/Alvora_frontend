import { BestSellersRitualSkeleton } from '../../components/common/BestSellersRitualSkeleton';

export default function Loading() {
  return (
    <div role="status" aria-label="Loading best sellers" className="min-h-screen bg-[#FAF6F2]">
      <section className="flex min-h-[40vh] flex-col items-center justify-center px-4 pb-12 pt-24 text-center">
        <span className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#C87355]">The Alvora Collection</span>
        <h1 className="mb-6 font-display text-4xl font-medium tracking-wide text-[#1A1A1A] sm:text-5xl md:text-7xl lg:text-8xl">Best Sellers</h1>
        <p className="max-w-2xl text-base font-medium leading-relaxed text-[#1A1A1A]/70 md:text-lg">Discover the science-backed formulations our community loves the most. Experience visible results with our top-rated skincare essentials.</p>
      </section>
      <BestSellersRitualSkeleton />
    </div>
  );
}
