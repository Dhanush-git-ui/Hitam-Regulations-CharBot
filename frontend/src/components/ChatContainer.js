import React from 'react';
import Message from './Message';
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
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 h-full">
      {messages.length === 0 ? (
        <WelcomeMessage onSendMessage={onSendMessage} />
      ) : (
        <div className="flex flex-col pt-4">
          {messages.map((message) => (
            <Message 
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={formatTime(message.timestamp)}
              isError={message.isError}
            />
          ))}
          {isTyping && (
            <div className="flex w-full mb-6 justify-start animate-slide-up">
              <div className="flex gap-3 max-w-[85%] flex-row">
                <div className="w-8 h-8 rounded-full flex shrink-0 items-center justify-center border border-gray-200 bg-white text-primary-green shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
                </div>
                <div className="bg-white border border-gray-200 px-5 py-4 rounded-[20px] rounded-tl-sm shadow-sm flex items-center h-12">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} className="h-4" />
        </div>
      )}
    </div>
  );
}

export default ChatContainer;
