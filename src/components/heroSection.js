import React from "react";

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-b from-black to-gray-900 text-white min-h-screen flex items-center justify-center w-full relative overflow-hidden">
      {/* Grid overlay pattern */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none">
        {Array(36).fill().map((_, i) => (
          <div key={i} className="border border-gray-700">
            {i % 5 === 0 && <div className="h-full w-full flex items-center justify-center">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>}
          </div>
        ))}
      </div>
      
      {/* Subtle blue arc at bottom */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="w-full h-40 mx-auto rounded-full bg-blue-600/10 blur-2xl transform translate-y-1/2"></div>
      </div>
      
      {/* Content container */}
      <div className="container mx-auto px-6 z-10 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Unlock Your Potential With<br />
            Personalized Investment Strategies.
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg text-gray-300 mb-10 mx-auto max-w-2xl leading-relaxed">
            We're here to empower you every step of the way. Whether you're managing your
            personal finances or seeking innovative investment opportunities.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="border border-gray-600 text-white hover:bg-gray-800 font-medium py-3 px-10 rounded-full transition-all duration-300">
              Learn More
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium py-3 px-10 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300">
              Get Started
            </button>
          </div>
          
          {/* Client avatars with counter */}
          <div className="flex items-center justify-center">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-gray-900 overflow-hidden bg-gray-300">
                <img src="/api/placeholder/40/40" alt="Client 1" className="object-cover" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-gray-900 overflow-hidden bg-gray-300">
                <img src="/api/placeholder/40/40" alt="Client 2" className="object-cover" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-gray-900 overflow-hidden bg-gray-300">
                <img src="/api/placeholder/40/40" alt="Client 3" className="object-cover" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-gray-900 overflow-hidden bg-gray-300">
                <img src="/api/placeholder/40/40" alt="Client 4" className="object-cover" />
              </div>
            </div>
            <div className="ml-3 text-left">
              <p className="font-semibold">Over 10,000+</p>
              <p className="text-sm text-gray-400">Active clients</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}