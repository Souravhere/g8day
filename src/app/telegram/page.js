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

  // Initialize Telegram Web App data
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      const initData = parseTelegramData(webApp.initDataUnsafe);
      setUser(initData.user || { 
        first_name: 'Stargazer', 
        id: 'unknown',
        photo_url: 'https://via.placeholder.com/100'
      });
      
      // Cache user data
      if (initData.user) {
        localStorage.setItem('g8day-user', JSON.stringify(initData.user));
      } else {
        // Try to load from cache
        const cachedUser = localStorage.getItem('g8day-user');
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }
      }
    }
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
              className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-4 shadow-lg my-6 border border-indigo-800"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-center text-gray-200 font-unica mb-4">
                Use your G8D to unlock mystical AI creations. Tap into the ancient power of astrology through your imagination.
              </p>
              <div className="flex justify-center gap-4">
                <motion.button
                  onClick={() => useStore.getState().buyTickets(1)}
                  disabled={useStore.getState().ghibPoints < 500}
                  className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg font-unica disabled:opacity-50"
                  whileTap={{ scale: 0.95 }}
                >
                  🎴 Get 1 Ticket (500 G8D)
                </motion.button>
                <motion.button
                  onClick={() => useStore.getState().buyTickets(5)}
                  disabled={useStore.getState().ghibPoints < 2000}
                  className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg font-unica disabled:opacity-50"
                  whileTap={{ scale: 0.95 }}
                >
                  🎴 Get 5 Tickets (2,000 G8D)
                </motion.button>
              </div>
            </motion.div>

            {/* AI Agent Access */}
            <motion.button
              onClick={handleAgentAccess}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-800 text-white py-3 rounded-lg font-unica mb-6 shadow-lg border border-purple-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-purple-950 text-white flex flex-col items-center p-4 overflow-x-hidden">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-purple-400 to-indigo-400">G8Day</h1>
          <p className="text-gray-300 font-unica">Where Astrology Meets AI</p>
          <p className="text-sm text-red-400 font-cinzel">
            Explore your destiny. Earn, Create, Evolve.
          </p>
        </motion.div>

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