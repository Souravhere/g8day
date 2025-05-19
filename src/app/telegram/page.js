'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ClaimButton from '@/components/miniappui/ClaimButton';
import UserStats from '@/components/miniappui/UserStats';
import TaskCenter from '@/components/miniappui/TaskCenter';
import ReferralSection from '@/components/miniappui/ReferralSection';
import Leaderboard from '@/components/miniappui/Leaderboard';
import MysticQuote from '@/components/miniappui/MysticQuote';
import BottomNav from '@/components/miniappui/BottomNav';

import Profile from '@/components/miniappui/Profile';
import Rewards from '@/components/miniappui/Rewards';
import Destiny from '@/components/miniappui/Destiny';
import Agent from '@/components/miniappui/Agent';

import { parseTelegramData } from '@/lib/utils';
import { useStore } from '@/lib/storage';

export default function TelegramMiniApp() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { tickets } = useStore();

  // Hide the footer and navbar 
  useEffect(() => {
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');
    if (nav) nav.style.display = 'none';
    if (footer) footer.style.display = 'none';

    return () => {
        if (nav) nav.style.display = '';
        if (footer) footer.style.display = '';
    };
  }, []);

  // Enhanced Telegram Web App data initialization
  useEffect(() => {
    const initializeTelegramData = async () => {
      setIsLoading(true);
      
      try {
        if (typeof window !== 'undefined') {
          // Wait for Telegram WebApp to be ready
          const checkWebApp = () => {
            if (window.Telegram?.WebApp) {
              const webApp = window.Telegram.WebApp;
              webApp.ready();
              
              const initData = parseTelegramData(webApp.initDataUnsafe);
              
              if (initData.user) {
                setUser(initData.user);
                localStorage.setItem('g8day-user', JSON.stringify(initData.user));
              } else {
                // Try to load from cache
                const cachedUser = localStorage.getItem('g8day-user');
                if (cachedUser) {
                  setUser(JSON.parse(cachedUser));
                } else {
                  // Fallback user data
                  setUser({ 
                    first_name: 'Stargazer', 
                    id: 'unknown',
                    photo_url: 'https://via.placeholder.com/100'
                  });
                }
              }
              
              setIsLoading(false);
              return true;
            }
            return false;
          };
          
          // Try immediately first
          if (!checkWebApp()) {
            // If not available, set up a retry with timeout
            const maxRetries = 5;
            let retries = 0;
            
            const retryInterval = setInterval(() => {
              if (checkWebApp() || retries >= maxRetries) {
                clearInterval(retryInterval);
                setIsLoading(false);
              }
              retries++;
            }, 500);
          }
        }
      } catch (error) {
        console.error("Error initializing Telegram data:", error);
        setIsLoading(false);
        
        // Fallback user data
        setUser({ 
          first_name: 'Stargazer', 
          id: 'unknown',
          photo_url: 'https://via.placeholder.com/100'
        });
      }
    };
    
    initializeTelegramData();
  }, []);

  const handleAgentAccess = () => {
    if (tickets > 0) {
      setActiveTab('agent');
    } else {
      // Use native Telegram alert if available
      if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: 'Ticket Required',
          message: 'You need at least 1 Creation Ticket to access the AI Astrology Agent.',
          buttons: [{type: 'ok'}]
        });
      } else {
        alert('You need at least 1 Creation Ticket to access the AI Astrology Agent.');
      }
    }
  };

  // TopNav component
  const TopNav = () => (
    <motion.div 
      className="w-full flex justify-between items-center py-2 px-1 mb-2"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <motion.div 
          className="w-10 h-10 flex items-center justify-center bg-red-900 rounded-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-white text-xl font-bold">G8</span>
        </motion.div>
        <span className="ml-2 font-orbitron text-lg text-white">G8Day</span>
      </div>
      
      {user && (
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('profile')}
        >
          <div className="text-right mr-2">
            <p className="text-white text-sm font-medium">{user.first_name}</p>
            <p className="text-red-300 text-xs">{useStore.getState().ghibPoints} G8D</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-500 shadow-lg">
            <img 
              src={user.photo_url || "https://via.placeholder.com/100"} 
              alt={user.first_name} 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  // Render appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <UserStats user={user} />
            <ClaimButton />

            {/* Create Card CTA */}
            <motion.div 
              className="bg-gradient-to-r from-red-900 to-red-700 rounded-lg p-4 shadow-lg my-6 border border-red-600"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-center text-white font-unica mb-4">
                Use your G8D to unlock mystical AI creations. Tap into the ancient power of astrology through your imagination.
              </p>
              <div className="flex justify-center gap-4">
                <motion.button
                  onClick={() => useStore.getState().buyTickets(1)}
                  disabled={useStore.getState().ghibPoints < 500}
                  className="bg-gradient-to-r from-white to-red-100 text-red-900 px-4 py-2 rounded-lg font-unica font-bold disabled:opacity-50 shadow-md"
                  whileTap={{ scale: 0.95 }}
                >
                  🎴 1 Ticket (500 G8D)
                </motion.button>
                <motion.button
                  onClick={() => useStore.getState().buyTickets(5)}
                  disabled={useStore.getState().ghibPoints < 2000}
                  className="bg-gradient-to-r from-white to-red-100 text-red-900 px-4 py-2 rounded-lg font-unica font-bold disabled:opacity-50 shadow-md"
                  whileTap={{ scale: 0.95 }}
                >
                  🎴 5 Tickets (2,000 G8D)
                </motion.button>
              </div>
            </motion.div>

            {/* AI Agent Access */}
            <motion.button
              onClick={handleAgentAccess}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg font-unica mb-6 shadow-lg border border-red-500 text-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              ✨ Start AI Astrology Reading
            </motion.button>

            {/* Task Center */}
            <TaskCenter />

            {/* Referral Section */}
            <ReferralSection userId={user?.id} />

            {/* Leaderboard */}
            <Leaderboard user={user} />

            {/* Mystic Quote */}
            <MysticQuote />
            
            {/* Extra space at bottom for navigation */}
            <div className="h-20"></div>
          </motion.div>
        );
      case 'rewards':
        return <Rewards />;
      case 'destiny':
        return <Destiny user={user} />;
      case 'profile':
        return <Profile user={user} />;
      case 'agent':
        return <Agent user={user} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-red-950 text-white flex flex-col items-center justify-center p-4">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }} 
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-16 h-16 border-4 border-t-white border-red-300 rounded-full"
        />
        <p className="mt-4 text-white font-unica">Loading G8Day...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 overflow-x-hidden">
      <div className="w-full max-w-md">
        {/* Top Navigation */}
        <TopNav />
        
        {/* Header
        <motion.div 
          className="text-center mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-white via-red-200 to-red-100">G8Day</h1>
          <p className="text-white font-unica">Where Astrology Meets AI</p>
          <p className="text-sm text-red-200 font-cinzel">
            Explore your destiny. Earn, Create, Evolve.
          </p>
        </motion.div> */}

        {/* Main Content Area with Animation */}
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}