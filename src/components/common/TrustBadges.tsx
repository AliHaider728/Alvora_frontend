import React from 'react';
import { Truck, ShieldCheck, RefreshCw, LockKeyhole } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Truck,
      title: 'Free Express Shipping',
      desc: 'On orders over Rs. 5000',
      bgColor: 'bg-amber-100 text-amber-700',
    },
    {
      icon: ShieldCheck,
      title: '100% Safe Materials',
      desc: 'BPA-free & child-certified',
      bgColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      icon: RefreshCw,
      title: 'Easy 30-Day Returns',
      desc: 'Hassle-free guarantee',
      bgColor: 'bg-sky-100 text-sky-700',
    },
    {
      icon: LockKeyhole,
      title: 'Secure Checkout',
      desc: 'Encrypted 256-bit payments',
      bgColor: 'bg-rose-100 text-rose-700',
    },
  ];

  return (
    <section className="py-8 border-y border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-all hover:shadow-sm"
              >
                <div className={`p-2.5 rounded-xl ${b.bgColor} flex-shrink-0`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-800 leading-snug">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-sans">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
