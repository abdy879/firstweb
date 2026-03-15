import { useState, useEffect } from 'react';
import DealCustomizeModal from './DealCustomizeModal';
import './RamadanDeals.css';

function RamadanDeals({ onAddToCart }) {
  const [dealModal, setDealModal] = useState(null);
  const [ramadanDeals, setRamadanDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/ramadan-deals');
        if (!response.ok) {
          throw new Error('Failed to fetch Ramadan deals');
        }
        const data = await response.json();
        setRamadanDeals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (loading) return <div className="loading">Loading deals...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <section id="ramadan" className="ramadan-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">SPECIAL OFFERS</span>
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
                <span className="price">Rs. {(deal.price || 0).toLocaleString()}</span>
                <span className="original-price">Rs. {(deal.originalPrice || 0).toLocaleString()}</span>
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
