import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ cartCount = 0, onOpenCart, onCheckout, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-container">
          <Link to="/" className="logo">
            <span className="logo-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
            <span className="logo-text">Mianwali</span>
            <span className="logo-subtext">Eats</span>
          </Link>
          <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
            <a href='/'>Home</a>
            <a href="/#menu">Menu</a>
            <a href="/#ramadan">Special Deals</a>
            <Link to="/contact">Contact</Link>
          </nav>
          <div className="header-actions">
            <button
              type="button"
              className="cart-icon"
              onClick={onOpenCart}
              aria-label="View cart"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button
              type="button"
              className="btn-checkout"
              onClick={() => cartCount > 0 ? onCheckout() : onOpenCart()}
              aria-label="Checkout">
              Checkout
            </button>
            <button
              className="menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
