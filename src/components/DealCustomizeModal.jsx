import { useState } from 'react';
import { pizzas, drinks } from '../data/menuData';
import './DealCustomizeModal.css';

function DealCustomizeModal({ deal, onAdd, onClose }) {
  const pizzaCount = deal.pizzaCount || 1;
  const hasDrink = deal.hasDrink || false;

  const [selectedPizzas, setSelectedPizzas] = useState(
    Array(pizzaCount).fill(null).map(() => pizzas[0]?.id ?? 1)
  );
  const [selectedDrink, setSelectedDrink] = useState(hasDrink ? drinks[0]?.id : null);

  const handlePizzaChange = (slotIndex, pizzaId) => {
    setSelectedPizzas((prev) => {
      const next = [...prev];
      next[slotIndex] = Number(pizzaId);
      return next;
    });
  };

  const handleAdd = () => {
    const pizzaNames = selectedPizzas.map((id) => pizzas.find((p) => p.id === id)?.name ?? 'Pizza');
    const drinkName = hasDrink ? drinks.find((d) => d.id === selectedDrink)?.name : null;
    const displayName = drinkName
      ? `${deal.name} (${pizzaNames.join(', ')} + ${drinkName})`
      : `${deal.name} (${pizzaNames.join(', ')})`;

    onAdd({
      ...deal,
      selectedPizzas: pizzaNames,
      selectedDrink: drinkName,
      displayName,
      customizationKey: `${deal.id}-${pizzaNames.join('-')}-${drinkName || ''}`,
    });
    onClose();
  };

  return (
    <>
      <div className="deal-modal-overlay" onClick={onClose} aria-hidden="true" />
      <div className="deal-modal">
        <div className="deal-modal-header">
          <h3>Customize Your Deal</h3>
          <button className="deal-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="deal-modal-body">
          <p className="deal-modal-name">{deal.name}</p>

          {Array.from({ length: pizzaCount }, (_, i) => (
            <div key={i} className="deal-modal-section">
              <label className="deal-modal-label">
                {pizzaCount > 1 ? `Pizza ${i + 1} Flavour` : 'Pizza Flavour'}
              </label>
              <div className="deal-modal-options">
                {pizzas.map((pizza) => {
                  const isSelected = selectedPizzas[i] === pizza.id;
                  return (
                    <label
                      key={pizza.id}
                      className={`deal-option deal-option-pizza ${isSelected ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`pizza-${i}`}
                        value={pizza.id}
                        checked={isSelected}
                        onChange={() => handlePizzaChange(i, pizza.id)}
                      />
                      <span className="deal-option-image">
                        <img src={pizza.image} alt={pizza.name} />
                      </span>
                      <span className="deal-option-row">
                        <span className="deal-option-circle" />
                        <span>{pizza.name}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {hasDrink && (
            <div className="deal-modal-section">
              <label className="deal-modal-label">Drink Selection</label>
              <div className="deal-modal-options">
                {drinks.map((drink) => {
                  const isSelected = selectedDrink === drink.id;
                  return (
                    <label
                      key={drink.id}
                      className={`deal-option ${isSelected ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="drink"
                        value={drink.id}
                        checked={isSelected}
                        onChange={() => setSelectedDrink(drink.id)}
                      />
                      <span className="deal-option-circle" />
                      <span>{drink.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="deal-modal-footer">
          <span className="deal-modal-price">Rs. {deal.price.toLocaleString()}</span>
          <button className="deal-modal-add-btn" onClick={handleAdd}>
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}

export default DealCustomizeModal;
