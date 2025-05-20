'use client'

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Star, Moon, Sun, Sparkles, ChevronRight } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll to hide/show navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { id: 'home', icon: <Sun className="w-5 h-5" />, label: 'Home' },
    { id: 'rewards', icon: <Star className="w-5 h-5" />, label: 'Rewards' },
    { id: 'destiny', icon: <Moon className="w-5 h-5" />, label: 'Destiny' },
    { id: 'agent', icon: <Sparkles className="w-5 h-5" />, label: 'AI Agent' },
  ];

  return (
    <nav className={cn(
      "flex justify-around items-center w-full transition-all duration-300 transform",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
    )}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={cn(
            "flex flex-col items-center px-3 py-1 relative transition-all duration-300",
            activeTab === item.id 
              ? "text-white" 
              : "text-red-300 hover:text-white"
          )}
        >
          <div className={cn(
            "p-1 rounded-full transition-all duration-300",
            activeTab === item.id 
              ? "bg-red-700 shadow-lg" 
              : "bg-transparent"
          )}>
            {item.icon}
          </div>
          
          <span className={cn(
            "text-xs mt-1 font-medium transition-all duration-300",
            activeTab === item.id 
              ? "opacity-100" 
              : "opacity-70"
          )}>
            {item.label}
          </span>
          
          {activeTab === item.id && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
          )}
        </button>
      ))}
    </nav>
  );
}