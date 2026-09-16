"use client";

import React, { useState, useEffect } from 'react';
import { api } from '../../../../services/api';
import { Product } from '../../../../types';
import Image from 'next/image';
import { ImageIcon, Loader2, ImagePlus, Trash2 } from 'lucide-react';
import { useToast } from '../../../../context/ToastContext';

export const AdminBestSellersPageClient: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      const allProducts = await api.getProducts();
      // Only keep bestsellers
      const bestSellers = allProducts.filter(p => p.isBestseller);
      setProducts(bestSellers);
    } catch (err) {
      console.error(err);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingId(productId);
    try {
      const file = e.target.files[0];
      const result = await api.uploadImage(file);
      
      if (result && result.url) {
        // Find current product to get existing tags
        const product = products.find(p => p.id === productId);
        if (!product) throw new Error("Product not found");

        const otherTags = (product.tags || []).filter(t => !t.startsWith('bestseller_image:'));
        const newTags = [...otherTags, `bestseller_image:${result.url}`];

        // Update product via API
        await api.updateProduct(productId, { tags: newTags });
        
        // Update local state
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, tags: newTags } : p
        ));
        
        showToast('Best seller image updated successfully', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to upload image', 'error');
    } finally {
      setUploadingId(null);
      e.target.value = ''; // Reset input
    }
  };

  const handleRemoveImage = async (productId: string) => {
    if (!confirm('Are you sure you want to remove the display image override? The default product image will be used.')) return;
    
    setUploadingId(productId);
    try {
      const product = products.find(p => p.id === productId);
      if (!product) throw new Error("Product not found");

      const newTags = (product.tags || []).filter(t => !t.startsWith('bestseller_image:'));

      await api.updateProduct(productId, { tags: newTags });
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, tags: newTags } : p
      ));
      showToast('Override image removed', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to remove image', 'error');
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading best sellers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black text-[#1A1A1A]">Best Sellers Display Images</h1>
          <p className="text-xs font-medium text-[#1A1A1A]/50 max-w-2xl mt-1">
            Override the image shown for products specifically in the "Best Sellers" section (like the 3D Ritual Animation). 
            This will not affect the main product image shown on the shop grid or product detail page.
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border p-8 text-center text-sm font-bold text-gray-500">
          No Best Seller products found. Edit a product and check "Is Bestseller" to see it here.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map(product => {
            const overrideImage = product.tags?.find(t => t.startsWith('bestseller_image:'))?.split('bestseller_image:')[1];
            const hasOverride = !!overrideImage;
            const displayUrl = overrideImage || (product.images && product.images[0]) || '';
            const isUploading = uploadingId === product.id;

            return (
              <div key={product.id} className="bg-white border border-[#E7D9D0] rounded-2xl p-5 flex flex-col shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 shrink-0 bg-[#FAF6F2] rounded-lg overflow-hidden border">
                    {product.images?.[0] && <Image src={product.images[0]} alt="" width={40} height={40} className="object-cover w-full h-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{product.category}</p>
                  </div>
                </div>

                <div className="relative w-full aspect-[4/5] bg-[#FAF6F2] rounded-xl overflow-hidden border border-[#E7D9D0] mb-4 group">
                  {displayUrl ? (
                    <Image src={displayUrl} alt={product.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-2 left-2 z-10">
                    {hasOverride ? (
                      <span className="bg-[#9C4122] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                        Override Active
                      </span>
                    ) : (
                      <span className="bg-white/90 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border">
                        Using Default Image
                      </span>
                    )}
                  </div>

                  {/* Loading overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                      <Loader2 className="w-8 h-8 animate-spin text-[#9C4122]" />
                    </div>
                  )}

                  {/* Actions overlay */}
                  <div className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex gap-2 transition-opacity ${hasOverride ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer bg-white text-gray-900 text-xs font-bold py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <ImagePlus className="w-4 h-4" />
                      {hasOverride ? 'Replace' : 'Upload Override'}
                      <input type="file" className="hidden" accept="image/*" disabled={isUploading} onChange={(e) => handleImageUpload(product.id, e)} />
                    </label>
                    {hasOverride && (
                      <button onClick={() => handleRemoveImage(product.id)} disabled={isUploading} className="flex-shrink-0 bg-white text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Remove override">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
