import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Layers, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { Category } from '../../types';
import { SeoHead } from '../../components/common/SeoHead';
import { formatPrice } from '../../utils/formatters';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, settings } = useStore();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState<number | undefined>(undefined);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setImage('https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80');
    setDescription('');
    setDeliveryCharge(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setImage(cat.image);
    setDescription(cat.description);
    setDeliveryCharge(cat.deliveryCharge);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, catName: string) => {
    if (window.confirm(`Delete category ${catName}?`)) {
      deleteCategory(id);
      showToast(`Deleted category ${catName}`, 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingCategory) {
      updateCategory(editingCategory.id, { name, slug, image, description, deliveryCharge });
      showToast(`Updated category ${name}`, 'success');
    } else {
      addCategory({ name, slug, iconName: 'Boxes', image, description, deliveryCharge });
      showToast(`Added category ${name}`, 'success');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      <SeoHead title="Manage Categories" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-2xl text-slate-900">Toy Categories</h1>
          <p className="text-xs text-slate-500 font-medium">Create and manage storefront toy collections & category delivery charges.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-heading font-bold text-xs flex items-center gap-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex gap-4 items-center">
              <img src={cat.image} alt={cat.name} className="w-16 h-16 object-cover rounded-2xl bg-slate-100" />
              <div>
                <h3 className="font-heading font-black text-base text-slate-900">{cat.name}</h3>
                <span className="text-xs text-slate-400 font-medium">{cat.itemCount} items cataloged</span>
                <span className="text-[11px] text-sky-700 font-bold block mt-1">
                  Delivery Charge:{' '}
                  {cat.deliveryCharge ? formatPrice(cat.deliveryCharge, settings.currency) : 'Default Store Shipping'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">{cat.description}</p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => openEditModal(cat)}
                className="p-2 text-sky-600 hover:bg-sky-50 rounded-xl"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-lg text-slate-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category Specific Delivery Fee (Rs., Optional)</label>
                <input
                  type="number"
                  placeholder="Leave blank for store default"
                  value={deliveryCharge || ''}
                  onChange={e => setDeliveryCharge(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

