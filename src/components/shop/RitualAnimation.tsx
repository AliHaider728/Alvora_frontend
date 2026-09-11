"use client";

import React from "react";
import { useScrollProgress, useReveal, mapRange, clamp01 } from "../../hooks/use-scroll-progress";

const STEPS = [
  {
    n: "1",
    title: "Cleanse",
    sub: "Hydra-Foam Cleanser",
    body: "A recovery-first cleansing step that purifies while preserving the skin barrier from the very first contact. Leaves skin feeling clean and hydrated.",
    img: "/images/animation/prod-1.png",
  },
  {
    n: "2",
    title: "Activate",
    sub: "Reset Serum",
    body: "A targeted activation serum that stimulates the skin cells in regaining strength, density and balance Ã¢â‚¬â€ preparing it for sustained resilience.",
    img: "/images/animation/prod-2.png",
  },
  {
    n: "3",
    title: "Protect",
    sub: "Barrier Fluid",
    body: "A weightless finishing layer that locks in moisture and shields against daily stress, so progress made overnight is never undone.",
    img: "/images/animation/prod-3.png",
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

function stageOpacity(progress: number, center: number, width = 0.17) {
  const distance = Math.abs(progress - center);
  return clamp01(1 - distance / width);
}

export function RitualAnimation() {
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  const centers = [0, 0.38, 0.64];
  const bubbleX = interpolateStops(p, [-18, -18, 18, 18, -18, -18, 0]);
  const bubbleY = interpolateStops(p, [8, 0, -7, 5, -5, 4, 0]);
  const bubbleScale = interpolateStops(p, [0.78, 0.88, 0.9, 0.94, 0.9, 0.96, 1.28]);
  const finalOpacity = mapRange(p, 0.82, 0.93, 0, 1);
  const itemOpacity = 1 - mapRange(p, 0.79, 0.88, 0, 1);

  return (
    <>
      
      <section id="ritual" ref={ref} className="relative h-[540vh] bg-[#FAF6F2]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            {STEPS.map((s, i) => {
              const opacity = stageOpacity(p, centers[i] ?? 0, 0.14);
              const onRight = i % 2 === 0;
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
                style={{ opacity: stageOpacity(p, centers[i] ?? 0, 0.17) * itemOpacity }}
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