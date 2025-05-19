'use client'

import { FaHome, FaGift, FaStar, FaUser, FaRobot } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function BottomNav({ activeTab, setActiveTab }) {
  const router = useRouter();
  
  const tabs = [
    { id: 'home', label: 'Home', icon: <FaHome />, color: 'from-red-500 to-red-600' },
    { id: 'rewards', label: 'Rewards', icon: <FaGift />, color: 'from-green-500 to-green-600' },
    { id: 'destiny', label: 'Destiny', icon: <FaStar />, color: 'from-yellow-500 to-yellow-600' },
    { id: 'profile', label: 'Profile', icon: <FaUser />, color: 'from-blue-500 to-blue-600' },
    { id: 'agent', label: 'Agent', icon: <FaRobot />, color: 'from-purple-500 to-purple-600' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    // If this is the Agent tab and we want to navigate to a different route
    if (tabId === 'agent' && window.location.pathname !== '/telegram/agent') {
      router.push('/telegram/agent');
    }
  };

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 border-t border-indigo-800 flex justify-around py-2 px-1 max-w-md mx-auto backdrop-blur-md z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className="flex flex-col items-center justify-center px-2 py-1 rounded-lg w-16"
          whileTap={{ scale: 0.9 }}
          whileHover={{ y: -2 }}
        >
          <motion.div
            className={`flex flex-col items-center relative ${
              activeTab === tab.id ? 'text-white' : 'text-gray-400'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-full opacity-20 -z-10`}
                layoutId="activeTabBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <motion.span 
              className={`text-xl mb-1 ${activeTab === tab.id ? 'text-2xl' : 'text-xl'}`}
              animate={{ 
                scale: activeTab === tab.id ? 1.2 : 1,
                y: activeTab === tab.id ? -2 : 0
              }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {tab.icon}
            </motion.span>
            <motion.span 
              className={`text-xs ${activeTab === tab.id ? 'font-bold' : 'font-normal'}`}
              animate={{ 
                opacity: activeTab === tab.id ? 1 : 0.8
              }}
            >
              {tab.label}
            </motion.span>
            {activeTab === tab.id && (
              <motion.div
                className="h-1 w-4 bg-gradient-to-r from-red-400 to-purple-400 rounded-full mt-1"
                layoutId="activeTabIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              />
            )}
          </motion.div>
        </motion.button>
      ))}
    </motion.nav>
  );
}