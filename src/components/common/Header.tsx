"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, X, Menu } from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';
import { isProductVisibleOnStorefront } from '../../utils/products';
import { getSafeImageSrc } from '../../utils/images';
import { useAuth } from '../../context/AuthContext';

/* ─────────────────────────────────────────────
   ALVORA — Primary Navigation
   Design reference: minimal ivory bar, logo left,
   links center, icons right.
   ───────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Shop',         href: '/category/all' },
  { label: 'Best Sellers', href: '/category/all?sort=bestseller' },
  { label: 'Skincare',     href: '/category/all' },
  { label: 'About',        href: '/about' },
];

export const Header: React.FC = () => {
  const { cartTotalItems, wishlist, setIsCartOpen, products, settings } = useStore();
  const { isLoggedIn, openAuthModal } = useAuth();
  const router = useRouter();

  // Hydration guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll behaviour
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 10);
      setHideHeader(y > lastScrollY.current && y > 120);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Open search → focus input
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Search results
  const searchResults = searchQuery.trim()
    ? products
        .filter(p =>
          isProductVisibleOnStorefront(p) && (
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        )
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div
        className="w-full overflow-hidden bg-[#FAF6F2] border-b border-[#EDE5DC] py-2 text-[#4D3D2D]"
        aria-label="Store announcements"
      >
        <div className="flex whitespace-nowrap alvora-marquee-track w-max">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-8">
              <span className="text-xs font-semibold tracking-wide">
                ✦&nbsp; Free Shipping All Over Pakistan
              </span>
              <span className="text-[#C48B80]">·</span>
              <span className="text-xs font-semibold tracking-wide">
                ✦&nbsp; Cash on Delivery Nationwide
              </span>
              <span className="text-[#C48B80]">·</span>
              <span className="text-xs font-semibold tracking-wide">
                ✦&nbsp; Clean Ingredients &nbsp;·&nbsp; Dermatologically Tested
              </span>
              <span className="text-[#C48B80]">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Header ── */}
      <header
        className={`
          sticky top-0 z-50 w-full bg-[#FAF6F2] border-b border-[#EDE5DC]
          transition-transform duration-300 ease-out
          ${hideHeader ? '-translate-y-full' : 'translate-y-0'}
          ${isScrolled ? 'shadow-[0_1px_12px_0_rgb(0_0_0_/_0.05)]' : ''}
        `}
      >
        <div className="alvora-container">
          <div className="flex items-center justify-between h-16 md:h-18 gap-4">

            {/* Logo */}
            <Logo size="md" className="flex-shrink-0" />

            {/* Desktop Nav — centered */}
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label="Primary navigation"
            >
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="
                    font-body text-sm font-semibold tracking-wide
                    text-[#1A1A1A] hover:text-[#C48B80]
                    transition-colors duration-200
                    relative after:absolute after:bottom-[-3px] after:left-0
                    after:h-px after:w-0 after:bg-[#C48B80]
                    after:transition-[width] after:duration-250
                    hover:after:w-full
                  "
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right — Icons */}
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">

              {/* Search icon */}
              <button
                onClick={() => setSearchOpen(v => !v)}
                aria-label="Search"
                className="
                  p-2 rounded-full text-[#1A1A1A] hover:text-[#C48B80]
                  hover:bg-[#F5EDE4] transition-colors duration-200
                "
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account */}
              {isLoggedIn ? (
                <Link
                  href="/account"
                  aria-label="My Account"
                  className="
                    hidden sm:flex p-2 rounded-full text-[#1A1A1A]
                    hover:text-[#C48B80] hover:bg-[#F5EDE4] transition-colors
                  "
                >
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  aria-label="Sign In"
                  className="
                    hidden sm:flex p-2 rounded-full text-[#1A1A1A]
                    hover:text-[#C48B80] hover:bg-[#F5EDE4] transition-colors
                  "
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="
                  hidden sm:flex relative p-2 rounded-full text-[#1A1A1A]
                  hover:text-[#C48B80] hover:bg-[#F5EDE4] transition-colors
                "
              >
                <Heart className="w-5 h-5" />
                {mounted && wishlist.length > 0 && (
                  <span className="
                    absolute top-0.5 right-0.5 w-4 h-4 rounded-full
                    bg-[#C48B80] text-white text-[9px] font-bold
                    flex items-center justify-center
                  ">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label={`Cart, ${mounted ? cartTotalItems : 0} items`}
                className="
                  relative flex items-center gap-2 px-4 py-2
                  bg-[#C48B80] hover:bg-[#4D3D2D] text-white
                  text-sm font-semibold tracking-wide
                  transition-colors duration-200
                "
              >
                <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Bag</span>
                {mounted && cartTotalItems > 0 && (
                  <span
                    key={cartTotalItems}
                    className="cart-count-pop inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#C48B80] text-[10px] font-bold"
                  >
                    {cartTotalItems}
                  </span>
                )}
              </button>

              {/* Mobile burger */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="
                  lg:hidden p-2 rounded-full text-[#1A1A1A]
                  hover:bg-[#F5EDE4] transition-colors
                "
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Search Overlay ── */}
        {searchOpen && (
          <div
            ref={searchRef}
            className="border-t border-[#EDE5DC] bg-[#FAF6F2] py-4"
          >
            <div className="alvora-container">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-[#A1A7AA] pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search skincare products…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="
                    w-full pl-11 pr-12 py-3
                    bg-white border border-[#EDE5DC]
                    focus:border-[#C48B80] focus:ring-2 focus:ring-[#C48B80]/15
                    text-sm text-[#1A1A1A] placeholder-[#A1A7AA]
                    outline-none transition-all
                  "
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="absolute right-4 text-[#A1A7AA] hover:text-[#1A1A1A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>

              {/* Live Results */}
              {searchResults.length > 0 && (
                <div className="mt-3 bg-white border border-[#EDE5DC] shadow-lg">
                  {searchResults.map(prod => (
                    <Link
                      key={prod.id}
                      href={`/product/${prod.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#FAF6F2] transition-colors border-b border-[#EDE5DC] last:border-0"
                    >
                      <img
                        src={getSafeImageSrc(prod.images?.[0])}
                        alt={prod.name}
                        className="w-10 h-10 object-cover flex-shrink-0 bg-[#F5EDE4]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A1A1A] truncate">{prod.name}</p>
                        <p className="text-xs text-[#A1A7AA]">{prod.category}</p>
                      </div>
                      <span className="text-sm font-bold text-[#C48B80] flex-shrink-0">
                        {formatPrice(prod.price, settings?.currency || 'Rs.')}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
              {searchQuery.trim() && searchResults.length === 0 && (
                <p className="mt-3 text-sm text-[#A1A7AA] text-center py-2">
                  No products found for &ldquo;{searchQuery}&rdquo;
                </p>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile Drawer ── */}
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300
          ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`
          fixed top-0 right-0 h-full w-80 max-w-[90vw] z-[61]
          bg-[#FAF6F2] shadow-2xl flex flex-col
          transition-transform duration-300 ease-out
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EDE5DC]">
          <Logo size="sm" />
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="p-2 text-[#1A1A1A] hover:text-[#C48B80] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href + link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="
                py-3 text-base font-semibold text-[#1A1A1A]
                border-b border-[#EDE5DC] hover:text-[#C48B80]
                transition-colors
              "
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/wishlist"
            onClick={() => setMobileOpen(false)}
            className="py-3 text-base font-semibold text-[#1A1A1A] border-b border-[#EDE5DC] hover:text-[#C48B80] transition-colors flex items-center justify-between"
          >
            <span>Wishlist</span>
            {mounted && wishlist.length > 0 && (
              <span className="text-xs font-bold bg-[#C48B80] text-white px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          {isLoggedIn ? (
            <Link href="/account" onClick={() => setMobileOpen(false)} className="py-3 text-base font-semibold text-[#1A1A1A] hover:text-[#C48B80] transition-colors">
              My Account
            </Link>
          ) : (
            <button
              onClick={() => { setMobileOpen(false); openAuthModal('login'); }}
              className="py-3 text-base font-semibold text-[#1A1A1A] hover:text-[#C48B80] transition-colors text-left"
            >
              Sign In / Register
            </button>
          )}
        </nav>

        {/* Drawer CTA */}
        <div className="px-6 pb-8 pt-4 border-t border-[#EDE5DC]">
          <button
            onClick={() => { setMobileOpen(false); setIsCartOpen(true); }}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            View Bag
            {mounted && cartTotalItems > 0 && (
              <span className="bg-white text-[#C48B80] rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center">
                {cartTotalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
