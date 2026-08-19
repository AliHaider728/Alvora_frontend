import React from 'react';
import Link from 'next/link';

export const IngredientSection: React.FC = () => {
  const ingredients = [
    {
      name: 'Niacinamide',
      description: 'Brightens skin and minimizes pores.',
      color: 'bg-[#F1C9BD]'
    },
    {
      name: 'Hyaluronic Acid',
      description: 'Locks in moisture and plumps skin.',
      color: 'bg-[#F5EDE4]'
    },
    {
      name: 'Centella Asiatica',
      description: 'Calms irritation and strengthens barrier.',
      color: 'bg-[#E3E8E1]'
    },
    {
      name: 'Ceramides',
      description: 'Locks in moisture and protects skin barrier.',
      color: 'bg-[#EADED2]'
    }
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="alvora-container">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          {/* Left: Text Content */}
          <div className="w-full lg:w-1/3">
            <span className="text-xs tracking-widest uppercase text-[#A1A7AA] font-semibold mb-4 block">
              SCIENCE & NATURE
            </span>
            <h2 className="font-display text-4xl lg:text-5xl text-[#1A1A1A] font-medium leading-tight mb-6">
              Nature + Science<br />For Your Skin
            </h2>
            <p className="text-[#4D3D2D]/80 leading-relaxed text-base mb-8">
              We combine clean, potent ingredients with advanced skincare science to deliver visible, lasting results. Every formula is carefully crafted to be gentle yet highly effective.
            </p>
            <Link href="/about" className="text-xs font-semibold tracking-widest text-[#1A1A1A] hover:text-[#C48B80] transition-colors border-b border-[#1A1A1A] hover:border-[#C48B80] pb-1 uppercase inline-flex items-center gap-2">
              LEARN MORE &rarr;
            </Link>
          </div>

          {/* Right: Ingredients Grid */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {ingredients.map((ing, i) => (
                <div key={i} className="bg-[#FAF6F2] p-6 flex flex-col gap-4">
                  {/* Circular Image Placeholder */}
                  <div className={`w-16 h-16 rounded-full ${ing.color} flex items-center justify-center`}>
                    {/* Add a subtle graphic or leave as clean color circle */}
                    <div className="w-8 h-8 rounded-full bg-white/40 backdrop-blur-sm"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A] text-base mb-1">
                      {ing.name}
                    </h3>
                    <p className="text-sm text-[#4D3D2D]/80">
                      {ing.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
