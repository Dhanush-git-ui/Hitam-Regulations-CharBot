import React from 'react';
import './Toast.css';

function Toast({ show, message, type }) {
  if (!show) return null;

  return (
    <div className={`toast ${type}`}>
      {message}
    </div>
  );
}

export default Toast;
