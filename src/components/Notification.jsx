import React, { useEffect } from 'react';
import './Notification.css';

function Notification({ message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="notification-toast">
      <span className="notification-icon">🛒</span>
      <span className="notification-message">{message}</span>
    </div>
  );
}

export default Notification;
