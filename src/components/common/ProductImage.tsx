"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { getSafeImageSrc } from '../../utils/images';

interface ProductImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
  src?: string | null;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  width?: number;
  height?: number;
  crop?: string;
  priority?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  loading,
  width,
  height,
  crop,
  priority = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const safeSrc = getSafeImageSrc(src, { width, height, crop });

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Skeleton loader shown while image is loading */}
      <div 
        className={`absolute inset-0 bg-slate-200 animate-pulse transition-opacity duration-300 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      />
      
      {/* Actual image */}
      <Image
        src={safeSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        onLoad={() => setIsLoaded(true)}
        className={`object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  );
};

