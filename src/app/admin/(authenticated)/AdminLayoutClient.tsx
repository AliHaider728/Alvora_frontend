"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
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
  Gift,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getAuthToken, removeAuthToken, api, isSuperAdmin } from '../../../services/api';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [adminUser, setAdminUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem('alvora_admin_user');
    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch(e) {}
    }
    const savedCollapsed = localStorage.getItem('alvora_admin_sidebar_collapsed');
    if (savedCollapsed === 'true') {
      setCollapsed(true);
    }
  }, []);

  const token = getAuthToken();

  useEffect(() => {
    if (!token) {
      router.replace('/admin/login');
    }
  }, [token, router]);

  const toggleCollapse = () => {
    const newVal = !collapsed;
    setCollapsed(newVal);
    localStorage.setItem('alvora_admin_sidebar_collapsed', String(newVal));
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Best Sellers', path: '/admin/best-sellers', icon: Star },
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
    { label: 'Routine Discounts', path: '/admin/routine-discounts', icon: Gift },
    ...(isSuperAdmin() ? [{ label: 'Store Appearance', path: '/admin/store-appearance', icon: Palette }] : []),
  ];

  const handleSignOut = async () => {
    await api.logout();
    removeAuthToken();
    localStorage.removeItem('alvora_admin_user');
    router.push('/admin/login');
  };

  if (!mounted || !token) {
    return null;
  }

  const displayName = adminUser?.name || 'Alvora Skincare Manager';
  const displayEmail = adminUser?.email || 'admin@alvora.pk';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'AS';

  const sidebarWidth = collapsed ? 'w-64 lg:w-[72px]' : 'w-64';
  const mainMargin = collapsed ? 'lg:ml-[72px]' : 'lg:ml-64';

  return (
    <div className="admin-shell min-h-screen bg-[#FAF6F2] font-body text-[#1A1A1A] flex">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 ${sidebarWidth} bg-[#F5EDE4] text-[#1A1A1A]/70 flex flex-col justify-between p-4 border-r border-[#E7D9D0] transition-all duration-300 ease-in-out lg:translate-x-0 overflow-visible ${mobileMenuOpen ? 'translate-x-0 overflow-y-auto' : '-translate-x-full'}`}>
        <div>
          {/* Logo Header */}
          <div className="flex items-center justify-center pb-6 pt-2 px-2 border-b border-[#E7D9D0] mb-4 relative">
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className={`block relative w-[140px] h-[40px] ${collapsed ? 'lg:hidden' : ''}`}>
              <Image src="/images/logo.png" alt="Alvora Skincare" fill className="object-contain" priority />
            </Link>
            
            {collapsed && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="hidden lg:flex items-center justify-center font-heading font-bold text-2xl text-[#9C4122] h-[40px]">
                A
              </Link>
            )}

            {/* Toggle Button */}
            <button 
              onClick={toggleCollapse} 
              className="hidden lg:flex absolute -right-7 top-2 bg-white border border-[#E7D9D0] text-[#1A1A1A]/70 rounded-full p-1 hover:bg-[#FAF6F2] transition-colors z-[60] shadow-sm"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 relative">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group relative flex items-center gap-3 ${collapsed ? 'lg:justify-center' : ''} px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-[#9C4122] to-[#B34E28] text-white shadow-md'
                      : 'text-[#1A1A1A]/70 hover:bg-white hover:text-[#1A1A1A]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className={`${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                  
                  {/* Tooltip */}
                  <div className={`hidden ${collapsed ? 'lg:group-hover:block' : 'hidden'} absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-[#1A1A1A] text-white text-xs font-medium rounded-md shadow-md whitespace-nowrap z-[70] pointer-events-none before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-[#1A1A1A]`}>
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-[#E7D9D0] space-y-2 relative">
          <Link
            href="/"
            target="_blank"
            className={`group relative flex items-center gap-3 ${collapsed ? 'lg:justify-center' : 'justify-between'} px-3.5 py-2.5 rounded-xl bg-white text-[#1A1A1A] text-xs font-bold hover:bg-[#FAF6F2] border border-[#E7D9D0] transition-colors`}
          >
            <span className={`${collapsed ? 'lg:hidden' : ''}`}>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C48B80] shrink-0" />
            
            <div className={`hidden ${collapsed ? 'lg:group-hover:block' : 'hidden'} absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-[#1A1A1A] text-white text-xs font-medium rounded-md shadow-md whitespace-nowrap z-[70] pointer-events-none before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-[#1A1A1A]`}>
              View Storefront
            </div>
          </Link>

          <button
            onClick={handleSignOut}
            className={`group relative w-full flex items-center gap-2 ${collapsed ? 'lg:justify-center' : ''} px-3.5 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className={`${collapsed ? 'lg:hidden' : ''}`}>Sign Out Manager</span>
            
            <div className={`hidden ${collapsed ? 'lg:group-hover:block' : 'hidden'} absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-[#1A1A1A] text-white text-xs font-medium rounded-md shadow-md whitespace-nowrap z-[70] pointer-events-none before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-[#1A1A1A]`}>
              Sign Out
            </div>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${mainMargin}`}>
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#E7D9D0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-all duration-300">
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
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gradient-to-r from-[#9C4122] to-[#B34E28] text-white shadow-sm" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-[#E7D9D0]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#9C4122] to-[#B34E28] text-white shadow-sm flex items-center justify-center font-bold text-xs">
                {initials}
              </div>
              <div className="hidden sm:block">
                <span className="font-heading font-bold text-xs text-[#1A1A1A] block leading-tight">
                  {displayName}
                </span>
                <span className="text-[10px] text-[#1A1A1A]/50 font-medium">{displayEmail}</span>
              </div>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="ml-1 p-2 rounded-full text-[#1A1A1A]/40 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-[18px] h-[18px]" />
              </button>
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
