import fallbackImage from '../assets/images/promo_toys.jpg';

export const getSafeImageSrc = (source?: string | null): string => {
  const url = source?.trim() || fallbackImage;
  
  // Only apply transformations to genuine Cloudinary URLs
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    // If it doesn't already have transformations
    if (!url.includes('/upload/f_auto') && !url.includes('/upload/q_auto')) {
      return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
    }
  }
  
  return url;
};
