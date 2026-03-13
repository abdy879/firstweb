import { useState } from 'react';
import './CheckoutAddress.css';

function CheckoutAddress({ cart, onBack, onPlaceOrder }) {
  const [address, setAddress] = useState({
    area: '',
    house: '',
    notes: '',
    contact: '',
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contact') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 11);
      setAddress((prev) => ({ ...prev, contact: digitsOnly }));
      return;
    }
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address.area.trim() || !address.house.trim()) {
      alert('Please fill in the required fields.');
      return;
    }
    if (address.contact.length !== 11) {
      alert('Please enter a valid 11-digit contact number.');
      return;
    }
    onPlaceOrder(address);
  };

  return (
    <>
      <div className="checkout-overlay" onClick={onBack} aria-hidden="true" />
      <div className="checkout-panel">
        <div className="checkout-header">
          <button className="checkout-back" onClick={onBack} aria-label="Go back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2>Delivery Address</h2>
        </div>

        <form className="checkout-body" onSubmit={handleSubmit}>
          <div className="checkout-form-group">
            <label htmlFor="area">Area / Street <span className="required">*</span></label>
            <input
              id="area"
              name="area"
              type="text"
              placeholder="e.g. Main Bazaar, Mianwali"
              value={address.area}
              onChange={handleChange}
              required
            />
          </div>

          <div className="checkout-form-group">
            <label htmlFor="house">House / Flat / Building <span className="required">*</span></label>
            <input
              id="house"
              name="house"
              type="text"
              placeholder="e.g. House #12, Street 5"
              value={address.house}
              onChange={handleChange}
              required
            />
          </div>
          <div className="checkout-form-group">
            <label htmlFor="name">Name <span className="required">*</span></label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. MR.ABC"
              value={address.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="checkout-form-group">
            <label htmlFor="notes">Additional Address Details</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Any landmarks, delivery instructions, or notes for the rider..."
              rows="3"
              value={address.notes}
              onChange={handleChange}
            />
          </div>
          <div className="checkout-form-group">
            <label htmlFor="contact">Contact Number <span className="required">*</span></label>
            <input
              id="contact"
              name="contact"
              type="tel"
              placeholder="e.g. 03001234567"
              value={address.contact}
              onChange={handleChange}
              maxLength={11}
              pattern="\d{11}"
              title="Enter exactly 11 digits"
              required
            />
          </div>


          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <ul className="checkout-items">
              {cart.map((item) => (
                <li key={item.customizationKey ? `${item.id}-${item.customizationKey}` : `${item.id}-${item.name}-${item.size || ''}`}>
                  <span className="checkout-item-name">
                    {item.displayName || item.name} × {item.quantity}
                  </span>
                  <span className="checkout-item-price">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="checkout-total">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" className="checkout-place-order-btn">
            Proceed To Payment
          </button>
        </form>
      </div>
    </>
  );
}

export default CheckoutAddress;
