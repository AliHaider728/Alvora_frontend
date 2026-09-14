"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { useScrollProgress, mapRange, clamp01 } from "../../hooks/use-scroll-progress";
import { useStore } from "../../context/StoreContext";

const STEPS = [
  {
    n: "1",
    title: "Cleanse",
    sub: "Gentle Glow Face Wash",
    body: "A soft, soap-free cleanser that removes impurities while preserving your natural moisture barrier. Leaves skin feeling clean and hydrated.",
    img: "/images/animation/prod-1.png",
    slug: "gentle-glow-face-wash",
  },
  {
    n: "2",
    title: "Prep",
    sub: "Nourishing Essence",
    body: "A watery essence that preps skin for maximum absorption of subsequent skincare steps.",
    img: "/images/animation/prod-2.png",
    slug: "nourishing-essence",
  },
  {
    n: "3",
    title: "Treat",
    sub: "Radiance Serum",
    body: "A lightweight, fast-absorbing serum infused with Niacinamide and Hyaluronic Acid to brighten, hydrate and even skin tone for a natural healthy glow.",
    img: "/images/animation/prod-3.png",
    slug: "radiance-serum",
  },
  {
    n: "4",
    title: "Hydrate",
    sub: "Hydra Comfort Gel Cream",
    body: "A lightweight gel-cream that delivers intense hydration and soothes irritated skin throughout the day.",
    img: "/images/animation/prod-1.png",
    slug: "hydra-comfort-gel-cream",
  },
  {
    n: "5",
    title: "Protect",
    sub: "Daily Defense SPF 50",
    body: "Lightweight broad-spectrum SPF 50 sunscreen with no white cast. Wear it every day to lock in your ritual.",
    img: "/images/animation/prod-2.png",
    slug: "daily-defense-spf-50",
  },
];

function interpolateStops(value: number, stops: number[]) {
  if (stops.length < 2) return stops[0] ?? 0;
  const scaled = clamp01(value) * (stops.length - 1);
  const index = Math.min(Math.floor(scaled), stops.length - 2);
  const local = scaled - index;
  const from = stops[index] ?? 0;
  const to = stops[index + 1] ?? from;
  return from + (to - from) * local;
}

function stageOpacity(progress: number, center: number, width = 0.12) {
  const distance = Math.abs(progress - center);
  return clamp01(1 - distance / width);
}

export function RitualAnimation() {
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  const { products, addToCart, setIsCartOpen } = useStore();

  const centers = [0, 0.16, 0.33, 0.5, 0.66];
  const bubbleX = interpolateStops(p, [-18, 18, -18, 18, -18, 0, 0]);
  const bubbleY = interpolateStops(p, [8, -3, -7, 5, -5, 0, 0]);
  const bubbleScale = interpolateStops(p, [0.78, 0.88, 0.9, 0.94, 0.9, 1.28, 1.28]);
  const finalOpacity = mapRange(p, 0.75, 0.85, 0, 1);
  const itemOpacity = 1 - mapRange(p, 0.72, 0.82, 0, 1);

  return (
    <>
      <section id="ritual" ref={ref} className="relative h-[800vh] bg-[#FAF6F2]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            {STEPS.map((s, i) => {
              const opacity = stageOpacity(p, centers[i] ?? 0, 0.12);
              const onRight = i % 2 === 0;
              const matchedProduct = products.find(prod => prod.slug === s.slug);

              return (
                <article
                  key={s.title}
                  className={`absolute top-1/2 w-[44%] max-w-md -translate-y-1/2 px-6 md:px-10 ${
                    onRight ? "right-0 md:right-[7%]" : "left-0 md:left-[7%]"
                  }`}
                  style={{
                    opacity,
                    transform: `translate3d(0, calc(-50% + ${mapRange(opacity, 0, 1, 38, 0)}px), 0)`,
                  }}
                >
                  <div className="flex flex-col gap-2 md:gap-4">
                    <div className="flex items-start gap-3 md:gap-5">
                      <span className="font-display text-[#C87355] text-4xl leading-none italic md:text-6xl">
                        {s.n}
                      </span>
                      <div>
                        <h3 className="text-lg uppercase md:text-4xl text-[#1A1A1A]">{s.title}</h3>
                        <p className="text-[#C87355] text-xs font-bold tracking-widest uppercase mt-2">{s.sub}</p>
                        <p className="text-[#1A1A1A]/70 mt-4 hidden text-sm leading-relaxed md:block">{s.body}</p>
                      </div>
                    </div>
                    
                    {/* Buttons - Hidden via opacity from parent, pointer-events-auto allows clicks */}
                    <div className="pointer-events-auto flex items-center gap-3 mt-6 ml-[4.5rem]">
                      <button 
                        onClick={() => {
                          if (matchedProduct) {
                            addToCart(matchedProduct);
                            setIsCartOpen(true);
                          }
                        }}
                        className="bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 shadow-lg"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <Link 
                        href={`/product/${s.slug}`}
                        className="bg-white hover:bg-gray-50 text-[#1A1A1A] border border-[#1A1A1A]/10 px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div
            className="relative flex aspect-square w-[76vw] max-w-[560px] items-center justify-center will-change-transform md:w-[46vw]"
            style={{
              transform: `translate3d(${bubbleX}vw, ${bubbleY}vh, 0) scale(${bubbleScale})`,
            }}
          >
            <img
              src="/images/animation/bubble.png"
              alt="Bubble"
              aria-hidden
              width={1024}
              height={1024}
              loading="lazy"
              className="absolute inset-0 h-full w-full opacity-80"
            />

            {STEPS.map((s, i) => (
              <img
                key={s.title}
                src={s.img}
                alt={s.sub}
                width={768}
                height={1024}
                loading="lazy"
                className="absolute top-1/2 left-1/2 h-[50%] w-auto -translate-x-1/2 -translate-y-1/2 object-contain"
                style={{ opacity: stageOpacity(p, centers[i] ?? 0, 0.12) * itemOpacity }}
              />
            ))}

            <div className="relative flex w-[64%] flex-col items-center" style={{ opacity: finalOpacity }}>
              <img src="/images/animation/products.png" alt="Skincare set" width={1200} height={1008} loading="lazy" className="w-full" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
