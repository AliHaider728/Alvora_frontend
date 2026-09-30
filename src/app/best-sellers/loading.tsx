import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF6F2]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-8 h-8 border-4 border-[#9C4122] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-[#1A1A1A] text-sm tracking-widest font-bold uppercase">Loading...</div>
      </div>
    </div>
  );
}
