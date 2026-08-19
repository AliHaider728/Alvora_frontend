"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Send, CheckCircle2, Instagram, Facebook, Youtube } from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

/* ─────────────────────────────────────────────
   ALVORA — Footer
   Design reference: warm ivory/cream, logo top-left,
   multi-column links, newsletter, social icons, clean bottom bar.
   ───────────────────────────────────────────── */

const SHOP_LINKS = [
  { label: 'All Products',   href: '/category/all' },
  { label: 'Best Sellers',   href: '/category/all?sort=bestseller' },
  { label: 'Serums',         href: '/category/serums' },
  { label: 'Moisturizers',   href: '/category/moisturizers' },
  { label: 'Cleansers',      href: '/category/cleansers' },
  { label: 'Shop All',       href: '/category/all' },
];

const ABOUT_LINKS = [
  { label: 'Our Story',      href: '/about' },
  { label: 'Our Ingredients',href: '/about#ingredients' },
  { label: 'Sustainability', href: '/about#sustainability' },
  { label: 'Careers',        href: '/careers' },
  { label: 'Press',          href: '/press' },
];

const HELP_LINKS = [
  { label: 'FAQs',                href: '/faq' },
  { label: 'Shipping & Returns',  href: '/shipping' },
  { label: 'Track Order',         href: '/account' },
  { label: 'Contact Us',          href: '/contact' },
  { label: '30-Day Guarantee',    href: '/return-policy' },
];

export const Footer: React.FC = () => {
  const { settings } = useStore();
  const { isLoggedIn, openAuthModal } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#F5EDE4] border-t border-[#EDE5DC]" role="contentinfo">

      {/* ── Main Footer Grid ── */}
      <div className="alvora-container py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] lg:gap-8">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-5">
            <Logo size="md" />
            <p className="text-sm text-[#4D3D2D]/80 leading-relaxed max-w-xs">
              Thoughtfully formulated skincare that nourishes, protects and brings out your most radiant skin. Pure ingredients. Visible results. Naturally.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-1">
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Alvora on Instagram"
                  className="w-9 h-9 rounded-full border border-[#EDE5DC] bg-white flex items-center justify-center text-[#4D3D2D] hover:border-[#C48B80] hover:text-[#C48B80] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Alvora on Facebook"
                  className="w-9 h-9 rounded-full border border-[#EDE5DC] bg-white flex items-center justify-center text-[#4D3D2D] hover:border-[#C48B80] hover:text-[#C48B80] transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Alvora on YouTube"
                  className="w-9 h-9 rounded-full border border-[#EDE5DC] bg-white flex items-center justify-center text-[#4D3D2D] hover:border-[#C48B80] hover:text-[#C48B80] transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.tiktok && (
                <a
                  href={settings.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Alvora on TikTok"
                  className="w-9 h-9 rounded-full border border-[#EDE5DC] bg-white flex items-center justify-center text-[#4D3D2D] hover:border-[#C48B80] hover:text-[#C48B80] transition-colors"
                >
                  {/* TikTok icon */}
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.39-2.95 5.73-1.74 1.3-4.04 1.81-6.17 1.34-2.11-.47-3.92-1.89-4.83-3.83-.93-1.95-.91-4.26.06-6.19.98-1.93 2.72-3.34 4.79-3.89.84-.22 1.7-.33 2.56-.31v4.06c-1.43.08-2.82.72-3.69 1.83-.88 1.1-1.12 2.65-.63 3.98.48 1.31 1.65 2.31 2.99 2.62 1.34.31 2.77.01 3.86-.78 1.12-.82 1.81-2.14 1.85-3.56.09-3.93.03-7.87.03-11.8V.02z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Col 2 — Shop */}
          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#1A1A1A] mb-5">
              SHOP
            </h4>
            <ul className="flex flex-col gap-3">
              {SHOP_LINKS.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs font-semibold text-[#1A1A1A]/70 hover:text-[#C48B80] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — About */}
          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#1A1A1A] mb-5">
              ABOUT
            </h4>
            <ul className="flex flex-col gap-3">
              {ABOUT_LINKS.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs font-semibold text-[#1A1A1A]/70 hover:text-[#C48B80] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Help */}
          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#1A1A1A] mb-5">
              HELP
            </h4>
            <ul className="flex flex-col gap-3">
              {HELP_LINKS.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs font-semibold text-[#1A1A1A]/70 hover:text-[#C48B80] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5 — Newsletter */}
          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#1A1A1A] mb-5">
              STAY IN THE GLOW
            </h4>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed mb-4">
              Signup for exclusive offers,<br/>skincare tips, and more.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <label htmlFor="footer-email" className="sr-only">
                Your email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="alvora-input text-sm py-2.5"
              />
              <button
                type="submit"
                className="
                  flex items-center justify-center gap-2
                  w-full py-2.5 px-4
                  bg-[#C48B80] hover:bg-[#4D3D2D]
                  text-white text-sm font-semibold tracking-wide
                  transition-colors duration-200
                "
              >
                Subscribe
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <div
                role="status"
                aria-live="polite"
                className="mt-3 flex items-center gap-2 text-xs text-[#4D3D2D] font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-[#C48B80] flex-shrink-0" />
                <span>You&apos;re subscribed! Check your inbox for your discount.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-[#EDE5DC]">
        <div className="alvora-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#A1A7AA] text-center sm:text-left">
            &copy; {new Date().getFullYear()} Alvora Skincare. All Rights Reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="text-xs text-[#A1A7AA] hover:text-[#C48B80] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/return-policy" className="text-xs text-[#A1A7AA] hover:text-[#C48B80] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};