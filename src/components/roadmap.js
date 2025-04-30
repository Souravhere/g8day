import React from 'react'
import Link from 'next/link';
import { Brain, Users, Coins, Globe } from 'lucide-react';

function Roadmap() {
    const roadmapItems = [
        {
            period: 'Q1',
            title: 'AI algorithm & backend',
            icon: <Brain className="text-red-500" size={24} />,
            description: 'Development of core AI algorithms and backend infrastructure to power our platform.',
            status: 'current'
        },
        {
            period: 'Q2',
            title: 'MVP, Community, Testnet NFTs',
            icon: <Users className="text-red-500" size={24} />,
            description: 'Launch of minimum viable product, community building initiatives, and testnet NFT releases.',
            status: 'upcoming'
        },
        {
            period: 'Q3',
            title: 'Token launch, Mainnet, Marketplace',
            icon: <Coins className="text-red-500" size={24} />,
            description: 'Official token launch on exchanges, mainnet deployment, and marketplace implementation.',
            status: 'planned'
        },
        {
            period: 'Q4',
            title: 'DAO, Global growth, B2B APIs',
            icon: <Globe className="text-red-500" size={24} />,
            description: 'Decentralized governance structure, international expansion, and B2B API solutions.',
            status: 'vision'
        }
    ];
  return (
    <div className="bg-black text-white">
        {/* Roadmap Section */}
        <section id='Journey' className="py-20 px-6 md:px-16 max-w-7xl mx-auto relative">                
            <div className="mb-16 text-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl text-gray-100 font-bold inline-block relative">
                    Roadmap 2025
                </h2>
                <p className="mt-3 text-gray-300/80 max-w-2xl mx-auto">
                    Our strategic vision for innovation and growth throughout 2025.
                </p>
                <div className="mt-4 w-32 h-1 bg-gradient-to-r from-red-700 to-red-500 mx-auto rounded-full"></div>
            </div>
            
            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-2 md:left-1/2 transform md:-translate-x-1/2 w-1 bg-red-500 h-full rounded-full"></div>
                
                <div className="space-y-12">
                    {roadmapItems.map((item, index) => (
                        <div key={index} className={`relative ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}`}>
                            {/* Timeline marker */}
                            <div className="absolute -left-[2px] md:left-1/2 transform -translate-y-1/2 md:-translate-x-1/2 w-6 h-6 rounded-full bg-black ring-2 ring-red-500 z-10"></div>
                            
                            {/* Content */}
                            <div className={`ml-10 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                                <div className={`bg-gray-900/90 backdrop-blur-sm p-6 rounded-2xl ring shadow-md
                                    ${item.status === 'current' ? 'ring-red-500/50' : 
                                      item.status === 'upcoming' ? 'ring-red-500/50' : 
                                      item.status === 'planned' ? 'ring-red-400/50' : 'ring-red-300'}`}>
                                    <div className="flex items-center mb-3">
                                        <span className="text-xl mr-2">{item.icon}</span>
                                        <span className="text-white font-bold">{item.period}</span>
                                        <span className={`ml-auto text-xs px-2 py-1 rounded-full
                                            ${item.status === 'current' ? 'bg-red-900 text-red-100' : 
                                              item.status === 'upcoming' ? 'bg-red-800 text-red-100' : 
                                              item.status === 'planned' ? 'bg-red-700 text-red-100' : 'bg-red-500 text-red-100'}`}>
                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                                    <p className="text-gray-300">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Call to action */}
            <div className="mt-16 text-center">
                <h3 className="text-2xl font-bold mb-4 text-white">Join Our Journey</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    Be part of our growing community as we build the future of our platform throughout 2025.
                </p>
            </div>
        </section>
    </div>
  )
}

export default Roadmap