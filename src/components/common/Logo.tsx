"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: {
      brand: "text-[27px]",
      sub: "text-[6px]",
      spacing: "tracking-[0.42em]",
    },
    md: {
      brand: "text-[38px] md:text-[42px]",
      sub: "text-[7px]",
      spacing: "tracking-[0.48em]",
    },
    lg: {
      brand: "text-[46px] md:text-[52px]",
      sub: "text-[8px]",
      spacing: "tracking-[0.5em]",
    },
  };

  const current = sizes[size];

  return (
    <Link
      href="/"
      aria-label="ALVORA Skincare"
      className={`
        group
        inline-flex
        flex-col
        items-center
        justify-center
        leading-none
        text-[#241916]
        ${className}
      `}
    >
      <span
        className={`
          font-display
          ${current.brand}
          font-normal
          tracking-[0.075em]
          transition-colors
          duration-300
          group-hover:text-[#A86249]
        `}
      >
        ALVORA
      </span>

      <span
        className={`
          mt-[7px]
          ${current.sub}
          ${current.spacing}
          font-sans
          font-medium
          uppercase
          text-[#A86249]
        `}
      >
        SKINCARE
      </span>
    </Link>
  );
};