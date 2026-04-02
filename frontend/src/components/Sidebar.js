import React from 'react';
import './Sidebar.css';

function Sidebar({ isOpen, onClose, onNewChat }) {
  const handleNewChat = () => {
    onNewChat();
    onClose();
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src="/logo.png" alt="HITAM Logo" className="logo-image" />
            <span>HITAM Bot</span>
          </div>
          <button className="new-chat-btn" onClick={handleNewChat}>
            <i className="fas fa-plus"></i>
            New Chat
          </button>
        </div>
        
        <div className="chat-history">
          <div className="history-item active">
            <i className="fas fa-message"></i>
            <span>Current Chat</span>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="info-section">
            <h4>About</h4>
            <p>Ask questions about HITAM college regulations, attendance policies, and student progression frameworks.</p>
          </div>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
    </>
  );
}

export default Sidebar;
