"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../../services/api';
import { Product } from '../../../../../types';
import { 
  ArrowLeft, Search, Plus, Minus, Trash2, Image as ImageIcon, 
  Box, Tag, Eye, Info, Check, AlertCircle, Save 
} from 'lucide-react';
import Image from 'next/image';

interface SelectedProduct {
  product: Product;
  qty: number;
  variant?: string;
}

export default function AdminCreateBundleClient() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [detailDesc, setDetailDesc] = useState('');
  const [status, setStatus] = useState('Active');
  const [category, setCategory] = useState('Bundles');
  const [tags, setTags] = useState('');
  
  // Selection
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  
  // Pricing
  const [discountType, setDiscountType] = useState('percentage'); // percentage, fixed, custom
  const [discountValue, setDiscountValue] = useState(10);
  const [customPrice, setCustomPrice] = useState(0);

  // Inventory
  const [autoCalcStock, setAutoCalcStock] = useState(true);
  const [manualStock, setManualStock] = useState(0);

  // Images & Marketing
  const [useCollage, setUseCollage] = useState(true);
  const [badgeText, setBadgeText] = useState('Best Value');
  const [routineSteps, setRoutineSteps] = useState('');

  // Visibility
  const [showShop, setShowShop] = useState(true);
  const [featureHome, setFeatureHome] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.getProducts();
      setProducts(Array.isArray(res) ? res : res.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Derived Values
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedProducts.find(sp => sp.product.id === p.id)
    );
  }, [products, searchTerm, selectedProducts]);

  const originalTotal = useMemo(() => {
    return selectedProducts.reduce((sum, sp) => sum + ((sp.product.price || 0) * sp.qty), 0);
  }, [selectedProducts]);

  const currentSaleTotal = useMemo(() => {
    return selectedProducts.reduce((sum, sp) => {
      const price = sp.product.discountPrice || sp.product.price || 0;
      return sum + (price * sp.qty);
    }, 0);
  }, [selectedProducts]);

  const finalPrice = useMemo(() => {
    if (discountType === 'percentage') {
      return currentSaleTotal * (1 - (discountValue / 100));
    }
    if (discountType === 'fixed') {
      return Math.max(0, currentSaleTotal - discountValue);
    }
    return Math.max(0, customPrice);
  }, [currentSaleTotal, discountType, discountValue, customPrice]);

  const totalSavings = originalTotal - finalPrice;
  const savingsPercent = originalTotal > 0 ? ((totalSavings / originalTotal) * 100).toFixed(0) : 0;

  const calculatedStock = useMemo(() => {
    if (selectedProducts.length === 0) return 0;
    const stocks = selectedProducts.map(sp => Math.floor((sp.product.stock || 0) / sp.qty));
    return Math.min(...stocks);
  }, [selectedProducts]);

  const bundleStock = autoCalcStock ? calculatedStock : manualStock;

  // Handlers
  const addProduct = (p: Product) => {
    setSelectedProducts([...selectedProducts, { product: p, qty: 1 }]);
    setSearchTerm('');
  };

  const updateQty = (id: string, delta: number) => {
    setSelectedProducts(prev => prev.map(sp => {
      if (sp.product.id === id) {
        const newQty = Math.max(1, sp.qty + delta);
        return { ...sp, qty: newQty };
      }
      return sp;
    }));
  };

  const removeProduct = (id: string) => {
    setSelectedProducts(prev => prev.filter(sp => sp.product.id !== id));
  };

  const formatPrice = (p: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(p);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Top Navbar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Create Product Bundle</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[#A85A3B] bg-[#A85A3B]/10 hover:bg-[#A85A3B]/20 rounded-lg transition-colors">
            Save Draft
          </button>
          <button className="px-5 py-2 text-sm font-medium text-white bg-[#1A1A1A] hover:bg-black rounded-lg shadow-md transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Create Bundle
          </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col xl:flex-row gap-8">
        
        {/* LEFT COLUMN - Forms */}
        <div className="flex-1 space-y-6">
          
          {/* SECTION 1 - Basic Info */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#A85A3B]" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Bundle Name *</label>
                <input 
                  type="text" 
                  value={name} onChange={e => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')); }}
                  placeholder="e.g. Glowing Skin Routine"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#A85A3B]/20 focus:border-[#A85A3B] transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Bundle Slug</label>
                <input 
                  type="text" value={slug} onChange={e => setSlug(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#A85A3B]/20 focus:border-[#A85A3B] transition-all outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Short Description</label>
                <input 
                  type="text" value={shortDesc} onChange={e => setShortDesc(e.target.value)}
                  placeholder="A quick summary of the bundle benefits..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#A85A3B]/20 focus:border-[#A85A3B] transition-all outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Detailed Description</label>
                <textarea 
                  rows={4} value={detailDesc} onChange={e => setDetailDesc(e.target.value)}
                  placeholder="Full description of what is included and how it helps..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#A85A3B]/20 focus:border-[#A85A3B] transition-all outline-none resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                  <option>Bundles</option>
                  <option>Kits</option>
                  <option>Gifts</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Bundle Tags (comma separated)</label>
                <input 
                  type="text" value={tags} onChange={e => setTags(e.target.value)}
                  placeholder="e.g. anti-aging, summer, essential"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#A85A3B]/20 focus:border-[#A85A3B] transition-all outline-none"
                />
              </div>
            </div>
          </section>

          {/* SECTION 2 - Products */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Box className="w-5 h-5 text-[#A85A3B]" />
              Included Products
            </h2>
            
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search products by name or SKU to add..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#A85A3B]/20 focus:border-[#A85A3B] outline-none"
              />
              {searchTerm && filteredProducts.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
                  {filteredProducts.map(p => (
                    <div key={p.id} onClick={() => addProduct(p)} className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg relative overflow-hidden shrink-0">
                        {p.images?.[0] && <Image src={p.images[0]} alt="" fill className="object-cover" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{formatPrice(p.price)}</p>
                      </div>
                      <Plus className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Products Table */}
            {selectedProducts.length > 0 ? (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Original Price</th>
                      <th className="p-4">Qty</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedProducts.map((sp) => {
                      const outOfStock = (sp.product.stock || 0) < sp.qty;
                      return (
                        <tr key={sp.product.id} className={outOfStock ? "bg-red-50/50" : ""}>
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg relative overflow-hidden shrink-0">
                              {sp.product.images?.[0] && <Image src={sp.product.images[0]} alt="" fill className="object-cover" />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{sp.product.name}</p>
                              {sp.product.discountPrice && (
                                <p className="text-xs text-green-600">Sale: {formatPrice(sp.product.discountPrice)}</p>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${outOfStock ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                              {sp.product.stock || 0}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">{formatPrice(sp.product.price)}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 border border-gray-200 rounded-lg w-fit p-1 bg-white">
                              <button onClick={() => updateQty(sp.product.id, -1)} className="p-1 hover:bg-gray-100 rounded">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-medium">{sp.qty}</span>
                              <button onClick={() => updateQty(sp.product.id, 1)} className="p-1 hover:bg-gray-100 rounded">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => removeProduct(sp.product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500 text-sm">No products added yet. Search above to add products to this bundle.</p>
              </div>
            )}
            
            {selectedProducts.length < 2 && selectedProducts.length > 0 && (
              <p className="text-amber-600 text-xs mt-3 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Minimum 2 products required for a bundle.
              </p>
            )}
          </section>

            {finalPrice > currentSaleTotal && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800">Warning: Bundle Price is Higher Than Individual Items</p>
                <p className="text-xs text-red-700 mt-1">Customers will pay more for this bundle than buying the items individually on sale.</p>
              </div>
            </div>
          )}

        {/* SECTION 3 - Pricing & Inventory Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#A85A3B]" />
                Pricing Logic
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Discount Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['percentage', 'fixed', 'custom'].map(t => (
                      <button 
                        key={t} onClick={() => setDiscountType(t)}
                        className={`py-2 text-xs font-medium rounded-lg border capitalize transition-colors ${discountType === t ? 'bg-[#A85A3B] text-white border-[#A85A3B]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                
                {discountType === 'percentage' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Discount Percentage (%)</label>
                    <input type="number" min="0" max="100" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                  </div>
                )}
                {discountType === 'fixed' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Discount Amount (PKR)</label>
                    <input type="number" min="0" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                  </div>
                )}
                {discountType === 'custom' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Final Custom Price (PKR)</label>
                    <input type="number" min="0" value={customPrice} onChange={e => setCustomPrice(Number(e.target.value))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#A85A3B]" />
                Inventory
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <input type="checkbox" checked={autoCalcStock} onChange={e => setAutoCalcStock(e.target.checked)} className="w-4 h-4 text-[#A85A3B]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Auto-Calculate Stock</p>
                    <p className="text-xs text-gray-500">Calculated based on lowest component quantity.</p>
                  </div>
                </div>
                {!autoCalcStock && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Manual Bundle Limit</label>
                    <input type="number" min="0" value={manualStock} onChange={e => setManualStock(Number(e.target.value))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                  </div>
                )}
                <div className="p-4 bg-[#A85A3B]/5 rounded-xl border border-[#A85A3B]/10">
                  <p className="text-sm text-[#A85A3B] font-medium flex items-center justify-between">
                    Available Bundle Stock: <span className="text-lg">{bundleStock}</span>
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* SECTION 4 & 5 - Marketing & Visibility */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#A85A3B]" />
              Marketing & Visibility
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Badge Text</label>
                  <input type="text" value={badgeText} onChange={e => setBadgeText(e.target.value)} placeholder="e.g. Save 20%" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Routine Steps (Optional)</label>
                  <textarea rows={3} value={routineSteps} onChange={e => setRoutineSteps(e.target.value)} placeholder="Step 1: Face Wash&#10;Step 2: Serum" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Benefits / Highlights</label>
                  <textarea rows={2} placeholder="What makes this bundle great..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">How to Use</label>
                  <textarea rows={2} placeholder="Usage instructions..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Who is this for?</label>
                  <input type="text" placeholder="e.g. Dry skin, Sensitive skin" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={showShop} onChange={e => setShowShop(e.target.checked)} className="w-4 h-4 rounded text-[#A85A3B] focus:ring-[#A85A3B]" />
                  <span className="text-sm text-gray-700">Show on Shop Page</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#A85A3B] focus:ring-[#A85A3B]" />
                  <span className="text-sm text-gray-700">Show on Bundle Page</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={featureHome} onChange={e => setFeatureHome(e.target.checked)} className="w-4 h-4 rounded text-[#A85A3B] focus:ring-[#A85A3B]" />
                  <span className="text-sm text-gray-700">Feature on Homepage</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#A85A3B] focus:ring-[#A85A3B]" />
                  <span className="text-sm text-gray-700">Allow Coupon Codes</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded text-[#A85A3B] focus:ring-[#A85A3B]" />
                  <span className="text-sm text-gray-700">Limited Time Bundle</span>
                </label>
                <div className="flex gap-4 pt-2">
                   <div className="space-y-1 w-1/2">
                      <label className="text-xs font-medium text-gray-700">Start Date</label>
                      <input type="date" className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none" />
                   </div>
                   <div className="space-y-1 w-1/2">
                      <label className="text-xs font-medium text-gray-700">End Date</label>
                      <input type="date" className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none" />
                   </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked={useCollage} onChange={e => setUseCollage(e.target.checked)} className="w-4 h-4 rounded text-[#A85A3B] focus:ring-[#A85A3B]" />
                    <span className="text-sm font-semibold text-gray-900">Auto-generate Image Collage</span>
                  </label>
                  {!useCollage && (
                    <div className="mt-3 p-4 border-2 border-dashed border-gray-200 rounded-xl text-center bg-gray-50">
                      <button className="text-sm font-medium text-[#A85A3B] hover:underline">Click to upload custom image</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN - Sticky Summary & Preview */}
        <div className="w-full xl:w-[400px] space-y-6">
          
          <div className="sticky top-24 space-y-6">
            {/* PRICING SUMMARY CARD */}
            <div className="bg-[#1A1A1A] p-6 rounded-2xl text-white shadow-xl">
              <h3 className="text-lg font-display mb-6">Pricing Summary</h3>
              
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Combined Original Value</span>
                  <span className="line-through">{formatPrice(originalTotal)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Combined Sale Value</span>
                  <span>{formatPrice(currentSaleTotal)}</span>
                </div>
                <div className="h-px bg-white/10 my-2"></div>
                <div className="flex justify-between font-medium text-lg text-white">
                  <span>Final Bundle Price</span>
                  <span className="text-[#A85A3B] font-bold">{formatPrice(finalPrice)}</span>
                </div>
              </div>

              <div className="bg-[#A85A3B]/20 border border-[#A85A3B]/30 p-4 rounded-xl">
                <p className="text-xs text-white/80 mb-1 uppercase tracking-widest">Customer Saves</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{formatPrice(totalSavings)}</span>
                  <span className="text-sm font-medium text-[#C87355]">({savingsPercent}%)</span>
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW CARD */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Live Preview</h3>
                {badgeText && <span className="bg-[#FAF6F2] text-[#A85A3B] px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded">{badgeText}</span>}
              </div>
              
              <div className="aspect-square bg-gray-100 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center p-4">
                {useCollage && selectedProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 w-full h-full">
                    {selectedProducts.slice(0, 4).map((sp, i) => (
                      <div key={i} className="relative w-full h-full bg-white rounded-lg p-2 shadow-sm">
                        {sp.product.images?.[0] && <Image src={sp.product.images[0]} alt="" fill className="object-contain" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <ImageIcon className="w-10 h-10 text-gray-300" />
                )}
              </div>

              <h4 className="font-display text-xl text-gray-900 mb-1">{name || 'Bundle Name'}</h4>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{shortDesc || 'Short description will appear here...'}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="font-semibold text-lg">{formatPrice(finalPrice)}</span>
                {totalSavings > 0 && <span className="text-sm text-gray-400 line-through">{formatPrice(originalTotal)}</span>}
              </div>

              <button className="w-full py-3 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-colors">
                Add Bundle to Cart
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
