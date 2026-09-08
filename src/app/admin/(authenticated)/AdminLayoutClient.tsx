"use client";
import React, { useEffect } from 'react';
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  BarChart3,
  Settings,
  Palette,
  LogOut,
  ExternalLink,
  Bell,
  MessageSquare,
  Mail,
  Menu,
  X as CloseIcon,
  Mic,
  Gift
} from 'lucide-react';
import { getAuthToken, removeAuthToken, api, isSuperAdmin } from '../../../services/api';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = usePathname();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const token = getAuthToken();

  useEffect(() => {
    if (!token) {
      router.replace('/admin/login');
    }
  }, [token, router]);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Attributes', path: '/admin/attributes', icon: Settings },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { label: 'Voice Reviews', path: '/admin/audio-reviews', icon: Mic },
    { label: 'Contact Messages', path: '/admin/contact-messages', icon: Mail },
    { label: 'Bundles', path: '/admin/bundles', icon: Gift },
    { label: 'Coupons & Deals', path: '/admin/coupons', icon: Tag },
    { label: 'Sales Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings },
    ...(isSuperAdmin() ? [{ label: 'Store Appearance', path: '/admin/store-appearance', icon: Palette }] : []),
  ];

  const handleSignOut = async () => {
    await api.logout();
    removeAuthToken();
    localStorage.removeItem('alvora_admin_user');
    router.push('/admin/login');
  };

  if (!mounted) {
    return null;
  }

  if (!token) {
    return null;
  }

  return (
    <div className="admin-shell min-h-screen bg-[#FAF6F2] font-sans text-[#1A1A1A] flex">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#F5EDE4] text-[#1A1A1A]/70 flex flex-col justify-between p-4 border-r border-[#E7D9D0] transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          {/* Logo Header */}
          <div className="flex items-center justify-between pb-6 pt-2 px-2 border-b border-[#E7D9D0] mb-4">
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#C48B80] text-white font-black">
                PB
              </div>
              <div>
                <span className="font-heading font-black text-[#1A1A1A] text-base block leading-tight">
                  Alvora Skincare
                </span>
                <span className="text-[10px] text-[#1A1A1A]/50 uppercase font-bold tracking-wider">
                  Admin Control
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-[#C48B80] text-white shadow-md'
                      : 'text-[#1A1A1A]/70 hover:bg-white hover:text-[#1A1A1A]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-[#E7D9D0] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white text-[#1A1A1A] text-xs font-bold hover:bg-[#FAF6F2] border border-[#E7D9D0] transition-colors"
          >
            <span>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C48B80]" />
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Manager</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#E7D9D0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 rounded-xl text-[#1A1A1A]/70 hover:bg-[#FAF6F2]"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-heading font-extrabold text-sm text-[#1A1A1A]">
              {navItems.find(i => i.path === pathname)?.label || 'Admin Management'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-[#FAF6F2] text-[#1A1A1A]/70">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C48B80]" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-[#E7D9D0]">
              <div className="w-8 h-8 rounded-full bg-[#C48B80] text-white flex items-center justify-center font-bold text-xs">
                PB
              </div>
              <div className="hidden sm:block">
                <span className="font-heading font-bold text-xs text-[#1A1A1A] block leading-tight">
                  Alvora Skincare Manager
                </span>
                <span className="text-[10px] text-[#1A1A1A]/50 font-medium">admin@alvora.pk</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};



