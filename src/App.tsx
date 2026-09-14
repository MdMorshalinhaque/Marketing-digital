import React, { useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { WishlistPage } from './pages/WishlistPage';

const AppContent: React.FC = () => {
  const { currentView } = useShop();

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 antialiased selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1">
        {currentView.type === 'home' && <HomePage />}
        {currentView.type === 'shop' && (
          <ShopPage
            initialCategory={currentView.category}
            initialQuery={currentView.query}
          />
        )}
        {currentView.type === 'product-details' && (
          <ProductDetailsPage productId={currentView.productId} />
        )}
        {currentView.type === 'cart' && <CartPage />}
        {currentView.type === 'checkout' && <CheckoutPage />}
        {currentView.type === 'wishlist' && <WishlistPage />}
        {currentView.type === 'account' && (
          <AccountPage initialTab={currentView.tab} />
        )}
        {currentView.type === 'about' && <AboutPage />}
        {currentView.type === 'contact' && <ContactPage />}
        {currentView.type === 'admin' && <AdminDashboardPage />}
      </main>

      <Footer />
      <CartDrawer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
