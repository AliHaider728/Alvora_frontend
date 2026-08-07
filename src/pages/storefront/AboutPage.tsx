import React from 'react';
import { Rocket, Heart, ShieldCheck, Sparkles, Award, Play } from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SeoHead } from '../../components/common/SeoHead';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans py-8">
      <SeoHead title="About Play Bimboo Store" />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
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
              Founded by passionate parents and educators, Play Bimboo exists to nurture creativity, wonder, and STEM problem-solving skills in children through safe, high-quality toys.
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

        {/* Brand Story & Video Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div className="space-y-6">
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
              The Story Behind Play Bimboo
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
              <p>
                It all started with a simple idea: toys shouldn't just be plastic distractions. They should be tools for growth, imagination, and family bonding. Play Bimboo was born out of a desire to create a magical space where parents could find high-quality, thoughtfully curated toys without compromising on safety or educational value.
              </p>
              <p>
                Our journey began in a small workshop where we tested and curated the very best STEM kits, puzzles, and creative sets. Today, we're proud to serve thousands of families across the globe, bringing smiles and "aha!" moments to young explorers every single day.
              </p>
              <p>
                We believe that every child is a natural innovator. With the right toys, they can build, discover, and learn the skills they need to shape the future. Thank you for being a part of our story!
              </p>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-4">
                <img className="w-12 h-12 rounded-full border-4 border-white object-cover bg-slate-200" src="https://i.pravatar.cc/100?img=1" alt="Founder 1" />
                <img className="w-12 h-12 rounded-full border-4 border-white object-cover bg-slate-200" src="https://i.pravatar.cc/100?img=5" alt="Founder 2" />
              </div>
              <div className="text-xs font-bold text-slate-700">
                <p>Sarah & James</p>
                <p className="text-slate-500 font-medium">Co-Founders</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 aspect-video group flex items-center justify-center">
            <div className="absolute inset-0 bg-rose-500/10 mix-blend-overlay z-10 pointer-events-none" />
            <div className="text-center z-20">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
              <p className="text-white/70 font-medium text-sm">Brand Video (Coming Soon)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
