import { getImageProps } from 'next/image';
import type { Product } from '../types';
import { getSafeImageSrc } from './images';

// All new uploads/backfilled images have a paired 400px WebP at this immutable path.
export function getThumbnailSource(source?: string) {
  return source?.replace(/(\/products\/optimized\/)([a-f0-9]+)\.webp$/, '$1thumb-$2.webp');
}

export function getCartImageSource(product: Product, variationId?: string) {
  const variation = product.variations?.find(v => v.id === variationId);
  const source = variation?.image?.url || product.imageThumbnailUrls?.[0] || product.images?.[0] || product.bundleData?.image;
  return getSafeImageSrc(getThumbnailSource(source));
}

export function getCartImageProps(src: string, alt = '') {
  return getImageProps({ src, alt, width: 80, height: 80, sizes: '80px', quality: 75, loading: 'eager', fetchPriority: 'high' }).props;
}

const warmed = new Map<string, HTMLImageElement>();
export function warmCartImage(src: string) {
  if (typeof window === 'undefined' || warmed.has(src)) return;
  const props = getCartImageProps(src);
  const image = new window.Image();
  image.fetchPriority = 'high';
  image.sizes = props.sizes || '80px';
  image.srcset = props.srcSet || '';
  image.src = props.src;
  warmed.set(src, image);
  image.onerror = () => warmed.delete(src);
  if (warmed.size > 50) warmed.delete(warmed.keys().next().value!);
}

export function warmCartProduct(product: Product, variationId?: string) {
  warmCartImage(getCartImageSource(product, variationId));
}
