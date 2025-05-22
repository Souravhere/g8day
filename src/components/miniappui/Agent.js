import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const AIAgent = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);


    // Hide the bottomnav and topnav when input is active
    useEffect(() => {
      const handleFocus = () => {
        const topnav = document.querySelector('.topnav');
        if (topnav) topnav.style.display = 'none';
      };

      const handleBlur = () => {
        const topnav = document.querySelector('.topnav');
        if (topnav) topnav.style.display = '';
      };

      const input = inputRef.current;
      if (input) {
        input.addEventListener('focus', handleFocus);
        input.addEventListener('blur', handleBlur);
      }

      return () => {
        if (input) {
          input.removeEventListener('focus', handleFocus);
          input.removeEventListener('blur', handleBlur);
        }
      };
    }, []);

  // Initial greeting message
  useEffect(() => {
    setConversation([
      {
        role: 'assistant',
        content: "Welcome to your Mystical Guide! I'm here to discuss astrology, tarot readings, and spiritual insights. How may I assist you on your cosmic journey today?"
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

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
      // Call the AI API with the astrology system prompt
      const systemPrompt = {
        role: "system",
        content: "You are a mystical guide specialized in astrology, tarot readings, and spiritual insights. Only provide information related to these topics. If asked about unrelated subjects, politely redirect the conversation to astrology, tarot, or spiritual guidance. Keep responses concise, engaging, and mystical in tone."
      };
      
      // Create the complete messages array with system prompt and conversation history
      const messages = [
        systemPrompt,
        ...conversation.slice(-5), // Send last 5 messages for context
        userMessage
      ];
      
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });
      
      if (!response.ok) {
        throw new Error('AI response error');
      }
      
      const data = await response.json();
      
      // Add AI response to conversation
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: data.reply || "I sense cosmic interference. Could you rephrase your question?"
      }]);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      
      // Add error message to conversation
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: "The celestial connection seems disturbed. Please try again when the cosmic energies realign."
      }]);
    } finally {
      setIsLoading(false);
      // Focus on input after response
      inputRef.current?.focus();
    }
  };

  // Handle keypress
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-b from-red-900/40 to-red-950/40 rounded-xl p-3 backdrop-blur-sm border border-red-500/30 shadow-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col h-[75vh]"
      > 
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-red-700 scrollbar-track-red-950/30">
          {conversation.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mr-2 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              )}
              
              <div 
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white rounded-tr-none shadow-md' 
                    : 'bg-red-950/40 border border-red-500/30 text-red-100 rounded-tl-none shadow-md'
                }`}
              >
                <p className="whitespace-pre-wrap text-[12px]">{msg.content}</p>
              </div>
              
              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center ml-2 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mr-2 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <div className="bg-red-950/40 border border-red-500/30 rounded-2xl rounded-tl-none px-4 py-3 shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse delay-150"></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messageEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your cosmic journey..."
            className="w-full bg-red-950/50 border border-red-500/40 rounded-lg pl-4 pr-12 py-3 text-white placeholder-red-300/50 outline-none"
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            disabled={isLoading || !question.trim()}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-2 rounded-lg shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </motion.button>
        </form>
        
        <div className="text-center mt-3">
          <p className="text-xs text-red-300/50">
            Ask about astrology, tarot readings, or spiritual guidance
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AIAgent;