import React from 'react';
import './TypingIndicator.css';

function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="typing-bubble">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="typing-text">Bot is typing...</span>
    </div>
  );
}

export default TypingIndicator;
