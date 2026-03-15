import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DealsBanner from './components/DealsBanner';
import RamadanDeals from './components/RamadanDeals';
import MenuSection from './components/MenuSection';
import Footer from './components/Footer';
import Cart from './components/Cart';
import CheckoutAddress from './components/CheckoutAddress';
import Payment from './components/Payment';
import Auth from './components/Auth';
import Notification from './components/Notification';
import Contact from './components/Contact';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      if (!saved || saved === 'undefined' || saved === 'null') return null;
      const parsed = JSON.parse(saved);
      // Robust check: must have email, phone or id to be valid
      return (parsed && (parsed.email || parsed.phone || parsed.id)) ? parsed : null;
    } catch (e) {
      return null;
    }
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const cartKey = (i) => {
    if (i.customizationKey) return `${i.id}-${i.customizationKey}`;
    if (i.size) return `${i.id}-${i.name}-${i.size}`;
    return `${i.id}-${i.name}`;
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const itemKey = cartKey(item);
      const existing = prev.find((i) => cartKey(i) === itemKey);
      if (existing) {
        return prev.map((i) =>
          cartKey(i) === itemKey ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    const itemName = item.displayName || item.name;
    setToastMessage(`Added 1x ${itemName} to Cart`);
    setToastVisible(false);
    setTimeout(() => setToastVisible(true), 10);
  };

  const decrementCart = (item) => {
    setCart((prev) => {
      const itemKey = cartKey(item);
      const existing = prev.find((i) => cartKey(i) === itemKey);
      if (existing) {
        if (existing.quantity === 1) {
          return prev.filter((i) => cartKey(i) !== itemKey);
        } else {
          return prev.map((i) =>
            cartKey(i) === itemKey ? { ...i, quantity: i.quantity - 1 } : i
          );
        }
      }
      return prev;
    });
  };

  const removeFromCart = (item) => {
    const itemKey = cartKey(item);
    setCart((prev) => prev.filter((i) => cartKey(i) !== itemKey));

    const itemName = item.displayName || item.name;
    setToastMessage(`Removed ${itemName} from Cart`);
    setToastVisible(false);
    setTimeout(() => setToastVisible(true), 10);
  };

  const handleCheckout = () => {
    console.log("handleCheckout called. User:", user);
    if (!user) {
      console.log("Redirecting to /login...");
      setCartOpen(false);
      navigate('/login', { state: { returnToCheckout: true } });
    } else {
      console.log("Opening Checkout modal...");
      setCartOpen(false);
      setCheckoutOpen(true);
    }
  };

  useEffect(() => {
    if (location.state?.openCheckout) {
      setCheckoutOpen(true);
      // Create a clean state object without openCheckout
      const cleanState = { ...location.state };
      delete cleanState.openCheckout;
      window.history.replaceState(cleanState, document.title);
    }
  }, [location.state, location]);

  return (
    <div className="app">
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        onCheckout={handleCheckout}
        user={user}
        onLogout={handleLogout}
      />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero onOrderNow={() => {
                const menu = document.getElementById('menu');
                if (menu) menu.scrollIntoView({ behavior: 'smooth' });
              }} />
              <DealsBanner />
              <RamadanDeals onAddToCart={addToCart} />
              <MenuSection onAddToCart={addToCart} />
            </>
          } />
          <Route path="/payment" element={
            <Payment cart={cart} setCart={setCart} />
          } />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Auth onLoginSuccess={(u) => setUser(u)} />} />
          <Route path="/signup" element={<Auth onLoginSuccess={(u) => setUser(u)} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Cart
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onAdd={addToCart}
        onDecrement={decrementCart}
        onCheckout={handleCheckout}
        onLogout={handleLogout}
        user={user}
      />
      {checkoutOpen && (
        <CheckoutAddress
          cart={cart}
          onBack={() => setCheckoutOpen(false)}
          onPlaceOrder={(address) => {
            setCheckoutOpen(false);
            navigate('/payment', { state: { address } });
          }}
        />
      )}

      <Notification
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}

export default App;
