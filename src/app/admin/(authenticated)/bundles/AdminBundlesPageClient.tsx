"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../services/api';
import { Plus, Edit2, Trash2, Search, Loader2, Package, Tag, Layers, ImageIcon } from 'lucide-react';
import { Product } from '../../../../types';
import Image from 'next/image';

export const AdminBundlesPageClient = () => {
  const router = useRouter();
  const [bundles, setBundles] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bundlesRes, productsRes] = await Promise.all([
        api.getBundles({ fetchAll: true }),
        api.getProducts()
      ]);
      setBundles(bundlesRes?.bundles || []);
      const normalizedProducts = Array.isArray(productsRes)
        ? productsRes
        : Array.isArray((productsRes as any)?.products)
          ? (productsRes as any).products
          : [];
      setProducts(normalizedProducts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteBundle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return;
    try {
      await api.deleteBundle(id);
      fetchData();
    } catch (e) {
      alert('Failed to delete bundle');
    }
  };

  const filteredBundles = bundles.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Bundles</h1>
          <p className="text-sm text-gray-500 mt-1">Manage curated product sets and discounts.</p>
        </div>
        <button 
          type="button" 
          onClick={() => router.push('/admin/bundles/new')} 
          className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#D4784F] to-[#A85A3B] rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 uppercase tracking-widest"
        >
          <Plus className="h-4 w-4" /> Add Bundle
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <label className="relative flex items-center w-full">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search bundles by name..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#A85A3B] outline-none transition-all text-sm" 
          />
        </label>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#A85A3B]" />
          <p className="text-sm font-semibold text-gray-500">Loading Bundles...</p>
        </div>
      ) : filteredBundles.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBundles.map(bundle => {
            const isActive = bundle.status === 'published';
            const bundleImage = bundle.image || (bundle.products?.[0]?.images?.[0]);

            return (
              <div key={bundle.id} className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Image Section */}
                <div className="relative aspect-[4/3] bg-gray-50 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                  {bundleImage ? (
                    <Image src={bundleImage} alt={bundle.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-300" />
                  )}
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-lg shadow-sm ${isActive ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                      {isActive ? 'Active' : 'Draft'}
                    </span>
                    {bundle.isBestseller && (
                      <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-lg shadow-sm bg-[#9C4122] text-white">
                        Bestseller
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-display font-semibold text-lg text-gray-900 leading-tight mb-1 truncate">{bundle.name}</h3>
                  <p className="text-xs text-gray-400 mb-4 truncate">/{bundle.slug}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 flex-1">
                      <Layers className="w-4 h-4 text-[#A85A3B]" />
                      <span className="font-medium text-xs">{bundle.products?.length || 0} Products</span>
                    </div>
                    <div className="w-px h-6 bg-gray-200"></div>
                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-xs text-emerald-700">{bundle.discountPercent}% OFF</span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <button 
                      type="button" 
                      onClick={() => router.push('/admin/bundles/edit/' + bundle.id)} 
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-gray-600 hover:text-[#A85A3B] hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <div className="w-px h-6 bg-gray-100 mx-2"></div>
                    <button 
                      type="button" 
                      onClick={() => deleteBundle(bundle.id)} 
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Bundle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center flex flex-col items-center">
          <Package className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No bundles found</h3>
          <p className="text-sm text-gray-500 mb-6">You haven't created any bundles yet, or none match your search.</p>
          <button 
            type="button" 
            onClick={() => router.push('/admin/bundles/new')} 
            className="px-6 py-2.5 text-sm font-bold text-[#A85A3B] bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors uppercase tracking-widest"
          >
            Create Your First Bundle
          </button>
        </div>
      )}
    </div>
  );
};

