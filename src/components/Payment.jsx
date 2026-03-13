import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { ref, push, set } from 'firebase/database';
import './Payment.css';

function Payment({ cart, setCart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

    const orderItems = cart.map((item) => ({
      name: item.displayName || item.name,
      size: item.size || null,
      qty: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    const order = {
      timestamp: Date.now(),
      isNew: true,
      paymentMethod: selectedMethod,
      customer: {
        name: address.name || 'N/A',
        contact: address.contact,
        area: address.area,
        house: address.house,
        notes: address.notes || '',
      },
      items: orderItems,
      subtotal,
      taxName: selectedMethod === 'Credit/Debit Card' ? 'Card Tax (5%)' : 'Standard Tax (15%)',
      taxAmount,
      total: finalTotal,
    };

    try {
      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, order);

      alert(`✅ Order placed successfully!\n\nYour Order ID: #${newOrderRef.key.slice(-8).toUpperCase()}\nPayment Method: ${selectedMethod}\nTotal: Rs. ${finalTotal.toLocaleString()}\n\nThank you for ordering from Mianwali Eats!`);

      setCart([]);
      setIsProcessing(false);
      navigate('/'); // Go back to home after successful order
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Sorry, there was an error processing your payment. Please try again or contact support.");
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
