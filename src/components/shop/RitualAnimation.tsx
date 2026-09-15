"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { useScroll, useSpring, motion, useTransform, useMotionTemplate } from "framer-motion";
import { useStore } from "../../context/StoreContext";

export function RitualAnimation() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const { products, addToCart, setIsCartOpen } = useStore();

  const STEPS = useMemo(() => {
    // Get visible products, prioritizing bestsellers
    let topProducts = products.filter(p => p.isBestseller && p.isVisible !== false);
    if (topProducts.length < 5) {
      const others = products.filter(p => !p.isBestseller && p.isVisible !== false);
      topProducts = [...topProducts, ...others];
    }
    // Take exactly up to 5 products
    return topProducts.slice(0, 5).map((prod, index) => ({
      n: (index + 1).toString(),
      title: prod.category || "Care",
      sub: prod.name,
      body: prod.description || prod.shortDescription || "Elevate your skincare routine.",
      img: prod.images?.[0] || "/images/animation/prod-1.png",
      slug: prod.slug,
      product: prod,
    }));
  }, [products]);

  // Framer Motion transforms to replace state-based interpolation
  const bubbleX = useTransform(smoothProgress, [0, 1/6, 2/6, 3/6, 4/6, 5/6, 1], [-18, 18, -18, 18, -18, 0, 0]);
  const bubbleY = useTransform(smoothProgress, [0, 1/6, 2/6, 3/6, 4/6, 5/6, 1], [8, -3, -7, 5, -5, 0, 0]);
  
  const transInputs = [
    0.0, 0.04, 0.08, 0.12, 
    0.16, 0.20, 0.24, 0.28, 
    0.33, 0.37, 0.41, 0.45, 
    0.50, 0.54, 0.58, 0.62, 
    0.66, 1.0
  ];
  const mainOp = [
    0.8, 0.8, 0.0, 0.8,
    0.8, 0.8, 0.0, 0.8,
    0.8, 0.8, 0.0, 0.8,
    0.8, 0.8, 0.0, 0.8,
    0.8, 0.8
  ];
  const mainSc = [
    0.78, 0.82, 1.2, 0.4,
    0.88, 0.92, 1.2, 0.4,
    0.9,  0.94, 1.2, 0.4,
    0.94, 0.98, 1.2, 0.4,
    0.9,  0.9
  ];
  const smallOp = [
    0, 0, 0.6, 0,
    0, 0, 0.6, 0,
    0, 0, 0.6, 0,
    0, 0, 0.6, 0,
    0, 0
  ];

  // Small Bubble 1 (Top Left)
  const sb1X = [0, 0, -12, 0, 0, 0, -15, 0, 0, 0, -10, 0, 0, 0, -14, 0, 0, 0];
  const sb1Y = [0, 0, -15, 0, 0, 0, -10, 0, 0, 0, -18, 0, 0, 0, -12, 0, 0, 0];
  // Small Bubble 2 (Top Right)
  const sb2X = [0, 0, 15, 0, 0, 0, 12, 0, 0, 0, 18, 0, 0, 0, 10, 0, 0, 0];
  const sb2Y = [0, 0, -10, 0, 0, 0, -16, 0, 0, 0, -8, 0, 0, 0, -15, 0, 0, 0];
  // Small Bubble 3 (Bottom Left)
  const sb3X = [0, 0, -10, 0, 0, 0, -8, 0, 0, 0, -12, 0, 0, 0, -16, 0, 0, 0];
  const sb3Y = [0, 0, 12, 0, 0, 0, 15, 0, 0, 0, 10, 0, 0, 0, 14, 0, 0, 0];
  // Small Bubble 4 (Bottom Right)
  const sb4X = [0, 0, 14, 0, 0, 0, 16, 0, 0, 0, 10, 0, 0, 0, 12, 0, 0, 0];
  const sb4Y = [0, 0, 15, 0, 0, 0, 12, 0, 0, 0, 18, 0, 0, 0, 10, 0, 0, 0];

  const bubbleScale = useTransform(smoothProgress, transInputs, mainSc);
  const bubbleOpacity = useTransform(smoothProgress, transInputs, mainOp);
  const smallBubbleOpacity = useTransform(smoothProgress, transInputs, smallOp);
  
  const b1X = useTransform(smoothProgress, transInputs, sb1X);
  const b1Y = useTransform(smoothProgress, transInputs, sb1Y);
  const b2X = useTransform(smoothProgress, transInputs, sb2X);
  const b2Y = useTransform(smoothProgress, transInputs, sb2Y);
  const b3X = useTransform(smoothProgress, transInputs, sb3X);
  const b3Y = useTransform(smoothProgress, transInputs, sb3Y);
  const b4X = useTransform(smoothProgress, transInputs, sb4X);
  const b4Y = useTransform(smoothProgress, transInputs, sb4Y);

  const t1 = useMotionTemplate`translate3d(${b1X}vw, ${b1Y}vh, 0) scale(0.35)`;
  const t2 = useMotionTemplate`translate3d(${b2X}vw, ${b2Y}vh, 0) scale(0.25)`;
  const t3 = useMotionTemplate`translate3d(${b3X}vw, ${b3Y}vh, 0) scale(0.4)`;
  const t4 = useMotionTemplate`translate3d(${b4X}vw, ${b4Y}vh, 0) scale(0.3)`;

  const finalOpacity = useTransform(smoothProgress, [0.75, 0.85], [0, 1]);
  const itemOpacity = useTransform(smoothProgress, [0.72, 0.82], [1, 0]);
  
  const bubbleTransform = useMotionTemplate`translate3d(${bubbleX}vw, ${bubbleY}vh, 0) scale(${bubbleScale})`;

  // Step Opacities
  const op0 = useTransform(smoothProgress, [0 - 0.12, 0, 0 + 0.12], [0, 1, 0]);
  const op1 = useTransform(smoothProgress, [0.16 - 0.12, 0.16, 0.16 + 0.12], [0, 1, 0]);
  const op2 = useTransform(smoothProgress, [0.33 - 0.12, 0.33, 0.33 + 0.12], [0, 1, 0]);
  const op3 = useTransform(smoothProgress, [0.5 - 0.12, 0.5, 0.5 + 0.12], [0, 1, 0]);
  const op4 = useTransform(smoothProgress, [0.66 - 0.12, 0.66, 0.66 + 0.12], [0, 1, 0]);
  const ops = [op0, op1, op2, op3, op4];

  // Step Y-Transforms (calc(-50% + 38px) down to calc(-50% + 0px))
  const y0 = useTransform(op0, [0, 1], ["calc(-50% + 38px)", "calc(-50% + 0px)"]);
  const y1 = useTransform(op1, [0, 1], ["calc(-50% + 38px)", "calc(-50% + 0px)"]);
  const y2 = useTransform(op2, [0, 1], ["calc(-50% + 38px)", "calc(-50% + 0px)"]);
  const y3 = useTransform(op3, [0, 1], ["calc(-50% + 38px)", "calc(-50% + 0px)"]);
  const y4 = useTransform(op4, [0, 1], ["calc(-50% + 38px)", "calc(-50% + 0px)"]);
  
  const trans0 = useMotionTemplate`translate3d(0, ${y0}, 0)`;
  const trans1 = useMotionTemplate`translate3d(0, ${y1}, 0)`;
  const trans2 = useMotionTemplate`translate3d(0, ${y2}, 0)`;
  const trans3 = useMotionTemplate`translate3d(0, ${y3}, 0)`;
  const trans4 = useMotionTemplate`translate3d(0, ${y4}, 0)`;
  const transforms = [trans0, trans1, trans2, trans3, trans4];

  // Image Opacities (Combined step opacity * overall items opacity)
  const imgOp0 = useTransform(() => op0.get() * itemOpacity.get());
  const imgOp1 = useTransform(() => op1.get() * itemOpacity.get());
  const imgOp2 = useTransform(() => op2.get() * itemOpacity.get());
  const imgOp3 = useTransform(() => op3.get() * itemOpacity.get());
  const imgOp4 = useTransform(() => op4.get() * itemOpacity.get());
  const imgOps = [imgOp0, imgOp1, imgOp2, imgOp3, imgOp4];

  // Pointer Events (Auto if opacity > 0.4)
  const pe0 = useTransform(() => imgOp0.get() > 0.4 ? "auto" : "none");
  const pe1 = useTransform(() => imgOp1.get() > 0.4 ? "auto" : "none");
  const pe2 = useTransform(() => imgOp2.get() > 0.4 ? "auto" : "none");
  const pe3 = useTransform(() => imgOp3.get() > 0.4 ? "auto" : "none");
  const pe4 = useTransform(() => imgOp4.get() > 0.4 ? "auto" : "none");
  const pes = [pe0, pe1, pe2, pe3, pe4];

  // If no steps generated yet (loading state), attach ref to avoid hydration errors
  if (STEPS.length === 0) {
    return (
      <>
        <section className="md:hidden bg-[#FAF6F2] py-20 px-6 min-h-[500px]" />
        <section id="ritual" ref={ref as any} className="hidden md:block relative h-[100vh] bg-[#FAF6F2]" />
      </>
    );
  }

  return (
    <>
      {/* MOBILE FALLBACK: Simple Stacked View */}
      <section className="md:hidden bg-[#FAF6F2] py-20 px-6">
        <div className="max-w-md mx-auto flex flex-col gap-16">
          <div className="text-center mb-4">
            <span className="text-xs tracking-[0.3em] uppercase text-[#C87355] font-bold block mb-4">
              Your Daily Ritual
            </span>
            <h2 className="font-display text-4xl text-[#1A1A1A]">Curated Routine</h2>
          </div>
          
          {STEPS.map((s, i) => (
            <div key={s.slug} className="flex flex-col items-center text-center gap-6 relative">
              <div className="relative w-full aspect-square max-w-[280px] bg-white rounded-3xl p-8 shadow-sm border border-[#E7D9D0]">
                <img
                  src={s.img}
                  alt={s.sub}
                  width={400}
                  height={400}
                  className="w-full h-full object-contain"
                />
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-[#C87355] text-white flex items-center justify-center font-display text-2xl italic">
                  {s.n}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm uppercase text-[#1A1A1A] font-bold tracking-widest">{s.title}</h3>
                <p className="text-xl font-display text-[#C87355] mt-1 mb-3">{s.sub}</p>
                <p className="text-[#1A1A1A]/70 text-sm leading-relaxed mb-6">{s.body}</p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(s.product);
                      setIsCartOpen(true);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-br from-[#D4784F] to-[#9C4122] text-white px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:from-[#9C4122] hover:to-[#7A321A] transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                  <Link 
                    href={`/product/${s.slug}`}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-[#C87355] text-[#C87355] px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#C87355] hover:text-white transition-colors"
                  >
                    <Eye className="w-4 h-4" /> View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DESKTOP/TABLET VIEW: Fancy 800vh Scroll Effect */}
      <section id="ritual" ref={ref} className="hidden md:block relative h-[800vh] bg-[#FAF6F2]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            {STEPS.map((s, i) => {
              const onRight = i % 2 === 0;

              return (
                <motion.article
                  key={s.slug}
                  className={`absolute top-1/2 w-[44%] max-w-md -translate-y-1/2 px-10 ${
                    onRight ? "right-[15%]" : "left-[15%]"
                  }`}
                  style={{
                    opacity: ops[i],
                    transform: transforms[i],
                  }}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-5">
                      <span className="font-display text-[#C87355] text-6xl leading-none italic">
                        {s.n}
                      </span>
                      <div>
                        <h3 className="uppercase text-4xl text-[#1A1A1A]">{s.title}</h3>
                        <p className="text-[#C87355] text-xs font-bold tracking-widest uppercase mt-2">{s.sub}</p>
                        <p className="text-[#1A1A1A]/70 mt-4 text-sm leading-relaxed line-clamp-3">{s.body}</p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <motion.div
            className="relative flex aspect-square items-center justify-center will-change-transform w-[46vw] max-w-[560px]"
            style={{ transform: bubbleTransform }}
          >
            {/* Small Bubbles for Splitting Effect */}
            {[t1, t2, t3, t4].map((t, index) => (
              <motion.img 
                key={`small-bubble-${index}`}
                src="/images/animation/bubble.png" 
                alt="Bubble Splinter" 
                className="absolute inset-0 h-full w-full pointer-events-none object-contain"
                style={{ 
                  transform: t, 
                  opacity: smallBubbleOpacity,
                  filter: 'grayscale(1)'
                }} 
              />
            ))}

            {/* Main Bubble */}
            <motion.img
              src="/images/animation/bubble.png"
              alt="Bubble"
              aria-hidden
              width={1024}
              height={1024}
              loading="lazy"
              className="absolute inset-0 h-full w-full pointer-events-none object-contain"
              style={{ opacity: bubbleOpacity, filter: 'grayscale(1)' }}
            />

            {STEPS.map((s, i) => {
              const onRight = i % 2 === 0;
              const sideClass = onRight ? 'right-[24%]' : 'left-[24%]';

              return (
                <motion.div
                  key={s.slug}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ opacity: imgOps[i], pointerEvents: pes[i] }}
                >
                  <img
                    src={s.img}
                    alt={s.sub}
                    width={768}
                    height={1024}
                    loading="lazy"
                    className="h-[45%] w-auto object-contain pointer-events-none rounded-xl"
                  />
                  
                  {/* Small Action Bubbles */}
                  <div className={`absolute top-[38%] flex flex-col gap-4 ${sideClass} pointer-events-auto`}>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(s.product);
                        setIsCartOpen(true);
                      }}
                      className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-center hover:bg-white hover:scale-110 transition-all text-[#C87355] z-50 cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-5 h-5" strokeWidth={2} />
                    </button>
                    <Link 
                      href={`/product/${s.slug}`}
                      className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-center hover:bg-white hover:scale-110 transition-all text-[#1A1A1A] z-50 cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" strokeWidth={2} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}

            <motion.div className="relative flex w-[64%] flex-col items-center pointer-events-none" style={{ opacity: finalOpacity }}>
              <img src="/images/animation/products.png" alt="Skincare set" width={1200} height={1008} loading="lazy" className="w-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
