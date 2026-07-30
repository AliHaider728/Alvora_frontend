import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Gift } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: ShieldCheck,
      title: '100% Safe &',
      desc: 'Child-Friendly',
      bgColor: 'bg-blue-500 text-white',
    },
    {
      icon: Truck,
      title: 'Express Delivery',
      desc: '2–3 Days',
      bgColor: 'bg-amber-400 text-white',
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      desc: 'Hassle-Free',
      bgColor: 'bg-rose-400 text-white',
    },
    {
      icon: Gift,
      title: 'Perfect for',
      desc: 'Gifting',
      bgColor: 'bg-purple-500 text-white',
    },
  ];

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 py-6 px-4 md:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 divide-x-0 md:divide-x divide-slate-100">
        {badges.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-4 px-2 md:justify-center"
            >
              <div className={`p-3 rounded-full flex-shrink-0 ${b.bgColor} shadow-sm`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-slate-800 text-xs md:text-sm leading-tight">
                  {b.title}
                </span>
                <span className="text-slate-500 text-[10px] md:text-xs font-semibold mt-0.5">
                  {b.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
