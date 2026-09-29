'use client';
import { useEffect, useRef, useState } from 'react';
import { getCartImageProps } from '../../utils/cartImages';

export function CartThumbnail({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const image = useRef<HTMLImageElement>(null);
  const [loadedSource, setLoadedSource] = useState('');
  const ready = loadedSource === src;
  useEffect(() => { if (image.current?.complete && image.current.naturalWidth) setLoadedSource(src); }, [src]);
  return <div className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F2E9E2] ${className}`}>
    {!ready && <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#F2E9E2] to-[#E7D9D0] motion-reduce:animate-none" />}
    <img {...getCartImageProps(src, alt)} ref={image} onLoad={() => setLoadedSource(src)} data-cart-thumbnail className={`absolute inset-0 h-full w-full object-cover ${ready ? '' : 'opacity-0'}`} />
  </div>;
}
