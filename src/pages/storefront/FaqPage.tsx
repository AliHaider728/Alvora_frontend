import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Truck, RefreshCw, Gift } from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SeoHead } from '../../components/common/SeoHead';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are all toys on Play Bimboo child-safe and non-toxic?',
      a: 'Yes, 100%! All toys sold on Play Bimboo undergo strict ASTM F963 and CPSIA testing. They are made with BPA-free, lead-free, non-toxic food-grade plastics or sustainably sourced birch woods.',
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-50'
    },
    {
      q: 'How fast is your shipping and how do I get FREE shipping?',
      a: 'We process orders within 1 business day. Standard shipping takes 2-4 business days. All orders over Rs. 5,000 qualify for FREE Express Shipping automatically!',
      icon: Truck,
      color: 'text-sky-500 bg-sky-50'
    },
    {
      q: 'What is your 30-Day Happiness Guarantee return policy?',
      a: 'If your child is not completely delighted with their toy, you can return it within 30 days of delivery in its original box for a full refund or exchange.',
      icon: RefreshCw,
      color: 'text-amber-500 bg-amber-50'
    },
    {
      q: 'Can I add gift wrapping or a personalized greeting card?',
      a: 'Absolutely! During checkout, select the "Gift Wrap Option" to include eco-friendly colorful gift paper and a hand-written custom message card.',
      icon: Gift,
      color: 'text-rose-500 bg-rose-50'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-8">
      <SeoHead title="Frequently Asked Questions (FAQ)" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'FAQs' }]} />

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm mb-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-500 flex items-center justify-center mx-auto">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h1 className="font-heading font-black text-3xl text-slate-900">Frequently Asked Questions</h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Everything you need to know about Play Bimboo safety, shipping speeds, gift options, and easy returns.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className={`w-full p-6 text-left flex items-start gap-4 transition-colors ${isOpen ? 'bg-slate-50/50' : 'hover:bg-slate-50/50'}`}
                >
                  <div className={`shrink-0 p-2 rounded-xl ${faq.color}`}>
                    <faq.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-heading font-bold text-sm sm:text-base ${isOpen ? 'text-rose-500' : 'text-slate-900 group-hover:text-rose-500'}`}>
                      {faq.q}
                    </h3>
                  </div>
                  <div className="shrink-0 pt-1">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-rose-500" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
