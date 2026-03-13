import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="logo-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
            <span className="footer-logo-text">Mianwali Eats</span>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Order</h4>
              <a href="/">Order Online</a>
              <a href="/MenuSection">Menu</a>
              <a href="/RamadanDeals">Deals</a>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <Link to="/contact">Contact Us</Link>
              <a href="#track">Track Order</a>
              <a href="#faq">FAQs</a>
            </div>
            <div className="footer-col">
              <h4>Call US</h4>
              <a href="tel:111366466" className="phone">111 366 466</a>
              <p className="hours">Open 24/7</p>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} Mianwali Eats. All rights reserved.</p>
          <p className="disclaimer">AA Teku Shayian Khawawa!</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
