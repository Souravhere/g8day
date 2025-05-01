import React from "react";
import { Brain, Scroll, Database } from "lucide-react";
import { AnimatedBeamMultipleOutputDemo } from "./ui/beamImport";

export default function AboutSection() {
  return (
    <section id="about" className="bg-black py-20 relative overflow-hidden">
      
      {/* Subtle blue accent */}
      <div className="absolute -left-40 top-40 w-80 h-80 rounded-full bg-red-600/20 blur-3xl"></div>
      <div className="absolute -right-40 bottom-40 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-2">
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-gray-100 font-bold inline-block relative">
            What is G8Day?
          </h2>
        </div>
        
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 mx-auto py-4">
          {/* Content area */}
          <div className="lg:w-1/2 space-y-6">
            <p className="text-lg text-gray-300/90 leading-relaxed">
              G8Day represents a groundbreaking fusion of ancient wisdom and cutting-edge technology. 
              We've combined the profound insights of Saju (Four Pillars of Destiny) - a traditional 
              Eastern philosophical system for understanding personal destiny - with advanced AI algorithms 
              and secure blockchain technology.
            </p>
            {/* <p className="text-lg text-gray-300/80 leading-relaxed">
              Our platform analyzes your unique Saju elements, processes them through our proprietary AI 
              models, and securely stores your personalized fortune on the blockchain. This creates an 
              immutable record of your destiny path that evolves with unprecedented accuracy as you interact 
              with our system.
            </p> */}
            
          </div>
          <div className="lg:w-1/2 flex items-center justify-center">
            <AnimatedBeamMultipleOutputDemo/>
          </div>
        </div>
        <div className="flex items-center pt-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-gray-600 flex-grow"></div>
          <span className="px-4 text-gray-400">Experience the difference</span>
          <div className="h-px bg-gradient-to-r from-gray-600 via-gray-600 to-transparent flex-grow"></div>
        </div>
      </div>
    </section>
  );
}