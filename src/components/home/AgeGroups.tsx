import React from 'react';
import Link from 'next/link';
import { Baby, Blocks, Rocket, Gamepad2 } from 'lucide-react';
import { AGE_GROUPS } from '../../data/mockData';

const ageIcons: Record<string, React.ReactNode> = {
  '0-2': <Baby className="w-6 h-6 text-amber-600" />,
  '3-5': <Blocks className="w-6 h-6 text-rose-600" />,
  '6-8': <Rocket className="w-6 h-6 text-sky-600" />,
  '9-12': <Gamepad2 className="w-6 h-6 text-purple-600" />,
  '13+': <Gamepad2 className="w-6 h-6 text-indigo-600" />
};

export const AgeGroups: React.FC<{ sectionSettings: any }> = ({ sectionSettings }) => {
  if (!sectionSettings?.enabled) return null;

  return (
    <section style={{ order: sectionSettings.order }} className="py-12 w-full bg-linear-to-r from-amber-50/70 via-rose-50/50 to-sky-50/70 border-y border-slate-200/60 mt-6 sm:mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 font-heading">
            Tailored for Every Stage
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-1">
            {sectionSettings.heading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            {sectionSettings.subheading}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {AGE_GROUPS.map(age => (
            <Link
              key={age.id}
              href={`/category/all?ageGroup=${age.id}`}
              className="group relative bg-white/60 backdrop-blur-md rounded-[24px] p-6 text-center border border-white hover:border-amber-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/80 to-white/20 rounded-[24px] z-0" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {ageIcons[age.id] || <Baby className="w-6 h-6 text-amber-600" />}
                </div>
                <h3 className="font-heading font-black text-xl text-slate-800 mb-1">
                  {age.label}
                </h3>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {age.description}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
