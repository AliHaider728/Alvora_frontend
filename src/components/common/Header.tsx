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

export const Header: React.FC = () => {
  const { cartTotalItems, wishlist, setIsCartOpen, products, categories, settings } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Filter search autosuggest results
  const searchResults = searchQuery.trim()
    ? products
        .filter(p =>
          p.isVisible !== false && (
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-sky-500 text-white text-xs sm:text-sm font-bold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-yellow-200" />
        <span>🎁 FREE Express Shipping on orders over {formatPrice(settings.freeShippingThreshold || 5000, settings.currency)}! Cash on Delivery (COD) Nationwide</span>
        <span className="hidden md:inline-block ml-4 text-xs font-normal opacity-90 border-l border-white/30 pl-3">
          Support: {settings.phone}
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo Component */}
          <div className="flex-shrink-0">
            <Logo size="lg" />
          </div>

          {/* Search Bar with Autosuggest */}
          <div ref={searchRef} className="flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search toys..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-9 pr-8 md:pl-11 md:pr-10 py-2 md:py-3 bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-rose-400 rounded-full text-xs md:text-sm font-medium text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-rose-100 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-3 md:left-4 top-2.5 md:top-3.5 pointer-events-none" />
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
          <div className="flex items-center gap-1.5 sm:gap-4 flex-shrink-0">
            {/* Admin Dashboard Button */}
            <Link
              to="/admin"
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-sm transition-colors shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Admin Panel</span>
            </Link>

            {/* Account / User */}
            <Link
              to="/account"
              className="hidden sm:flex p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors items-center justify-center"
              title="My Account"
            >
              <User className="w-6 h-6" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden sm:flex relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors items-center justify-center"
              title="Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200 transition-all duration-200 active:scale-95 text-xs md:text-sm"
            >
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline font-heading font-bold">Cart</span>
              {cartTotalItems > 0 && (
                <span className="px-2 py-0.5 text-[10px] md:text-xs font-heading font-black bg-white text-rose-600 rounded-full">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Category Navigation Bar */}
        <nav className="hidden md:flex items-center justify-between border-t border-slate-100 py-3 text-sm font-heading font-bold text-slate-700">
          <div className="flex items-center gap-7">
            <Link to="/" className="hover:text-rose-500 transition-colors">
              Home
            </Link>

            {/* Category Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1.5 hover:text-rose-500 transition-colors py-1"
              >
                <span>Shop Categories</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 hidden group-hover:block z-50">
                <Link
                  to="/category/all"
                  className="block px-3.5 py-2.5 rounded-xl text-slate-800 hover:bg-rose-50 font-bold text-sm"
                >
                  All Toys & Games
                </Link>
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="block px-3.5 py-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors font-semibold text-sm"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/category/building-sets" className="hover:text-rose-500 transition-colors">
              Building Sets
            </Link>
            <Link to="/category/action-figures" className="hover:text-rose-500 transition-colors">
              Action Figures
            </Link>
            <Link to="/category/educational-stem" className="hover:text-rose-500 transition-colors">
              STEM & Learning
            </Link>
            <Link to="/about" className="hover:text-rose-500 transition-colors">
              About Us
            </Link>
            <Link to="/faq" className="hover:text-rose-500 transition-colors">
              FAQs
            </Link>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-sm font-semibold">
            <Link to="/contact" className="hover:text-rose-500 transition-colors">
              Contact Us
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

