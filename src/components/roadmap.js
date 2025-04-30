'use client'
import { useState, useEffect } from 'react';
import { 
  Brain, 
  Users, 
  Coins, 
  Globe, 
  Calendar, 
  ChevronRight
} from 'lucide-react';

export default function RoadmapTimeline() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeQuarter, setActiveQuarter] = useState(null);
  
  useEffect(() => {
    // Check if we're on mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set the initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Setup intersection observer for animation
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
          const quarter = entry.target.getAttribute('data-quarter');
          if (quarter) {
            setActiveQuarter(quarter);
          }
        }
      });
    }, observerOptions);
    
    // Observe all timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
      observer.observe(item);
    });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);
  
  const quarters = [
    {
      id: 'q1',
      title: 'AI algorithm & backend',
      icon: <Brain className="text-red-600" size={24} />,
      details: 'Q1'
    },
    {
      id: 'q2',
      title: 'MVP, Community, Testnet NFTs',
      icon: <Users className="text-red-600" size={24} />,
      details: 'Q2'
    },
    {
      id: 'q3',
      title: 'Token launch, Mainnet, Marketplace',
      icon: <Coins className="text-red-600" size={24} />,
      details: 'Q3'
    },
    {
      id: 'q4',
      title: 'DAO, Global growth, B2B APIs',
      icon: <Globe className="text-red-600" size={24} />,
      details: 'Q4'
    }
  ];
  
  return (
    <div className="w-full min-h-screen bg-black text-white p-6 flex flex-col items-center font-sans">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-center mb-16 mt-8">
          <Calendar className="text-red-600 mr-3" size={32} />
          <h1 className="text-4xl font-bold uppercase tracking-wider">ROADMAP 2025</h1>
          <ChevronRight className="text-red-600 ml-3" size={32} />
        </div>
        
        {/* Title Underline */}
        <div className="w-32 h-1 bg-red-600 mx-auto mb-16 rounded-full"></div>
        
        {/* Timeline Layout */}
        <div className={`w-full ${isMobile ? 'flex flex-col space-y-12' : 'grid grid-cols-4 gap-6'}`}>
          {quarters.map((quarter, index) => (
            <div 
              key={quarter.id}
              data-quarter={quarter.id}
              className={`timeline-item opacity-0 transition-all duration-700 ${
                activeQuarter === quarter.id ? 'scale-105' : ''
              }`}
            >
              {/* Quarter Marker */}
              <div className="flex items-center mb-4">
                <div className={`w-3 h-3 rounded-full bg-red-600 ${
                  activeQuarter === quarter.id ? 'animate-pulse' : ''
                }`}></div>
                <div className={`h-1 ${isMobile ? 'w-12' : 'w-full'} bg-red-600 mx-2 
                  ${index === quarters.length - 1 && !isMobile ? 'hidden' : ''}
                  ${isMobile ? 'hidden' : 'timeline-connector'}`}
                ></div>
                <span className="text-red-600 font-bold">{quarter.details}</span>
              </div>
              
              {/* Content Box */}
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-red-600 
                transition-all duration-300 h-full">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gray-800 rounded-md mr-3">
                    {quarter.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{quarter.title}</h3>
                </div>
                
                {/* Connecting line for mobile */}
                {isMobile && index !== quarters.length - 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="w-1 h-12 bg-red-600"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .animate-fadeIn {
          opacity: 1;
          transform: translateY(0);
        }
        .timeline-item {
          transform: translateY(20px);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .timeline-connector {
          position: relative;
          overflow: hidden;
        }
        .timeline-connector::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          background-color: rgb(220, 38, 38);
          animation: lineGrow 1.5s ease-out forwards;
          animation-delay: 0.5s;
        }
        @keyframes lineGrow {
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}