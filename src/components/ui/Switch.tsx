import React from 'react';

export const Switch: React.FC<{
  checked: boolean;
  onChange: (next: boolean) => void;
  className?: string;
  'aria-label'?: string;
}> = ({ checked, onChange, className = '', ...props }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    aria-label={props['aria-label']}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#9C4122] ${
      checked 
        ? 'bg-gradient-to-r from-[#9C4122] to-[#B34E28] hover:from-[#9C4122] hover:to-[#7A321A] text-white border-transparent shadow-sm' 
        : 'bg-slate-300 border border-slate-400 hover:border-slate-500 hover:bg-slate-400'
    } ${className}`}
  >
    <span 
      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-200 ${
        checked 
          ? 'left-6 shadow-sm' 
          : 'left-1 shadow-sm border border-slate-300'
      }`} 
    />
  </button>
);
