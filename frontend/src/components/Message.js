import React from 'react';
import './Message.css';

function Message({ role, content, timestamp, isError }) {
  const formatContent = (text) => {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  return (
    <div className={`message ${role}`}>
      <div className="message-avatar">
        <i className={`fas ${role === 'user' ? 'fa-user' : 'fa-robot'}`}></i>
      </div>
      <div className="message-content-wrapper">
        <div 
          className="message-content" 
          style={isError ? { color: '#ef4444' } : {}}
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
        <div className="message-time">{timestamp}</div>
      </div>
    </div>
  );
}

export default Message;
