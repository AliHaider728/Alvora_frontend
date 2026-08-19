"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import defaultLogoImg from '../../assets/images/play_bimboo_logo_1785311841625.webp';
import { getSafeImageSrc } from '../../utils/images';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'footer';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const { settings } = useStore();

  const imageSizes = {
    sm: 'h-8 md:h-9',
    md: 'h-11 md:h-13',
    lg: 'h-14 md:h-18'
  };

  const logoSrc = getSafeImageSrc(settings.logoUrl || (typeof defaultLogoImg === 'string' ? defaultLogoImg : (defaultLogoImg as any).src), { width: 300 });

  return (
    <Link href="/" className={`inline-flex items-center transition-all group ${className}`} title={settings.storeName || 'Alvora Skincare'}>
      {/* Brand Logo Image Only with transparent background */}
      <img
        src={logoSrc}
        alt={settings.storeName || 'Alvora Skincare'}
        referrerPolicy="no-referrer"
        className={`${imageSizes[size]} w-auto object-contain bg-transparent transition-transform duration-300 group-hover:scale-105`}
      />
    </Link>
  );
};
