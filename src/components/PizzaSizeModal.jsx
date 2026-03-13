import { useState } from 'react';
import './PizzaSizeModal.css';

function PizzaSizeModal({ pizza, onAdd, onClose }) {
  const [selectedSize, setSelectedSize] = useState('medium');

  const handleAdd = () => {
    const price = pizza.sizePrices[selectedSize];
    onAdd({
      ...pizza,
      size: selectedSize,
      price,
      displayName: `${pizza.name} (${selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)})`,
    });
    onClose();
  };

  return (
    <>
      <div className="size-modal-overlay" onClick={onClose} aria-hidden="true" />
      <div className="size-modal">
        <div className="size-modal-header">
          <h3>Select Size</h3>
          <button className="size-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="size-modal-body">
          <p className="size-modal-pizza-name">{pizza.name}</p>
          <div className="size-options">
            {pizza.sizes.map((size) => {
              const key = size.toLowerCase();
              const price = pizza.sizePrices[key];
              const isSelected = selectedSize === key;
              return (
                <label
                  key={key}
                  className={`size-option ${isSelected ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="pizza-size"
                    value={key}
                    checked={isSelected}
                    onChange={() => setSelectedSize(key)}
                  />
                  <span className="size-option-circle" />
                  <span className="size-option-label">{size}</span>
                  <span className="size-option-price">Rs. {price.toLocaleString()}</span>
                </label>
              );
            })}
          </div>
        </div>
        <div className="size-modal-footer">
          <button className="size-modal-add-btn" onClick={handleAdd}>
            Add to Cart — Rs. {pizza.sizePrices[selectedSize].toLocaleString()}
          </button>
        </div>
      </div>
    </>
  );
}

export default PizzaSizeModal;
