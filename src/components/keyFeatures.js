import React from "react";
import { Brain, Lock, Sparkles } from "lucide-react";

export default function KeyFeaturesSection() {
  const features = [
    {
      id: 1,
      icon: <Brain size={24} />,
      imageUrl: "/key/card1.png",
      title: "AI Fortune Engine",
      description: "Our advanced AI algorithms analyze patterns to create personalized fortune predictions with remarkable accuracy. Experience the future of destiny forecasting powered by cutting-edge machine learning."
    },
    {
      id: 2,
      icon: <Lock size={24} />,
      imageUrl: "/key/card2.png",
      title: "Blockchain Security",
      description: "Every prediction is securely stored on our private blockchain network, ensuring your personal destiny data remains tamper-proof and private. Your fortune is protected by the most advanced cryptographic technology."
    },
    {
      id: 3,
      icon: <Sparkles size={24} />,
      imageUrl: "/key/card3.png",
      title: "Personalized Insights",
      description: "Receive custom recommendations and insights tailored to your unique destiny pattern. Our system adapts to your feedback, continuously refining your fortune pathway for greater precision and relevance."
    }
  ];

  return (
    <section className="bg-black text-white py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <div className="h-1 w-24 bg-red-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
            Discover how G8Day combines ancient wisdom with modern technology to reveal your destiny path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/20 border border-gray-800 hover:border-red-600/50"
            >
              {/* Image Container */}
              <div className="relative h-fit overflow-hidden">
                <img
                  src={feature.imageUrl}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                
                {/* Icon badge */}
                <div className="absolute top-4 right-4 bg-red-600 p-2 rounded-full">
                  {feature.icon}
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-red-400 flex items-center">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Learn More Link */}
                <div className="mt-6">
                  <a 
                    href="#" 
                    className="inline-flex items-center text-red-400 hover:text-red-300 transition-colors duration-300"
                  >
                    Learn more
                    <svg 
                      className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}