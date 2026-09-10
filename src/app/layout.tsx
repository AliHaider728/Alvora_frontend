import React from 'react';
import Script from 'next/script';
import '../index.css';
import { Providers } from './Providers';
import { AuthModalWrapper } from './AuthModalWrapper';
import { StorefrontLayoutWrapper } from '../components/common/StorefrontLayoutWrapper';
import MetaPixel from '../components/analytics/MetaPixel';
import TikTokPixel from '../components/analytics/TikTokPixel';
import { Playfair_Display } from 'next/font/google';
import type { Metadata } from 'next';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
});


export const metadata: Metadata = {
  title: {
    default: 'Alvora Skincare - Premium Skincare',
    template: '%s | Alvora Skincare',
  },
  description:
    'Thoughtfully formulated skincare that nourishes, protects and brings out your most radiant skin. Shop serums, moisturizers, cleansers and more.',
  keywords: ['skincare', 'serum', 'moisturizer', 'alvora', 'Pakistan', 'beauty'],
  authors: [{ name: 'Alvora Skincare' }],
  openGraph: {
    type: 'website',
    siteName: 'Alvora Skincare',
    title: 'Alvora Skincare - Premium Skincare',
    description:
      'Thoughtfully formulated skincare that nourishes, protects and brings out your most radiant skin.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alvora Skincare',
    description: 'Premium skincare formulated with pure ingredients.',
  },
  icons: {
    icon: '/favicon-rounded.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_ALVORA_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className={playfairDisplay.variable} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet" />
        {/* Meta Pixel stub • loads fbq global before any pixel fires */}
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
          background: 'var(--alvora-ivory)',
        }}
        className="font-sans antialiased text-[#1A1A1A] selection:bg-[#F1C9BD] selection:text-[#1A1A1A]"
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
