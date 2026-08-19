"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import alvoraLogoOfficial from '../../assets/images/alvora-logo-official.png';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'footer';
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { height: 36, className: 'h-9' },
  md: { height: 44, className: 'h-11' },
  lg: { height: 56, className: 'h-14' },
};

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'dark', size = 'md' }) => {
  const { height, className: sizeClass } = sizeMap[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center transition-opacity hover:opacity-80 ${className}`}
      title="Alvora Skincare — Home"
    >
      <Image
        src={alvoraLogoOfficial}
        alt="Alvora Skincare"
        height={height}
        width={height * 2.2} /* aspect ratio ~2.2:1 for the logo */
        className={`${sizeClass} w-auto object-contain`}
        priority
        style={{
          /* On ivory/peach backgrounds the logo reads well naturally.
             On dark footer, we add a slight brightness boost. */
          filter: variant === 'light' ? 'brightness(0) invert(1)' : 'none',
        }}
      />
    </Link>
  );
};
