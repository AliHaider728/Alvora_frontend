import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';
import { isProductVisibleOnStorefront } from '../../utils/products';
import { orderedVisibleNavigation } from '../../config/storeAppearance';

export const Header: React.FC = () => {
  const { cartTotalItems, wishlist, setIsCartOpen, products, categories, settings } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  
  // Smart Scroll state
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const desktopNavigation = orderedVisibleNavigation(settings, 'desktop');

  // Filter search autosuggest results
  const searchResults = searchQuery.trim()
    ? products
        .filter(p =>
          isProductVisibleOnStorefront(p) && (
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    // Smart Scroll logic
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsScrolledDown(true);
      } else if (currentScrollY < lastScrollY) {
        setIsScrolledDown(false);
      }
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ease-out border-b border-slate-100
        ${isScrolledDown ? '-translate-y-full' : 'translate-y-0'} 
        ${isScrolled ? 'bg-slate-50/80 backdrop-blur-lg shadow-sm' : 'bg-slate-50 shadow-xs'}`}
    >
      {/* Top Announcement Bar */}
      <div className="bg-white text-slate-600 text-xs sm:text-sm font-medium py-2 px-4 flex flex-col md:flex-row items-center justify-between max-w-[1560px] mx-auto border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span>🚀</span> Free Express Shipping on orders over {formatPrice(settings.freeShippingThreshold || 5000, settings.currency)}
          </span>
          <span className="hidden md:inline-block text-slate-300">|</span>
          <span className="hidden md:flex items-center gap-1.5">
            <span>💳</span> Cash on Delivery (COD) Nationwide
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-slate-500">
          <span className="text-amber-400">⭐</span> Rated 4.9/5 by 12,000+ happy parents
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <div className="bg-white rounded-b-3xl sm:rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 px-4 md:px-6 py-3 flex items-center justify-between gap-4 xl:gap-8 mt-0 sm:mt-4 mb-0 relative z-50">
          {/* Logo Component */}
          <div className="flex-shrink-0 mr-2 xl:mr-0">
            <Logo size="lg" />
          </div>

          {/* Consolidated Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-7 text-sm font-heading font-bold text-slate-600 flex-shrink-0">
            {desktopNavigation.map(item => item.key === 'categories' ? (
              <div key={item.key} className="relative group">
                <button
                  type="button"
                  disabled={!item.enabled}
                  aria-disabled={!item.enabled}
                  onClick={() => item.enabled && setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center gap-1.5 hover:text-rose-500 transition-colors py-1 disabled:cursor-not-allowed disabled:text-slate-300"
                  title={item.enabled ? undefined : 'Coming soon'}
                >
                  <span>{item.label}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {item.enabled && <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 hidden group-hover:block z-50">
                  <Link to="/category/all" className="block px-3.5 py-2.5 rounded-xl text-slate-800 hover:bg-rose-50 font-bold text-sm">
                    All Toys & Games
                  </Link>
                  {categories.map(cat => (
                    <Link key={cat.id} to={`/category/${cat.slug}`} className="block px-3.5 py-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors font-semibold text-sm">
                      {cat.name}
                    </Link>
                  ))}
                </div>}
              </div>
            ) : item.enabled ? (
              <Link key={item.key} to={item.path} className="hover:text-rose-500 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span key={item.key} aria-disabled="true" title="Coming soon" className="cursor-not-allowed text-slate-300">
                {item.label}
              </span>
            ))}
          </nav>

          {/* Search Bar with Autosuggest */}
          <div ref={searchRef} className="flex-1 max-w-[400px] xl:max-w-xl relative mx-auto hidden md:block">
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
              <Search className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search toys, sets, and more..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-11 pr-10 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-rose-300 rounded-full text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-rose-50 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 md:right-3.5 md:top-3 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              )}
            </form>

            {/* Live Search Autosuggest Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 overflow-hidden">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  Top Matching Toys
                </div>
                {searchResults.length === 0 ? (
                  <p className="text-sm text-slate-500 p-3 text-center">No matching toys found.</p>
                ) : (
                  <div className="space-y-1">
                    {searchResults.map(prod => (
                      <Link
                        key={prod.id}
                        to={`/product/${prod.slug}`}
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-rose-50/80 transition-colors"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg bg-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs md:text-sm font-heading font-bold text-slate-800 truncate">
                            {prod.name}
                          </h4>
                          <span className="text-[10px] md:text-xs text-sky-600 font-semibold">{prod.category}</span>
                        </div>
                        <span className="text-xs md:text-sm font-bold text-slate-900">{formatPrice(prod.price, settings.currency)}</span>
                      </Link>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center text-xs md:text-sm font-bold text-rose-500 hover:text-rose-600 py-2 pt-2 border-t border-slate-100 mt-1"
                    >
                      View all results for "{searchQuery}" &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions & Cart / Wishlist */}
          <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* Account / User */}
            <Link
              to="/account"
              className="hidden sm:flex items-center gap-2 group"
              title="My Account"
            >
              <div className="p-2 rounded-full bg-slate-50 group-hover:bg-rose-50 text-slate-600 transition-colors">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-heading font-bold text-slate-900 leading-tight">Account</span>
                <span className="text-[10px] font-medium text-slate-500 leading-tight">Sign in / Up</span>
              </div>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden xl:flex items-center gap-2 group"
              title="Wishlist"
            >
              <div className="relative p-2 rounded-full bg-slate-50 group-hover:bg-rose-50 text-slate-600 transition-colors">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="text-sm font-heading font-bold text-slate-900">Wishlist</span>
            </Link>

            {/* Cart Drawer Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white shadow-[0_4px_14px_rgba(225,29,72,0.3)] transition-all duration-200 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-heading font-bold text-sm">Cart ({cartTotalItems})</span>
            </button>
                     {/* Expanding Mobile Search Overlay */}
            {mobileSearchOpen && (
              <div className="absolute inset-0 bg-white z-[60] flex items-center px-4 gap-3 rounded-b-3xl sm:rounded-3xl shadow-sm animate-fade-in md:hidden">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <form onSubmit={(e) => {
                  handleSearchSubmit(e);
                  setMobileSearchOpen(false);
                }} className="flex-1">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search toys, sets..."
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      setIsSearchFocused(true);
                    }}
                    onFocus={() => setIsSearchFocused(true)}
                    className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700 placeholder-slate-400 py-3"
                  />
                </form>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => { setMobileSearchOpen(false); setSearchQuery(''); setIsSearchFocused(false); }} className="pl-2 text-xs font-bold text-slate-500 border-l border-slate-200">
                  Cancel
                </button>
                
                {/* Mobile Autosuggest Dropdown */}
                {isSearchFocused && searchQuery.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-[70] overflow-hidden">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                      Top Matching Toys
                    </div>
                    {searchResults.length === 0 ? (
                      <p className="text-sm text-slate-500 p-3 text-center">No matching toys found.</p>
                    ) : (
                      <div className="space-y-1">
                        {searchResults.map(prod => (
                          <Link
                            key={prod.id}
                            to={`/product/${prod.slug}`}
                            onClick={() => {
                              setIsSearchFocused(false);
                              setSearchQuery('');
                              setMobileSearchOpen(false);
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-rose-50/80 transition-colors"
                          >
                            <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 object-cover rounded-lg bg-slate-100" />
                            <div>
                              <div className="text-xs font-bold text-slate-800 line-clamp-1">{prod.name}</div>
                              <div className="text-[10px] text-slate-500">{formatPrice(prod.price, settings.currency)}</div>
                            </div>
                          </Link>
                        ))}
                        <button
                          onClick={(e) => {
                            handleSearchSubmit(e);
                            setMobileSearchOpen(false);
                          }}
                          className="w-full text-center text-xs font-bold text-rose-500 hover:text-rose-600 py-2 pt-2 border-t border-slate-100 mt-1"
                        >
                          View all results for "{searchQuery}" &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
