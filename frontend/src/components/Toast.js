import React from 'react';

function Toast({ show, message, type }) {
  if (!show) return null;

  const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-primary-green' : 'bg-gray-800';

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className={`${bgColor} text-white px-4 py-2.5 rounded-xl shadow-lg border border-black/10 flex items-center gap-2 text-sm font-medium`}>
        {type === 'error' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        )}
        {type === 'success' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        )}
        {message}
      </div>
    </div>
  );
}

export default Toast;
