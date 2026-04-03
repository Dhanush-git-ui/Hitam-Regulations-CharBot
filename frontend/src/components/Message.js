import React from 'react';
import LogoIcon from './LogoIcon';

function Message({ role, content, timestamp, isError }) {
  const formatContent = (text) => {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  const isUser = role === 'user';

  return (
    <div className={`flex w-full mb-6 animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center border shadow-sm ${
          isUser 
            ? 'bg-primary-green text-white border-transparent p-1.5' 
            : 'bg-white border-gray-200 overflow-hidden'
        }`}>
          {isUser ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          ) : (
            <LogoIcon className="w-full h-full" />
          )}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${
            isUser 
              ? 'bg-primary-green text-white rounded-[20px] rounded-tr-sm font-medium' 
              : `bg-white text-gray-800 border border-gray-200 rounded-[20px] rounded-tl-sm ${isError ? 'text-red-500 border-red-200' : ''}`
          }`}>
            <span dangerouslySetInnerHTML={{ __html: formatContent(content) }} className="break-words"/>
          </div>
          <span className="text-[11px] text-gray-400 mt-1.5 px-1 font-medium">{timestamp}</span>
        </div>
      </div>
    </div>
  );
}

export default Message;

