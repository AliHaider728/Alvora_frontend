"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Leaf, FlaskConical, Heart, Sparkles, Diamond } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export const AboutPageClient: React.FC = () => {
  return (
    <div className="bg-[#FAF6F2] min-h-screen overflow-hidden text-[#1A1A1A]">
      
      {/* SECTION 1: HERO */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#F9F4F0]">
        <div className="absolute inset-0 z-0 opacity-100">
          <Image 
            src="/images/about-hero.png" 
            alt="Alvora Hero Background" 
            fill 
            className="object-cover object-[80%_center] md:object-right xl:object-center"
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F2]/80 via-[#FAF6F2]/40 to-transparent md:from-transparent md:via-transparent md:to-transparent" />
        </div>
        
        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span variants={fadeInUp} className="text-xs font-bold tracking-[0.2em] text-[#C48B80] uppercase mb-6 block">
            About Alvora
          </motion.span>
          
          <motion.h1 variants={fadeInUp} className="font-display text-5xl md:text-6xl lg:text-7xl text-[#1A1A1A] mb-8 leading-[1.1]">
            More Than Skincare,<br/>
            <span className="italic font-light">It's a Ritual.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-[#1A1A1A]/70 text-base md:text-lg max-w-xl mx-auto mb-8 font-medium">
            At Alvora, we believe in the power of skincare to bring out your natural glow — because healthy skin isn't a luxury, it's confidence.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="w-12 h-px bg-[#C48B80]/50" />
        </motion.div>
      </section>

      {/* SECTION 2: OUR STORY */}
      <section className="py-24 md:py-32 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-stretch">
          
          <motion.div 
            className="w-full lg:w-1/2 flex flex-col justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="text-[10px] font-bold tracking-[0.2em] text-[#C48B80] uppercase mb-4 block">
              Our Story
            </motion.span>
            
            <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl text-[#1A1A1A] leading-tight mb-6">
              Rooted in Care,<br/>Backed by Science.
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-[#1A1A1A]/70 text-sm leading-relaxed mb-12 max-w-lg">
              Founded on the belief that beauty should be uncompromising, we formulate clean, effective skincare that respects your skin's natural barrier and delivers visible, radiant results without harsh chemicals.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Leaf, title: "Clean Ingredients", desc: "No harsh chemicals, just what your skin loves." },
                { icon: FlaskConical, title: "Dermatologist Approved", desc: "Tested for safety, efficacy, and real results." },
                { icon: Heart, title: "Happiness Guaranteed", desc: "Your satisfaction means everything to us." },
                { icon: Sparkles, title: "Science Backed", desc: "Modern science meets nature's best." }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp} className="flex flex-col">
                  <div className="w-10 h-10 rounded-full bg-[#FDF8F5] border border-[#F1C9BD] flex items-center justify-center text-[#C48B80] mb-3">
                    <item.icon className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <h4 className="text-[11px] font-bold text-[#1A1A1A] mb-1">{item.title}</h4>
                  <p className="text-[10px] text-[#1A1A1A]/60 leading-snug">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="w-full lg:w-1/2 relative min-h-[400px] md:min-h-[500px] lg:min-h-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="/images/cta-lifestyle.webp" 
                alt="Model with glowing skin" 
                fill 
                className="object-cover"
              />
              {/* Overlay text */}
              <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 text-white drop-shadow-md" style={{ fontFamily: "var(--font-display), serif" }}>
                <p className="text-3xl lg:text-4xl italic font-light tracking-wide rotate-[-4deg]">Healthy Skin,</p>
                <p className="text-3xl lg:text-4xl italic font-light tracking-wide rotate-[-4deg] ml-6 mt-1">Happy You</p>
              </div>
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* SECTION 3: OUR MISSION */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white to-[#FAF6F2]">
        {/* Subtle curved background shape overlay if desired */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row gap-16 lg:gap-24 items-center">
            
            <motion.div 
              className="w-full lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="relative aspect-[16/10] md:aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-white/50">
                <Image 
                  src="/images/cta-shelf.jpg" 
                  alt="Alvora Skincare Products" 
                  fill 
                  className="object-cover"
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="w-full lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeInUp} className="text-[10px] font-bold tracking-[0.2em] text-[#C48B80] uppercase mb-4 block">
                Our Mission
              </motion.span>
              
              <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl text-[#1A1A1A] leading-tight mb-6">
                Skincare Rooted in Care,<br/>Backed by Science.
              </motion.h2>
              
              <motion.p variants={fadeInUp} className="text-[#1A1A1A]/70 text-sm leading-relaxed mb-8 max-w-lg">
                We're on a mission to make high-performance skincare accessible to everyone — with thoughtfully crafted formulas, clean ingredients, and real, lasting results.
              </motion.p>
              
              <motion.p variants={fadeInUp} className="text-2xl md:text-3xl text-[#C48B80]" style={{ fontFamily: "var(--font-display), serif" }}>
                <span className="italic font-light">Better Skin. A Kinder Tomorrow.</span>
              </motion.p>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* SECTION 4: OUR VALUES */}
      <section className="py-24 md:py-32 px-6 lg:px-12 max-w-[1440px] mx-auto text-center border-t border-[#E7D9D0]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.span variants={fadeInUp} className="text-[10px] font-bold tracking-[0.2em] text-[#C48B80] uppercase mb-4 block">
            Our Values
          </motion.span>
          
          <motion.h2 variants={fadeInUp} className="font-display text-4xl text-[#1A1A1A] mb-4">
            What Drives Us
          </motion.h2>
          
          <motion.p variants={fadeInUp} className="text-[#1A1A1A]/60 text-sm max-w-xl mx-auto mb-16">
            Our values shape every product, every decision, and every step we take — because your skin deserves nothing less.
          </motion.p>
          
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 relative">
            {[
              { icon: Leaf, title: "Purity", desc: "Clean, safe, effective." },
              { icon: FlaskConical, title: "Innovation", desc: "Backed by science." },
              { icon: Heart, title: "Inclusivity", desc: "For every skin, always." },
              { icon: Diamond, title: "Integrity", desc: "Always transparent." }
            ].map((val, i) => (
              <motion.div key={i} variants={fadeInUp} className={`flex flex-col items-center relative ${i !== 3 ? 'lg:after:content-[""] lg:after:absolute lg:after:right-0 lg:after:top-[10%] lg:after:h-[80%] lg:after:w-px lg:after:bg-[#E7D9D0]' : ''}`}>
                <div className="w-12 h-12 rounded-full border border-[#C48B80] text-[#C48B80] flex items-center justify-center mb-4 bg-white">
                  <val.icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h4 className="text-xs font-bold text-[#1A1A1A] mb-1">{val.title}</h4>
                <p className="text-[11px] text-[#1A1A1A]/60">{val.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 5: FOUNDER'S NOTE */}
      <section className="pb-24 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto">
        <motion.div 
          className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-br from-[#F5EDE4] to-[#F1C9BD]/40 p-10 md:p-16 border border-white/60 shadow-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {/* Subtle texture/floral overlay in background */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none mix-blend-multiply flex justify-end">
             <Image src="/images/hero-background.jpeg" alt="Texture" fill className="object-cover object-right" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5EDE4] via-[#F5EDE4]/80 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#C48B80] uppercase mb-4 block">
              A Promise From Our Founder
            </span>
            
            <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A] mb-6 leading-tight">
              Skincare for a <br/>Brighter Tomorrow.
            </h2>
            
            <p className="text-[#1A1A1A]/80 text-sm md:text-base leading-relaxed italic mb-8 font-serif">
              "Alvora was born from a simple belief — that everyone deserves skincare that's safe, effective, and truly works. We're here to help you feel confident in your skin, every single day."
            </p>
            
            <p className="text-xs font-bold text-[#1A1A1A]/60 uppercase tracking-widest">
              — The Alvora Skincare Team
            </p>
          </div>
        </motion.div>
      </section>

    </div>
  );
};




