'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClaimButton from '@/components/miniappui/ClaimButton';
import UserStats from '@/components/miniappui/UserStats';
import TaskCenter from '@/components/miniappui/TaskCenter';
import ReferralSection from '@/components/miniappui/ReferralSection';
import Leaderboard from '@/components/miniappui/Leaderboard';
import MysticQuote from '@/components/miniappui/MysticQuote';
import BottomNav from '@/components/miniappui/BottomNav';
import { parseTelegramData } from '@/lib/utils';
import { useStore } from '@/lib/storage';

export default function TelegramMiniApp() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();
  const { tickets } = useStore();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      const initData = parseTelegramData(webApp.initDataUnsafe);
      setUser(initData.user || { first_name: 'Stargazer', id: 'unknown' });
    }
  }, []);

  const handleAgentAccess = () => {
    if (tickets > 0) {
      router.push('/telegram/agent');
    } else {
      alert('You need at least 1 Creation Ticket to access the AI Astrology Agent.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-purple-950 text-white flex flex-col items-center justify-between p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold font-orbitron">G8Day</h1>
          <p className="text-gray-300 font-unica">Where Astrology Meets AI</p>
          <p className="text-sm text-red-400 font-cinzel">
            Explore your destiny. Earn, Create, Evolve.
          </p>
        </div>

        {/* Dashboard */}
        <UserStats user={user} />
        <ClaimButton />

        {/* Create Card CTA */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-4 shadow-lg my-6">
          <p className="text-center text-gray-200 font-unica mb-4">
            Use your GHIB to unlock mystical AI creations. Tap into the ancient power of astrology through your imagination.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => useStore.getState().buyTickets(1)}
              disabled={useStore.getState().ghibPoints < 500}
              className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg font-unica disabled:opacity-50"
            >
              🎴 Get 1 Ticket (500 GHIB)
            </button>
            <button
              onClick={() => useStore.getState().buyTickets(5)}
              disabled={useStore.getState().ghibPoints < 2000}
              className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg font-unica disabled:opacity-50"
            >
              🎴 Get 5 Tickets (2,000 GHIB)
            </button>
          </div>
        </div>

        {/* AI Agent Access */}
        <button
          onClick={handleAgentAccess}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-800 text-white py-3 rounded-lg font-unica mb-6 hover:scale-105 transition-transform"
        >
          ✨ Start AI Astrology Reading
        </button>

        {/* Task Center */}
        <TaskCenter />

        {/* Referral Section */}
        <ReferralSection userId={user?.id} />

        {/* Leaderboard */}
        <Leaderboard user={user} />

        {/* Mystic Quote */}
        <MysticQuote />
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}