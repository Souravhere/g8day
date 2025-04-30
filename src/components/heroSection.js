'use client'
import React, { useState, useEffect } from "react";
import { Sparkles, ChevronRight } from "lucide-react";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center w-full relative overflow-hidden">
        
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80 z-0"></div>
      
      {/* Particle effect overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header with animation */}
          <div className={`flex justify-center mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
            <div className="relative">
              <Sparkles className="text-red-500" size={48} />
              <div className="absolute -inset-1 bg-red-500/30 rounded-full blur-sm animate-pulse"></div>
            </div>
          </div>
          
          {/* Headline with split design */}
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-8 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Discover Your Destiny</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-300">with AI & Blockchain</span>
          </h1>
          
          {/* Description with improved typography */}
          <p className={`text-lg md:text-xl text-gray-300 mb-10 mx-auto max-w-2xl leading-relaxed transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
            G8Day combines cutting-edge AI predictions with secure blockchain technology 
            to unveil the path to your future. Our revolutionary platform analyzes cosmic patterns and digital footprints to reveal insights about your untapped potential.
          </p>
          
          {/* CTA section with multiple elements */}
          <div className={`flex flex-col md:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
            <button className="group bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg flex items-center gap-2 shadow-lg shadow-red-600/20 hover:shadow-red-600/40">
              Explore Your Fortune
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <a href="#learn-more" className="text-gray-300 hover:text-white transition-colors duration-300 underline-offset-4 decoration-red-500/50 hover:decoration-red-500 underline">
              Learn how it works
            </a>
          </div>
          
          {/* Stats counter */}
          <div className={`mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-center transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
            <div className="p-4">
              <p className="text-3xl font-bold text-red-500">25M+</p>
              <p className="text-gray-400">Predictions Made</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-red-500">96%</p>
              <p className="text-gray-400">Accuracy Rate</p>
            </div>
            <div className="p-4 col-span-2 md:col-span-1">
              <p className="text-3xl font-bold text-red-500">120K+</p>
              <p className="text-gray-400">Daily Users</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-red-900/10 to-transparent"></div>
    </div>
  );
}