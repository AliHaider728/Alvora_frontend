import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle2, Heart } from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { categories, settings } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 font-sans border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Banner */}
        <div className="bg-gradient-to-r from-rose-500 via-amber-500 to-sky-500 rounded-3xl p-6 sm:p-10 mb-16 shadow-2xl text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h3 className="font-heading font-black text-2xl sm:text-3xl mb-2 text-white">
              Join the ToyLand Fun Club!
            </h3>
            <p className="text-white/90 text-sm mb-6 font-medium">
              Subscribe to get exclusive secret sales, early toy drops, and a <strong className="underline">15% OFF coupon</strong> instantly!
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className="px-5 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-white/40 flex-1"
              />
              <button
                type="submit"
                className="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            {subscribed && (
              <div className="flex items-center gap-2 mt-3 text-emerald-100 font-bold text-xs bg-emerald-900/40 p-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Yay! Check your inbox for your 15% OFF coupon code!</span>
              </div>
            )}
          </div>
        </div>

        {/* 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Store Bio & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" size="lg" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              ToyLand is your magical destination for premium, non-toxic toys, creative STEM kits, action figures, and family board games. Inspiring young minds to explore, imagine, and grow!
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Shop Categories */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-rose-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/category/all" className="text-amber-400 font-bold hover:underline">
                  View All Toys &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-rose-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-rose-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-rose-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-rose-400 transition-colors">
                  Track Order & Account
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-rose-400 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Admin Quick Access & Safety */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Store Manager
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Store administrators can manage inventory, orders, and sales reports.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-heading font-bold text-xs border border-slate-700 transition-colors"
            >
              Go to Admin Panel
            </Link>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved. Crafted with{' '}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for playful kids worldwide.
          </p>

          {/* Payment Badges */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-slate-400">Guaranteed Safe Checkout:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-800 rounded font-mono font-bold text-[10px] text-slate-300">
                VISA
              </span>
              <span className="px-2 py-1 bg-slate-800 rounded font-mono font-bold text-[10px] text-slate-300">
                MC
              </span>
              <span className="px-2 py-1 bg-slate-800 rounded font-mono font-bold text-[10px] text-slate-300">
                AMEX
              </span>
              <span className="px-2 py-1 bg-slate-800 rounded font-mono font-bold text-[10px] text-slate-300">
                PAYPAL
              </span>
              <span className="px-2 py-1 bg-slate-800 rounded font-mono font-bold text-[10px] text-slate-300">
                APPLE PAY
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
