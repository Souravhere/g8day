import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';

export default function VisionStatement() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.2 });
    
    const section = document.querySelector('#vision-statement');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);
  
  return (
    <section 
      id="vision-statement" 
      className="w-full bg-black text-white py-16 md:py-24 px-4 md:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">Vision</span>
              </h2>
              <p className="text-xl md:text-2xl italic mt-3 text-gray-300">Guided by Destiny, Powered by Web3</p>
            </div>
            
            <div className="relative pl-6 md:pl-8">
              {/* Vertical red accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-full"></div>
              
              {/* Quote Icon */}
              <div className="absolute -left-3 -top-6 text-red-500 bg-black rounded-full p-1">
                <Quote size={36} className="rotate-180" />
              </div>
              
              {/* Quote Text */}
              <blockquote className="text-xl md:text-2xl font-light leading-relaxed pt-8 text-shadow-glow">
                "To merge Eastern metaphysics with Web3 technology—making destiny a data-driven and democratized experience."
              </blockquote>
              
              {/* Quote Icon - Bottom */}
              <div className="absolute -right-2 -bottom-4 text-red-500 bg-black rounded-full p-1">
                <Quote size={24} />
              </div>
            </div>
            
            <div className="pt-6">
              <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-full hover:shadow-glow-red transition-all duration-300 flex items-center space-x-2 group">
                <span>Explore Our Mission</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Right Column - Visual Element */}
          <div className={`transition-all duration-1500 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl border border-gray-800">
              {/* Placeholder image - In production, replace with your actual image */}
              <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center">
                
                {/* Eastern-inspired circular element with Web3 symbolism */}
                <div className="relative w-4/5 h-4/5 animate-slow-spin">
                  {/* Outer circle */}
                  <div className="absolute inset-0 border-2 border-red-500 rounded-full opacity-30"></div>
                  
                  {/* Middle circle */}
                  <div className="absolute inset-[15%] border border-gray-400 rounded-full opacity-40"></div>
                  
                  {/* Inner circle */}
                  <div className="absolute inset-[30%] border border-red-400 rounded-full opacity-60 flex items-center justify-center">
                    {/* Yin Yang inspired element */}
                    <div className="relative w-full h-full rounded-full overflow-hidden flex">
                      <div className="w-1/2 h-full bg-gradient-to-br from-red-500 to-red-700"></div>
                      <div className="w-1/2 h-full bg-gradient-to-br from-gray-700 to-gray-900"></div>
                      
                      {/* Center dots */}
                      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-1/6 h-1/6 rounded-full bg-gray-800 border border-red-400"></div>
                      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-1/6 h-1/6 rounded-full bg-red-600 border border-gray-400"></div>
                    </div>
                  </div>
                  
                  {/* Decorative nodes and connections */}
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <div key={i} className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-40"
                      style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}>
                      <div className="absolute right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"></div>
                    </div>
                  ))}
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-transparent opacity-30 mix-blend-overlay"></div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Global styles */}
      <style jsx global>{`
        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
        }
        .shadow-glow-red {
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 60s linear infinite;
        }
      `}</style>
    </section>
  );
}