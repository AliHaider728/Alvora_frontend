"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '../../../context/StoreContext';
import { formatPrice } from '../../../utils/formatters';
import { Product } from '../../../types';
import { Minus, Plus } from 'lucide-react';

export default function BuildBundlePage() {
  const { products, addToCart, setIsCartOpen } = useStore();
  
  // State is now an array of { product, quantity }
  const [selectedItems, setSelectedItems] = useState<{product: Product, quantity: number}[]>([]);

  const MAX_PRODUCTS = 3;
  const BUNDLE_DISCOUNT = 0.15; // 15% discount

  const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddProduct = (product: Product) => {
    if (totalQuantity >= MAX_PRODUCTS) return;

    setSelectedItems(prev => {
      const existing = prev.find(p => p.product.id === product.id);
      if (existing) {
        return prev.map(p => p.product.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const handleRemoveProduct = (product: Product) => {
    setSelectedItems(prev => {
      const existing = prev.find(p => p.product.id === product.id);
      if (!existing) return prev;
      
      if (existing.quantity > 1) {
        return prev.map(p => p.product.id === product.id ? { ...p, quantity: p.quantity - 1 } : p);
      } else {
        return prev.filter(p => p.product.id !== product.id);
      }
    });
  };

  const handleAddBundleToCart = () => {
    if (totalQuantity < MAX_PRODUCTS) return;

    // Add each product to cart with its respective quantity
    selectedItems.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    
    // Reset and open cart
    setSelectedItems([]);
    setIsCartOpen(true);
  };

  const originalPrice = selectedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const finalPrice = originalPrice * (1 - BUNDLE_DISCOUNT);

  // Flatten the selected items into an array of products for the sidebar slots
  const flatSelectedProducts = selectedItems.flatMap(item => Array(item.quantity).fill(item.product));

  return (
    <>
      <div className="bg-[#FAF6F2] min-h-screen py-24">
        <div className="alvora-container">
          
          <div className="mb-12 text-center">
            <h1 className="font-display text-4xl lg:text-5xl text-[#241916] font-medium leading-tight mb-4">
              Build Your Routine
            </h1>
            <p className="text-[#241916]/70 max-w-xl mx-auto">
              Select {MAX_PRODUCTS} items to create your perfect personalized regimen and save 15%.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left: Product Grid */}
            <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(product => {
                const selectedItem = selectedItems.find(p => p.product.id === product.id);
                const selectedQty = selectedItem ? selectedItem.quantity : 0;
                const isFull = totalQuantity >= MAX_PRODUCTS;
                const isDisabledForAdd = isFull;

                return (
                  <div 
                    key={product.id}
                    className={`relative flex flex-col bg-white border transition-all duration-300 ${selectedQty > 0 ? 'border-[#A86249] ring-1 ring-[#A86249]' : 'border-[#E7D9D0]'}`}
                  >
                    <div className="relative aspect-square bg-[#F5EDE4] p-4 w-full">
                      {product.images && product.images.length > 0 && (
                        <Image 
                          src={product.images[0]} 
                          alt={product.name} 
                          fill 
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-contain" 
                        />
                      )}
                      {selectedQty > 0 && (
                        <div className="absolute top-3 right-3 bg-[#A86249] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
                          {selectedQty}
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col h-full">
                      <div className="flex-grow">
                        <h3 className="font-display text-sm font-medium text-[#241916] mb-1 line-clamp-2">{product.name}</h3>
                        <p className="text-[#A86249] font-medium text-sm">{formatPrice(product.price)}</p>
                      </div>
                      
                      <div className="mt-4 h-10">
                        {selectedQty > 0 ? (
                          <div className="flex items-center justify-between border border-[#A86249] rounded-full h-full px-2">
                            <button 
                              onClick={() => handleRemoveProduct(product)}
                              className="w-8 h-8 flex items-center justify-center text-[#A86249] hover:bg-[#F5EDE4] rounded-full transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[#A86249] text-xs font-bold w-4 text-center">
                              {selectedQty}
                            </span>
                            <button 
                              onClick={() => handleAddProduct(product)}
                              disabled={isDisabledForAdd}
                              className="w-8 h-8 flex items-center justify-center text-[#A86249] hover:bg-[#F5EDE4] rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAddProduct(product)}
                            disabled={isDisabledForAdd}
                            className="w-full h-full flex items-center justify-center border border-[#E7D9D0] text-[#241916] text-[10px] font-bold tracking-widest uppercase rounded-full hover:border-[#A86249] hover:text-[#A86249] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#E7D9D0] disabled:hover:text-[#241916]"
                          >
                            Add to Routine
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Sticky Summary */}
            <div className="lg:w-1/3">
              <div className="sticky top-32 bg-white border border-[#E7D9D0] p-8 rounded-sm shadow-sm">
                <h3 className="font-display text-2xl text-[#241916] mb-6">Your Routine</h3>
                
                <div className="space-y-4 mb-8">
                  {[...Array(MAX_PRODUCTS)].map((_, i) => {
                    const product = flatSelectedProducts[i];
                    return (
                      <div key={i} className="flex items-center gap-4 border-b border-[#E7D9D0] pb-4">
                        <div className="w-16 h-16 bg-[#F5EDE4] relative flex-shrink-0 border border-[#E7D9D0]">
                          {product?.images?.[0] && (
                            <Image 
                              src={product.images[0]} 
                              alt={product.name} 
                              fill
                              sizes="64px"
                              className="object-contain p-1" 
                            />
                          )}
                        </div>
                        <div className="flex-grow">
                          {product ? (
                            <>
                              <p className="text-sm font-medium text-[#241916] line-clamp-1">{product.name}</p>
                              <p className="text-sm text-[#241916]/60">{formatPrice(product.price)}</p>
                            </>
                          ) : (
                            <p className="text-sm text-[#241916]/40 italic">Select an item...</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#241916]/70">Subtotal</span>
                  <span className={`font-medium ${totalQuantity === MAX_PRODUCTS ? 'line-through text-[#241916]/40' : 'text-[#241916]'}`}>
                    {formatPrice(originalPrice)}
                  </span>
                </div>
                
                {totalQuantity === MAX_PRODUCTS && (
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[#A86249] font-medium">Bundle Price (15% off)</span>
                    <span className="text-xl font-bold text-[#A86249]">{formatPrice(finalPrice)}</span>
                  </div>
                )}

                <button 
                  onClick={handleAddBundleToCart}
                  disabled={totalQuantity < MAX_PRODUCTS}
                  className={`w-full py-4 text-[11px] font-bold tracking-widest uppercase transition-colors rounded-full ${totalQuantity === MAX_PRODUCTS ? 'bg-[#A86249] hover:bg-[#8C4A35] text-white shadow-md' : 'bg-[#E7D9D0] text-[#241916]/40 cursor-not-allowed'}`}
                >
                  {totalQuantity < MAX_PRODUCTS ? `Select ${MAX_PRODUCTS - totalQuantity} More` : 'Add Routine to Cart'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
