import { AgeGroupCategory, Product } from '../types';

export const isProductVisibleOnStorefront = (product: Product): boolean =>
  product.isVisible !== false && product.status !== 'draft';

export const getProductDeliveryType = (product: Product) =>
  product.deliveryType || product.deliveryChargeType || 'store_threshold';

export const getProductAgeGroups = (product: Product): AgeGroupCategory[] =>
  product.ageGroups?.length
    ? product.ageGroups
    : product.ageGroup
      ? [['9-11', '9-12', '13+'].includes(String(product.ageGroup)) ? '8+' : product.ageGroup]
      : [];

export const formatProductAgeGroups = (product: Product) => {
  const groups = getProductAgeGroups(product);
  return groups.length ? `Ages ${groups.join(', ')}` : 'All ages';
};
