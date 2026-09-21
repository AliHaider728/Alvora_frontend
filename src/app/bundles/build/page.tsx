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

  const MIN_PRODUCTS = 2;
  const BUNDLE_DISCOUNT = 0.15; // 15% discount

  const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

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
    if (selectedItems.length < MIN_PRODUCTS) return;

    selectedItems.forEach(item => {
      addToCart(item.product, item.quantity, undefined, undefined, { isRoutine: true });
    });
    
    setSelectedItems([]);
    setIsCartOpen(true);
  };

  const originalPrice = selectedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const finalPrice = originalPrice * (1 - BUNDLE_DISCOUNT);

  // Flatten the selected items into an array of products for the sidebar slots
  const flatSelectedProducts = selectedItems.flatMap(item => Array(item.quantity).fill(item.product));

  return (
    <>
      <div className="bg-[#FAF6F2] flex-1 py-24">
        <div className="alvora-container">
          
          <div className="mb-12 text-center">
            <h1 className="font-display text-4xl lg:text-5xl text-[#241916] font-medium leading-tight mb-4">
              Build Your Routine
            </h1>
            <p className="text-[#241916]/70 max-w-xl mx-auto">
              Select at least {MIN_PRODUCTS} items to build your routine and save 15%.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left: Product Grid */}
            <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map(product => {
                const selectedItem = selectedItems.find(p => p.product.id === product.id);
                const selectedQty = selectedItem ? selectedItem.quantity : 0;
                const isFull = false;
                const isDisabledForAdd = isFull;

                return (
                  <div 
                    key={product.id}
                    className={`relative flex flex-col bg-white border transition-all duration-300 ${selectedQty > 0 ? 'border-[#C48B80] shadow-[0_0_0_1px_#C48B80]' : 'border-transparent shadow-sm hover:shadow-md'}`}
                  >
                    <div className="relative aspect-[4/5] bg-[#F5EDE4] w-full overflow-hidden">
                      {product.images && product.images.length > 0 && (
                        <Image 
                          src={product.images[0]} 
                          alt={product.name} 
                          fill 
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover" 
                        />
                      )}
                      {selectedQty > 0 && (
                        <div className="absolute top-2 right-2 bg-[#C48B80] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm z-10">
                          {selectedQty}
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col h-full bg-white">
                      <div className="flex-grow">
                        <h3 className="font-display text-[15px] font-medium text-[#1A1A1A] mb-1 line-clamp-2 leading-tight">{product.name}</h3>
                        <p className="text-[#1A1A1A]/70 text-[13px] font-medium">{formatPrice(product.price)}</p>
                      </div>
                      
                      <div className="mt-4 h-9">
                        {selectedQty > 0 ? (
                          <div className="flex items-center justify-between border-2 border-[#C48B80] rounded-[8px] h-full px-2">
                            <button 
                              onClick={() => handleRemoveProduct(product)}
                              className="w-6 h-6 flex items-center justify-center text-[#C48B80] hover:bg-[#F5EDE4] rounded-full transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-[#C48B80] text-xs font-bold w-4 text-center">
                              {selectedQty}
                            </span>
                            <button 
                              onClick={() => handleAddProduct(product)}
                              disabled={isDisabledForAdd}
                              className="w-6 h-6 flex items-center justify-center text-[#C48B80] hover:bg-[#F5EDE4] rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAddProduct(product)}
                            disabled={isDisabledForAdd}
                            className="w-full h-full flex items-center justify-center border-2 border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-bold tracking-widest uppercase rounded-[8px] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#1A1A1A]"
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
              <div className="sticky top-32 bg-white border border-gray-100 p-6 lg:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="font-display text-2xl text-[#1A1A1A] mb-6">Your Routine</h3>
                
                <div className="space-y-4 mb-8">
                  {selectedItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-8">
                        <p className="text-sm text-[#1A1A1A]/40 italic">Start building your routine by adding products from the left.</p>
                      </div>
                    ) : (
                      selectedItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0 relative">
                          <button 
                            onClick={() => handleRemoveProduct(item.product)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-gray-100 hover:bg-[#C48B80] text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-colors"
                            aria-label="Remove item"
                          >
                            <span className="text-xs font-bold leading-none mb-0.5">&times;</span>
                          </button>
                          <div className="w-16 h-16 bg-[#FAF6F2] relative flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                            {item.product?.images?.[0] && (
                              <Image 
                                src={item.product.images[0]} 
                                alt={item.product.name} 
                                fill
                                sizes="64px"
                                className="object-cover" 
                              />
                            )}
                          </div>
                          <div className="flex-grow flex flex-col gap-1">
                            <p className="text-sm font-medium text-[#1A1A1A] line-clamp-1 pr-4">{item.product.name}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-[#1A1A1A]/60">{formatPrice(item.product.price)}</p>
                              
                              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-7">
                                <button 
                                  onClick={() => handleRemoveProduct(item.product)}
                                  className="w-7 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => handleAddProduct(item.product)}
                                  className="w-7 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#1A1A1A]/70">Subtotal</span>
                    <span className={`font-medium ${selectedItems.length >= MIN_PRODUCTS ? 'line-through text-[#1A1A1A]/40' : 'text-[#1A1A1A]'}`}>
                      {formatPrice(originalPrice)}
                    </span>
                  </div>
                  
                  {selectedItems.length >= MIN_PRODUCTS && (
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[#C48B80] font-medium">Bundle Price (15% off)</span>
                      <span className="text-xl font-bold text-[#C48B80]">{formatPrice(finalPrice)}</span>
                    </div>
                  )}

                  <button 
                    onClick={handleAddBundleToCart}
                    disabled={selectedItems.length < MIN_PRODUCTS}
                    className={`w-full mt-4 py-4 text-[11px] font-bold tracking-widest uppercase transition-all duration-300 rounded-[8px] ${selectedItems.length >= MIN_PRODUCTS ? 'bg-[#1A1A1A] hover:bg-[#C48B80] text-white shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    {selectedItems.length < MIN_PRODUCTS ? (selectedItems.length === 0 ? 'Select at least 2 items' : `Select ${MIN_PRODUCTS - selectedItems.length} More to unlock 15% off`) : 'Add Routine to Cart'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
