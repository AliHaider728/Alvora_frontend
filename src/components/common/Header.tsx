"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Heart, User, X, Menu } from "lucide-react";

import { Logo } from "./Logo";
import { useStore } from "../../context/StoreContext";
import { formatPrice } from "../../utils/formatters";
import { isProductVisibleOnStorefront } from "../../utils/products";
import { getSafeImageSrc } from "../../utils/images";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Shop", href: "/category/all" },
  { label: "Best Sellers", href: "/category/all?sort=bestseller" },
  { label: "Skincare", href: "/category/all" },
  { label: "About", href: "/about" },
];

export const Header: React.FC = () => {
  const { cartTotalItems, wishlist, setIsCartOpen, products, settings } = useStore();
  const { isLoggedIn, openAuthModal } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Measure header height
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeight = () => setHeaderHeight(header.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);

    return () => observer.disconnect();
  }, [searchOpen]);

  // Scroll state
  useEffect(() => {
    let lastScroll = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 8);
      
      if (currentScrollY <= 80) {
        setIsVisible(true);
      } else {
        setIsVisible(currentScrollY < lastScroll);
      }
      lastScroll = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search focus
  useEffect(() => {
    if (searchOpen) {
      const timer = window.setTimeout(() => searchInputRef.current?.focus(), 80);
      return () => window.clearTimeout(timer);
    }
    setSearchQuery("");
  }, [searchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Lock body while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Search results
  const searchResults = searchQuery.trim()
    ? products
        .filter((product) => {
          if (!isProductVisibleOnStorefront(product)) return false;
          const query = searchQuery.toLowerCase();
          return (
            product.name.toLowerCase().includes(query) ||
            product.category?.toLowerCase().includes(query) ||
            product.tags?.some((tag) => tag.toLowerCase().includes(query))
          );
        })
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      {/* FIXED HEADER */}
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 bg-alvora-ivory text-[#241916] transition-all duration-300 ease-in-out ${isScrolled ? "shadow-[0_4px_24px_rgba(36,25,22,0.06)]" : ""} ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        {/* SHIPPING BAR */}
        <div className="flex min-h-8 items-center justify-center bg-[#C87355] px-4 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-white sm:min-h-8.5 sm:text-xs">
          FREE SHIPPING ON ORDERS OVER {settings?.freeShippingThreshold ? formatPrice(settings.freeShippingThreshold, settings.currency) : 'RS. 5,000'}
          <span className="mx-2 opacity-60">•</span>
          30-DAY RETURNS
          <span className="mx-2 hidden opacity-60 sm:inline">•</span>
          <span className="hidden sm:inline">SAMPLES WITH EVERY ORDER</span>
        </div>

        {/* MAIN NAVIGATION */}
        <div className="mx-auto w-full max-w-375 px-5 sm:px-8 lg:px-12">
          <div className="relative flex h-19 items-center justify-between lg:h-21">
            {/* LEFT NAVIGATION */}
            <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex xl:gap-9">
              {NAV_LINKS.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="relative text-[13px] font-medium uppercase tracking-[0.11em] text-[#2A211E] transition-colors duration-200 hover:text-[#A86249] after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-[#A86249] after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="rounded-full p-2 text-[#241916] transition-colors hover:bg-[#F2E7DF] lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.4} />
            </button>

            {/* CENTER LOGO */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Logo size="md" className="block" />
            </div>

            {/* RIGHT ACTIONS */}
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                type="button"
                onClick={() => setSearchOpen((value) => !value)}
                aria-label="Search"
                className="rounded-full p-2 text-[#241916] transition-colors hover:bg-[#F2E7DF] hover:text-[#A86249]"
              >
                <Search className="h-4.75 w-4.75" strokeWidth={1.35} />
              </button>

              {/* Account */}
              {isLoggedIn ? (
                <Link
                  href="/account"
                  aria-label="My account"
                  className="hidden rounded-full p-2 text-[#241916] transition-colors hover:bg-[#F2E7DF] hover:text-[#A86249] sm:flex"
                >
                  <User className="h-4.75 w-4.75" strokeWidth={1.35} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  aria-label="Sign in"
                  className="hidden rounded-full p-2 text-[#241916] transition-colors hover:bg-[#F2E7DF] hover:text-[#A86249] sm:flex"
                >
                  <User className="h-4.75 w-4.75" strokeWidth={1.35} />
                </button>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative hidden rounded-full p-2 text-[#241916] transition-colors hover:bg-[#F2E7DF] hover:text-[#A86249] sm:flex"
              >
                <Heart className="h-4.75 w-4.75" strokeWidth={1.35} />
                {mounted && wishlist.length > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C87355] px-1 text-[9px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Shopping bag, ${mounted ? cartTotalItems : 0} items`}
                className="relative rounded-full p-2 text-[#241916] transition-colors hover:bg-[#F2E7DF] hover:text-[#A86249]"
              >
                <ShoppingBag className="h-4.75 w-4.75" strokeWidth={1.35} />
                {mounted && cartTotalItems > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C87355] px-1 text-[9px] font-bold text-white">
                    {cartTotalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH PANEL */}
        {searchOpen && (
          <div ref={searchRef} className="border-t border-[#E7D9D0] bg-alvora-ivory px-5 py-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-375">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A8177]" strokeWidth={1.5} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search skincare products..."
                  className="h-12 w-full border border-[#E2D2C9] bg-white pl-11 pr-12 text-sm text-[#241916] outline-none transition-colors placeholder:text-[#AA958B] focus:border-[#C87355]"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#806960] hover:bg-[#F2E7DF]"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </form>

              {searchResults.length > 0 && (
                <div className="mt-3 overflow-hidden border border-[#E2D2C9] bg-white">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 border-b border-[#EEE3DC] px-4 py-3 last:border-b-0 hover:bg-alvora-ivory"
                    >
                      <img
                        src={getSafeImageSrc(product.images?.[0])}
                        alt={product.name}
                        className="h-11 w-11 shrink-0 bg-alvora-cream object-cover"
                      />   
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#241916]">{product.name}</p>
                        <p className="mt-0.5 text-xs text-[#998279]">{product.category}</p>
                      </div>
                      <span className="shrink-0 text-sm font-medium text-[#A86249]">
                        {formatPrice(product.price, settings?.currency || "Rs.")}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {searchQuery.trim() && searchResults.length === 0 && (
                <p className="py-4 text-center text-sm text-[#998279]">No products found for &ldquo;{searchQuery}&rdquo;</p>
              )}
            </div>
          </div>
        )}
      </header>

      {/* HEADER SPACER — keeps the hero below the fixed header */}
      <div style={{ height: headerHeight }} aria-hidden="true" />

      {/* MOBILE DRAWER BACKDROP */}
      <div
        className={`fixed inset-0 z-60 bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* MOBILE DRAWER */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed right-0 top-0 z-61 flex h-full w-[320px] max-w-[88vw] flex-col bg-alvora-ivory shadow-2xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-[#E7D9D0] px-6 py-5">
          <Logo size="sm" />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="rounded-full p-2 text-[#241916] hover:bg-[#F2E7DF]"
          >
            <X className="h-5 w-5" strokeWidth={1.4} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex border-b border-[#E7D9D0] py-4 text-sm font-medium uppercase tracking-widest text-[#241916]"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/wishlist"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between border-b border-[#E7D9D0] py-4 text-sm font-medium uppercase tracking-widest text-[#241916]"
          >
            Wishlist
            {mounted && wishlist.length > 0 && (
              <span className="rounded-full bg-[#C87355] px-2 py-0.5 text-[10px] font-bold text-white">{wishlist.length}</span>
            )}
          </Link>

          {isLoggedIn ? (
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="flex border-b border-[#E7D9D0] py-4 text-sm font-medium uppercase tracking-widest text-[#241916]"
            >
              My Account
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openAuthModal("login");
              }}
              className="flex w-full border-b border-[#E7D9D0] py-4 text-left text-sm font-medium uppercase tracking-widest text-[#241916]"
            >
              Sign In / Register
            </button>
          )}
        </nav>

        <div className="border-t border-[#E7D9D0] p-6">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              setIsCartOpen(true);
            }}
            className="flex h-12 w-full items-center justify-center gap-2 bg-[#A86249] text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#8E4D39]"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.4} />
            View Bag
            {mounted && cartTotalItems > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-[#A86249]">
                {cartTotalItems}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};