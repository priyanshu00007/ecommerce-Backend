import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';
import CustomCursor from './components/ui/CustomCursor';
import FullscreenMenu from './components/ui/FullscreenMenu';
import CinematicLoader from './components/ui/Loading';
import SearchOverlay from './components/ui/SearchOverlay';
import CartDrawer from './components/ui/CartDrawer';
import QuickViewModal from './components/ui/QuickViewModal';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Craft = lazy(() => import('./pages/Craft'));
const Journal = lazy(() => import('./pages/Journal'));
const Maison = lazy(() => import('./pages/Maison'));
const Contact = lazy(() => import('./pages/Contact'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
  const [cinemaLoading, setCinemaLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const { count } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const isCheckout = location.pathname === '/checkout';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || cartOpen || searchOpen || quickView ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, cartOpen, searchOpen, quickView]);

  return (
    <div className="min-h-screen selection:bg-[#8C9A84] selection:text-[#F9F8F4]">
      <AnimatePresence>
        {cinemaLoading && <CinematicLoader onComplete={() => setCinemaLoading(false)} />}
      </AnimatePresence>

      {!cinemaLoading && (
        <>
          <CustomCursor />
          <Navbar
            onMenu={() => setMenuOpen(true)}
            onCart={() => setCartOpen(true)}
            onSearch={() => setSearchOpen(true)}
            cartCount={count}
          />
          <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isAdmin={isAdmin} />
          <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} onSelect={(p) => { setSearchOpen(false); setQuickView(p); }} />
          <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
          <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />

          <Suspense fallback={<div className="h-screen flex items-center justify-center text-aura-primary/50 text-sm tracking-widest uppercase">Loading...</div>}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home openQuickView={setQuickView} />} />
                <Route path="/shop" element={<Shop openQuickView={setQuickView} />} />
                <Route path="/product/:id" element={<ProductDetail openQuickView={setQuickView} />} />
                <Route path="/craft" element={<Craft />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/maison" element={<Maison />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin/*" element={<Admin />} />
              </Routes>
            </AnimatePresence>
          </Suspense>

          {!isCheckout && <Footer />}
        </>
      )}
    </div>
  );
}

export default App;
