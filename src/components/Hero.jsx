import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-content">
        <div className="hero-text">
          <h1>Hot & Fresh Fast Food Delivered to Your Door</h1>
          <p>Order online and get your favorite Food in 30 minutes or less. Ramadan special deals available now!</p>
          <div className="hero-buttons">
            <Link to="/MenuSection" className="btn btn-primary">Order Now</Link>
            
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
