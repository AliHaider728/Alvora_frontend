import fallbackImage from '../assets/images/promo_toys.webp';

export const getSafeImageSrc = (source?: string | any | null): string => {
  if (source && typeof source === 'object' && source.src) source = source.src;
  const fallbackSrc = typeof fallbackImage === "string" ? fallbackImage : (fallbackImage as any).src;
  const url = (typeof source === 'string' ? source.trim() : source) || fallbackSrc;
  
  // Only apply transformations to genuine Cloudinary URLs
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    // If it doesn't already have transformations
    if (!url.includes('/upload/f_auto') && !url.includes('/upload/q_auto')) {
      return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
    }
  }
  
  return url;
};
