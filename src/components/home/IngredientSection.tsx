"use client";
import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const IngredientSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const animVariants = shouldReduceMotion ? {} : itemVariants;
  const contVariants = shouldReduceMotion ? {} : containerVariants;

  const ingredients = [
    {
      name: 'Niacinamide',
      description: 'Visibly brightens skin tone and improves texture.',
      color: 'bg-[#FDF0EC]', // very soft peach
      iconColor: 'text-[#E1A492]',
      icon: <Image src="/images/icons/icon-niacinamide.svg" alt="Niacinamide" width={24} height={24} className="opacity-70" />
    },
    {
      name: 'Hyaluronic Acid',
      description: 'Deeply hydrates and plumps the skin.',
      color: 'bg-[#F0F5FA]', // soft blue
      iconColor: 'text-[#8DB4D2]',
      icon: <Image src="/images/icons/icon-hyaluronic-acid.svg" alt="Hyaluronic Acid" width={24} height={24} className="opacity-70" />
    },
    {
      name: 'Centella Asiatica',
      description: 'Calms irritation and supports skin repair.',
      color: 'bg-[#F2F8ED]', // soft green
      iconColor: 'text-[#9CBF86]',
      icon: <Image src="/images/icons/icon-centella.svg" alt="Centella Asiatica" width={24} height={24} className="opacity-70" />
    },
    {
      name: 'Ceramides',
      description: 'Strengthen the skin barrier and lock in moisture.',
      color: 'bg-[#FAF5EE]', // soft beige
      iconColor: 'text-[#C9A98F]',
      icon: <Image src="/images/icons/icon-ceramides.svg" alt="Ceramides" width={24} height={24} className="opacity-70" />
    }
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="alvora-container">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left: Text Content */}
          <div className="w-full lg:w-1/3">
            <h2 className="font-display text-4xl lg:text-5xl text-[#1A1A1A] font-medium leading-tight mb-6">
              Nature + Science<br />For Your Skin
            </h2>
            <p className="text-[#1A1A1A]/70 leading-relaxed text-base mb-10">
              We use powerful, clean ingredients backed by science to deliver visible results and lasting skin health.
            </p>
            <Link 
              href="/about" 
              className="group inline-flex items-center text-[10px] font-bold tracking-widest text-[#1A1A1A] uppercase relative"
            >
              <span>DISCOVER INGREDIENTS</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
              <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#1A1A1A] scale-x-100 group-hover:scale-x-0 origin-left transition-transform duration-300"></span>
            </Link>
          </div>

          {/* Right: Ingredients Grid */}
          <div className="w-full lg:w-2/3">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              variants={contVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {ingredients.map((ing, i) => (
                <motion.div 
                  key={i} 
                  variants={animVariants}
                  className="bg-white border border-[#EDE5DC] p-6 rounded-2xl flex items-start gap-5 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`w-14 h-14 shrink-0 rounded-full ${ing.color} ${ing.iconColor} flex items-center justify-center`}>
                    {ing.icon}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-display text-lg text-[#1A1A1A] mb-1">
                      {ing.name}
                    </h3>
                    <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">
                      {ing.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
