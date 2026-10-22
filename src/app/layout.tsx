import React from 'react';
import Script from 'next/script';
import '../index.css';
import { Providers } from './Providers';
import { AuthModalWrapper } from './AuthModalWrapper';
import { StorefrontLayoutWrapper } from '../components/common/StorefrontLayoutWrapper';
import MetaPixel from '../components/analytics/MetaPixel';
import TikTokPixel from '../components/analytics/TikTokPixel';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-poppins',
  display: 'swap',
  preload: false,
});




export const metadata: Metadata = {
  metadataBase: new URL('https://alvora.pk'),
  title: {
    default: 'ALVORA Skincare Pakistan | Face Wash, Serums, Creams & Sunscreen',
    template: '%s | ALVORA Skincare Pakistan',
  },
  description:
    'Discover ALVORA premium skincare in Pakistan, featuring face washes, acne serums, brightening creams, SPF 60 sunscreen and skincare bundles. Your glow, your ritual.',
  keywords: [
    'ALVORA',
    'ALVORA Skincare',
    'ALVORA Pakistan',
    'ALVORA official',
    'ALVORA skincare Pakistan',
    'ALVORA beauty',
    'ALVORA cosmetics',
    'ALVORA online store',
    'ALVORA skincare products',
    'ALVORA face wash',
    'ALVORA Clear Acne Face Wash',
    'ALVORA Clear Acne Serum',
    'ALVORA Glow Beads Face Wash',
    'ALVORA Radiance Brightening Cream',
    'ALVORA Skin Brightening Cream',
    'ALVORA TintShield Sunscreen',
    'ALVORA SPF 60 Sunscreen',
    'ALVORA PA++++ Sunscreen',
    'ALVORA Clear Acne Care Duo',
    'ALVORA Glow Bundle',
    'ALVORA Glow and Care Bundle',
    'premium skincare Pakistan',
    'best skincare products Pakistan',
    'skincare brands Pakistan',
    'face wash Pakistan',
    'acne face wash',
    'acne serum Pakistan',
    'serum for acne prone skin',
    'facial serum',
    'skin brightening cream Pakistan',
    'glowing skin products',
    'sunscreen SPF 60 Pakistan',
    'broad spectrum sunscreen',
    'daily face sunscreen',
    'skincare routine Pakistan',
    'skincare essentials',
    'skincare bundles Pakistan',
    'beauty products online Pakistan',
    'buy skincare online',
    'online skincare store Pakistan',
    'original skincare products Pakistan',
    'cash on delivery skincare',
    'COD skincare Pakistan',
    'skincare for women',
    'skincare for men',
    'oily skin products',
    'dry skin products',
    'combination skin care',
    'acne prone skin care',
    'skin hydration',
    'radiant skin',
    'healthy skin routine',
    'premium beauty essentials',
    'ALVORA Instagram',
    'ALVORA Facebook',
    'ALVORA TikTok',
    'ALVORA social media',
  ],
  authors: [{ name: 'ALVORA Skincare' }],
  creator: 'ALVORA Skincare',
  publisher: 'ALVORA',
  applicationName: 'ALVORA',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://alvora.pk/',
    siteName: 'ALVORA',
    title: 'ALVORA — Premium Skincare & Beauty Essentials | Pakistan',
    description:
      'Discover ALVORA skincare essentials, from face washes and acne serums to brightening creams, SPF 60 sunscreen and curated skincare bundles. Your glow, your ritual.',
    images: [
      {
        url: 'https://alvora.pk/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ALVORA premium skincare products',
      },
    ],
  },
  icons: {
    icon: '/favicon-rounded.png',
  },
  other: {
    'geo.region': 'PK',
    'language': 'English',
    'theme-color': '#FAF7F2',
  },
};

import GoogleAnalyticsEvents from '../components/common/GoogleAnalyticsEvents';
import { GA_TRACKING_ID } from '../lib/gtag';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BeautyBrand',
              name: 'ALVORA',
              url: 'https://alvora.pk',
              logo: 'https://alvora.pk/alvora-logo.png',
              image: 'https://alvora.pk/og-image.jpg',
              description: 'Discover ALVORA premium skincare in Pakistan, featuring face washes, acne serums, brightening creams, SPF 60 sunscreen and skincare bundles. Your glow, your ritual.',
              sameAs: [
                'https://www.instagram.com/alvora.pk/',
                'https://www.facebook.com/Alvora.pk',
                'https://www.tiktok.com/@alvora_pk',
              ],
            }),
          }}
        />
        <link rel="preconnect" href="https://admin.alvora.pk" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning 
        style={{
          background: 'var(--alvora-ivory)',
        }}
        className="font-sans antialiased text-[#1A1A1A] selection:bg-[#F1C9BD] selection:text-[#1A1A1A]"
      >
        <Script 
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} 
          strategy="afterInteractive" 
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <GoogleAnalyticsEvents />
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
