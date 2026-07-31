import fallbackImage from '../assets/images/promo_toys.jpg';

export const getSafeImageSrc = (source?: string | null): string =>
  source?.trim() || fallbackImage;
