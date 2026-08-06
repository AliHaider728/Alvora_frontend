import { AgeGroupCategory, Product, ProductVariantOption, StockStatus } from '../types';

type InventorySource = {
  trackInventory?: boolean;
  stockQuantity?: number | null;
  stockStatus?: StockStatus;
  inStock?: boolean;
};

export type NormalizedInventory = {
  trackInventory: boolean;
  stockQuantity?: number;
  stockStatus: StockStatus;
  inStock: boolean;
};

export const normalizeInventory = (source: InventorySource): NormalizedInventory => {
  const hasQuantity = source.stockQuantity !== undefined && source.stockQuantity !== null &&
    String(source.stockQuantity).trim() !== '' &&
    Number.isInteger(Number(source.stockQuantity)) && Number(source.stockQuantity) >= 0;
  const trackInventory = typeof source.trackInventory === 'boolean'
    ? source.trackInventory
    : hasQuantity;
  if (trackInventory) {
    const stockQuantity = hasQuantity ? Number(source.stockQuantity) : 0;
    return {
      trackInventory: true,
      stockQuantity,
      stockStatus: stockQuantity > 0 ? 'in_stock' : 'out_of_stock',
      inStock: stockQuantity > 0
    };
  }
  const stockStatus: StockStatus = source.stockStatus === 'out_of_stock' || source.inStock === false
    ? 'out_of_stock'
    : 'in_stock';
  return { trackInventory: false, stockStatus, inStock: stockStatus === 'in_stock' };
};

export const isVariantOptionAvailable = (option: ProductVariantOption) =>
  normalizeInventory(option).inStock;

export const getEffectiveProductAvailability = (
  product: Product,
  selectedVariants?: Record<string, string>
) => {
  if (product.productType === 'variable' && product.variations && product.variations.length > 0) {
    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      const matched = product.variations.find(v => v.enabled && Object.entries(selectedVariants).every(([k, val]) => v.attributes[k] === val));
      return matched ? normalizeInventory(matched).inStock : false;
    }
    return product.variations.some(v => v.enabled && normalizeInventory(v).inStock);
  }

  const groups = (product.variants || []).filter(group => group.options.length > 0);
  if (groups.length === 0) return normalizeInventory(product).inStock;
  return groups.every(group => {
    const selected = selectedVariants?.[group.name];
    return selected
      ? group.options.some(option => option.name === selected && isVariantOptionAvailable(option))
      : group.options.some(isVariantOptionAvailable);
  });
};

export const getEffectiveAvailableQuantity = (
  product: Product,
  selectedVariants?: Record<string, string>
): number | undefined => {
  if (product.productType === 'variable' && product.variations && product.variations.length > 0) {
    if (selectedVariants && Object.keys(selectedVariants).length > 0) {
      const matched = product.variations.find(v => v.enabled && Object.entries(selectedVariants).every(([k, val]) => v.attributes[k] === val));
      if (matched) {
        const inv = normalizeInventory(matched);
        return inv.trackInventory ? inv.stockQuantity : undefined;
      }
    }
    const trackedQuantities = product.variations
      .filter(v => v.enabled)
      .map(normalizeInventory)
      .filter(inv => inv.trackInventory)
      .map(inv => inv.stockQuantity || 0);
    return trackedQuantities.length > 0 ? Math.max(...trackedQuantities) : undefined;
  }

  const groups = (product.variants || []).filter(group => group.options.length > 0);
  if (groups.length === 0) return normalizeInventory(product).stockQuantity;
  const selected = groups
    .map(group => group.options.find(option => option.name === selectedVariants?.[group.name]))
    .filter((option): option is ProductVariantOption => Boolean(option));
  if (selected.length !== groups.length) return undefined;
  const trackedQuantities = selected
    .map(normalizeInventory)
    .filter(inventory => inventory.trackInventory)
    .map(inventory => inventory.stockQuantity || 0);
  return trackedQuantities.length > 0 ? Math.min(...trackedQuantities) : undefined;
};

export const normalizeProductAgeGroups = (ageGroups: unknown, legacyAgeGroup?: unknown): AgeGroupCategory[] => {
  const submitted = Array.isArray(ageGroups) && ageGroups.length > 0
    ? ageGroups.map(String)
    : legacyAgeGroup ? [String(legacyAgeGroup)] : [];
  const normalized = submitted.flatMap(value =>
    value === '9-11' ? ['9-12'] : value === '8+' ? ['9-12', '13+'] : [value]
  );
  const supported = new Set<AgeGroupCategory>(['0-2', '3-5', '6-8', '9-12', '13+']);
  return [...new Set(normalized.filter((value): value is AgeGroupCategory => supported.has(value as AgeGroupCategory)))];
};

export const isProductVisibleOnStorefront = (product: Product): boolean =>
  product.isVisible !== false && product.status !== 'draft';

export const getProductDeliveryType = (product: Product) =>
  product.deliveryType || product.deliveryChargeType || 'store_threshold';

export const getProductAgeGroups = (product: Product): AgeGroupCategory[] =>
  normalizeProductAgeGroups(product.ageGroups, product.ageGroup);

export const formatProductAgeGroups = (product: Product) => {
  const groups = getProductAgeGroups(product);
  return groups.length ? `Ages ${groups.join(', ')}` : 'All ages';
};


export const getVariationDisplayLabel = (
  variation: any,
  productAttributes: any[],
  index: number
): string => {
  if (!variation || !variation.attributes || Object.keys(variation.attributes).length === 0) {
    if (variation?.sku) return variation.sku;
    return `Variation ${index + 1}`;
  }

  const parts: string[] = [];
  const varAttrs = productAttributes.filter(a => a.usedForVariations);

  for (const attr of varAttrs) {
    // 1. variation value by attribute slug
    let val = variation.attributes[attr.slug];
    
    // 2. variation value by attribute ID
    if (!val && attr.id) val = variation.attributes[attr.id];
    
    // 3. variation value by globalAttributeId
    if (!val && attr.globalAttributeId) val = variation.attributes[attr.globalAttributeId];
    
    // 4. variation value by attribute name
    if (!val && attr.name) val = variation.attributes[attr.name];

    // 5. resolve stored term ID to its visible term label
    if (val) {
      const termMatch = attr.terms?.find((t: any) => t.id === val || t.value === val || t.slug === val);
      if (termMatch) {
        val = termMatch.label || termMatch.value || val;
      }
      parts.push(val);
    }
  }

  if (parts.length > 0) {
    return parts.join(' / ');
  }

  // 6. any remaining non-empty variation attribute values
  const allVals = Object.values(variation.attributes).filter(Boolean);
  if (allVals.length > 0) {
    return allVals.map(String).join(' / ');
  }

  // 7. variation SKU
  if (variation.sku) return variation.sku;

  // 8. Variation ${index + 1}
  return `Variation ${index + 1}`;
};
