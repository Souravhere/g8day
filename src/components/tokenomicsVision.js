"use client"
import { useState, useEffect } from 'react';
import { BookOpen, Coins, UsersRound, Trophy, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function TokenomicsAndVision() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.3 });
    
    const visibilityTarget = document.querySelector('#vision-section');
    if (visibilityTarget) {
      observer.observe(visibilityTarget);
    }
    
    return () => {
      if (visibilityTarget) {
        observer.unobserve(visibilityTarget);
      }
    };
  }, []);

  const tokenDistribution = [
    { name: 'Team', value: 15, color: '#FF3333' },
    { name: 'Partnerships', value: 10, color: '#FF6666' },
    { name: 'Community Rewards', value: 25, color: '#FF9999' },
    { name: 'Liquidity', value: 20, color: '#FFCCCC' },
    { name: 'Ecosystem Fund', value: 30, color: '#FF0000' },
  ];

  const useCases = [
    { 
      icon: <BookOpen size={24} />, 
      title: 'Access Readings', 
      description: 'Unlock premium divination content and personalized readings with G8D tokens'
    },
    { 
      icon: <Coins size={24} />, 
      title: 'Trade NFTs', 
      description: 'Use G8D to acquire unique digital artifacts and destiny-altering collectibles'
    },
    { 
      icon: <UsersRound size={24} />, 
      title: 'Join Governance', 
      description: 'Participate in protocol decisions and shape the future of destiny validation'
    },
    { 
      icon: <Trophy size={24} />, 
      title: 'Earn Rewards', 
      description: 'Stake G8D to earn passive income and unlock special platform perks'
    }
  ];

  return (
    <div className="w-full bg-black text-white py-16 px-4 md:px-8">
      {/* Section 1: Token Utility & Distribution */}
      <div className="max-w-7xl mx-auto mb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">G8D Token Utility & Distribution</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Use Cases */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold mb-6">G8D Use Cases</h3>
            <p className="text-gray-300 text-lg mb-8">Access readings, trade NFTs, join governance, earn rewards.</p>
            
            <div className="space-y-6">
              {useCases.map((useCase, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border border-gray-800 rounded-lg hover:border-red-500 transition-all duration-300">
                  <div className="p-2 bg-red-500 bg-opacity-20 rounded-full text-red-500">
                    {useCase.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-medium">{useCase.title}</h4>
                    <p className="text-gray-400 mt-1">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column: Pie Chart */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold mb-8">Token Distribution</h3>
            <div className="w-full h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tokenDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationDuration={1500}
                    animationBegin={isVisible ? 0 : 2000}
                  >
                    {tokenDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section 2: Vision Statement */}
      <div id="vision-section" className="max-w-5xl mx-auto py-16">
        <div className={`border-gray-700 border p-8 md:p-12 rounded-lg transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl uppercase font-bold text-center mb-10">Vision</h2>
          
          <div className="flex">
            <div className="w-1 bg-red-500 mr-6"></div>
            <blockquote className="text-xl md:text-2xl lg:text-3xl italic font-light text-center text-gray-200">
              "To merge Eastern metaphysics with Web3 technology—making destiny a data-driven and democratized experience."
            </blockquote>
          </div>
          
          <div className="flex justify-center mt-12">
            <button className="bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-full flex items-center gap-2 transition-all">
              <BarChart3 color='white' size={20} />
              <span>Explore Our Ecosystem</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}