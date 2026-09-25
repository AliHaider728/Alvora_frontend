export function getBundleImages(bundle: { image?: string; galleryImages?: string[] }): string[] {
  // Included products and legacy marketing assets are never gallery fallbacks.
  const gallery = Array.isArray(bundle.galleryImages) ? bundle.galleryImages : [];
  return [...new Set([bundle.image, ...gallery].filter((url): url is string => typeof url === 'string' && url.trim().length > 0).map(url => url.trim()))];
}
