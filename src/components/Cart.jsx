import './Cart.css';

function Cart({ cart, isOpen, onClose, onRemove, onAdd, onDecrement, onCheckout, onLogout, user }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div 
        className={`cart-overlay ${isOpen ? 'cart-overlay-open' : ''}`} 
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside className={`cart-drawer ${isOpen ? 'cart-drawer-open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <p className="cart-empty">Your cart is empty!</p>
          ) : (
            <ul className="cart-items">
              {cart.map((item) => (
                <li key={item.customizationKey ? `${item.id}-${item.customizationKey}` : `${item.id}-${item.name}-${item.size || ''}`} className="cart-item">
                  <div className="cart-item-image">
                    {typeof item.image === 'string' && item.image.startsWith('/') ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span className="cart-item-emoji">{item.image}</span>
                    )}
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.displayName || item.name}</h4>
                    <p className="cart-item-price">Rs. {item.price.toLocaleString()}</p>
                    <div className="cart-item-qty">
                      <div className="qty-controls">
                        <button 
                          className="qty-btn" 
                          onClick={() => onDecrement(item)}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button 
                          className="qty-btn" 
                          onClick={() => onAdd(item)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="cart-item-remove" 
                        onClick={() => onRemove(item)}
                        aria-label={`Remove ${item.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
            <button className="cart-checkout" onClick={onCheckout}>Complete Order</button>
            {user && (
              <button 
                className="cart-logout-btn" 
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                Sign Out ({user.email || user.phone || 'User'})
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

export default Cart;
