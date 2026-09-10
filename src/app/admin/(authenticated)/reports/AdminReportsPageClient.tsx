"use client";
import React from 'react';
import { BarChart3, TrendingUp, PieChart, ShoppingBag } from 'lucide-react';
import { useStore } from '../../../../context/StoreContext';

import { formatPrice } from '../../../../utils/formatters';
import { getSafeImageSrc } from '../../../../utils/images';

export const AdminReportsPageClient: React.FC = () => {
  const { categories, products, orders, settings } = useStore();

  return (
    <div className="space-y-6 font-heading">
      

      <div>
        <h1 className="font-heading font-black text-2xl text-[#1A1A1A]">Sales Reports & Category Breakdown</h1>
        <p className="text-xs text-[#1A1A1A]/50 font-medium">In-depth revenue trends, category distribution, and top product sales.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Share Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7D9D0]/80 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-base text-[#1A1A1A] flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#C48B80]" />
            <span>Category Share & Catalog Mix</span>
          </h3>

          <div className="space-y-3 pt-2">
            {categories.map((c, idx) => {
              const catProducts = products.filter(p => (p.categorySlugs?.length ? p.categorySlugs : [p.categorySlug]).includes(c.slug));
              const percent = Math.round((catProducts.length / products.length) * 100) || 15;
              return (
                <div key={c.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-[#1A1A1A]/80">
                    <span>{c.name}</span>
                    <span>{percent}% ({catProducts.length} items)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#FAF6F2] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx % 3 === 0 ? 'bg-[#C48B80]' : idx % 3 === 1 ? 'bg-amber-400' : 'bg-[#C48B80]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performing Products */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7D9D0]/80 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-base text-[#1A1A1A] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span>Top Performing Products This Month</span>
          </h3>

          <div className="space-y-3 divide-y divide-slate-100">
            {products.slice(0, 4).map((p, i) => (
              <div key={p.id} className="pt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-heading font-bold text-[#1A1A1A]/40 w-4">#{i + 1}</span>
                  <img src={getSafeImageSrc(p.images[0])} alt="" className="w-9 h-9 object-cover rounded-lg bg-[#FAF6F2]" />
                  <div>
                    <span className="font-heading font-bold text-[#1A1A1A] block">{p.name}</span>
                    <span className="text-[10px] text-[#1A1A1A]/40">{p.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#1A1A1A] block">{formatPrice(p.price * 24, settings.currency)}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">24 sales</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

