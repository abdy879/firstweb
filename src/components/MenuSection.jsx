import { useState } from 'react';
import { pizzas, sides, menuDrinks } from '../data/menuData';
import PizzaSizeModal from './PizzaSizeModal';
import './MenuSection.css';

function MenuSection({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('pizzas');
  const [pizzaModal, setPizzaModal] = useState(null);

  return (
    <section id="menu" className="menu-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">OUR MENU</span>
          <h2>Choose Your Favorite</h2>
          <p>Fresh ingredients, delicious taste, delivered hot</p>
        </div>
        <div className="menu-tabs">
          <button
            className={`tab ${activeCategory === 'pizzas' ? 'active' : ''}`}
            onClick={() => setActiveCategory('pizzas')}
          >
            Pizzas
          </button>
          <button
            className={`tab ${activeCategory === 'sides' ? 'active' : ''}`}
            onClick={() => setActiveCategory('sides')}
          >
            Sides & More
          </button>
          <button
            className={`tab ${activeCategory === 'drinks' ? 'active' : ''}`}
            onClick={() => setActiveCategory('drinks')}
          >
            Drinks
          </button>
        </div>
        {activeCategory === 'pizzas' && (
          <div className="menu-grid">
            {pizzas.map((item) => (
              <div key={item.id} className="menu-card">
                <div className="menu-card-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="menu-card-footer">
                  <span className="menu-price">From Rs. {item.price.toLocaleString()}</span>
                  <button className="btn-order-sm" onClick={() => setPizzaModal(item)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeCategory === 'sides' && (
          <div className="menu-grid sides-grid">
            {sides.map((item) => (
              <div key={item.id} className="menu-card side-card">
                <div className="menu-card-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <h3>{item.name}</h3>
                <div className="menu-card-footer">
                  <span className="menu-price">Rs. {item.price.toLocaleString()}</span>
                  <button className="btn-order-sm" onClick={() => onAddToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeCategory === 'drinks' && (
          <div className="menu-grid sides-grid">
            {menuDrinks.map((item) => (
              <div key={item.id} className="menu-card side-card">
                <div className="menu-card-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <h3>{item.name}</h3>
                <div className="menu-card-footer">
                  <span className="menu-price">Rs. {item.price.toLocaleString()}</span>
                  <button className="btn-order-sm" onClick={() => onAddToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {pizzaModal && (
        <PizzaSizeModal
          pizza={pizzaModal}
          onAdd={onAddToCart}
          onClose={() => setPizzaModal(null)}
        />
      )}
    </section>
  );
}

export default MenuSection;
