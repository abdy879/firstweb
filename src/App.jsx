import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DealsBanner from './components/DealsBanner';
import RamadanDeals from './components/RamadanDeals';
import MenuSection from './components/MenuSection';
import Footer from './components/Footer';
import Cart from './components/Cart';
import CheckoutAddress from './components/CheckoutAddress';
import Payment from './components/Payment';
import Notification from './components/Notification';
import Contact from './components/Contact';
import { db } from './firebase';
import { ref, push, set } from 'firebase/database';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const navigate = useNavigate();

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

    // Trigger Notification
    const itemName = item.displayName || item.name;
    setToastMessage(`Added 1x ${itemName} to Cart`);
    setToastVisible(false); // reset animation if clicked quickly
    setTimeout(() => setToastVisible(true), 10);
  };

  const decrementCart = (item) => {
    setCart((prev) => {
      const itemKey = cartKey(item);
      const existing = prev.find((i) => cartKey(i) === itemKey);

      if (existing) {
        if (existing.quantity === 1) {
          // If quantity is 1, completely remove it
          return prev.filter((i) => cartKey(i) !== itemKey);
        } else {
          // Otherwise, decrease quantity by 1
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
    setToastVisible(false); // reset animation if clicked quickly
    setTimeout(() => setToastVisible(true), 10);
  };

  return (
    <div className="app">
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <DealsBanner />

            </>
          } />
          <Route path="/payment" element={
            <Payment cart={cart} setCart={setCart} />
          } />
          <Route path="/MenuSection" element={
            <MenuSection onAddToCart={addToCart} />
          } />
          <Route path="/RamadanDeals" element={
            <RamadanDeals onAddToCart={addToCart} />
          } />
          <Route path="/contact" element={<Contact />} />
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
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
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
