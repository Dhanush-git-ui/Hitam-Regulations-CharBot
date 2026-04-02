import React from 'react';
import './ChatContainer.css';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import WelcomeMessage from './WelcomeMessage';

function ChatContainer({ messages, isTyping, chatEndRef, onSendMessage }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="chat-container">
      {messages.length === 0 ? (
        <WelcomeMessage onSendMessage={onSendMessage} />
      ) : (
        <>
          {messages.map((message) => (
            <Message 
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={formatTime(message.timestamp)}
              isError={message.isError}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={chatEndRef} />
        </>
      )}
    </div>
  );
}

export default ChatContainer;
