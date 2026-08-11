import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Boxes, Shield, GraduationCap, Heart, Sun, Dices } from 'lucide-react';
import { Category } from '../../types';
import { getSafeImageSrc } from '../../utils/images';

const categoryIcons: Record<string, React.ReactNode> = {
  'building-sets': <Boxes className="w-6 h-6 text-amber-500" />,
  'action-figures': <Shield className="w-6 h-6 text-rose-500" />,
  'educational-stem': <GraduationCap className="w-6 h-6 text-sky-500" />,
  'soft-toys': <Heart className="w-6 h-6 text-pink-500" />,
  'outdoor-toys': <Sun className="w-6 h-6 text-emerald-500" />,
  'board-games': <Dices className="w-6 h-6 text-purple-500" />
};

export const Categories: React.FC<{ categories: Category[], sectionSettings: any }> = ({ categories, sectionSettings }) => {
  if (!sectionSettings?.enabled) return null;

  return (
    <section style={{ order: sectionSettings.order }} className="py-14 sm:py-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-rose-500 font-heading">
            {sectionSettings.subheading}
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-1">
            {sectionSettings.heading}
          </h2>
        </div>
        <Link
          href={sectionSettings.ctaLink || '/category/all'}
          className="mt-2 sm:mt-0 font-heading font-bold text-xs sm:text-sm text-rose-500 hover:text-rose-600 flex items-center gap-1 group"
        >
          <span>{sectionSettings.ctaLabel || 'View All Categories'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(cat => (
          <Link
            key={cat.id || cat.slug}
            href={`/category/${cat.slug}`}
            className="group bg-white rounded-3xl p-4 border border-slate-100 shadow-xs hover:shadow-xl hover:shadow-rose-100 hover:-translate-y-1.5 transition-all text-center flex flex-col items-center justify-between h-52"
          >
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 mb-3">
              <Image
                src={getSafeImageSrc(cat.image) || '/placeholder.png'}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
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
  );
};
