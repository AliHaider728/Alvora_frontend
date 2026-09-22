"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SeoHead } from '../../components/common/SeoHead';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { HomeFAQ } from '../../components/home/HomeFAQ';
import { FinalCTA } from '../../components/home/FinalCTA';

// TikTok SVG (not in lucide-react)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.39-2.95 5.73-1.74 1.3-4.04 1.81-6.17 1.34-2.11-.47-3.92-1.89-4.83-3.83-.93-1.95-.91-4.26.06-6.19.98-1.93 2.72-3.34 4.79-3.89.84-.22 1.7-.33 2.56-.31v4.06c-1.43.08-2.82.72-3.69 1.83-.88 1.1-1.12 2.65-.63 3.98.48 1.31 1.65 2.31 2.99 2.62 1.34.31 2.77.01 3.86-.78 1.12-.82 1.81-2.14 1.85-3.56.09-3.93.03-7.87.03-11.8V.02z"/>
  </svg>
);

// Facebook SVG (inline for exact brand icon)
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// Instagram SVG
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);



// ─────────────────────────────────────────────────────────
// Hardcoded real store contact info.
// These are the confirmed real values • kept in sync with
// Footer.tsx. Do NOT fall back to settings.phone / .email /
// .address, which was the source of the data-flicker bug
// (settings context loads async and could momentarily show
// stale/empty data after the real values had already rendered).
// If these ever need to change, update them directly here
// (and in Footer.tsx to keep both in sync).
// ─────────────────────────────────────────────────────────
const STORE_PHONE = '+92 324 6036146';
const STORE_EMAIL = 'Sales@alvora.pk';
const STORE_ADDRESS = 'Mumtaz Market, Gujranwala';

export const ContactPageClient: React.FC = () => {
  const { settings } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitContact({ name, email, subject, message });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }, 4000);
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const phoneDisplay = STORE_PHONE;
  const phoneLink = `tel:+92${phoneDisplay.replace(/[^0-9]/g, '').replace(/^0/, '')}`;
  const emailDisplay = STORE_EMAIL;
  const emailLink = `mailto:${emailDisplay}`;
  const addressDisplay = STORE_ADDRESS;

  const socialLinks = [
    {
      key: 'facebook',
      label: 'Facebook',
      href: settings.socialLinks?.facebook || 'https://facebook.com/alvora.pk',
      icon: <FacebookIcon className="w-5 h-5" />,
      hoverClass: 'hover:text-[#C48B80]'
    },
    {
      key: 'instagram',
      label: 'Instagram',
      href: settings.socialLinks?.instagram || 'https://www.instagram.com/alvora.pk',
      icon: <InstagramIcon className="w-5 h-5" />,
      hoverClass: 'hover:text-[#C48B80]'
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      href: settings.socialLinks?.tiktok || 'https://tiktok.com/@alvora.pk',
      icon: <TikTokIcon className="w-5 h-5" />,
      hoverClass: 'hover:text-slate-900'
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F2] font-sans pb-24">
      <SeoHead title="Contact Us" />

      {/* SECTION 1: HERO */}
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-[#F9F4F0]">
        <div className="absolute inset-0 z-0 opacity-100">
          <Image 
            src="/images/contact-hero.png" 
            alt="Alvora Contact Hero" 
            fill 
            className="object-cover object-[80%_center] md:object-center"
            priority 
          />
        </div>
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4 mt-16">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4 drop-shadow-md">
            We're Here for You
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-sm">
            Reach out with any questions, concerns, or feedback. Your skincare journey is our priority.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
          {/* Left column: contact info + follow us */}
          <div className="lg:col-span-5 space-y-8">

            {/* Contact Information Card */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F1C9BD]/20 to-[#C48B80]/20 rounded-bl-full -mr-10 -mt-10" />
              
              <h1 className="font-display text-4xl text-[#1A1A1A]">Get in Touch</h1>
              <p className="text-[#1A1A1A]/70 text-base leading-relaxed">
                Have questions about our skincare, orders, delivery, or anything else? Send us a message and our team will get back to you as soon as possible.
              </p>

              <div className="space-y-6 pt-6 border-t border-gray-100">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="p-3 rounded-2xl bg-[#F5EDE4] text-[#C48B80] h-fit">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/50 block mb-1">Store Address</span>
                    <span className="text-[#1A1A1A] font-medium text-lg leading-snug">{addressDisplay}</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="p-3 rounded-2xl bg-[#F5EDE4] text-[#C48B80] h-fit">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/50 block mb-1">Phone Support</span>
                    <a href={phoneLink} className="text-[#1A1A1A] font-medium text-lg hover:text-[#C48B80] transition-colors">
                      {phoneDisplay}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="p-3 rounded-2xl bg-[#F5EDE4] text-[#C48B80] h-fit">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/50 block mb-1">Email Customer Service</span>
                    <a href={emailLink} className="text-[#1A1A1A] font-medium text-lg hover:text-[#C48B80] transition-colors">
                      {emailDisplay}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow Us Card */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm">
              <h2 className="font-display text-2xl text-[#1A1A1A] mb-6">Follow Us</h2>
              <div className="flex items-center gap-4 flex-wrap">
                {socialLinks.map(({ key, label, href, icon, hoverClass }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow Alvora Skincare on ${label}`}
                    className={`p-4 bg-[#FAF6F2] rounded-2xl text-gray-500 hover:bg-white hover:shadow-md ${hoverClass} transition-all duration-300`}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right column: contact form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm space-y-8">
              <h2 className="font-display text-3xl text-[#1A1A1A]">Send a Message</h2>

              {submitted ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-2xl text-[#1A1A1A]">Message Sent!</h3>
                  <p className="text-[#1A1A1A]/70 text-base max-w-sm">Thank you for reaching out to Alvora Skincare. We'll reply to your email shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/80 block mb-2">Your Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF6F2] border-none focus:ring-2 focus:ring-[#C48B80] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/80 block mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF6F2] border-none focus:ring-2 focus:ring-[#C48B80] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/80 block mb-2">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Order Tracking or Product Question"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF6F2] border-none focus:ring-2 focus:ring-[#C48B80] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/80 block mb-2">Message</label>
                    <textarea
                      required
                      rows={6}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF6F2] border-none focus:ring-2 focus:ring-[#C48B80] outline-none resize-none transition-all"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-interactive w-full py-4 rounded-full bg-gradient-to-br from-[#D4784F] to-[#9C4122] text-white font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-white">
        <HomeFAQ />
      </div>
      <FinalCTA />
    </div>
  );
};
