import React, { useState, useRef, useEffect } from 'react';

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
  
  // Reset height when empty
  useEffect(() => {
    if (message === '' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message]);

  return (
    <div className="w-full bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pb-6 pt-10 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <form 
          className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200 transition-all focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus-within:border-primary-green flex items-end p-2 pb-2 gap-2"
          onSubmit={handleSubmit}
        >
          {/* Mic icon removed */}
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Backend is offline...' : 'Ask about attendance, credits, or progression...'}
            rows="1"
            disabled={disabled}
            className="flex-1 max-h-[150px] min-h-[44px] py-3 px-2 bg-transparent border-none outline-none resize-none text-[15px] text-gray-900 placeholder:text-gray-400 font-medium"
          />
          
          <button 
            type="submit" 
            disabled={!message.trim() || isTyping || disabled}
            className="shrink-0 mb-1 mr-1 p-2.5 rounded-full bg-primary-green text-white hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 flex items-center justify-center transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
        
        <div className="text-center mt-3">
          <p className="text-[11px] text-gray-400 font-medium tracking-wide">
            Responses are based on official HITAM regulations documents • Press <kbd className="font-sans px-1 text-[10px] bg-gray-100 border border-gray-200 rounded">Enter</kbd> to send
          </p>
        </div>
      </div>
    </div>
  );
}

export default InputArea;
