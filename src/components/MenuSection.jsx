import { useState, useEffect } from 'react';
import PizzaSizeModal from './PizzaSizeModal';
import './MenuSection.css';

function MenuSection({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('pizzas');
  const [pizzaModal, setPizzaModal] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const [sides, setSides] = useState([]);
  const [menuDrinks, setMenuDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const [pizzasRes, sidesRes, drinksRes] = await Promise.all([
          fetch('http://localhost:3000/api/pizzas'),
          fetch('http://localhost:3000/api/sides'),
          fetch('http://localhost:3000/api/drinks')
        ]);

        if (!pizzasRes.ok || !sidesRes.ok || !drinksRes.ok) {
          throw new Error('Failed to fetch menu data');
        }

        const [pizzasData, sidesData, drinksData] = await Promise.all([
          pizzasRes.json(),
          sidesRes.json(),
          drinksRes.json()
        ]);

        setPizzas(pizzasData);
        setSides(sidesData);
        setMenuDrinks(drinksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  if (loading) return <div className="loading">Loading menu...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <section id="menu" className="menu-section">
      <div className="section-container">
        
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
