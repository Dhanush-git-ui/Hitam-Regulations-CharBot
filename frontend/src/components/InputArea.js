import React, { useState, useRef } from 'react';
import './InputArea.css';

function InputArea({ onSendMessage, isTyping, disabled }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isTyping && !disabled) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = Math.min(target.scrollHeight, 150) + 'px';
    setMessage(target.value);
  };

  return (
    <div className="input-container">
      <form className="input-wrapper" onSubmit={handleSubmit}>
        <div className="input-box">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Backend is offline...' : 'Ask about attendance, credits, or progression...'}
            rows="1"
            disabled={disabled}
          />
          <div className="input-actions">
            <button type="button" className="mic-btn" title="Use Microphone">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            </button>
            <button 
              type="submit" 
              className="send-btn" 
              disabled={!message.trim() || isTyping || disabled}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
        <div className="input-footer">
          <span className="disclaimer">Responses are based on official HITAM regulations documents</span>
          <span className="shortcut-hint">Press Enter to send, Shift+Enter for new line</span>
        </div>
      </form>
    </div>
  );
}

export default InputArea;
