import React from 'react';
import Script from 'next/script';
import '../index.css';
import { Providers } from './Providers';
import { AuthModalWrapper } from './AuthModalWrapper';
import { StorefrontLayoutWrapper } from '../components/common/StorefrontLayoutWrapper';
import MetaPixel from '../components/analytics/MetaPixel';
import TikTokPixel from '../components/analytics/TikTokPixel';
import { Playfair_Display, Lato } from 'next/font/google';
import type { Metadata } from 'next';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Alvora Skincare — Pure Ingredients. Visible Results.',
    template: '%s | Alvora Skincare',
  },
  description:
    'Thoughtfully formulated skincare that nourishes, protects and brings out your most radiant skin. Shop serums, moisturizers, cleansers and more.',
  keywords: ['skincare', 'serum', 'moisturizer', 'alvora', 'Pakistan', 'beauty'],
  authors: [{ name: 'Alvora Skincare' }],
  openGraph: {
    type: 'website',
    siteName: 'Alvora Skincare',
    title: 'Alvora Skincare — Pure Ingredients. Visible Results.',
    description:
      'Thoughtfully formulated skincare that nourishes, protects and brings out your most radiant skin.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alvora Skincare',
    description: 'Premium skincare formulated with pure ingredients.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_ALVORA_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className={`${playfairDisplay.variable} ${lato.variable}`}>
      <head>
        {/* Meta Pixel stub — loads fbq global before any pixel fires */}
        <Script
          id="meta-pixel-stub"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];}(window,document,'script');
            `,
          }}
        />

        {GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="google-analytics-config"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        style={{
          fontFamily: 'var(--font-lato, Lato, system-ui, sans-serif)',
          background: 'var(--alvora-ivory)',
        }}
        className="antialiased text-[#1A1A1A] selection:bg-[#F1C9BD] selection:text-[#1A1A1A]"
      >
        <MetaPixel />
        <TikTokPixel />
        <Providers>
          <AuthModalWrapper />
          <StorefrontLayoutWrapper>
            {children}
          </StorefrontLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
