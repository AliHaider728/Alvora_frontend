"use client";
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useStore } from '../../../context/StoreContext';
import { formatPrice } from '../../../utils/formatters';
import { Product } from '../../../types';
import { Minus, Plus, ShoppingCart, Heart, Check, X, ChevronDown, Leaf, Beaker, Shield, Gem } from 'lucide-react';

export default function BuildBundlePage() {
  const { products, addToCart, setIsCartOpen } = useStore();
  
  const [selectedItems, setSelectedItems] = useState<{product: Product, quantity: number}[]>([]);

  const MIN_PRODUCTS = 2;
  const BUNDLE_DISCOUNT = 0.15; // 15% discount

  const distinctCount = selectedItems.length;
  const originalPrice = selectedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const finalPrice = distinctCount >= MIN_PRODUCTS ? originalPrice * (1 - BUNDLE_DISCOUNT) : originalPrice;

  const handleAddProduct = (product: Product) => {
    setSelectedItems(prev => {
      const existing = prev.find(p => p.product.id === product.id);
      if (existing) {
        return prev.map(p => p.product.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const handleRemoveProduct = (product: Product, removeAll = false) => {
    setSelectedItems(prev => {
      const existing = prev.find(p => p.product.id === product.id);
      if (!existing) return prev;
      
      if (!removeAll && existing.quantity > 1) {
        return prev.map(p => p.product.id === product.id ? { ...p, quantity: p.quantity - 1 } : p);
      } else {
        return prev.filter(p => p.product.id !== product.id);
      }
    });
  };

  const handleAddBundleToCart = () => {
    if (distinctCount < MIN_PRODUCTS) return;

    selectedItems.forEach(item => {
      addToCart(item.product, item.quantity, undefined, undefined, { isRoutine: true });
    });
    
    setSelectedItems([]);
    setIsCartOpen(true);
  };

  return (
    <div className="bg-gradient-to-b from-[#FAF6F2] to-white min-h-screen pb-16">
      
      {/* Hero Banner */}
      <section className="relative w-full h-[450px] md:h-[500px] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#FAF6F2] to-white">
        {/* Abstract shapes / Image placeholder */}
        <div className="absolute inset-0 opacity-40 mix-blend-multiply">
           <Image src="/images/hero/alvora-hero.png" alt="Build Your Routine Background" fill className="object-cover object-top" priority />
        </div>
        
        <div className="relative z-10 text-center px-4 mt-8 flex flex-col items-center">
          <span className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-[#C48B80] uppercase mb-4 block bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full">Build Your Routine</span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-[64px] text-[#1A1A1A] mb-4">Build Your Routine</h1>
          <p className="text-[#1A1A1A]/80 text-base md:text-lg max-w-xl mx-auto mb-10">Choose 2+ essentials and save 15% on your routine.</p>
          
          
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left: Product Grid */}
          <div className="lg:w-2/3">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#C48B80] uppercase mb-2 block">Our Skincare Essentials</span>
                <h2 className="font-display text-2xl md:text-3xl text-[#1A1A1A]">Clean ingredients. Real results.</h2>
              </div>
              
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {products.map(product => {
                const selectedItem = selectedItems.find(p => p.product.id === product.id);
                const selectedQty = selectedItem ? selectedItem.quantity : 0;

                return (
                  <div 
                    key={product.id}
                    className={`relative flex flex-col bg-white rounded-[24px] p-2.5 pb-4 transition-all duration-300 ${selectedQty > 0 ? 'border-2 border-[#C48B80] shadow-md rounded-[24px] overflow-hidden' : 'border border-[#EDE5DC] shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-[24px] overflow-hidden'}`}
                  >
                    
                    
                    {selectedQty > 0 && (
                      <div className="absolute top-4 right-4 z-20 w-7 h-7 bg-[#C48B80] rounded-full flex items-center justify-center text-white shadow-sm border-2 border-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    <div className="relative aspect-[4/5] bg-[#F9F7F5] w-full overflow-hidden rounded-[24px] mb-4">
                      {product.images && product.images.length > 0 && (
                        <Image 
                          src={product.images[0]} 
                          alt={product.name} 
                          fill 
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover mix-blend-multiply opacity-90 p-2" 
                        />
                      )}
                    </div>
                    
                    <div className="flex-grow px-2 flex flex-col">
                      <h3 className="font-display text-[14px] font-bold text-[#1A1A1A] mb-1 line-clamp-2 leading-tight min-h-[36px]">{product.name}</h3>
                      <p className="text-[#1A1A1A]/70 text-[12px] font-medium mb-1.5">{formatPrice(product.price)}</p>
                      
                      <p className="text-[#1A1A1A]/50 text-[10px] leading-relaxed line-clamp-2 min-h-[30px] mb-4">
                        {product.shortDescription || product.description || 'Nourishing daily essential.'}
                      </p>
                      
                      <div className="mt-auto h-9">
                        {selectedQty > 0 ? (
                          <div className="flex items-center justify-between bg-[#FDFDFD] border border-[#E7D9D0] rounded-full h-full px-1">
                            <button 
                              onClick={() => handleRemoveProduct(product)}
                              className="w-7 h-7 flex items-center justify-center text-[#C48B80] bg-white rounded-full shadow-sm hover:bg-[#C48B80] hover:text-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-[#C48B80] text-xs font-bold w-6 text-center">{selectedQty}</span>
                            <button 
                              onClick={() => handleAddProduct(product)}
                              className="w-7 h-7 flex items-center justify-center text-[#C48B80] bg-white rounded-full shadow-sm hover:bg-[#C48B80] hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAddProduct(product)}
                            className="w-full h-full flex items-center justify-center gap-2 bg-[#FDFDFD] hover:bg-[#F5EDE4] text-[#1A1A1A] text-[10px] font-bold tracking-widest uppercase rounded-full transition-colors border border-[#EDE5DC]"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Add to Routine
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Sticky Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 bg-[#FDFDFD] border border-[#EDE5DC] p-6 rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
              
              {/* Unlocked Banner */}
              <div className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl mb-6 text-[10px] md:text-[11px] font-bold tracking-wide uppercase transition-colors ${distinctCount >= MIN_PRODUCTS ? 'bg-[#FDFDFD] text-[#C48B80] border border-[#F1C9BD]' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                {distinctCount >= MIN_PRODUCTS ? (
                  <>
                    <div className="w-4 h-4 bg-[#C48B80] rounded-full text-white flex items-center justify-center"><Check className="w-2.5 h-2.5" /></div>
                    Routine Unlocked - 15% Saved
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full text-white flex items-center justify-center" />
                    Add {MIN_PRODUCTS - distinctCount} more to unlock 15%
                  </>
                )}
              </div>
              
              <h3 className="font-display text-[28px] text-[#1A1A1A] mb-1">Your Routine</h3>
              <p className="text-xs text-[#1A1A1A]/60 font-medium mb-6">{selectedItems.reduce((s, i) => s + i.quantity, 0)} items selected</p>
              
              {/* List */}
              <div className="space-y-4 mb-6 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                {selectedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-10 opacity-60">
                     <ShoppingCart className="w-8 h-8 text-[#1A1A1A]/30 mb-3" />
                     <p className="text-xs text-[#1A1A1A]/60 font-medium">Your routine is empty.</p>
                     <p className="text-[11px] text-[#1A1A1A]/40 mt-1">Add items from the left to start saving.</p>
                  </div>
                ) : (
                  selectedItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 relative">
                      <div className="w-14 h-14 bg-[#F9F7F5] relative flex-shrink-0 rounded-xl overflow-hidden border border-[#EDE5DC] p-1">
                        {item.product?.images?.[0] && (
                          <Image src={item.product.images[0]} alt={item.product.name} fill sizes="56px" className="object-cover mix-blend-multiply opacity-90 p-1" />
                        )}
                      </div>
                      
                      <div className="flex-grow flex flex-col justify-center max-w-[130px]">
                        <p className="text-[11px] font-bold text-[#1A1A1A] line-clamp-1 leading-tight mb-1">{item.product.name}</p>
                        <p className="text-[11px] text-[#1A1A1A]/60 font-medium">{formatPrice(item.product.price)}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-auto shrink-0">
                        <div className="flex items-center border border-[#EDE5DC] rounded-full h-7 px-0.5 bg-white shadow-sm">
                          <button onClick={() => handleRemoveProduct(item.product)} className="w-6 h-6 flex items-center justify-center text-[#1A1A1A]/60 hover:text-[#C48B80] transition-colors">
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-[10px] font-bold w-4 text-center text-[#1A1A1A]">{item.quantity}</span>
                          <button onClick={() => handleAddProduct(item.product)} className="w-6 h-6 flex items-center justify-center text-[#1A1A1A]/60 hover:text-[#C48B80] transition-colors">
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <button onClick={() => handleRemoveProduct(item.product, true)} className="w-6 h-6 flex flex-shrink-0 items-center justify-center text-[#1A1A1A]/30 hover:text-red-400 hover:bg-red-50 rounded-full transition-all">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Subtotal block */}
              <div className="pt-5 border-t border-[#EDE5DC] space-y-3 mb-6 bg-gradient-to-b from-transparent to-[#FDFDFD]">
                <div className="flex justify-between items-center text-[11px] font-medium text-[#1A1A1A]/60">
                  <span>Subtotal</span>
                  <span>{formatPrice(originalPrice)}</span>
                </div>
                {distinctCount >= MIN_PRODUCTS && (
                  <div className="flex justify-between items-center text-[11px] font-bold text-emerald-600">
                    <span>Routine Savings (15%)</span>
                    <span>- {formatPrice(originalPrice - finalPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-3 border-t border-[#EDE5DC]/60">
                  <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
                  <span className="text-xl font-bold text-[#1A1A1A]">{formatPrice(finalPrice)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleAddBundleToCart} 
                disabled={distinctCount < MIN_PRODUCTS} 
                className="w-full h-12 bg-[#1A1A1A] hover:bg-[#333] text-white rounded-[14px] text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-md disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:border border-gray-200"
              >
                <ShoppingCart className="w-4 h-4" />
                Add Routine To Cart
              </button>
            </div>
          </div>
        </div>

        {/* Value Props Bar */}
        <div className="border-t border-[#EDE5DC] py-10 mt-20 flex flex-wrap justify-between gap-6 px-4 md:px-12 bg-[#FDFDFD]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#C48B80] text-[#C48B80] flex items-center justify-center bg-white shadow-sm">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#1A1A1A]">Clean Ingredients</p>
              <p className="text-[10px] text-[#1A1A1A]/60">Pure, safe and effective.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#C48B80] text-[#C48B80] flex items-center justify-center bg-white shadow-sm">
              <Beaker className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#1A1A1A]">Science Backed</p>
              <p className="text-[10px] text-[#1A1A1A]/60">Real results, not just promises.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#C48B80] text-[#C48B80] flex items-center justify-center bg-white shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#1A1A1A]">Gentle on Skin</p>
              <p className="text-[10px] text-[#1A1A1A]/60">For a healthier, happier you.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#C48B80] text-[#C48B80] flex items-center justify-center bg-white shadow-sm">
              <Gem className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#1A1A1A]">Premium Quality</p>
              <p className="text-[10px] text-[#1A1A1A]/60">Naturally beautiful.</p>
            </div>
          </div>
        </div>

        {/* Footer Banner */}
        <div className="text-center py-16 bg-gradient-to-b from-[#FAF6F2] to-white rounded-[32px] mx-2 mt-12 relative overflow-hidden border border-white/40 shadow-inner">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#C48B80] uppercase mb-3 relative z-10 block bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full w-max mx-auto">ALVORA</p>
          <h2 className="font-display text-2xl md:text-3xl text-[#1A1A1A] mb-3 relative z-10">Your Skin Deserves the Best</h2>
          <p className="text-[13px] text-[#1A1A1A]/70 relative z-10 max-w-sm mx-auto font-medium">Build a routine that works for your unique skin - and save while you do.</p>
        </div>

      </div>
    </div>
  );
}





