"use client";
import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm animate-pulse">
      <div className="h-[200px] w-full shrink-0 bg-slate-200 sm:h-[216px]" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-2.5 w-1/3 rounded-full bg-slate-200" />
        <div className="h-4 w-3/4 rounded-full bg-slate-200" />
        <div className="h-3 w-1/2 rounded-full bg-slate-200" />
        <div className="mt-auto flex min-h-[72px] items-end justify-between border-t border-slate-100 pt-3">
          <div className="h-5 w-20 rounded-full bg-slate-200" />
          <div className="h-9 w-20 rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonDetail: React.FC = () => {
  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6 md:py-10 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-1/4 rounded-full bg-slate-200 mb-8" />
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column (Image) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-3xl bg-slate-200" />
          <div className="flex gap-4">
            <div className="h-20 w-20 rounded-xl bg-slate-200" />
            <div className="h-20 w-20 rounded-xl bg-slate-200" />
            <div className="h-20 w-20 rounded-xl bg-slate-200" />
          </div>
        </div>
        
        {/* Right Column (Info) */}
        <div className="lg:col-span-6 space-y-6 lg:py-8">
          <div className="space-y-4">
            <div className="h-4 w-1/3 rounded-full bg-slate-200" />
            <div className="h-10 w-3/4 rounded-xl bg-slate-200" />
            <div className="h-8 w-1/4 rounded-xl bg-slate-200" />
          </div>
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <div className="h-4 w-full rounded-full bg-slate-200" />
            <div className="h-4 w-5/6 rounded-full bg-slate-200" />
            <div className="h-4 w-4/6 rounded-full bg-slate-200" />
          </div>
          <div className="pt-8">
            <div className="h-14 w-full rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
