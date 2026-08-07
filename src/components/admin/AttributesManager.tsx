import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Settings } from 'lucide-react';
import { ProductAttribute, ProductAttributeTerm } from '../../types';
import { api } from '../../services/api';

interface AttributesManagerProps {
  attributes: ProductAttribute[];
  onChange: (attributes: ProductAttribute[]) => void;
}

export const AttributesManager: React.FC<AttributesManagerProps> = ({ attributes, onChange }) => {
  const [globalAttributes, setGlobalAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGlobalAttributes()
      .then(res => {
        if (res) setGlobalAttributes(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddCustomAttribute = () => {
    onChange([
      ...attributes,
      {
        source: 'custom',
        id: `attr-${Date.now()}`,
        name: '',
        slug: '',
        displayType: 'buttons',
        terms: [],
        selectedTermIds: [],
        visible: true,
        usedForVariations: true,
        position: attributes.length
      }
    ]);
  };

  const handleAddGlobalAttribute = (globalAttrId: string) => {
    if (!globalAttrId) return;
    
    // Check if already added
    if (attributes.some(a => a.globalAttributeId === globalAttrId)) return;

    const globalAttr = globalAttributes.find(g => g.id === globalAttrId);
    if (!globalAttr) return;

    onChange([
      ...attributes,
      {
        source: 'global',
        globalAttributeId: globalAttr.id,
        id: `attr-${Date.now()}`,
        name: globalAttr.name,
        slug: globalAttr.slug,
        displayType: globalAttr.displayType,
        terms: globalAttr.terms, // populate snapshots for preview
        selectedTermIds: [], // none selected initially
        visible: true,
        usedForVariations: true,
        position: attributes.length
      }
    ]);
  };

  const handleRemoveAttribute = (id: string) => {
    onChange(attributes.filter(a => a.id !== id));
  };

  const handleAttributeChange = (id: string, field: keyof ProductAttribute, value: any) => {
    onChange(
      attributes.map(a => {
        if (a.id !== id) return a;
        const updated = { ...a, [field]: value };
        if (field === 'name' && a.source === 'custom') {
          updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        return updated;
      })
    );
  };

  const addCustomTerm = (attrId: string, label: string) => {
    label = label.trim();
    if (!label) return;
    
    onChange(attributes.map(a => {
      if (a.id !== attrId || a.source !== 'custom') return a;
      const terms = a.terms || [];
      if (terms.some(t => t.label.toLowerCase() === label.toLowerCase())) {
        return a; // Prevent duplicate value
      }
      return {
        ...a,
        terms: [
          ...terms,
          {
            id: `term-${Date.now()}-${terms.length}`,
            label,
            slug: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            value: label,
            position: terms.length
          }
        ]
      };
    }));
  };

  const removeCustomTerm = (attrId: string, termId: string) => {
    onChange(attributes.map(a => {
      if (a.id !== attrId || a.source !== 'custom') return a;
      return {
        ...a,
        terms: (a.terms || []).filter(t => t.id !== termId)
      };
    }));
  };

  const handleCustomTermsChange = (id: string, termsStr: string) => {
    // Keep this function if we need a fallback, but we will mostly rely on addCustomTerm
  };

  const toggleGlobalTermSelection = (attrId: string, termId: string) => {
    onChange(attributes.map(a => {
      if (a.id !== attrId || a.source !== 'global') return a;
      
      const selected = new Set(a.selectedTermIds || []);
      if (selected.has(termId)) {
        selected.delete(termId);
      } else {
        selected.add(termId);
      }
      return { ...a, selectedTermIds: Array.from(selected) };
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading font-bold text-slate-800">Product Attributes</h3>
        <a href="/admin/attributes" target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
          <Settings className="w-3.5 h-3.5" /> Manage Global Attributes
        </a>
      </div>

      {attributes.map((attr, index) => (
        <div key={attr.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex gap-4">
          <div className="pt-2 cursor-grab text-slate-400 hover:text-slate-600">
            <GripVertical className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${attr.source === 'global' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
                  {attr.source}
                </span>
                <span className="text-sm font-medium text-slate-500 capitalize flex items-center gap-1">
                  &bull; Display: 
                  <select 
                    value={attr.source === 'global' ? attr.displayTypeOverride || attr.displayType : attr.displayType}
                    onChange={(e) => {
                      if (attr.source === 'global') {
                        handleAttributeChange(attr.id, 'displayTypeOverride', e.target.value === attr.displayType ? undefined : e.target.value);
                      } else {
                        handleAttributeChange(attr.id, 'displayType', e.target.value);
                      }
                    }}
                    className="ml-1 bg-transparent border-none p-0 text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer"
                  >
                    <option value="buttons">Buttons</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="radio">Radio</option>
                    <option value="color_swatches">Color Swatches</option>
                    <option value="image_swatches">Image Swatches</option>
                  </select>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1">Attribute Name</label>
                <input
                  type="text"
                  value={attr.name}
                  disabled={attr.source === 'global'}
                  onChange={(e) => handleAttributeChange(attr.id, 'name', e.target.value)}
                  placeholder="e.g. Size, Color"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-400 outline-none focus:ring-1 focus:ring-rose-400 disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 mb-1">
                  Values
                </label>
                
                {attr.source === 'custom' ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {attr.terms.map(t => (
                        <span key={t.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-sm border border-rose-200">
                          {(attr.displayTypeOverride || attr.displayType) === 'color_swatches' && (
                            <span
                              className="h-3.5 w-3.5 rounded-full border border-black/10"
                              style={{ backgroundColor: t.colorValue || t.value || '#cbd5e1' }}
                              aria-hidden="true"
                            />
                          )}
                          {t.label}
                          <button type="button" onClick={() => removeCustomTerm(attr.id, t.id)} className="text-rose-500 hover:text-rose-700 p-0.5 rounded-full hover:bg-rose-100 transition-colors">
                            <span className="sr-only">Remove</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomTerm(attr.id, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      onBlur={(e) => {
                        addCustomTerm(attr.id, e.target.value);
                        e.target.value = '';
                      }}
                      placeholder="Type value and press Enter..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-400 outline-none focus:ring-1 focus:ring-rose-400"
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {attr.terms.filter(t => !t.isArchived).map(term => {
                      const isSelected = (attr.selectedTermIds || []).includes(term.id);
                      return (
                        <button
                          key={term.id}
                          onClick={() => toggleGlobalTermSelection(attr.id, term.id)}
                          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium ring-1 ring-blue-500' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {(attr.displayTypeOverride || attr.displayType) === 'color_swatches' && (
                            <span
                              className="mr-1.5 inline-block h-3.5 w-3.5 rounded-full border border-black/10 align-[-2px]"
                              style={{ backgroundColor: term.colorValue || term.value || '#cbd5e1' }}
                              aria-hidden="true"
                            />
                          )}
                          {term.label}
                        </button>
                      );
                    })}
                    {attr.terms.filter(t => !t.isArchived).length === 0 && (
                      <span className="text-sm text-slate-500 italic">No terms defined globally.</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attr.visible}
                  onChange={(e) => handleAttributeChange(attr.id, 'visible', e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-500 cursor-pointer"
                />
                Visible on product page
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attr.usedForVariations}
                  onChange={(e) => handleAttributeChange(attr.id, 'usedForVariations', e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-500 cursor-pointer"
                />
                Used for variations
              </label>
            </div>
          </div>
          
          <div className="pt-1">
            <button
              type="button"
              onClick={() => handleRemoveAttribute(attr.id)}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              title="Remove Attribute"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3 pt-2">
        <select
          onChange={(e) => {
            handleAddGlobalAttribute(e.target.value);
            e.target.value = '';
          }}
          defaultValue=""
          disabled={loading || globalAttributes.length === 0}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 focus:border-rose-400 outline-none focus:ring-1 focus:ring-rose-400 disabled:bg-slate-50 disabled:text-slate-400"
        >
          <option value="" disabled>+ Add Global Attribute</option>
          {globalAttributes.map(g => (
             <option key={g.id} value={g.id} disabled={attributes.some(a => a.globalAttributeId === g.id)}>{g.name}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAddCustomAttribute}
          className="px-4 py-2 text-sm font-heading font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Custom
        </button>
      </div>
    </div>
  );
};
