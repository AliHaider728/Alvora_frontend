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
