import React from 'react';
import LogoIcon from './LogoIcon';

function Sidebar({ isOpen, onClose, onNewChat }) {
  const handleNewChat = () => {
    onNewChat();
    onClose();
  };

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col md:translate-x-0 md:static md:w-72 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col gap-6">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center group">
              <LogoIcon className="w-full h-full group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">HITAM Assistant</span>
          </div>


          {/* New Chat Button */}
          <button 
            onClick={handleNewChat}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary-green text-white rounded-xl shadow-sm hover:shadow-md hover:bg-green-700 transition-all duration-200 font-medium"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Chat
          </button>
        </div>
        
        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Recent</div>
          <div className="flex items-center gap-3 px-4 py-3 bg-primary-light text-primary-green rounded-xl cursor-pointer font-medium mb-2 border border-green-200/50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span className="truncate">Current Chat</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-100 mt-auto">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-green"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              About
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Ask questions about regulations, attendance, and student progression frameworks.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={onClose}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
