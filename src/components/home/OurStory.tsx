import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Recycle, HeartHandshake } from 'lucide-react';

export const OurStory: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="alvora-container">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          {/* Left: Image Placeholder */}
          <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-[600px] overflow-hidden">
             <Image src="/images/our-story-lifestyle.jpg" alt="Alvora Skincare lifestyle" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-1/2">
            <span className="text-[10px] tracking-widest uppercase text-[#A1A7AA] font-bold mb-4 block">
              OUR STORY
            </span>
            
            <h2 className="font-display text-4xl lg:text-5xl text-[#1A1A1A] font-medium leading-tight mb-6">
              Skincare With Purpose
            </h2>
            
            <p className="text-[#4D3D2D]/80 leading-relaxed text-base mb-10">
              Alvora was created with a simple belief — skincare should be safe, effective and made with integrity. We source the finest ingredients, craft every formula with care and ensure every product is gentle on your skin and kind to the planet.
            </p>

            {/* Principles */}
            <div className="flex flex-col gap-6 mb-10">
              
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-10 h-10 rounded-full bg-[#FAF6F2] flex items-center justify-center text-[#C48B80]">
                    <Leaf className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1A1A] text-sm mb-1 uppercase tracking-wider">Clean & Conscious</h3>
                  <p className="text-sm text-[#4D3D2D]/80">Thoughtful ingredients for healthy skin.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-10 h-10 rounded-full bg-[#FAF6F2] flex items-center justify-center text-[#C48B80]">
                    <Recycle className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1A1A] text-sm mb-1 uppercase tracking-wider">Sustainable</h3>
                  <p className="text-sm text-[#4D3D2D]/80">Eco-friendly practices for a better tomorrow.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-10 h-10 rounded-full bg-[#FAF6F2] flex items-center justify-center text-[#C48B80]">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1A1A] text-sm mb-1 uppercase tracking-wider">Cruelty Free</h3>
                  <p className="text-sm text-[#4D3D2D]/80">No animal testing, ever.</p>
                </div>
              </div>

            </div>

            <Link href="/about" className="text-xs font-semibold tracking-widest text-[#1A1A1A] hover:text-[#C48B80] transition-colors border-b border-[#1A1A1A] hover:border-[#C48B80] pb-1 uppercase inline-flex items-center gap-2">
              READ OUR STORY &rarr;
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
};
