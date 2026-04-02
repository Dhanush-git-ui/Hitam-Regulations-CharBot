import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import ChatContainer from './components/ChatContainer';
import InputArea from './components/InputArea';
import Toast from './components/Toast';

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const chatEndRef = useRef(null);

  const API_URL = 'http://127.0.0.1:5000/ask';

  // Check backend status on mount and periodically
  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const checkBackendStatus = async () => {
    try {
      // Use the health check endpoint for faster status check
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('http://127.0.0.1:5000/health', {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setBackendStatus(response.ok ? 'online' : 'offline');
    } catch (error) {
      // Only set to offline if it's a connection error, not a timeout
      if (error.name === 'AbortError') {
        // Timeout - backend might be slow but still running
        console.log('Backend status check timed out, assuming online');
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
  };

  const sendMessage = async (message) => {
    if (!message.trim() || isTyping) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message }),
        signal: AbortSignal.timeout(60000)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        role: 'bot',
        content: data.answer || 'No response received',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'bot',
        content: 'Sorry, I encountered an error. Please make sure the backend server is running and try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      showToast('Failed to get response from server', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    showToast('New chat started', 'success');
  };

  const clearChat = () => {
    if (messages.length === 0) return;
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      setMessages([]);
      showToast('Chat cleared', 'success');
    }
  };

  return (
    <div className="app">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onNewChat={startNewChat}
      />
      
      <main className="main-content">
        <ChatHeader 
          backendStatus={backendStatus}
          onMenuClick={() => setSidebarOpen(true)}
          onClearChat={clearChat}
          hasMessages={messages.length > 0}
        />
        
        <ChatContainer 
          messages={messages}
          isTyping={isTyping}
          chatEndRef={chatEndRef}
          onSendMessage={sendMessage}
        />
        
        <InputArea 
          onSendMessage={sendMessage}
          isTyping={isTyping}
          disabled={false}
        />
      </main>

      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}

export default App;
