import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
        <div className="w-full h-40 mx-auto rounded-full bg-orange-600/20 blur-2xl transform translate-y-1/2"></div>
      </div>
      
      {/* Content container */}
      <div className="container mx-auto px-6 z-10 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Headline */}
          <h1 className="text-5xl text-gray-100 md:text-6xl lg:text-7xl scale-105 font-bold mb-6 tracking-tight">
          Discover <span className="text-red-400">Your Destiny</span> with <br />
          AI & Blockchain
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg text-gray-300/80 mb-10 mx-auto max-w-2xl leading-relaxed">
          G8Day blends ancient Eastern astrology with AI and blockchain technology to reveal deep insights into your destiny from wealth and career to love and life’s purpose.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 lg:scale-110">
            <Link href='/' className="flex items-center gap-2 text-xl bg-gradient-to-r from-red-500 to-red-400 text-white font-medium py-3 px-10 rounded-full shadow-lg shadow-red-500/30 hover:shadow-red-500/40 transition-all duration-300">
              Get Started
              <ArrowUpRight/>
            </Link>
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
              <p className="font-semibold">Over 5,000+</p>
              <p className="text-sm text-gray-400">Trust Us</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}