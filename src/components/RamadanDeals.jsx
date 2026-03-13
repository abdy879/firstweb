import { useState } from 'react';
import { ramadanDeals } from '../data/menuData';
import DealCustomizeModal from './DealCustomizeModal';
import './RamadanDeals.css';

function RamadanDeals({ onAddToCart }) {
  const [dealModal, setDealModal] = useState(null);

  return (
    <section id="ramadan" className="ramadan-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">SPECIAL OFFERS</span>
          <h2>Ramadan Deals</h2>
          <p>Exclusive deals for the holy month. Order now and save!</p>
        </div>
        <div className="deals-grid">
          {ramadanDeals.map((deal) => (
            <div key={deal.id} className="deal-card">
              <span className="deal-tag">{deal.tag}</span>
              <div className="deal-image">
                <img src={deal.image} alt={deal.name} />
              </div>
              <h3>{deal.name}</h3>
              <p className="deal-desc">{deal.description}</p>
              <div className="deal-pricing">
                <span className="price">Rs. {deal.price.toLocaleString()}</span>
                <span className="original-price">Rs. {deal.originalPrice.toLocaleString()}</span>
              </div>
              <button className="btn-add" onClick={() => setDealModal(deal)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
      {dealModal && (
        <DealCustomizeModal
          deal={dealModal}
          onAdd={onAddToCart}
          onClose={() => setDealModal(null)}
        />
      )}
    </section>
  );
}

export default RamadanDeals;
