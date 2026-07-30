import React from 'react';
import { Rocket, Heart, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SeoHead } from '../../components/common/SeoHead';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans py-8">
      <SeoHead title="About ToyLand Store" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-amber-400 via-rose-500 to-sky-500 rounded-3xl p-8 sm:p-14 text-white shadow-xl mb-12 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-yellow-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Our Story & Mission
            </span>
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-white">
              Inspiring Young Explorers Every Single Day!
            </h1>
            <p className="text-xs sm:text-base text-white/90 leading-relaxed font-medium">
              Founded by passionate parents and educators, ToyLand exists to nurture creativity, wonder, and STEM problem-solving skills in children through safe, high-quality toys.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-black text-lg text-slate-900">100% Non-Toxic & Safe</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every single toy in our catalog undergoes rigorous safety testing for BPA, lead, and phthalates before reaching your child's hands.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-500 flex items-center justify-center mx-auto">
              <Rocket className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-black text-lg text-slate-900">STEM Learning First</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We collaborate with educators to curate hands-on building sets, coding kits, and logic puzzles that encourage brain growth.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-500 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-black text-lg text-slate-900">Happiness Guaranteed</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We stand by our 30-day hassle-free return policy. If your kid isn't thrilled, our customer support will make it right!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
