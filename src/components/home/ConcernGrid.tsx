import React from 'react';
import Link from 'next/link';

export const ConcernGrid: React.FC = () => {
  const concerns = [
    {
      id: 'hydration',
      name: 'Hydration',
      subtext: 'Quench dry, thirsty skin.',
      link: '/category/all?tags=hydrating',
      bgClass: 'bg-gradient-to-br from-[#F5EDE4] to-[#F1C9BD]',
      textColor: 'text-[#4D3D2D]'
    },
    {
      id: 'brightening',
      name: 'Brightening',
      subtext: 'Reveal your natural glow.',
      link: '/category/all?tags=brightening',
      bgClass: 'bg-gradient-to-br from-[#F1C9BD] to-[#C48B80]',
      textColor: 'text-white'
    },
    {
      id: 'acne',
      name: 'Acne & Blemishes',
      subtext: 'Clear. Calm. Heal.',
      link: '/category/all?tags=acne',
      bgClass: 'bg-gradient-to-br from-[#EDE5DC] to-[#A1A7AA]',
      textColor: 'text-[#1A1A1A]'
    },
    {
      id: 'barrier',
      name: 'Skin Barrier',
      subtext: 'Strengthen & Protect.',
      link: '/category/all?tags=barrier',
      bgClass: 'bg-gradient-to-br from-[#C48B80] to-[#4D3D2D]',
      textColor: 'text-white'
    }
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="alvora-container">
        
        <div className="mb-10">
          <h2 className="font-display text-2xl md:text-3xl text-[#1A1A1A] font-medium uppercase tracking-widest">
            SHOP BY CONCERN
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {concerns.map((concern) => (
            <Link 
              key={concern.id}
              href={concern.link}
              className={`group relative overflow-hidden aspect-[4/3] flex flex-col justify-end p-6 ${concern.bgClass} hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className={`font-display text-2xl mb-1 ${concern.textColor}`}>
                  {concern.name}
                </h3>
                <p className={`text-xs mb-4 opacity-80 ${concern.textColor}`}>
                  {concern.subtext}
                </p>
                <span className={`text-[10px] font-bold tracking-widest uppercase border-b pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${concern.textColor} border-current inline-block`}>
                  SHOP NOW &rarr;
                </span>
              </div>
              
              {/* Subtle overlay effect on hover */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
