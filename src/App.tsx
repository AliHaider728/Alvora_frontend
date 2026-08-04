import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import { DialogProvider } from './context/DialogContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { MobileBottomNav } from './components/common/MobileBottomNav';


// Storefront Pages
import { HomePage } from './pages/storefront/HomePage';
import { CategoryPage } from './pages/storefront/CategoryPage';
import { ProductDetailPage } from './pages/storefront/ProductDetailPage';
import { SearchResultsPage } from './pages/storefront/SearchResultsPage';
import { WishlistPage } from './pages/storefront/WishlistPage';
import { CheckoutPage } from './pages/storefront/CheckoutPage';
import { AccountPage } from './pages/storefront/AccountPage';
import { AboutPage } from './pages/storefront/AboutPage';
import { ContactPage } from './pages/storefront/ContactPage';
import { FaqPage } from './pages/storefront/FaqPage';
import { NotFoundPage } from './pages/storefront/NotFoundPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminStoreAppearancePage } from './pages/admin/AdminStoreAppearancePage';

const AdminProductFormPage = React.lazy(() =>
  import('./pages/admin/AdminProductFormPage').then(module => ({
    default: module.AdminProductFormPage
  }))
);

const adminPageFallback = (
  <div className="flex min-h-[40vh] items-center justify-center text-sm font-bold text-slate-500">
    Loading product editor…
  </div>
);

// Scroll to top helper on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { setIsCartOpen } = useStore();
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsCartOpen(false); // Ensure cart closes on every route change
  }, [pathname, setIsCartOpen]);
  return null;
};

// Storefront Layout Wrapper
const StorefrontLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 xl:pb-0">
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <DialogProvider>
      <StoreProvider>
        <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route
              path="products/new"
              element={<React.Suspense fallback={adminPageFallback}><AdminProductFormPage /></React.Suspense>}
            />
            <Route
              path="products/edit/:id"
              element={<React.Suspense fallback={adminPageFallback}><AdminProductFormPage /></React.Suspense>}
            />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="store-appearance" element={<AdminStoreAppearancePage />} />
          </Route>

          {/* Customer Storefront Routes */}
          <Route path="/*" element={<StorefrontLayout />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
    </DialogProvider>
    </ToastProvider>
  );
}
