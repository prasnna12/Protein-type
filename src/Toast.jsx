import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ type = 'info', message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-container ${type}`}>
      <div className="toast-icon">
        {type === 'success' ? '✓' : '⚠'}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

export default Toast;
