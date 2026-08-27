"use client";
import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Leaf, HeartHandshake, Instagram, Facebook, Users, Star, PackageCheck, Clock, Sparkles, Truck, Heart, LayoutGrid, Quote, Droplet } from 'lucide-react';

export const AboutPageClient: React.FC = () => {
  return (
    <div className="alvora-container min-h-screen py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        
        {/* HERO BANNER */}
        <div className="bg-[#FAF6F2] border border-[#E7D9D0] rounded-sm p-10 sm:p-16 mb-16 text-center shadow-sm relative overflow-hidden flex flex-col items-center justify-center">
          <div className="relative z-10 max-w-3xl">
            <span className="text-[10px] tracking-widest uppercase text-[#A86249] font-bold mb-4 block">
              Our Mission
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#241916] font-medium leading-tight mb-6">
              Skincare Rooted in Care, Backed by Science
            </h1>
            <p className="text-[#241916]/70 leading-relaxed text-base sm:text-lg max-w-2xl mx-auto">
              Founded on the belief that beauty should be uncompromising. We formulate clean, effective skincare that respects your skin's natural barrier and delivers visible, radiant results without harsh chemicals.
            </p>
          </div>
        </div>

        {/* THREE FEATURE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20">
          <div className="bg-white p-8 sm:p-10 rounded-sm border border-[#E7D9D0] shadow-sm text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#F1C9BD] text-[#A86249] flex items-center justify-center mb-6">
              <Leaf className="w-7 h-7" />
            </div>
            <h3 className="font-display text-xl text-[#241916] mb-3">Clean, Non-Toxic Ingredients</h3>
            <p className="text-[#1A1A1A]/70 text-sm leading-relaxed">
              We never use parabens, sulfates, or artificial fragrances. Only skin-loving ingredients that nourish and protect.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-sm border border-[#E7D9D0] shadow-sm text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#EFCDBE] text-[#A86249] flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-display text-xl text-[#241916] mb-3">Dermatologist Approved</h3>
            <p className="text-[#1A1A1A]/70 text-sm leading-relaxed">
              Every formula is rigorously tested to ensure it is safe, effective, and gentle enough for even the most sensitive skin.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-sm border border-[#E7D9D0] shadow-sm text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#FAF6F2] text-[#A86249] flex items-center justify-center mb-6">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="font-display text-xl text-[#241916] mb-3">Happiness Guaranteed</h3>
            <p className="text-[#1A1A1A]/70 text-sm leading-relaxed">
              We stand behind our products. If your skin doesn't love our formulas, our support team is here to make it right.
            </p>
          </div>
        </div>

        {/* THE STORY BEHIND ALVORA SKINCARE */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-24">
          <div className="w-full lg:w-1/2 relative aspect-[4/3] rounded-sm overflow-hidden shadow-md">
            <Image 
              src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop"
              alt="Premium Skincare"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <span className="text-[10px] tracking-widest uppercase text-[#A86249] font-bold block">
              Our Story
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#241916] font-medium leading-tight">
              The Story Behind Alvora Skincare
            </h2>
            <div className="space-y-4 text-[#1A1A1A]/70 leading-relaxed text-sm sm:text-base">
              <p>
                It all started with a simple idea: skincare shouldn't be a compromise between efficacy and safety. We noticed the market was flooded with harsh chemical treatments or natural products that simply didn't work. Alvora Skincare was born out of a desire to bridge that gap.
              </p>
              <p>
                We spent years researching and partnering with top dermatologists to develop formulas that treat real skin concerns — from hyperpigmentation to barrier repair — using clean, scientifically-backed ingredients. We believe in transparency, sustainability, and giving you the radiant skin you deserve.
              </p>
            </div>
            
            <div className="pt-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F5EDE4] overflow-hidden relative">
                 {/* Optional Avatar */}
                 <div className="w-full h-full bg-[#EFCDBE]" />
              </div>
              <div>
                <p className="font-display text-[#241916] font-medium text-lg">Sarah & James</p>
                <p className="text-xs text-[#A86249] uppercase tracking-widest font-bold">Co-Founders</p>
              </div>
            </div>
          </div>
        </div>

        {/* JOIN OUR COMMUNITY BOX */}
        <div className="bg-[#FAF6F2] rounded-sm p-8 sm:p-12 mb-20 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#E7D9D0]">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="font-display text-2xl sm:text-3xl text-[#241916] mb-3">Join Our Community</h3>
            <p className="text-[#1A1A1A]/70 text-sm leading-relaxed">
              Follow Alvora Skincare on our official social channels to see real results, get exclusive skincare tips, and share your glowing journey!
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <a href="#" className="w-12 h-12 rounded-full bg-white text-[#A86249] flex items-center justify-center hover:bg-[#A86249] hover:text-white transition-colors shadow-sm border border-[#E7D9D0]">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-white text-[#A86249] flex items-center justify-center hover:bg-[#A86249] hover:text-white transition-colors shadow-sm border border-[#E7D9D0]">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="bg-[#1A1A1A] p-8 sm:p-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#2A2A2A] text-[#F1C9BD] flex items-center justify-center mx-auto">
                <Users className="w-5 h-5" />
              </div>
              <p className="font-display text-3xl sm:text-4xl text-white">12,000+</p>
              <p className="text-[10px] sm:text-xs text-white/60 font-bold uppercase tracking-widest">Happy Customers</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#2A2A2A] text-[#F1C9BD] flex items-center justify-center mx-auto">
                <Star className="w-5 h-5" />
              </div>
              <p className="font-display text-3xl sm:text-4xl text-white">4.9/5</p>
              <p className="text-[10px] sm:text-xs text-white/60 font-bold uppercase tracking-widest">Average Rating</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#2A2A2A] text-[#F1C9BD] flex items-center justify-center mx-auto">
                <PackageCheck className="w-5 h-5" />
              </div>
              <p className="font-display text-3xl sm:text-4xl text-white">500+</p>
              <p className="text-[10px] sm:text-xs text-white/60 font-bold uppercase tracking-widest">Products Curated</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#2A2A2A] text-[#F1C9BD] flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <p className="font-display text-3xl sm:text-4xl text-white">2-4 Days</p>
              <p className="text-[10px] sm:text-xs text-white/60 font-bold uppercase tracking-widest">Nationwide Delivery</p>
            </div>
          </div>
        </div>

        {/* WHY CHOOSE ALVORA SKINCARE */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <span className="text-[10px] tracking-widest uppercase text-[#A86249] font-bold block">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#241916] font-medium leading-tight">
              Why Customers Choose Alvora Skincare
            </h2>
            <p className="text-[#1A1A1A]/70 text-sm sm:text-base leading-relaxed">
              From the moment you order to the moment you see the glow in the mirror, every step is built around safety, efficacy, and a premium experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-sm border border-[#E7D9D0] shadow-sm space-y-4 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF6F2] text-[#A86249] flex items-center justify-center">
                <PackageCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg text-[#241916]">Sustainable Packaging</h3>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                Every order is carefully packed in protective, eco-conscious packaging so it arrives safe and sound.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm border border-[#E7D9D0] shadow-sm space-y-4 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF6F2] text-[#A86249] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg text-[#241916]">Fast Delivery Across Pakistan</h3>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                Quick and reliable delivery straight to your doorstep, nationwide, with Cash on Delivery available.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm border border-[#E7D9D0] shadow-sm space-y-4 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF6F2] text-[#A86249] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg text-[#241916]">Gentle, Skin-Safe Ingredients</h3>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                Every product is selected with your skin's health in mind, using non-toxic, clinically-tested formulations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm border border-[#E7D9D0] shadow-sm space-y-4 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF6F2] text-[#A86249] flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg text-[#241916]">A Formula for Every Skin Type</h3>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                Explore hydrating serums, clarifying toners, barrier creams, and more — curated for every skin concern.
              </p>
            </div>
          </div>
        </div>

        {/* OUR PROMISE QUOTE */}
        <div className="bg-[#EFCDBE]/20 rounded-sm border border-[#EFCDBE] p-10 sm:p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-white text-[#A86249] flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#E7D9D0]">
            <Quote className="w-6 h-6" />
          </div>
          <p className="max-w-3xl mx-auto font-display text-xl sm:text-2xl text-[#241916] leading-relaxed">
            "At Alvora Skincare, we're passionate about empowering you to feel confident in your own skin through clean, effective, and beautifully crafted formulas — because your skin deserves the best."
          </p>
          <p className="mt-8 text-[10px] font-bold text-[#A86249] uppercase tracking-widest">— The Alvora Skincare Team</p>
        </div>
        
      </div>
    </div>
  );
};