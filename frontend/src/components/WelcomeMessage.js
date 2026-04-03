import React, { useEffect, useState } from 'react';
import LogoIcon from './LogoIcon';

function WelcomeMessage({ onSendMessage }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch from backend
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/files', { signal: AbortSignal.timeout(5000) });
        if (response.ok) {
          const data = await response.json();
          setFiles(data);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (error) {
        console.log('Falling back to mock files due to error fetching from backend:', error);
        // Fallback or mock data if backend not ready
        setFiles([
          { name: "Attendance Policy.pdf", description: "Rules for class attendance and leaves" },
          { name: "Credits System.pdf", description: "Grading and credit requirements" },
          { name: "Student Progression.pdf", description: "Criteria for advancing to next year" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleDocumentClick = (fileName) => {
    // autofill query to send about this document
    const query = `What does ${fileName} say?`;
    onSendMessage(query);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 animate-slide-up">
      <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-xl border border-gray-100 mb-8 transform hover:scale-110 transition-transform duration-500 hover:rotate-3">
        <LogoIcon className="w-full h-full" />
      </div>

      
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center tracking-tight">
        Welcome to HITAM Regulations Assistant
      </h2>
      <p className="text-gray-500 mb-10 text-center max-w-md mx-auto">
        Your intelligent guide to college rules, attendance policies, and student frameworks.
      </p>

      <div className="w-full max-w-3xl">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 px-1">
          Available Documents
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse flex space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file, index) => (
              <button 
                key={index} 
                className="text-left bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 group"
                onClick={() => handleDocumentClick(file.name)}
              >
                <div className="bg-red-50 p-2.5 rounded-lg shrink-0 group-hover:bg-red-100 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate mb-0.5">{file.name}</h4>
                  {file.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">{file.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WelcomeMessage;
