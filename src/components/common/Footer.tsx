import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Heart,
  Facebook,
  Instagram,
  Youtube,
  PackageSearch,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import Ballpit from '../Ballpit/Ballpit';

// Adjust this import path to wherever the transparent logo file lives in your project
import playBimbooLogo from '../../assets/images/playbimboo-logo.png';

export const Footer: React.FC = () => {
  const { settings } = useStore();
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
    <footer className="relative overflow-hidden bg-black pb-6 pt-10 font-sans text-slate-300 sm:pt-12">
      {/* Ballpit background animation — sits behind everything, doesn't block clicks */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-30" aria-hidden="true">
        <Ballpit
          count={60}
          gravity={0}
          friction={0.998}
          wallBounce={0.95}
          followCursor={false}
          colors={[0xffffff, 0x8b5cf6, 0x18181b]} /* white -> vivid violet -> near-black, high contrast like the React Bits demo */
          materialParams={{ metalness: 0.15, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.1 }}
          minSize={0.35}
          maxSize={0.7}
          size0={0.5}
          ambientIntensity={1.4}
          lightIntensity={300}
        />
      </div>

      {/* Light dark overlay — just enough to keep text readable without hiding the balls */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/70 to-black/85" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Newsletter Banner */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-amber-500 to-sky-500 p-5 text-white shadow-xl sm:p-7">
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h3 className="font-heading font-black text-2xl sm:text-3xl mb-2 text-white drop-shadow-sm">
                Join the Play Bimboo Fun Club! 🎉
              </h3>
              <p className="text-white/90 text-sm font-medium">
                Subscribe to get exclusive secret sales, early toy drops, and a{' '}
                <strong className="underline decoration-white/70 underline-offset-2">15% OFF coupon</strong> instantly!
              </p>
            </div>

            <div className="w-full lg:w-auto lg:min-w-[420px]">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="px-5 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-white/40 flex-1 shadow-inner"
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
                <div role="status" aria-live="polite" className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-900/40 p-2.5 text-xs font-bold text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Yay! Check your inbox for your 15% OFF coupon code!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Grid: Brand / Customer Care / Connect */}
        <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-8 md:grid-cols-3 md:gap-10">

          {/* Column 1: Store Bio */}
          <div className="space-y-5">
            <img
              src={playBimbooLogo}
              alt="Play Bimboo"
              className="h-14 w-auto object-contain"
            />
            <p className="max-w-sm text-sm font-medium leading-relaxed text-white/80">
              Play Bimboo is your magical destination for premium, non-toxic toys, creative STEM kits, action figures, and family board games. Inspiring young minds to explore, imagine, and grow!
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-rose-500 hover:to-amber-500 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-rose-500 hover:to-amber-500 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-rose-500 hover:to-amber-500 flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Customer Care */}
          <div>
            <h4 className="font-heading font-bold text-white text-base uppercase tracking-wider mb-5">
              Customer Care
            </h4>
            <ul className="space-y-3 text-sm font-medium text-white/80">
              <li>
                <Link to="/about" className="hover:text-rose-400 transition-colors relative group inline-block">
                  About Us
                  <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-rose-400 transition-all group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-rose-400 transition-colors relative group inline-block">
                  Contact Us
                  <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-rose-400 transition-all group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-rose-400 transition-colors relative group inline-block">
                  Frequently Asked Questions
                  <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-rose-400 transition-all group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-rose-400 transition-colors relative group inline-block">
                  Saved Wishlist
                  <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-rose-400 transition-all group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-rose-400 transition-colors relative group inline-block">
                  Privacy Policy
                  <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-rose-400 transition-all group-hover:w-full" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact + Account */}
          <div className="space-y-6">
            <div>
              <h4 className="font-heading font-bold text-white text-base uppercase tracking-wider mb-5">
                Get In Touch
              </h4>
              <div className="space-y-3 text-sm font-medium text-white/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  </span>
                  <span>Mumtaz Market, Shafique Center, Gujranwala, Pakistan</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <a href="tel:3276655557" className="hover:text-amber-400 transition-colors">
                    +327-6655557
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                  </span>
                  <a href="mailto:sales@playbimboo.com" className="hover:text-sky-400 transition-colors">
                    sales@playbimboo.com
                  </a>
                </div>
              </div>
            </div>

            <Link
              to="/account"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white font-heading font-bold text-xs shadow-md transition-opacity"
            >
              <PackageSearch className="w-3.5 h-3.5" />
              Track Order & Account
            </Link>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p className="flex items-center gap-1.5 text-center md:text-left">
            &copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved. Crafted with{' '}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for playful kids worldwide.
          </p>

          {/* Credit */}
          <p className="text-sm text-white/60">
            Design and developed by{' '}
            <span className="font-heading font-bold text-white/90">Tecnosphere</span>
          </p>
        </div>  
      </div>
    </footer>
  );
};
