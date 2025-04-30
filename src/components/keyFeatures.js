import React from "react";
import { Brain, Lock, Sparkles } from "lucide-react";
import Image from "next/image";

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
    <section className="bg-black text-white py-4 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-gray-100 font-bold inline-block relative">Key Features</h2>
          <p className="mt-6 text-gray-300/80 max-w-2xl mx-auto">
            Discover how G8Day combines ancient wisdom with modern technology to reveal your destiny path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-gray-900/50 rounded-lg overflow-hidden transition-all duration-300 hover:transform hover:shadow-lg hover:shadow-red-600/20 border border-gray-800 hover:border-red-600/50"
            >
              {/* Image Container */}
              <div className="relative h-fit overflow-hidden">
                <Image
                  src={feature.imageUrl}
                  alt={feature.title}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                
                {/* Icon badge */}
                <div className="absolute top-4 right-4 bg-red-500/30 p-2 rounded-full">
                  {feature.icon}
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-100 group-hover:text-red-400 flex items-center">
                  {feature.title}
                </h3>
                <p className="text-gray-300/80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}