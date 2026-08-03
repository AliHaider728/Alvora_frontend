import { Product } from '../types';

export const isProductVisibleOnStorefront = (product: Product): boolean =>
  product.isVisible !== false && product.status !== 'draft';

export const getProductDeliveryType = (product: Product) =>
  product.deliveryType || product.deliveryChargeType || 'store_threshold';
