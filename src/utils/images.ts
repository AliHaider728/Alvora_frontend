import fallbackImage from '../assets/images/placeholder.webp';

interface ImageOptions {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
}

export const getSafeImageSrc = (source?: string | any | null, options?: ImageOptions): string => {
  if (source && typeof source === 'object' && source.src) source = source.src;
  const fallbackSrc = typeof fallbackImage === "string" ? fallbackImage : (fallbackImage as any).src;
  const url = (typeof source === 'string' ? source.trim() : source) || fallbackSrc;
  
  // Only apply transformations to genuine Cloudinary URLs
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    const transforms: string[] = ['f_auto', `q_${options?.quality || 'auto'}`];
    
    if (options?.width) transforms.push(`w_${options.width}`);
    if (options?.height) transforms.push(`h_${options.height}`);
    if (options?.crop) transforms.push(`c_${options.crop}`);
    
    const transformString = transforms.join(',');
    
    // Remove existing basic transformations if they exist
    const cleanUrl = url.replace(/\/upload\/(?:f_auto,q_auto|q_auto,f_auto)\//g, '/upload/');
    
    if (!cleanUrl.includes(`/upload/${transformString}/`)) {
      return cleanUrl.replace('/image/upload/', `/image/upload/${transformString}/`);
    }
    return cleanUrl;
  }
  
  return url;
};
