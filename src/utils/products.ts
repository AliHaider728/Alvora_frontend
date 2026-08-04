import { AgeGroupCategory, Product } from '../types';

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
