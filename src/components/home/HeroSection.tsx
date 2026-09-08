"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FlaskConical, Leaf, Rabbit, Droplet, ArrowRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    eyebrow: "PREMIUM SKINCARE",
    headlineLine1: "Skincare,",
    headlineLine2: "Made Simple.",
    description: "Thoughtful formulas. Clinically tested.\nMade for real skin and real life.",
    ctaText: "EXPLORE COLLECTION",
    ctaLink: "/category/all",
    image: "/images/hero/alvora-hero.png",
    scriptText: "Healthy Skin\nHappy You",
  },
  {
    id: 2,
    eyebrow: "DAILY RITUALS",
    headlineLine1: "Glow From",
    headlineLine2: "Within.",
    description: "Nourish your skin barrier with our\naward-winning hydration trio.",
    ctaText: "SHOP HYDRATION",
    ctaLink: "/category/moisturizers",
    image: "/images/hero/alvora-hero.png", 
    scriptText: "Radiant &\nRenewed",
  },
  {
    id: 3,
    eyebrow: "DERMATOLOGIST TESTED",
    headlineLine1: "Gentle Yet",
    headlineLine2: "Effective.",
    description: "Targeted solutions for sensitive skin.\nNo harsh chemicals, just results.",
    ctaText: "SHOP SERUMS",
    ctaLink: "/category/serums",
    image: "/images/hero/alvora-hero.png",
    scriptText: "Pure &\nPotent",
  }
];

const trustItems = [
  { icon: FlaskConical, title: "Clinically", subtitle: "Tested" },
  { icon: Leaf, title: "Clean", subtitle: "Ingredients" },
  { icon: Rabbit, title: "Cruelty", subtitle: "Free" },
  { icon: Droplet, title: "Sensitive", subtitle: "Skin" },
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Preload images to avoid flicker
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.image;
    });
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
  };

  useEffect(() => {
    if (!isPaused) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handleManualChange = (index: number) => {
    setCurrentSlide(index);
    setIsPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Resume autoplay after 8s of inactivity
    setTimeout(() => {
      setIsPaused(false);
    }, 8000);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-[#F5E6DE]">
      <div className="mx-auto w-full max-w-[1536px] relative px-4 sm:px-6 lg:px-12 xl:px-16 pt-8 pb-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] min-h-[640px] lg:min-h-[760px] items-center">
          
          {/* LEFT CONTENT */}
          <div className="relative z-20 flex flex-col justify-center pt-10 pb-16 lg:py-20 xl:pr-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                {/* Eyebrow */}
                <div className="mb-6 flex items-center gap-4">
                  <span className="h-[1px] w-12 bg-[#B3715C]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B3715C]">
                    {slide.eyebrow}
                  </span>
                </div>

                {/* Heading */}
                <h1 className="font-display text-[64px] font-medium leading-[0.95] tracking-[-0.02em] text-[#2B1D18] sm:text-[76px] lg:text-[84px] xl:text-[96px]">
                  {slide.headlineLine1}
                  <br />
                  <span className="font-display italic text-[#C27B66]">{slide.headlineLine2}</span>
                </h1>

                {/* Description */}
                <p className="mt-6 max-w-md text-[13px] leading-relaxed text-[#5C4F4A] sm:text-[15px] sm:leading-loose whitespace-pre-line">
                  {slide.description}
                </p>

                {/* Buttons */}
                <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                  <Link
                    href={slide.ctaLink}
                    className="group flex h-[50px] items-center justify-center gap-3 rounded-full bg-[#B3715C] px-8 text-[11px] font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#965D49] hover:shadow-lg"
                  >
                    {slide.ctaText}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <button className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#2B1D18] transition-colors hover:text-[#B3715C]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2B1D18]/20 transition-colors group-hover:border-[#B3715C]">
                      <Play className="h-3.5 w-3.5 fill-current ml-1" />
                    </span>
                    <span className="text-left leading-tight">
                      Our<br />Philosophy
                    </span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* TRUST ITEMS */}
            <div className="mt-16 border-t border-[#2B1D18]/10 pt-8 max-w-md">
              <div className="grid grid-cols-4 gap-2">
                {trustItems.map(({ icon: Icon, title, subtitle }) => (
                  <div key={title} className="flex flex-col items-center text-center group">
                    <Icon className="mb-3 h-[22px] w-[22px] text-[#A17163] transition-transform group-hover:scale-110 group-hover:text-[#B3715C]" strokeWidth={1.2} />
                    <span className="text-[9px] font-bold uppercase leading-relaxed tracking-widest text-[#4A3D38]">
                      {title}
                      <br />
                      {subtitle}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative h-[550px] w-full lg:h-full lg:min-h-[760px] rounded-3xl lg:rounded-none overflow-hidden lg:overflow-visible flex items-center justify-center lg:justify-end">
            
            {/* The actual image container */}
            <div className="relative w-full h-full lg:absolute lg:inset-y-0 lg:right-16 lg:left-0 lg:h-[85%] lg:my-auto rounded-[40px] overflow-hidden lg:shadow-none bg-transparent">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  {/* Note: The reference image shows products directly on the peach background with geometric shapes behind them.
                      Assuming the transparent PNG is used, we just drop it in. 
                  */}
                  <Image
                    src={slide.image}
                    alt="Alvora Skincare Hero"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover object-center lg:object-contain"
                  />
                  
                  {/* Floating Script Text */}
                  <div className="absolute right-[4%] top-[25%] z-20 hidden md:block">
                    <span className="font-display italic text-[42px] leading-tight text-[#C27B66] opacity-90 drop-shadow-sm whitespace-pre-line text-right block -rotate-[8deg]">
                      {slide.scriptText}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* OVERLAYS (Static across slides) */}
              
              {/* Badge - Dermatologist Approved */}
              <div className="absolute right-[10%] top-[10%] sm:right-[15%] sm:top-[15%] z-30 flex h-[110px] w-[110px] lg:h-[130px] lg:w-[130px] items-center justify-center rounded-full border border-[#2B1D18]/10 bg-transparent">
                <div className="absolute inset-[4px] rounded-full border border-[#2B1D18]/10" />
                <div className="relative text-center flex flex-col items-center">
                  <span className="block text-[8px] font-medium uppercase tracking-[0.2em] text-[#5C4F4A]">Dermatologist</span>
                  <Leaf className="my-1.5 h-5 w-5 text-[#B3715C]" strokeWidth={1} />
                  <span className="block text-[8px] font-medium uppercase tracking-[0.2em] text-[#5C4F4A]">Approved</span>
                </div>
              </div>

              {/* Floating Card - Bottom Center/Left */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-8 xl:left-[15%] z-30 flex items-center gap-4 rounded-[20px] bg-white/50 backdrop-blur-md px-6 py-3.5 shadow-sm border border-white/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B3715C]/15">
                  <Leaf className="h-5 w-5 text-[#B3715C]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#2B1D18]">Real Ingredients.</span>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-[#7A6A63]">Visible Results.</span>
                </div>
              </div>

            </div>

            {/* SLIDE INDICATORS (Far Right Edge of the viewport) */}
            <div className="hidden lg:flex absolute right-0 inset-y-0 w-16 flex-col items-center justify-center gap-5 z-40 bg-gradient-to-l from-[#F5E6DE]/50 to-transparent">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => handleManualChange(idx)}
                  className="group relative flex items-center justify-center py-2 w-full"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <span className={`text-[10px] font-bold tracking-widest transition-all duration-300 ${
                    currentSlide === idx 
                      ? "text-[#B3715C]" 
                      : "text-[#2B1D18]/40 hover:text-[#2B1D18]/80"
                  }`}>
                    0{idx + 1}
                  </span>
                  {currentSlide === idx && (
                    <motion.div 
                      layoutId="activeSlideIndicator"
                      className="absolute right-0 h-px w-6 bg-[#B3715C]" 
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Slide Indicators (Dots) */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 lg:hidden z-40">
               {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => handleManualChange(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? "w-6 bg-[#B3715C]" : "w-1.5 bg-[#B3715C]/30 hover:bg-[#B3715C]/50"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
               ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};