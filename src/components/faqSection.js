"use client"
import { useState } from 'react';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is Saju in G8D?",
      answer: "Saju, also known as the Four Pillars of Destiny, is an ancient Eastern astrology method that analyzes your life's path based on your birth data. G8D reinterprets Saju using advanced AI technology to provide personalized fortune readings, offering insights into your life, wealth, relationships, and career."
    },
    {
      question: "How does the G8D AI Fortune Engine work?",
      answer: "The G8D AI Fortune Engine uses GPT-powered analysis and curated Saju datasets to generate personalized fortune reports. By entering your birth date and time, the engine provides you with an AI-driven, data-backed analysis of your destiny, helping you understand potential life outcomes."
    },
    {
      question: "How secure is my data on the G8D platform?",
      answer: "Your data is securely stored on the blockchain, ensuring full transparency and ownership. All fortune readings and user interactions are recorded as NFTs, giving you complete control over your personal information. Blockchain technology guarantees that your data cannot be tampered with or altered."
    },
    {
      question: "What are Destiny Fragments and how can I use them?",
      answer: "Destiny Fragments are unique NFTs created from your personalized fortune readings. These NFTs represent your astrological destiny and can be collected, traded, or sold on the G8D marketplace. Rare fortune combinations may have a higher market value, making them desirable collectibles."
    },
    {
      question: "How do I earn G8D tokens?",
      answer: "You can earn G8D tokens through various activities on the platform, such as participating in community events, referring new users, leaving reviews, and engaging in governance decisions. Tokens can also be earned by purchasing fortune readings or through premium consultations."
    },
    {
      question: "Can I resell my Fortune NFTs?",
      answer: "Yes, Destiny Fragments (Fortune NFTs) can be resold on the G8D marketplace. Each NFT is tied to a unique fortune reading, and rare combinations may fetch higher prices, providing opportunities for trading and profit."
    },
    {
      question: "What is the purpose of the G8D Token in the ecosystem?",
      answer: "The G8D Token serves multiple purposes within the ecosystem: it grants access to fortune readings, facilitates NFT transactions, and allows users to participate in governance decisions. Holders of the token can vote on improvements and have a say in the future direction of the platform."
    },
    {
      question: "What is the roadmap for the G8D project?",
      answer: "The roadmap for G8D includes key milestones such as the launch of the AI-powered algorithm, the release of the MVP, the token and marketplace launch, DAO formation, and global expansion. The project aims to continually grow the community and introduce more advanced features like B2B astrology API services."
    },
    {
      question: "How do I participate in G8D governance?",
      answer: "G8D operates as a decentralized autonomous organization (DAO), allowing users to participate in governance by holding G8D tokens. Token holders can vote on important platform decisions, such as algorithm improvements, new features, and tokenomics changes, ensuring that the community shapes the future of the platform."
    }
  ];

  const faqCategories = [
    { name: "Platform", icon: "🔮", items: [0, 1, 2] },
    { name: "NFTs & Tokens", icon: "💰", items: [3, 4, 5, 6] },
    { name: "Governance", icon: "🏛️", items: [7, 8] }
  ];

  return (
    <>
      <div className="text-gray-200">
        <div className="pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-100">
                Frequently Asked Questions ❓
              </h1>
            </div>

            {/* Category Navigation */}
            <div className="max-w-6xl mx-auto mb-10 flex flex-wrap justify-center gap-3">
              {faqCategories.map((category) => (
                <a
                  key={category.name}
                  href={`#${category.name.toLowerCase()}`}
                  className="bg-gray-800/60 hover:bg-gray-700/60 text-gray-200 px-4 py-2 rounded-full flex items-center transition-colors duration-300 backdrop-blur-sm border border-gray-700/50"
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </a>
              ))}
            </div>

            {/* FAQ Sections */}
            <div className="max-w-3xl mx-auto">
              {faqCategories.map((category) => (
                <div
                  key={category.name}
                  id={category.name.toLowerCase()}
                  className="mb-12"
                >
                  <div className="flex items-center mb-6">
                    <div className="text-3xl mr-3">{category.icon}</div>
                    <h2 className="text-2xl font-bold text-gray-100">{category.name}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {category.items.map((itemIndex) => (
                      <div
                        key={itemIndex}
                        className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-orange-900/10 transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleFAQ(itemIndex)}
                          className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-800/20 transition-colors duration-300"
                        >
                          <h3 className="font-semibold text-lg text-gray-100">
                            {faqItems[itemIndex].question}
                          </h3>
                          <div
                            style={{ 
                              transform: openFAQ === itemIndex ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s ease'
                            }}
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-5 w-5 text-orange-500" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>
                        {openFAQ === itemIndex && (
                          <div className="px-6 py-4 bg-gray-800/20 border-t border-gray-800/30">
                            <p className="text-gray-300 leading-relaxed">
                              {faqItems[itemIndex].answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;