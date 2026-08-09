import React from 'react';
import '../index.css';
import { Providers } from './Providers';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { AuthModalWrapper } from './AuthModalWrapper';
import { MobileBottomNav } from '../components/common/MobileBottomNav';
import { FloatingWhatsApp } from '../components/common/FloatingWhatsApp';

export const metadata = {
  title: 'Play Bimboo - Magical Toys, Games & Playland',
  description: 'Discover endless play with Play Bimboo! Shop action figures, educational toys, board games, plush soft toys, and outdoor play.',
  icons: {
    icon: '/logo.jpg',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-800 selection:bg-amber-200 selection:text-amber-900">
        <Providers>
          <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 xl:pb-0">
            <Header />
            <CartDrawer />
            <AuthModalWrapper />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <FloatingWhatsApp />
            <MobileBottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
