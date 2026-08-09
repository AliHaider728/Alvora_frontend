import React, { useEffect, useState } from 'react';
import { Settings, Plus, Trash2, Edit2, GripVertical, AlertCircle, Save, X, Image as ImageIcon } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { getSafeImageSrc } from '../../utils/images';

interface Term {
  id: string;
  label: string;
  slug: string;
  value: string;
  colorValue?: string;
  imageUrl?: string;
  imageAlt?: string;
  position: number;
  isArchived?: boolean;
}

interface GlobalAttribute {
  id: string;
  name: string;
  slug: string;
  displayType: 'dropdown' | 'buttons' | 'radio' | 'color_swatches' | 'image_swatches';
  terms: Term[];
}

function SortableTermItem({ term, onEdit, onDelete, displayType, inUseCount }: { term: Term, onEdit: (term: Term) => void, onDelete: (id: string) => void, displayType: string, inUseCount: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: term.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 group">
      <button {...attributes} {...listeners} className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4" />
      </button>
      
      {displayType === 'color_swatches' && term.colorValue && (
        <div className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: term.colorValue }} />
      )}
      
      {displayType === 'image_swatches' && term.imageUrl && (
        <div className="w-8 h-8 rounded-md border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
          <img src={getSafeImageSrc(term.imageUrl)} alt={term.label} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-slate-900 truncate">{term.label}</p>
          {term.isArchived && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Archived</span>}
        </div>
        <p className="text-sm text-slate-500 truncate">Slug: {term.slug}</p>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(term)}
          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (inUseCount > 0) {
              if (window.confirm(`This attribute is used by ${inUseCount} product(s). Deleting this term will archive it safely instead. Continue?`)) {
                onDelete(term.id);
              }
            } else {
               onDelete(term.id);
            }
          }}
          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
          title={inUseCount > 0 ? "Archive" : "Delete"}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function AdminGlobalAttributesPage() {
  const [attributes, setAttributes] = useState<GlobalAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  const [editingAttr, setEditingAttr] = useState<GlobalAttribute | null>(null);
  const [attrUsage, setAttrUsage] = useState<number>(0);
  
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Partial<Term> | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      const res = await api.getGlobalAttributes();
      setAttributes(res || []);
    } catch (error) {
      showToast('Failed to load attributes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAttr) return;

    try {
      if (editingAttr?.id) {
        await api.updateGlobalAttribute(editingAttr.id, { name: editingAttr.name, slug: editingAttr.slug, displayType: editingAttr.displayType });
        showToast('Attribute updated', 'success');
      } else {
        await api.createGlobalAttribute({ name: editingAttr.name, slug: editingAttr.slug, displayType: editingAttr.displayType });
        showToast('Attribute created', 'success');
      }
      setEditingAttr(null);
      fetchAttributes();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to save attribute', 'error');
    }
  };

  const handleDeleteAttribute = async (id: string, inUse: number) => {
    if (inUse > 0) {
      if (!window.confirm(`This attribute is used by ${inUse} product(s). Deleting it will soft-archive it instead. Proceed?`)) return;
    } else {
      if (!window.confirm('Are you sure you want to delete this attribute?')) return;
    }

    try {
      await api.deleteGlobalAttribute(id);
      showToast('Attribute removed', 'success');
      fetchAttributes();
      if (editingAttr?.id === id) setEditingAttr(null);
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to delete attribute', 'error');
    }
  };

  const openAttribute = async (attr: GlobalAttribute) => {
    setEditingAttr(attr);
    try {
      const res = await api.getGlobalAttributeUsage(attr.id);
      setAttrUsage(res?.productCount || 0);
    } catch {
      setAttrUsage(0);
    }
  };

  const handleSaveTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAttr || !editingTerm) return;

    try {
      if (editingTerm.id) {
        await api.updateGlobalAttributeTerm(editingAttr.id, editingTerm.id, editingTerm);
        showToast('Term updated', 'success');
      } else {
        await api.addGlobalAttributeTerm(editingAttr.id, editingTerm);
        showToast('Term added', 'success');
      }
      setIsTermModalOpen(false);
      
      // Refresh the specific attribute to get updated terms
      const res = await api.getGlobalAttributes();
      const updated = res?.find((a: any) => a.id === editingAttr.id);
      if (updated) {
        setEditingAttr(updated);
        setAttributes(prev => prev.map(a => a.id === updated.id ? updated : a));
      }
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to save term', 'error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      showToast('Uploading image...', 'success');
      const res = await api.uploadProductImage(formData);
      setEditingTerm(prev => ({ ...prev, imageUrl: res?.secureUrl }));
      showToast('Image uploaded successfully', 'success');
    } catch (error: any) {
      showToast('Failed to upload image', 'error');
    }
  };

  const handleDeleteTerm = async (termId: string) => {
    if (!editingAttr) return;
    try {
      await api.deleteGlobalAttributeTerm(editingAttr.id, termId);
      showToast('Term removed', 'success');
      const res = await api.getGlobalAttributes();
      const updated = res?.find((a: any) => a.id === editingAttr.id);
      if (updated) {
        setEditingAttr(updated);
        setAttributes(prev => prev.map(a => a.id === updated.id ? updated : a));
      }
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to delete term', 'error');
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!editingAttr || !over || active.id === over.id) return;

    const oldIndex = editingAttr.terms.findIndex(t => t.id === active.id);
    const newIndex = editingAttr.terms.findIndex(t => t.id === over.id);

    const newTerms = [...editingAttr.terms];
    const [moved] = newTerms.splice(oldIndex, 1);
    newTerms.splice(newIndex, 0, moved);
    
    // Update local state instantly
    setEditingAttr({ ...editingAttr, terms: newTerms });

    try {
      await api.reorderGlobalAttributeTerms(editingAttr.id, {
        termIds: newTerms.map(t => t.id)
      });
      // Silent success
    } catch (error) {
      showToast('Failed to save order', 'error');
      // Revert on failure
      const res = await api.getGlobalAttributes();
      const reverted = res?.find((a: any) => a.id === editingAttr.id);
      if (reverted) setEditingAttr(reverted);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading attributes...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Global Attributes</h1>
          <p className="text-slate-500 mt-1">Manage reusable attributes and terms for your products.</p>
        </div>
        <button
          onClick={() => setEditingAttr({ id: '', name: '', slug: '', displayType: 'buttons', terms: [] })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Attribute
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar: List of Attributes */}
        <div className="lg:col-span-1 space-y-3">
          {attributes.length === 0 ? (
            <div className="p-8 bg-white border border-dashed border-slate-300 rounded-xl text-center text-slate-500">
              No global attributes yet.
            </div>
          ) : (
            attributes.map(attr => (
              <button
                key={attr.id}
                onClick={() => openAttribute(attr)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  editingAttr?.id === attr.id
                    ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-slate-900">{attr.name}</div>
                  <div className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {attr.terms.filter(t => !t.isArchived).length} terms
                  </div>
                </div>
                <div className="text-sm text-slate-500 mt-1 capitalize flex items-center gap-2">
                  <Settings className="w-3 h-3" />
                  {attr.displayType.replace('_', ' ')}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Main Editor */}
        {editingAttr && (
          <div className="lg:col-span-2 space-y-6">
            {/* Attribute Settings Form */}
            <form onSubmit={handleSaveAttribute} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingAttr.id ? 'Edit Attribute' : 'New Attribute'}
                </h2>
                {editingAttr.id && attrUsage > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-amber-600 font-medium px-3 py-1 bg-amber-50 rounded-full">
                    <AlertCircle className="w-4 h-4" />
                    Used by {attrUsage} product{attrUsage !== 1 && 's'}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={editingAttr.name}
                    onChange={e => setEditingAttr({ ...editingAttr, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Size"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={editingAttr.slug}
                    onChange={e => setEditingAttr({ ...editingAttr, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Display Type</label>
                  <select
                    value={editingAttr.displayType}
                    onChange={e => setEditingAttr({ ...editingAttr, displayType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="buttons">Text Buttons</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="radio">Radio Buttons</option>
                    <option value="color_swatches">Color Swatches</option>
                    <option value="image_swatches">Image Swatches</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-100">
                {editingAttr.id ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteAttribute(editingAttr.id, attrUsage)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    {attrUsage > 0 ? 'Archive Attribute' : 'Delete Attribute'}
                  </button>
                ) : <div />}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingAttr(null)}
                    className="px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Save Settings
                  </button>
                </div>
              </div>
            </form>

            {/* Terms Management */}
            {editingAttr.id && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Terms</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage the values available for this attribute.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingTerm({ label: '', slug: '', value: '' });
                      setIsTermModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Term
                  </button>
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={editingAttr.terms.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {editingAttr.terms.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                          No terms defined yet. Click "Add Term" to begin.
                        </div>
                      ) : (
                        editingAttr.terms.map(term => (
                          <SortableTermItem
                            key={term.id}
                            term={term}
                            displayType={editingAttr.displayType}
                            onEdit={(t) => { setEditingTerm(t); setIsTermModalOpen(true); }}
                            onDelete={handleDeleteTerm}
                            inUseCount={attrUsage}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Term Edit Modal */}
      {isTermModalOpen && editingTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{editingTerm.id ? 'Edit Term' : 'Add Term'}</h3>
              <button onClick={() => setIsTermModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveTerm} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
                  <input
                    type="text"
                    required
                    value={editingTerm.label || ''}
                    onChange={e => setEditingTerm({ 
                      ...editingTerm, 
                      label: e.target.value, 
                      value: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Extra Large"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={editingTerm.slug || ''}
                    onChange={e => setEditingTerm({ ...editingTerm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                {editingAttr?.displayType === 'color_swatches' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Color Value</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={editingTerm.colorValue || '#000000'}
                        onChange={e => setEditingTerm({ ...editingTerm, colorValue: e.target.value })}
                        className="h-10 w-16 p-1 bg-white border border-slate-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingTerm.colorValue || ''}
                        onChange={e => setEditingTerm({ ...editingTerm, colorValue: e.target.value })}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm uppercase"
                        placeholder="#HEXCODE"
                      />
                    </div>
                  </div>
                )}

                {editingAttr?.displayType === 'image_swatches' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                    <div className="flex gap-2 items-center">
                      <div className="flex-1 flex gap-2">
                         <input
                           type="url"
                           value={editingTerm.imageUrl || ''}
                           onChange={e => setEditingTerm({ ...editingTerm, imageUrl: e.target.value })}
                           className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                           placeholder="https://..."
                         />
                         <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm cursor-pointer shrink-0">
                           <ImageIcon className="w-4 h-4" />
                           Upload
                           <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                         </label>
                      </div>
                      {editingTerm.imageUrl && (
                         <div className="w-10 h-10 shrink-0 border border-slate-200 rounded-md overflow-hidden">
                           <img src={getSafeImageSrc(editingTerm.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                         </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Provide a URL or upload an image.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTermModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save Term
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
