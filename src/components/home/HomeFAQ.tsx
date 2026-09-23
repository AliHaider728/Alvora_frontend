'use client';

import React, { useState } from 'react';
import { Plus, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    question: "What ingredients does Alvora use?",
    answer: "We use clinically proven, clean ingredients like Niacinamide, Hyaluronic Acid, Centella Asiatica, and Ceramides. All our formulas are free from parabens, sulfates, and artificial fragrances."
  },
  {
    question: "Do you offer Cash on Delivery?",
    answer: "Yes! We offer Cash on Delivery (COD) across Pakistan."
  },
  {
    question: "How long does shipping take?",
    answer: "We offer free express shipping on orders over Rs. 5,000. Standard delivery takes 2-4 business days across Pakistan."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 7-day return policy. If you're not satisfied with your purchase, contact us within 7 days for a full refund or exchange."
  },
  {
    question: "Are your products suitable for sensitive skin?",
    answer: "Yes, all Alvora products are dermatologically tested and formulated for all skin types, including sensitive skin. We recommend patch testing new products."
  },
  {
    question: "How do I choose the right products for my skin?",
    answer: "Visit our Best Sellers page to see our most popular products, or contact us via WhatsApp for personalized recommendations."
  }
];

export const HomeFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#FAF6F2] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left Column: Heading & Intro */}
          <div className="lg:w-1/3 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4784F] bg-[#D4784F]/5 text-[#D4784F] mb-6">
              <Zap className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold uppercase tracking-widest">FAQs</span>
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-4xl text-[#1A1A1A] mb-4 leading-tight">
              Frequently Asked<br/>Questions
            </h2>
            
            <p className="text-[#1A1A1A]/70 text-base leading-relaxed mb-8">
              Have questions? You're in the right place. Explore our FAQs to learn how Alvora can support your skincare journey with clean, effective, and beautifully formulated solutions. We're here to bring out your most radiant skin.
            </p>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:w-2/3 space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white/60 hover:bg-white backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden transition-colors duration-300"
              >
                <button
                  onClick={() => toggleOpen(index)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <span className="font-semibold text-lg text-[#1A1A1A]">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0 ml-4 relative w-6 h-6 flex items-center justify-center text-[#1A1A1A]">
                    <motion.div
                      animate={{ rotate: openIndex === index ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute"
                    >
                      <Plus className="w-6 h-6" strokeWidth={2} />
                    </motion.div>
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-[#1A1A1A]/70 leading-relaxed text-base">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
};
