import React, { useState } from 'react';
import { Play, Settings2, Trash2 } from 'lucide-react';
import { ProductAttribute, ProductVariation } from '../../types';

interface VariationsGeneratorProps {
  attributes: ProductAttribute[];
  variations: ProductVariation[];
  onChange: (variations: ProductVariation[]) => void;
  basePrice: number;
}

export const VariationsGenerator: React.FC<VariationsGeneratorProps> = ({ attributes, variations, onChange, basePrice }) => {
  const variationAttributes = attributes.filter(a => {
    if (!a.usedForVariations) return false;
    if (a.source === 'custom') return a.terms && a.terms.length > 0;
    return a.selectedTermIds && a.selectedTermIds.length > 0;
  });

  const generateCombinations = () => {
    if (variationAttributes.length === 0) return;
    
    // Generate Cartesian product of all variant attribute values
    const generate = (index: number, currentCombo: Record<string, string>): Record<string, string>[] => {
      if (index === variationAttributes.length) {
        return [{ ...currentCombo }];
      }
      const attr = variationAttributes[index];
      const results: Record<string, string>[] = [];
      const values = attr.source === 'global' 
        ? (attr.terms || []).filter(t => (attr.selectedTermIds || []).includes(t.id)).map(t => t.value)
        : (attr.terms || []).map(t => t.value);

      for (const val of values) {
        results.push(...generate(index + 1, { ...currentCombo, [attr.slug]: val }));
      }
      return results;
    };

    const combinations = generate(0, {});
    
    const newVariations = combinations.map(combo => {
      // Find existing variation with same attributes to preserve data
      const existing = variations.find(v => {
        return Object.entries(combo).every(([key, val]) => v.attributes[key] === val) &&
               Object.keys(v.attributes).length === Object.keys(combo).length;
      });

      if (existing) return existing;

      return {
        id: `var-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        attributes: combo,
        enabled: false, // New variations begin disabled until configured
        sku: '',
        regularPrice: '' as unknown as number, // Force empty state instead of 0
        manageStock: false,
        stockStatus: 'in_stock' as const
      };
    });

    const obsolete = variations.filter(v => 
      !newVariations.some(nv => nv.id === v.id)
    );

    if (obsolete.length > 0) {
      if (!window.confirm(`${obsolete.length} existing variation(s) are no longer valid and will be removed. Proceed?`)) {
        return;
      }
    }

    onChange(newVariations);
  };

  const updateVariation = (id: string, field: keyof ProductVariation, value: any) => {
    onChange(variations.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const removeVariation = (id: string) => {
    onChange(variations.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-50 p-4 border border-slate-200 rounded-xl">
        <div>
          <h3 className="font-heading font-bold text-slate-800">Generate Variations</h3>
          <p className="text-sm text-slate-500">
            {variationAttributes.length > 0 
              ? `Ready to generate from ${variationAttributes.length} attribute(s).`
              : 'Add attributes used for variations first.'}
          </p>
        </div>
        <button
          type="button"
          disabled={variationAttributes.length === 0}
          onClick={generateCombinations}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-heading font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors text-sm"
        >
          <Play className="w-4 h-4" /> Generate
        </button>
      </div>

      {variations.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-slate-100 rounded-lg text-xs font-heading font-bold text-slate-600 uppercase tracking-wider">
            <div className="col-span-3">Attributes</div>
            <div className="col-span-2">Regular Price</div>
            <div className="col-span-2">Sale Price</div>
            <div className="col-span-2">SKU</div>
            <div className="col-span-2">Stock</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          
          {variations.map(variation => (
            <div key={variation.id} className={`grid grid-cols-12 gap-4 px-4 py-3 border border-slate-200 rounded-xl items-center transition-opacity ${!variation.enabled ? 'opacity-50 bg-slate-50' : 'bg-white'}`}>
              <div className="col-span-3 flex flex-col gap-1">
                {Object.entries(variation.attributes).map(([key, val]) => (
                  <span key={key} className="text-sm font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md self-start">
                    {key}: {val}
                  </span>
                ))}
                <label className="flex items-center gap-2 text-xs text-slate-500 mt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={variation.enabled}
                    onChange={(e) => updateVariation(variation.id, 'enabled', e.target.checked)}
                    className="rounded text-rose-500 focus:ring-rose-500 cursor-pointer"
                  />
                  Enabled
                </label>
              </div>

              <div className="col-span-2">
                <input
                  type="number"
                  min="0"
                  value={variation.regularPrice !== undefined && variation.regularPrice !== ('' as unknown as number) ? variation.regularPrice : ''}
                  onChange={(e) => updateVariation(variation.id, 'regularPrice', e.target.value === '' ? ('' as unknown as number) : parseFloat(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-rose-400 outline-none focus:ring-1 focus:ring-rose-400"
                  placeholder="Required"
                />
              </div>

              <div className="col-span-2">
                <input
                  type="number"
                  min="0"
                  value={variation.salePrice || ''}
                  onChange={(e) => updateVariation(variation.id, 'salePrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-rose-400 outline-none focus:ring-1 focus:ring-rose-400"
                  placeholder="Optional"
                />
              </div>

              <div className="col-span-2">
                <input
                  type="text"
                  value={variation.sku || ''}
                  onChange={(e) => updateVariation(variation.id, 'sku', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-rose-400 outline-none focus:ring-1 focus:ring-rose-400"
                  placeholder="SKU"
                />
              </div>

              <div className="col-span-2 flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={variation.manageStock}
                    onChange={(e) => updateVariation(variation.id, 'manageStock', e.target.checked)}
                    className="rounded text-rose-500 focus:ring-rose-500 cursor-pointer"
                  />
                  Track
                </label>
                {variation.manageStock && (
                  <input
                    type="number"
                    min="0"
                    value={variation.stockQuantity || ''}
                    onChange={(e) => updateVariation(variation.id, 'stockQuantity', parseInt(e.target.value, 10))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-rose-400 outline-none focus:ring-1 focus:ring-rose-400"
                    placeholder="Qty"
                  />
                )}
              </div>

              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeVariation(variation.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove Variation"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
