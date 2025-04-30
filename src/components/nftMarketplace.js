"use client"
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, Star, Moon, Sun, Heart, Zap, Droplets, Wind } from "lucide-react";

export default function FortuneNFTMarketplace() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef(null);
  const autoScrollRef = useRef(null);

  // Sample NFT data
  const nftCards = [
    {
      id: 1,
      name: "Lunar Flame",
      rarity: "Rare",
      domains: "Love & Wealth",
      color: "from-purple-600 to-red-500",
      glow: "purple",
      icon: <Moon size={20} className="text-purple-300" />,
      image: "/nft/lunar.png"
    },
    {
      id: 2,
      name: "Solar Fortune",
      rarity: "Legendary",
      domains: "Success & Power",
      color: "from-yellow-500 to-orange-600",
      glow: "yellow",
      icon: <Sun size={20} className="text-yellow-300" />,
      image: "/nft/solar.png"
    },
    {
      id: 3,
      name: "Heart's Destiny",
      rarity: "Uncommon",
      domains: "Romance & Family",
      color: "from-pink-500 to-red-600",
      glow: "pink",
      icon: <Heart size={20} className="text-pink-300" />,
      image: "/nft/hearts.png"
    },
    {
      id: 4,
      name: "Thunder Path",
      rarity: "Epic",
      domains: "Career & Vision",
      color: "from-blue-500 to-indigo-600",
      glow: "blue",
      icon: <Zap size={20} className="text-blue-300" />,
      image: "/nft/hearts.png"
    },
    {
      id: 5,
      name: "Ocean's Whisper",
      rarity: "Rare",
      domains: "Wisdom & Peace",
      color: "from-cyan-500 to-blue-600",
      glow: "cyan",
      icon: <Droplets size={20} className="text-cyan-300" />,
      image: "/nft/hearts.png"
    },
    {
      id: 6,
      name: "Spirit Breeze",
      rarity: "Uncommon",
      domains: "Health & Energy",
      color: "from-green-500 to-emerald-600",
      glow: "green",
      icon: <Wind size={20} className="text-green-300" />,
      image: "/nft/hearts.png"
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(autoScrollRef.current);
  }, []);

  const startAutoScroll = () => {
    clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      if (!isHovering) {
        setActiveIndex(prevIndex => (prevIndex + 1) % nftCards.length);
      }
    }, 3000);
  };

  // Handle manual navigation
  const handlePrev = () => {
    setActiveIndex(prevIndex => (prevIndex - 1 + nftCards.length) % nftCards.length);
    startAutoScroll();
  };

  const handleNext = () => {
    setActiveIndex(prevIndex => (prevIndex + 1) % nftCards.length);
    startAutoScroll();
  };

  // Scroll cards to active index
  useEffect(() => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollWidth * (activeIndex / nftCards.length);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  return (
    <section className="bg-black text-white py-20 px-4 relative overflow-hidden">
      {/* Background Accent Elements */}
      <div className="absolute top-40 -left-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -right-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-gray-100 font-bold inline-block relative">
            Your Destiny as a Collectible
          </h2>
          <p className="mt-6 text-gray-300/80 max-w-2xl mx-auto">
            Mint your unique results as "Destiny Fragments." Rarer fates have greater value.
          </p>
        </div>

        {/* Marketplace Carousel Section */}
        <div 
          className="relative px-4 md:px-12 mt-16"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Navigation Arrows */}
          <button 
            onClick={handlePrev}
            aria-label="Previous NFT"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-red-600/80 p-2 rounded-full transition-all duration-300 ring ring-gray-700 hover:ring-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={handleNext}
            aria-label="Next NFT"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-red-600/80 p-2 rounded-full transition-all duration-300 ring ring-gray-700 hover:ring-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div 
              ref={carouselRef} 
              className="flex gap-4 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-8 pt-4 mx-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {nftCards.map((card, index) => (
                <div 
                  key={card.id}
                  className={`flex-shrink-0 w-64 ml-2 md:w-72 snap-center transition-all duration-300 ${index === activeIndex ? 'scale-105' : 'scale-95 opacity-70'}`}
                >
                  {/* NFT Card */}
                  <div className={`group relative rounded-xl overflow-hidden ring ring-gray-800 hover:ring-${card.glow}-500 transition-all duration-500 transform hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-${card.glow}-500/40`}>
                    {/* Card Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img 
                        src={card.image} 
                        alt={`${card.name} NFT preview`} 
                        className="w-full h-full object-cover transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                      
                      {/* Rarity Badge */}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-black/70 ring ring-${card.glow}-500/50 flex items-center gap-1`}>
                        <Star size={12} className={`text-${card.glow}-400`} />
                        {card.rarity}
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-5 relative">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          {card.icon}
                          {card.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-400">
                        {card.rarity}: {card.domains}
                      </p>
                      
                      {/* Price Tag */}
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-gray-400">Current Value</span>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="font-medium">{(Math.random() * 1).toFixed(2)} ETH</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card ring Glow Effect */}
                    <div className={`absolute inset-0 ring ring-${card.glow}-500/0 group-hover:ring-${card.glow}-500/50 rounded-xl transition-all duration-500 pointer-events-none`}></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {nftCards.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to NFT ${index + 1}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                    index === activeIndex ? 'bg-red-600 w-6' : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA Button will be hidden */}
        {/* <div className="flex justify-center mt-12">
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-medium text-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
            <ShoppingBag size={20} />
            Browse Marketplace
          </button>
        </div> */}
      </div>
    </section>
  );
}