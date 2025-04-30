import React from "react";
import { Brain, Scroll, Database } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="bg-black text-white py-20 relative overflow-hidden">
      
      {/* Subtle blue accent */}
      <div className="absolute -left-40 top-40 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl"></div>
      <div className="absolute -right-40 bottom-40 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold inline-block relative">
            What is G8Day?
          </h2>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mx-auto">
          {/* Content area */}
          <div className="lg:w-1/2 space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              G8Day represents a groundbreaking fusion of ancient wisdom and cutting-edge technology. 
              We've combined the profound insights of Saju (Four Pillars of Destiny) - a traditional 
              Eastern philosophical system for understanding personal destiny - with advanced AI algorithms 
              and secure blockchain technology.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Our platform analyzes your unique Saju elements, processes them through our proprietary AI 
              models, and securely stores your personalized fortune on the blockchain. This creates an 
              immutable record of your destiny path that evolves with unprecedented accuracy as you interact 
              with our system.
            </p>
            
            <div className="flex items-center pt-6">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-grow"></div>
              <span className="px-4 text-gray-400">Experience the difference</span>
              <div className="h-px bg-gradient-to-r from-gray-600 via-gray-600 to-transparent flex-grow"></div>
            </div>
          </div>
          
          {/* Visual area */}
          <div className="lg:w-1/2 hidden">
            <div className="relative h-64 md:h-80 flex items-center justify-center">
              {/* Center ring connecting the icons */}
              <div className="absolute w-32 h-32 border-2 border-blue-500/30 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 border-2 border-indigo-500/40 rounded-full animate-pulse"></div>
              </div>
              
              {/* Brain icon for AI */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center shadow-lg shadow-blue-700/20">
                <Brain size={32} className="text-blue-200" />
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-blue-400 font-medium">AI Analysis</span>
                </div>
              </div>
              
              {/* Scroll icon for Saju */}
              <div className="absolute bottom-1/4 left-0 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-full flex items-center justify-center shadow-lg shadow-indigo-700/20">
                <Scroll size={32} className="text-indigo-200" />
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-indigo-400 font-medium">Saju Wisdom</span>
                </div>
              </div>
              
              {/* Database icon for Blockchain */}
              <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-16 h-16 bg-gradient-to-br from-purple-900 to-purple-700 rounded-full flex items-center justify-center shadow-lg shadow-purple-700/20">
                <Database size={32} className="text-purple-200" />
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-purple-400 font-medium">Blockchain Security</span>
                </div>
              </div>
              
              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M200 50 L120 180 M200 50 L280 180" stroke="url(#gradient)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M120 180 L280 180" stroke="url(#gradient)" strokeWidth="2" strokeDasharray="4 4" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}