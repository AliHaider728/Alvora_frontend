import React, { useState } from 'react';
import { getSafeImageSrc } from '../../utils/images';

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  loading = 'lazy',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const safeSrc = getSafeImageSrc(src);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Skeleton loader shown while image is loading */}
      <div 
        className={`absolute inset-0 bg-slate-200 animate-pulse transition-opacity duration-300 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      />
      
      {/* Actual image */}
      <img
        src={safeSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        {...props}
      />
    </div>
  );
};

