"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FlaskConical, Leaf, Rabbit, Droplet } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

const trustItems = [
  { icon: FlaskConical, title: "Clinically", subtitle: "Tested" },
  { icon: Leaf, title: "Clean", subtitle: "Ingredients" },
  { icon: Rabbit, title: "Cruelty", subtitle: "Free" },
  { icon: Droplet, title: "Sensitive", subtitle: "Skin" },
];

export const HeroSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF6F2]">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* HERO GRID */}
        <div className="grid min-h-[620px] grid-cols-1 lg:grid-cols-[43%_57%] lg:min-h-[690px]">
          {/* LEFT CONTENT */}
          <motion.div
            variants={shouldReduceMotion ? undefined : containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative z-20 flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-12 lg:py-16 xl:px-16"
          >
            {/* Eyebrow */}
            <motion.div variants={shouldReduceMotion ? undefined : itemVariants} className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#C87355]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#B5654A]">
                Clean. Conscious. Confident.
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="max-w-[650px] font-display text-[58px] font-medium leading-[0.92] tracking-[-0.04em] text-[#211815] sm:text-[72px] md:text-[82px] lg:text-[72px] xl:text-[88px]"
            >
              Skincare,
              <br />
              <span className="italic text-[#D47F60]">Made Simple.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="mt-7 max-w-[410px] text-[13px] leading-6 text-[#604C43] sm:text-[14px] sm:leading-7"
            >
              Thoughtful formulas. Clinically tested.
              <br />
              Made for real skin and real life.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={shouldReduceMotion ? undefined : itemVariants} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/category/all?sort=bestseller"
                className="inline-flex h-12 items-center justify-center rounded-[3px] bg-[#A86249] px-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#8E4D39]"
              >
                Shop Best Sellers
              </Link>

              <Link
                href="/quiz"
                className="inline-flex h-12 items-center justify-center rounded-[3px] border border-[#C88973] px-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A86249] transition-all duration-300 hover:bg-[#A86249] hover:text-white"
              >
                Take The Quiz
              </Link>
            </motion.div>

            {/* TRUST ITEMS */}
            <motion.div
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="mt-12 max-w-[500px] border-t border-[#241916]/10 pt-6"
            >
              <div className="grid grid-cols-4">
                {trustItems.map(({ icon: Icon, title, subtitle }, index) => (
                  <div
                    key={title}
                    className={`flex flex-col items-center text-center ${index !== 0 ? "border-l border-[#241916]/10" : ""}`}
                  >
                    <Icon className="mb-2 h-[22px] w-[22px] text-[#9E624D]" strokeWidth={1.1} />
                    <span className="text-[8px] font-medium uppercase leading-[1.5] tracking-[0.12em] text-[#342721]">
                      {title}
                      <br />
                      {subtitle}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT VISUAL */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, x: 25 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative min-h-[470px] lg:min-h-[690px] w-full"
          >
            {/* Peach visual background with organic sweeping curve */}
            <div className="absolute inset-y-0 right-0 w-full lg:w-[115%] bg-[#EFCDBE] rounded-l-none lg:rounded-l-[150px] xl:rounded-l-[250px] -z-0" />

            {/* Soft light */}
            <div className="absolute right-[5%] top-[8%] z-[1] h-[55%] w-[70%] rounded-full bg-white/25 blur-3xl" />

            {/* PRODUCT IMAGE */}
            <div className="absolute inset-0 z-10 lg:-left-[15%]">
              <Image
                src="/images/hero/alvora-hero.png"
                alt="ALVORA skincare products"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover object-bottom lg:object-[center_bottom]"
              />
            </div>

            {/* BADGE */}
            <div className="absolute right-[6%] top-[12%] z-20 flex h-[96px] w-[96px] items-center justify-center rounded-full border border-[#B9765E] bg-[#F8E8DF]/80 backdrop-blur-sm sm:h-[110px] sm:w-[110px] lg:h-[116px] lg:w-[116px]">
              <div className="absolute inset-[7px] rounded-full border border-[#B9765E]/60" />
              <div className="relative text-center">
                <span className="block text-[7px] uppercase tracking-[0.16em] text-[#965D49]">Dermatologist</span>
                <Leaf className="mx-auto my-2 h-5 w-5 text-[#A9654E]" strokeWidth={1} />
                <span className="block text-[7px] uppercase tracking-[0.16em] text-[#965D49]">Approved</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SMALL SOCIAL PROOF BAR */}
        <div className="relative z-30 border-t border-[#241916]/10 bg-[#FFF9F5]">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            <div className="px-5 py-5 text-center lg:px-8">
              <p className="font-display text-[18px] text-[#241916]">30,000+</p>
              <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-[#80655A]">Happy Customers</p>
            </div>

            <div className="border-l border-[#241916]/10 px-5 py-5 text-center">
              <p className="font-display text-[18px] text-[#241916]">4.9/5</p>
              <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-[#80655A]">Customer Rating</p>
            </div>

            <div className="border-l border-[#241916]/10 px-5 py-5 text-center">
              <p className="font-display text-[18px] text-[#241916]">Clean</p>
              <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-[#80655A]">Thoughtful Formulas</p>
            </div>

            <div className="border-l border-[#241916]/10 px-5 py-5 text-center">
              <p className="font-display text-[18px] text-[#241916]">Cruelty Free</p>
              <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-[#80655A]">Always</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};