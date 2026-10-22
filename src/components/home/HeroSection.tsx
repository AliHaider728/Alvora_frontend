"use client";

import React, { useRef } from "react";
import { getImageProps } from "next/image";
import { ArrowDown } from "lucide-react";
import { AnimatedButton } from "../common/AnimatedButton";

export const HeroSection: React.FC<{ featuredHref?: string }> = ({ featuredHref }) => {
  const sectionRef = useRef<HTMLElement>(null);

  const common = {
    alt: "Alvora Skincare - Healthy Skin, Naturally You",
    fill: true,
    priority: true,
    sizes: "100vw",
    quality: 90,
  };
  const { props: desktop } = getImageProps({ ...common, src: "/images/alvora-desktop-hero.webp" });
  const { props: mobile } = getImageProps({ ...common, src: "/images/alvora-mobile-hero.webp" });

  // Scroll so the next section starts at the top (the header hides itself while scrolling down)
  const handleScrollDown = () => {
    const el = sectionRef.current;
    if (!el) return;
    const sectionBottom = el.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo({ top: sectionBottom, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      // The header spacer already pushes this section below the navbar.
      // Height = visible screen minus the real header height (--header-h is set by Header.tsx).
      // Desktop: clip-path clips the fixed background image to this section only (fixed parallax effect).
      // bg color fills the small band above the image that can show while the header is hidden; match it to your hero's top color.
      className="relative h-[calc(100svh-var(--header-h,110px))] min-h-[520px] max-h-[950px] w-full overflow-hidden bg-[#F6CFBC] sm:min-h-[560px] sm:[clip-path:inset(0)]"
    >
      {/*
        Background image.
        Mobile: normal absolute image (no fixed effect).
        Desktop (sm+): position fixed under the navbar, 18% taller than the visible hero area (zoom).
        Because the section clips with clip-path, the image stays still while the page scrolls over it.
        Tune the zoom with the 1.18 multiplier (1.10 to 1.25).
      */}
      <div className="absolute inset-x-0 top-0 z-0 h-full sm:fixed sm:top-[var(--header-h,118px)] sm:h-[calc((100svh_-_var(--header-h,118px))_*_1.18)]">
        <picture>
          <source media="(max-width: 639px)" srcSet={mobile.srcSet} />
          <source media="(min-width: 640px)" srcSet={desktop.srcSet} />
          <img
            alt={desktop.alt}
            src={desktop.src}
            srcSet={desktop.srcSet}
            sizes={desktop.sizes}
            fetchPriority="high"
            decoding="sync"
            className="h-full w-full object-cover object-center sm:object-[right_top]"
          />
        </picture>
      </div>

      {/* Mobile contrast overlay: lighter, only behind the text area at the top */}
      <div
        aria-hidden="true"
        className="sm:hidden absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(250,246,242,0.72)_0%,rgba(250,246,242,0.2)_40%,transparent_65%)]"
      />

      {/* Desktop contrast overlay: light, only on the left behind the copy, products stay clear */}
      <div
        aria-hidden="true"
        className="hidden sm:block absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,rgba(250,246,242,0.62)_0%,rgba(250,246,242,0.12)_32%,transparent_52%)]"
      />

      {/* Content: section already starts below the navbar, so only a small top padding on mobile */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-375 flex-col justify-start px-5 pt-10 sm:justify-center sm:px-8 sm:pt-0 lg:px-12">
        <div className="max-w-xl pb-16">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-12 bg-[#8C7B74]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#241916] sm:text-[#3A2E2A]">
              PURE • NATURAL • EFFECTIVE
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-8 font-display text-4xl leading-[1.2] text-[#241916] md:text-5xl lg:text-5xl tracking-tight">
            Healthy Skin. <br className="block sm:inline" />
            <span className="italic text-[#A86249]">Naturally You.</span>
          </h1>

          {/* Supporting paragraph */}
          <p className="mb-10 max-w-sm text-sm leading-relaxed text-[#140D0B] font-medium drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] sm:drop-shadow-none sm:text-[#3A2E2A] sm:font-normal md:text-base">
            Thoughtfully crafted skincare with nature&apos;s{" "}
            <br className="hidden sm:inline" />
            finest ingredients — for a calmer, clearer,{" "}
            <br className="hidden sm:inline" />
            more radiant you.
          </p>

          {/* CTAs */}
          <div className="flex flex-col flex-wrap items-start gap-4 sm:flex-row sm:items-center sm:gap-6 mt-4">
            <AnimatedButton
              href="/category/all"
              size="sm"
              variant="primary"
              className="!py-[12px] !px-[32px] !text-[14px]"
            >
              DISCOVER THE COLLECTION
            </AnimatedButton>
          </div>
        </div>

        {/* Bottom Left: small Scroll button (aligned with the text, away from the products) */}
        <button
          type="button"
          onClick={handleScrollDown}
          aria-label="Scroll to next section"
          className="group absolute bottom-6 left-5 hidden items-center gap-2.5 sm:flex sm:left-8 lg:left-12"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#241916]/35 bg-white/50 text-[#241916] backdrop-blur-sm transition-colors duration-200 group-hover:bg-[#241916] group-hover:text-white">
            <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#241916]/80">
            Scroll
          </span>
        </button>

        {/* Right Edge: Vertical Text */}
        <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 lg:block lg:right-12">
          <div className="flex items-center gap-6 [writing-mode:vertical-rl] rotate-180">
            <div className="h-16 w-px bg-[#8C7B74]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3A2E2A]">
              SKINCARE COLLECTION
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};