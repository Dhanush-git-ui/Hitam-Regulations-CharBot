import React from 'react';
import LogoIcon from './LogoIcon';

function ChatHeader({ backendStatus, onMenuClick, onClearChat, hasMessages }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button 
          className="p-2 -ml-2 text-gray-500 rounded-lg hover:bg-gray-100 md:hidden transition-colors"
          onClick={onMenuClick}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center">
              <LogoIcon className="w-full h-full" />
            </div>
            HITAM Regulations Assistant
          </h1>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight flex md:hidden items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center">
              <LogoIcon className="w-full h-full" />
            </div>
            HITAM Assistant
          </h1>

          
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-2.5 w-2.5">
              {backendStatus === 'online' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                backendStatus === 'online' ? 'bg-green-500' : 
                backendStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></span>
            </span>
            <span className="text-xs font-medium text-gray-500 capitalize">
              {backendStatus === 'online' ? 'Online' : backendStatus === 'checking' ? 'Connecting...' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        {hasMessages && (
          <button 
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
            onClick={onClearChat} 
            title="Clear Conversation"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        )}
      </div>
    </header>
  );
}

export default ChatHeader;
