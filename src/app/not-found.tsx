"use client";
import React from 'react';
import Link from "next/link";
import { Search, Home } from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F2] font-sans flex flex-col items-center justify-center p-4">
      <SeoHead title="404 - Page Not Found" />

      <div className="bg-white max-w-lg w-full text-center p-12 shadow-sm border border-[#EDE5DC]">
        <div className="w-20 h-20 bg-[#F5EDE4] rounded-full flex items-center justify-center mx-auto mb-8">
          <Search className="w-8 h-8 text-[#C48B80]" />
        </div>
        
        <h1 className="font-display text-4xl text-[#1A1A1A] mb-4">404</h1>
        <h2 className="text-xl text-[#4D3D2D] font-medium mb-4">Oops! Page Not Found</h2>
        
        <p className="text-sm text-[#4D3D2D]/80 mb-10 leading-relaxed">
          The page or product you are looking for could not be found. Let's get you back on track.
        </p>

        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2 px-8 py-4"
        >
          <Home className="w-4 h-4" />
          <span>BACK TO HOMEPAGE</span>
        </Link>
      </div>
    </div>
  );
}
