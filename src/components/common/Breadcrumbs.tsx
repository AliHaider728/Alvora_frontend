"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 px-1 my-2">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-medium text-slate-500">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-rose-50"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
              {isLast || !item.path ? (
                <span className="font-semibold text-slate-800 line-clamp-1 max-w-[200px] sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-rose-50 line-clamp-1"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
