import React, { useState, useEffect } from 'react';  
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

function Payment({ cart, setCart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  // Scroll to the payment container when the component mounts
  useEffect(() => {
    const element = document.querySelector('.payment-page');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);
  // Address details passed from the checkout address modal
  const address = location.state?.address;

  // If no address or cart, redirect back to home
  if (!address || cart.length === 0) {
    navigate('/');
    return null;
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Calculate Tax: 5% for Credit/Debit Card, 15% for everything else
  const taxRate = selectedMethod === 'Credit/Debit Card' ? 0.05 : 0.15;
  const taxAmount = Math.round(subtotal * taxRate);
  const finalTotal = subtotal + taxAmount;

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }

    setIsProcessing(true);

    try {
      // Send order to our Node.js Backend (SQL Server)
      const response = await fetch('http://localhost:3000/api/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: address.name || 'N/A',
          customerContact: address.contact,
          address: `${address.house}, ${address.area}`,
          items: cart.map(item => ({
            name: item.displayName || item.name,
            quantity: item.quantity,
            price: item.price,
            size: item.size || null,
            flavour: item.customizationKey || null // Using customization as flavour
          })),
          totalAmount: finalTotal
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save order to backend');
      }

      alert(`✅ Order placed successfully!\n\nSaved to SQL Server Database\nPayment Method: ${selectedMethod}\nTotal: Rs. ${finalTotal.toLocaleString()}\n\nThank you for ordering from Mianwali Eats!`);

      setCart([]);
      setIsProcessing(false);
      navigate('/');
    } catch (error) {
      console.error("Error saving to backend: ", error);
      alert("Sorry, there was an error processing your order in the SQL database. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h2>Select Payment Method</h2>
        <p className="payment-subtitle">Choose how you want to pay for your order</p>

        <div className="payment-methods">
          <label className={`payment-method-card ${selectedMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="Cash on Delivery"
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            <div className="payment-icon">💵</div>
            <div className="payment-info">
              <h3>Cash on Delivery</h3>
              <p>Pay with cash when your food arrives</p>
            </div>
          </label>

          <label className={`payment-method-card ${selectedMethod === 'Credit/Debit Card' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="Credit/Debit Card"
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            <div className="payment-icon">💳</div>
            <div className="payment-info">
              <h3>Credit / Debit Card</h3>
              <p>Pay securely with your card via POS machine</p>
            </div>
          </label>

          <label className={`payment-method-card ${selectedMethod === 'JazzCash / EasyPaisa' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="JazzCash / EasyPaisa"
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            <div className="payment-icon">📱</div>
            <div className="payment-info">
              <h3>JazzCash / EasyPaisa</h3>
              <p>Pay via mobile wallet on delivery</p>
            </div>
          </label>
        </div>

        <div className="payment-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>Free</span>
          </div>

          <div className="summary-row">
            <span>{selectedMethod === 'Credit/Debit Card' ? 'Card Tax (5%)' : 'Standard Tax (15%)'}</span>
            <span>Rs. {taxAmount.toLocaleString()}</span>
          </div>

          <div className="summary-row total">
            <span>Total to Pay</span>
            <span>Rs. {finalTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="payment-actions">
          <button className="payment-back-btn" onClick={() => navigate(-1)} disabled={isProcessing}>
            Back
          </button>
          <button
            className="payment-confirm-btn"
            onClick={handlePayment}
            disabled={!selectedMethod || isProcessing}
          >
            {isProcessing ? 'Processing...' : `Confirm Order`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
