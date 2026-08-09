"use client";
import React from 'react';
import Link from 'next/link';
import { Construction, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-24 h-24 mb-6 rounded-full bg-amber-100 flex items-center justify-center border-4 border-amber-200">
        <Construction className="w-12 h-12 text-amber-500" />
      </div>
      <h1 className="font-heading font-black text-4xl text-slate-900 mb-4">
        Migration in Progress 🚧
      </h1>
      <p className="text-lg text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
        This page is currently being migrated to Next.js in Phase 2/3. It will be available shortly once the migration is complete!
      </p>
      <Link 
        href="/"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all hover:-translate-y-1 shadow-lg shadow-rose-200"
      >
        <ArrowLeft className="w-5 h-5" />
        Return to Homepage
      </Link>
    </div>
  );
}
