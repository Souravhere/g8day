import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const AIAgent = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    // Add user message to conversation
    const userMessage = {
      role: 'user',
      content: question
    };
    
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);
    setQuestion('');
    
    try {
      // Call the AI API
      const response = await fetch('/api/ai/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...conversation, userMessage]
        }),
      });
      
      if (!response.ok) {
        throw new Error('AI response error');
      }
      
      const data = await response.json();
      
      // Add AI response to conversation
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }]);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      
      // Add error message to conversation
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting to my cosmic sources. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
      // Scroll to the latest message
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-b from-indigo-900/30 to-purple-900/30 rounded-xl p-6 backdrop-blur-sm border border-indigo-500/20 shadow-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col h-[500px]"
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">Cosmic AI Guide</h2>
        
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
          {conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-indigo-200 opacity-70">
              <div className="w-16 h-16 mb-4 rounded-full bg-indigo-700/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm">Ask me anything about astrology, tarot, or your cosmic journey!</p>
            </div>
          ) : (
            conversation.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-tr-none' 
                      : 'bg-indigo-800/40 border border-indigo-500/30 text-indigo-100 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))
          )}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-indigo-800/40 border border-indigo-500/30 rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-150"></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messageEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask the cosmic AI..."
            className="flex-1 bg-indigo-800/30 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-2 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AIAgent;