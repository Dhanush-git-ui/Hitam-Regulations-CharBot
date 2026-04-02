import React from 'react';
import './ChatHeader.css';

function ChatHeader({ backendStatus, onMenuClick, onClearChat, hasMessages }) {
  return (
    <header className="chat-header">
      <button className="menu-toggle" onClick={onMenuClick}>
        <i className="fas fa-bars"></i>
      </button>
      
      <div className="header-logo">
        <img src="/logo.png" alt="HITAM Logo" />
      </div>
      
      <div className="header-title">
        <h1>HITAM Regulations Assistant</h1>
        <span className="status-indicator">
          {backendStatus === 'online' ? '🟢 Online' : backendStatus === 'checking' ? '🟡 Checking...' : '🔴 Offline'}
        </span>
      </div>
      
      <div className="header-actions">
        {hasMessages && (
          <button className="icon-btn" onClick={onClearChat} title="Clear Chat">
            <i className="fas fa-trash"></i>
          </button>
        )}
      </div>
    </header>
  );
}

export default ChatHeader;
