import React from 'react';
import './WelcomeMessage.css';

function WelcomeMessage({ onSendMessage }) {
  const suggestions = [
    { text: 'What is the attendance policy?', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> },
    { text: 'Explain student progression', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> },
    { text: 'Requirements for Band A & B', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> },
    { text: 'Band C & D endorsement', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> }
  ];

  return (
    <div className="welcome-message">
      <div className="welcome-logo" title="HITAM College Logo">
        <img 
          src="/logo.png" 
          alt="HITAM College Logo - Hyderabad Institute of Technology and Management"
          loading="eager"
        />
      </div>
      <h2>Welcome to HITAM Regulations Bot</h2>
      <p>Ask anything about attendance, credits, or student progression.</p>
      <div className="suggestions-grid">
        {suggestions.map((item, index) => (
          <button 
            key={index} 
            className="suggestion-btn" 
            onClick={() => onSendMessage(item.text)}
          >
            <span className="suggestion-icon">{item.icon}</span>
            <span>{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default WelcomeMessage;
