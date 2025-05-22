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

// Define the window type to help with Telegram WebApp access
/**
 * Extend the Window object to include Telegram-related properties.
 * This is a workaround for JavaScript since interfaces are not supported.
 */
if (typeof window !== 'undefined') {
  window.Telegram = window.Telegram || {};
  window.TelegramWebviewProxy = window.TelegramWebviewProxy || null;
}

export default function TelegramMiniApp() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const { tickets, ghibPoints, buyTickets } = useStore();
  const [debug, setDebug] = useState({});

  // Hide the default navigation
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

  // Add the Telegram WebApp script dynamically if it's not already loaded
  useEffect(() => {
    // Function to add the Telegram WebApp script
    const addTelegramScript = () => {
      if (document.getElementById('telegram-webapp-script')) return;
      
      const script = document.createElement('script');
      script.id = 'telegram-webapp-script';
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      
      document.head.appendChild(script);
      
      return script;
    };
    
    // Only add script if window.Telegram is not defined
    if (typeof window !== 'undefined' && !window.Telegram) {
      const script = addTelegramScript();
      if (script) {
        script.onload = () => {
          console.log('Telegram WebApp script loaded');
          initializeTelegram();
        };
      }
    } else {
      initializeTelegram();
    }
    
    // Clean up
    return () => {
      const script = document.getElementById('telegram-webapp-script');
      if (script) {
        script.remove();
      }
    };
  }, []);

  // Initialize Telegram and get user data
  const initializeTelegram = () => {
    const checkTelegram = () => {
      try {
        // Update debug info
        const currentDebug = {
          timestamp: new Date().toISOString(),
          telegramExists: typeof window !== 'undefined' && !!window.Telegram,
          webAppExists: typeof window !== 'undefined' && !!(window.Telegram && window.Telegram.WebApp),
          webViewExists: typeof window !== 'undefined' && !!(window.Telegram && window.Telegram.WebView),
          proxyExists: typeof window !== 'undefined' && !!window.TelegramWebviewProxy,
          searchParams: typeof window !== 'undefined' ? window.location.search : '',
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : ''
        };
        
        setDebug(prev => ({ ...prev, ...currentDebug }));
        console.log('Telegram Debug:', currentDebug);
        
        // Check if Telegram WebApp is available
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready();
          tg.expand();
          
          // Get user data from Telegram
          let userData = null;
          
          // Try to get user data from Telegram WebApp
          if (tg.initDataUnsafe?.user) {
            userData = tg.initDataUnsafe.user;
            console.log('User data from initDataUnsafe:', userData);
          } else if (tg.initData) {
            try {
              const params = new URLSearchParams(tg.initData);
              const userParam = params.get('user');
              if (userParam) {
                userData = JSON.parse(decodeURIComponent(userParam));
                console.log('User data from initData params:', userData);
              }
            } catch (error) {
              console.error('Error parsing initData:', error);
            }
          } else if (tg.initData && tg.initData.length > 0) {
            try {
              const parsedData = JSON.parse(decodeURIComponent(tg.initData));
              if (parsedData.user) {
                userData = parsedData.user;
                console.log('User data from parsed initData:', userData);
              }
            } catch (error) {
              console.error('Error parsing initData as JSON:', error);
            }
          }
          // Try to parse from initData
          else if (tg.initData) {
            try {
              const params = new URLSearchParams(tg.initData);
              const userParam = params.get('user');
              if (userParam) {
                userData = JSON.parse(decodeURIComponent(userParam));
                console.log('User data from initData params:', userData);
              }
            } catch (error) {
              console.error('Error parsing initData:', error);
            }
          }
          // Try to get from hash or search params (sometimes Telegram puts it there)
          else {
            try {
              const urlParams = new URLSearchParams(window.location.search);
              const tgWebAppData = urlParams.get('tgWebAppData');
              const tgWebAppUser = urlParams.get('tgWebAppUser');
              
              if (tgWebAppUser) {
                userData = JSON.parse(decodeURIComponent(tgWebAppUser));
                console.log('User data from URL params:', userData);
              } else if (tgWebAppData) {
                const dataParams = new URLSearchParams(tgWebAppData);
                const userParam = dataParams.get('user');
                if (userParam) {
                  userData = JSON.parse(decodeURIComponent(userParam));
                  console.log('User data from tgWebAppData:', userData);
                }
              }
            } catch (error) {
              console.error('Error parsing URL params:', error);
            }
          }
          
          // Save and set user data if found
          if (userData) {
            setUser(userData);
            localStorage.setItem('g8dai-user', JSON.stringify(userData));
            setIsLoading(false);
            return true;
          }
        }
          const fallbackUser = localStorage.getItem('g8dai-user');
          if (fallbackUser) {
            console.log('Using user data from localStorage');
            setUser(JSON.parse(fallbackUser));
          } else {
            console.log('No user data available, using default');
            setUser({ id: 'unknown', first_name: 'Stargazer', photo_url: 'https://i.ibb.co/NyxrmGp/default-avatar.png' });
            setAuthError('Could not connect to Telegram. Please ensure the Telegram WebApp is properly configured.');
          }
        } catch (error) {
          console.error('Error during Telegram initialization:', error);
          setAuthError('An error occurred while connecting to Telegram.');
        }
      }; // Closing the function checkTelegram properly

    // Try to get user data from Telegram
    const userFound = checkTelegram();
    
    // If user data was not found, try again after a delay
    if (!userFound) {
      console.log('User data not found, will retry in 1 second');
      setTimeout(() => {
        const retryUserFound = checkTelegram();
        
        // If still not found after retry, use fallback
        if (!retryUserFound) {
          console.log('User data still not found, using fallback');
          const fallbackUser = localStorage.getItem('g8dai-user');
          if (fallbackUser) {
            console.log('Using user data from localStorage');
            setUser(JSON.parse(fallbackUser));
          } else {
            console.log('No user data available, using default');
            setUser({ id: 'unknown', first_name: 'Stargazer' });
            setAuthError('Could not connect to Telegram');
          }
          setIsLoading(false);
        }
      }, 1000);
    }
  };

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
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-500 shadow-lg">
            <img
              src={user.photo_url || 'https://i.ibb.co/NyxrmGp/default-avatar.png'}
              alt="avatar"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderHomeContent = () => (
    <div className="space-y-6">
      {/* Always show debug in production temporarily for troubleshooting */}
      <div className="bg-red-950 rounded-xl p-5 border border-red-800 mb-4 text-xs">
        <h3 className="text-white mb-2">Debug Info</h3>
        <pre className="text-red-200 overflow-auto max-h-40">
          {JSON.stringify(debug, null, 2)}
        </pre>
        <div className="mt-2 flex justify-center">
          <button 
            onClick={() => initializeTelegram()} 
            className="bg-red-700 text-white px-3 py-1 rounded-lg text-xs"
          >
            Retry Connection
          </button>
        </div>
      </div>
      <UserStats user={user} />
      <div className="bg-red-950 rounded-xl p-5 border border-red-800 shadow">
        <ClaimButton />
      </div>

      <div className="bg-red-900 rounded-xl p-5 border border-red-700">
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