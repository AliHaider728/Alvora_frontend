"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-[120px] h-[35px]",
    md: "w-[160px] md:w-[190px] h-[45px] md:h-[55px]",
    lg: "w-[200px] md:w-[240px] h-[60px] md:h-[70px]",
  };

  return (
    <Link
      href="/"
      aria-label="ALVORA Skincare"
      className={`relative inline-block ${sizeClasses[size]} ${className}`}
    >
      <Image 
        src="/images/logo.png" 
        alt="Alvora Skincare"
        fill
        className="object-contain object-center transition-opacity duration-300 hover:opacity-80"
        priority
      />
    </Link>
  );
};