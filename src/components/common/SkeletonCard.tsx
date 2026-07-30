import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm animate-pulse flex flex-col gap-3">
      <div className="aspect-square w-full rounded-2xl bg-slate-200"></div>
      <div className="h-3 w-1/3 bg-slate-200 rounded-full"></div>
      <div className="h-4 w-3/4 bg-slate-200 rounded-full"></div>
      <div className="h-3 w-1/2 bg-slate-200 rounded-full"></div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
        <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
        <div className="h-8 w-20 bg-slate-200 rounded-2xl"></div>
      </div>
    </div>
  );
};
