// app/telegram/page.js
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/storage';

// UI Components
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

export default function TelegramMiniApp() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const { tickets, ghibPoints, buyTickets, resetDailyTasks } = useStore();

  // Hide default navigation
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

  // Initialize Telegram WebApp
  useEffect(() => {
    const initializeTelegram = () => {
      try {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready();
          tg.expand();

          if (tg.initDataUnsafe?.user) {
            const userData = {
              id: tg.initDataUnsafe.user.id || 'unknown',
              first_name: tg.initDataUnsafe.user.first_name || 'Stargazer',
              last_name: tg.initDataUnsafe.user.last_name || '',
              username: tg.initDataUnsafe.user.username || '',
              photo_url: tg.initDataUnsafe.user.photo_url || 'https://i.ibb.co/NyxrmGp/default-avatar.png',
            };
            setUser(userData);
            useStore.getState().setUser(userData);
            localStorage.setItem('g8dai-user', JSON.stringify(userData));
            if (tg.initDataUnsafe.start_param) {
              useStore.getState().updateInvites(1);
            }
          } else {
            const fallbackUser = localStorage.getItem('g8dai-user');
            if (fallbackUser) {
              setUser(JSON.parse(fallbackUser));
              useStore.getState().setUser(JSON.parse(fallbackUser));
            } else {
              const defaultUser = {
                id: 'unknown',
                first_name: 'Stargazer',
                photo_url: 'https://i.ibb.co/NyxrmGp/default-avatar.png',
              };
              setUser(defaultUser);
              useStore.getState().setUser(defaultUser);
              setAuthError('No user data available from Telegram. Please ensure you are in Telegram WebView.');
            }
          }
        } else {
          const fallbackUser = localStorage.getItem('g8dai-user');
          if (fallbackUser) {
            setUser(JSON.parse(fallbackUser));
            useStore.getState().setUser(JSON.parse(fallbackUser));
          } else {
            const defaultUser = {
              id: 'unknown',
              first_name: 'Stargazer',
              photo_url: 'https://i.ibb.co/NyxrmGp/default-avatar.png',
            };
            setUser(defaultUser);
            useStore.getState().setUser(defaultUser);
            setAuthError('Telegram WebApp not detected. Please open via Telegram.');
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Telegram:', error);
        setAuthError('Error connecting to Telegram: ' + error.message);
        setUser({
          id: 'unknown',
          first_name: 'Stargazer',
          photo_url: 'https://i.ibb.co/NyxrmGp/default-avatar.png',
        });
        useStore.getState().setUser({
          id: 'unknown',
          first_name: 'Stargazer',
          photo_url: 'https://i.ibb.co/NyxrmGp/default-avatar.png',
        });
        setIsLoading(false);
      }
    };

    const loadTelegramSDK = () => {
      if (typeof window !== 'undefined' && !window.Telegram?.WebApp) {
        const script = document.createElement('script');
        script.id = 'telegram-webapp-script';
        script.src = 'https://telegram.org/js/telegram-web-app.js';
        script.async = true;
        script.onload = initializeTelegram;
        script.onerror = () => {
          console.error('Failed to load Telegram WebApp SDK');
          setAuthError('Failed to load Telegram WebApp SDK. Please try again.');
          setIsLoading(false);
        };
        document.head.appendChild(script);
        return () => script.remove();
      } else {
        initializeTelegram();
      }
    };

    loadTelegramSDK();

    // Reset daily tasks at midnight
    const today = new Date().toISOString().split('T')[0];
    const lastReset = localStorage.getItem('lastTaskReset');
    if (lastReset !== today) {
      resetDailyTasks();
      localStorage.setItem('lastTaskReset', today);
    }
  }, [resetDailyTasks]);

  const handleAgentAccess = () => {
    if (tickets > 0) {
      setActiveTab('agent');
    } else {
      const popup = window.Telegram?.WebApp?.showPopup;
      popup
        ? popup({
            title: 'Ticket Required',
            message: 'You need at least 1 Creation Ticket to access the AI Astrology Agent.',
            buttons: [{ type: 'ok' }],
          })
        : alert('You need at least 1 Creation Ticket.');
    }
  };

  const TopNav = () => (
    <div className="w-full flex justify-between items-center py-3 px-2 mb-6 bg-gradient-to-r from-red-950 to-red-900 rounded-lg shadow-lg">
      <Image src="/logo.png" alt="Logo" width={100} height={50} />
      {user && (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab('profile')}
        >
          <div className="text-right mr-2">
            <p className="text-white text-sm font-medium">{user.first_name}</p>
            <p className="text-red-200 text-xs">{ghibPoints} G8D</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-red-500 shadow-lg">
            <Image
              src='/g8dcharacter.png'
              alt="avatar"
              width={150}
              height={150}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderHomeContent = () => (
    <div className="space-y-6">
      <UserStats user={user} />
      <div className="bg-red-950 rounded-xl p-5 border border-red-800 shadow">
        <ClaimButton />
      </div>
      <div className="bg-red-950 rounded-xl p-5 border border-red-800">
        <p className="text-center text-white font-unica mb-4 text-lg">
          Use your G8D to unlock mystical AI creations. Tap into astrology.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => buyTickets(1)}
            disabled={ghibPoints < 500}
            className={cn(
              'bg-white text-red-900 px-4 py-2 rounded-lg shadow font-bold',
              ghibPoints < 500 && 'opacity-50 cursor-not-allowed'
            )}
          >
            🎴 1 Ticket
          </button>
          <button
            onClick={() => buyTickets(5)}
            disabled={ghibPoints < 2000}
            className={cn(
              'bg-white text-red-900 px-4 py-2 rounded-lg shadow font-bold',
              ghibPoints < 2000 && 'opacity-50 cursor-not-allowed'
            )}
          >
            🎴 5 Tickets
          </button>
        </div>
      </div>
      <button
        onClick={handleAgentAccess}
        className="w-full bg-red-700 py-4 text-white font-bold rounded-xl shadow hover:scale-105 transition-all"
      >
        ✨ Start AI Astrology Reading ✨
      </button>
      <div className="bg-red-950 rounded-xl p-5 border border-red-800">
        <h2 className="text-xl text-white text-center mb-4">Daily Tasks</h2>
        <TaskCenter />
      </div>
      <div className="bg-red-950 rounded-xl p-5 border border-red-800">
        <h2 className="text-xl text-white text-center mb-4">Invite Friends</h2>
        <ReferralSection userId={user?.id} />
      </div>
      <div className="bg-red-950 rounded-xl p-5 border border-red-800">
        <h2 className="text-xl text-white text-center mb-4">Leaderboard</h2>
        <Leaderboard user={user} />
      </div>
      <div className="bg-black rounded-xl p-5 border border-red-900">
        <MysticQuote />
      </div>
      <div className="h-20" />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'profile':
        return <Profile user={user} />;
      case 'rewards':
        return <Rewards />;
      case 'destiny':
        return <Destiny user={user} />;
      case 'agent':
        return <Agent user={user} />;
      default:
        return null;
    }
  };

  const renderLoader = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-950 to-black text-white p-6">
      <div className="w-20 h-20 border-4 border-t-white border-b-white border-l-red-400 border-r-red-400 rounded-full animate-spin mb-6" />
      <h2 className="text-xl font-unica animate-pulse tracking-wide">
        Connecting to the Stars...
      </h2>
    </div>
  );

  const renderAuthError = () => (
    <div className="min-h-screen bg-gradient-to-b from-red-950 to-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 rounded-full bg-red-800 flex items-center justify-center mb-4">
        <span className="text-2xl">❗</span>
      </div>
      <h2 className="text-xl text-white mb-2">Authentication Error</h2>
      <p className="text-red-300 text-center mb-6">{authError}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-700 px-6 py-2 rounded-full"
      >
        Try Again
      </button>
    </div>
  );

  if (isLoading) return renderLoader();
  if (authError && !user) return renderAuthError();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <TopNav />
        {renderContent()}
      </div>
      <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
        <div className="bg-red-950 rounded-full py-2 px-4 border border-red-800 shadow-xl">
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}