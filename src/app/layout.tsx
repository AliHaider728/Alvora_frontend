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
  preload: true,
});




export const metadata: Metadata = {
  title: {
    default: 'ALVORA | Glowing & Healthy Skin',
    template: '%s | ALVORA',
  },
  description:
    'Thoughtfully formulated skincare that nourishes, protects and brings out your most radiant skin. Shop serums, moisturizers, cleansers and more.',
  keywords: ['skincare', 'serum', 'moisturizer', 'alvora', 'Pakistan', 'beauty'],
  authors: [{ name: 'Alvora Skincare' }],
  openGraph: {
    type: 'website',
    siteName: 'ALVORA',
    title: 'ALVORA | Glowing & Healthy Skin',
    description:
      'Thoughtfully formulated skincare that nourishes, protects and brings out your most radiant skin.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALVORA | Glowing & Healthy Skin',
    description: 'Premium skincare formulated with pure ingredients.',
  },
  icons: {
    icon: '/favicon-rounded.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_ALVORA_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className={`${poppins.variable}`} data-scroll-behavior="smooth">
      <head>{GA_MEASUREMENT_ID && (
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
