"use client";
import React from 'react';
import { Sparkles, Sun, Droplets, Feather, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';

interface Props {
  product?: Product;
}

export const FeaturedProduct: React.FC<Props> = ({ product }) => {
  const { addToCart, settings } = useStore();
  const [qty, setQty] = React.useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  return (
    <section className="bg-[#FAF6F2]">
      <div className="flex flex-col lg:flex-row w-full min-h-[70vh]">
        
        {/* Left: Image Box */}
        <div className="w-full lg:w-1/2 bg-[#F1C9BD] relative flex items-center justify-center overflow-hidden min-h-[400px]">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover absolute inset-0 z-10"
            />
          ) : (
            <div className="w-72 h-[450px] bg-white/40 backdrop-blur-md border border-white/50 shadow-2xl flex flex-col items-center justify-center p-8 z-10">
              <span className="font-display text-4xl text-[#4D3D2D] mb-2 tracking-widest text-center">ALVORA</span>
              <span className="text-xs tracking-widest text-[#4D3D2D]/60 uppercase text-center mb-6">{product.name}</span>
            </div>
          )}

          {/* Stamp */}
          <div className="absolute top-12 right-12 w-28 h-28 rounded-full border border-white/40 flex items-center justify-center spin-slow text-white z-20 hidden md:flex">
             <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow" style={{ animationDuration: '20s' }}>
              <path id="curve-featured" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
              <text fontSize="10" letterSpacing="1.5" className="uppercase font-semibold fill-current">
                <textPath href="#curve-featured" startOffset="0">
                  ✦ CLINICALLY TESTED ✦ PROVEN RESULTS
                </textPath>
              </text>
            </svg>
          </div>
        </div>

        {/* Right: Content Box */}
        <div className="w-full lg:w-1/2 flex items-center p-8 py-16 lg:px-20 bg-white">
          <div className="max-w-lg w-full">
            <h2 className="font-display text-4xl lg:text-5xl text-[#1A1A1A] mb-4">
              {product.name}
            </h2>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-[#C48B80] text-[13px] gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>{star <= (product.rating || 5) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-sm text-[#1A1A1A]/70 font-medium">4.9 (1,234 Reviews)</span>
            </div>
            
            {/* Price */}
            <div className="text-2xl font-bold text-[#C48B80] mb-6">
              {formatPrice(product.price, settings?.currency || 'Rs.')}
            </div>

            <p className="text-[#1A1A1A]/70 leading-relaxed text-base mb-10">
              A lightweight, fast-absorbing serum that brightens, evens skin tone, and boosts radiance.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-10 text-sm text-[#1A1A1A]/80">
              <div className="flex items-center gap-3">
                <Sun className="w-4 h-4 text-[#1A1A1A]" />
                <span>Brightens & Evens Tone</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#1A1A1A]" />
                <span>Antioxidant Protection</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                <span>Fades Dark Spots</span>
              </div>
              <div className="flex items-center gap-3">
                <Feather className="w-4 h-4 text-[#1A1A1A]" />
                <span>Lightweight Formula</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
                <span>Boosts Radiance</span>
              </div>
              <div className="flex items-center gap-3">
                <Droplets className="w-4 h-4 text-[#1A1A1A]" />
                <span>All Skin Types</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-4">
                <div className="flex items-center border border-[#EDE5DC] rounded-full px-4 py-3 bg-white">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-[#1A1A1A]/50 hover:text-[#1A1A1A] px-2">-</button>
                  <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="text-[#1A1A1A]/50 hover:text-[#1A1A1A] px-2">+</button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#1A1A1A] hover:bg-[#333] text-white text-[10px] font-bold tracking-widest uppercase rounded-full transition-colors"
                >
                  ADD TO CART
                </button>
              </div>
              <button 
                className="w-full border border-[#1A1A1A] hover:bg-slate-50 text-[#1A1A1A] text-[10px] font-bold tracking-widest uppercase py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                BUY WITH <span className="text-[#5A31F4] normal-case tracking-normal font-sans text-base leading-none font-bold">shop</span><span className="font-sans normal-case tracking-normal text-sm font-bold bg-[#5A31F4] text-white px-1.5 rounded">Pay</span>
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};
