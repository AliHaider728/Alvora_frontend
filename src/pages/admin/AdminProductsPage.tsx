import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Eye, EyeOff, Sparkles, AlertCircle, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { Product, AgeGroupCategory, DeliveryChargeType, ProductVariantGroup } from '../../types';
import { SeoHead } from '../../components/common/SeoHead';
import { AGE_GROUPS } from '../../data/mockData';
import { formatPrice } from '../../utils/formatters';

export const AdminProductsPage: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, settings } = useStore();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState(2999);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(3499);
  const [category, setCategory] = useState(categories[0]?.name || 'Building Sets & Blocks');
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || 'building-sets');
  const [ageGroup, setAgeGroup] = useState<AgeGroupCategory>('6-8');
  const [brand, setBrand] = useState('PlayBimboo Studios');
  const [stockQuantity, setStockQuantity] = useState(25);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80');
  const [description, setDescription] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [deliveryType, setDeliveryType] = useState<DeliveryChargeType>('store_threshold');
  const [customDeliveryFee, setCustomDeliveryFee] = useState<number | undefined>(undefined);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Dynamic Product Variants State
  const [variants, setVariants] = useState<ProductVariantGroup[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newOptionInputs, setNewOptionInputs] = useState<{ [groupIndex: number]: string }>({});

  const handleAddVariantGroup = () => {
    if (!newGroupName.trim()) return;
    setVariants(prev => [...prev, { name: newGroupName.trim(), options: [] }]);
    setNewGroupName('');
  };

  const handleRemoveVariantGroup = (groupIndex: number) => {
    setVariants(prev => prev.filter((_, idx) => idx !== groupIndex));
  };

  const handleAddOptionToGroup = (groupIndex: number) => {
    const val = (newOptionInputs[groupIndex] || '').trim();
    if (!val) return;
    setVariants(prev => prev.map((g, idx) => {
      if (idx !== groupIndex) return g;
      if (g.options.includes(val)) return g;
      return { ...g, options: [...g.options, val] };
    }));
    setNewOptionInputs(prev => ({ ...prev, [groupIndex]: '' }));
  };

  const handleRemoveOptionFromGroup = (groupIndex: number, optionVal: string) => {
    setVariants(prev => prev.map((g, idx) => {
      if (idx !== groupIndex) return g;
      return { ...g, options: g.options.filter(o => o !== optionVal) };
    }));
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCatFilter === 'all' || p.categorySlug === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice(2999);
    setOriginalPrice(3499);
    setDescription('Fun and engaging toy designed for hours of creative play.');
    setStockQuantity(25);
    setImageUrl('https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80');
    setIsVisible(true);
    setDeliveryType('store_threshold');
    setCustomDeliveryFee(undefined);
    setMetaTitle('');
    setMetaDescription('');
    setVariants([]);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setPrice(prod.price);
    setOriginalPrice(prod.originalPrice);
    setCategory(prod.category);
    setCategorySlug(prod.categorySlug);
    setAgeGroup(prod.ageGroup);
    setBrand(prod.brand);
    setStockQuantity(prod.stockQuantity);
    setImageUrl(prod.images[0] || '');
    setDescription(prod.description);
    setIsVisible(prod.isVisible !== false);
    setDeliveryType(prod.deliveryType || 'store_threshold');
    setCustomDeliveryFee(prod.customDeliveryFee);
    setMetaTitle(prod.metaTitle || '');
    setMetaDescription(prod.metaDescription || '');
    setVariants(prod.variants ? JSON.parse(JSON.stringify(prod.variants)) : []);
    setIsModalOpen(true);
  };

  const toggleVisibility = (prod: Product) => {
    const nextState = !(prod.isVisible !== false);
    updateProduct(prod.id, { isVisible: nextState });
    showToast(`${prod.name} is now ${nextState ? 'visible' : 'hidden'} on storefront.`, 'info');
  };

  const handleDelete = (id: string, prodName: string) => {
    if (window.confirm(`Are you sure you want to delete ${prodName}?`)) {
      deleteProduct(id);
      showToast(`Deleted ${prodName}`, 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const selectedCatObj = categories.find(c => c.name === category);

    const productPayload = {
      name,
      slug,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      discountPercent: originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      category,
      categorySlug: selectedCatObj ? selectedCatObj.slug : categorySlug,
      ageGroup,
      brand,
      inStock: Number(stockQuantity) > 0,
      stockQuantity: Number(stockQuantity),
      images: [imageUrl],
      description,
      isVisible,
      deliveryType,
      customDeliveryFee: deliveryType === 'fixed' ? customDeliveryFee : undefined,
      variants,
      features: editingProduct ? editingProduct.features : ['Durable BPA-free plastic construction', 'Encourages imaginative play'],
      safetyInfo: editingProduct ? editingProduct.safetyInfo : 'Non-toxic child safe materials.',
      specifications: editingProduct ? editingProduct.specifications : { 'Material': 'ABS Plastic' },
      tags: ['toy', categorySlug],
      metaTitle: metaTitle || `${name} - PlayBimboo`,
      metaDescription: metaDescription || description.slice(0, 150)
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
      showToast(`Updated product ${name}`, 'success');
    } else {
      addProduct(productPayload);
      showToast(`Added new product ${name}`, 'success');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      <SeoHead title="Manage Products" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl text-slate-900">Products Catalog</h1>
          <p className="text-xs text-slate-500 font-medium">Manage toys, PKR pricing, inventory stock, visibility, and delivery charge logic.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-heading font-bold text-xs flex items-center gap-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Toy</span>
        </button>
      </div>

      {/* Filter controls */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search by toy name or brand..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={selectedCatFilter}
          onChange={e => setSelectedCatFilter(e.target.value)}
          className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 pl-6">Toy</th>
                <th className="p-4">Category</th>
                <th className="p-4">Age</th>
                <th className="p-4">Price (PKR)</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Store Visibility</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(prod => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img src={prod.images[0]} alt="" className="w-10 h-10 object-cover rounded-xl bg-slate-100" />
                      <div>
                        <span className="font-heading font-bold text-slate-900 block">{prod.name}</span>
                        <span className="text-[10px] text-slate-400">{prod.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-sky-600">{prod.category}</td>
                  <td className="p-4 font-bold">{prod.ageGroup} Yrs</td>
                  <td className="p-4 font-bold text-slate-900">{formatPrice(prod.price, settings.currency)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      prod.stockQuantity > 15 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {prod.stockQuantity} in stock
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleVisibility(prod)}
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                        prod.isVisible !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {prod.isVisible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{prod.isVisible !== false ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-sky-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id, prod.name)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-lg text-slate-900">
                {editingProduct ? 'Edit Toy Product' : 'Add New Toy Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => {
                      setCategory(e.target.value);
                      const obj = categories.find(c => c.name === e.target.value);
                      if (obj) setCategorySlug(obj.slug);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Age Recommendation</label>
                  <select
                    value={ageGroup}
                    onChange={e => setAgeGroup(e.target.value as AgeGroupCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    {AGE_GROUPS.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Original Price (Rs.)</label>
                  <input
                    type="number"
                    step="1"
                    value={originalPrice || ''}
                    onChange={e => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={stockQuantity}
                    onChange={e => setStockQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Storefront Visibility</label>
                  <select
                    value={isVisible ? 'true' : 'false'}
                    onChange={e => setIsVisible(e.target.value === 'true')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                  >
                    <option value="true">Visible to Customers</option>
                    <option value="false">Hidden / Draft</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Charge Model</label>
                  <select
                    value={deliveryType}
                    onChange={e => setDeliveryType(e.target.value as DeliveryChargeType)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="store_threshold">Default (Store Shipping Fee)</option>
                    <option value="category">Category-Based Charge</option>
                    <option value="fixed">Fixed Custom Fee</option>
                    <option value="free">Always Free Delivery</option>
                  </select>
                </div>

                {deliveryType === 'fixed' && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Custom Delivery Fee (Rs.)</label>
                    <input
                      type="number"
                      placeholder="e.g. 150"
                      value={customDeliveryFee || ''}
                      onChange={e => setCustomDeliveryFee(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>

                {/* Custom Product Variants & Options Section */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-rose-500" />
                      <span>Custom Product Variants (e.g. Color, Size, Pack)</span>
                    </span>
                  </div>

                  {/* Add Group Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="New Variant Group Name (e.g. Color, Size, Pieces)"
                      value={newGroupName}
                      onChange={e => setNewGroupName(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddVariantGroup}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                    >
                      + Add Group
                    </button>
                  </div>

                  {/* Group Items */}
                  {variants.map((group, groupIdx) => (
                    <div key={groupIdx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-xs text-rose-600 uppercase">
                          {group.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantGroup(groupIdx)}
                          className="text-xs text-rose-500 hover:text-rose-700 font-bold"
                        >
                          Remove Group
                        </button>
                      </div>

                      {/* Options Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {group.options.map((opt, optIdx) => (
                          <span
                            key={optIdx}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-bold flex items-center gap-1"
                          >
                            <span>{opt}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveOptionFromGroup(groupIdx, opt)}
                              className="text-slate-400 hover:text-rose-500"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add Option Input */}
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder={`Add option for ${group.name} (e.g. Red, XL)...`}
                          value={newOptionInputs[groupIdx] || ''}
                          onChange={e => setNewOptionInputs({ ...newOptionInputs, [groupIdx]: e.target.value })}
                          className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddOptionToGroup(groupIdx)}
                          className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold text-xs"
                        >
                          + Option
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SEO Fields */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-heading font-bold text-xs text-slate-800 block">SEO Metadata (Optional)</span>
                  <input
                    type="text"
                    placeholder="SEO Meta Title"
                    value={metaTitle}
                    onChange={e => setMetaTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="SEO Meta Description"
                    value={metaDescription}
                    onChange={e => setMetaDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-heading font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-rose-500 text-white font-heading font-bold text-xs shadow-md"
                >
                  Save Toy Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

