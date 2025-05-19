'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

import { useStore } from '@/lib/storage';

// Enhanced Telegram data parsing utility
const parseTelegramData = (initDataUnsafe) => {
  try {
    // Handle both string and object formats
    let parsedData;
    
    if (typeof initDataUnsafe === 'string') {
      // Handle URL-encoded string format (common in Telegram WebApp)
      if (initDataUnsafe.startsWith('query_id=') || initDataUnsafe.includes('&')) {
        const params = new URLSearchParams(initDataUnsafe);
        parsedData = {
          query_id: params.get('query_id'),
          user: params.get('user') ? JSON.parse(decodeURIComponent(params.get('user'))) : null,
          auth_date: params.get('auth_date'),
          hash: params.get('hash')
        };
      } else {
        // Try parsing as JSON string
        parsedData = JSON.parse(initDataUnsafe);
      }
    } else {
      // Already an object
      parsedData = initDataUnsafe;
    }
    
    // Extract user data
    const userData = parsedData?.user || {};
    
    // Ensure all expected fields exist
    return {
      user: {
        id: userData.id?.toString() || 'unknown',
        first_name: userData.first_name || 'Stargazer',
        last_name: userData.last_name || '',
        username: userData.username || '',
        language_code: userData.language_code || 'en',
        photo_url: userData.photo_url || null,
        is_premium: !!userData.is_premium,
      },
      auth_date: parsedData?.auth_date,
      hash: parsedData?.hash,
      query_id: parsedData?.query_id,
      start_param: parsedData?.start_param
    };
  } catch (error) {
    console.error('Error parsing Telegram data:', error);
    return { 
      user: { 
        id: 'unknown', 
        first_name: 'Stargazer',
        last_name: '',
        username: '',
        language_code: 'en',
        photo_url: null,
        is_premium: false
      } 
    };
  }
};

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
          // Check if Telegram WebApp object exists
          if (window.Telegram?.WebApp) {
            const webApp = window.Telegram.WebApp;
            
            // Ensure webapp is expanded to maximum height
            webApp.expand();
            
            // Tell Telegram WebApp we're ready
            webApp.ready();
            
            // Get main button if we need it later
            const mainButton = webApp.MainButton;
            
            // Extract and parse the initData
            const initDataRaw = webApp.initData || webApp.initDataUnsafe;
            
            if (initDataRaw) {
              // Parse the data
              const parsedData = parseTelegramData(initDataRaw);
              
              if (parsedData.user && parsedData.user.id !== 'unknown') {
                setUser(parsedData.user);
                // Cache user data
                localStorage.setItem('g8day-user', JSON.stringify(parsedData.user));
              } else {
                throw new Error('Could not retrieve user data from Telegram');
              }
            } else {
              throw new Error('No init data provided by Telegram');
            }
          } else {
            throw new Error('Telegram WebApp not found');
          }
        }
      } catch (error) {
        console.error("Error initializing Telegram data:", error);
        
        // Attempt to retrieve from cache
        const cachedUser = localStorage.getItem('g8day-user');
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
          } catch (e) {
            console.error("Error parsing cached user data:", e);
            // Use fallback
            setUser({ 
              first_name: 'Stargazer', 
              id: 'unknown',
              photo_url: null
            });
          }
        } else {
          // Use fallback
          setUser({ 
            first_name: 'Stargazer', 
            id: 'unknown',
            photo_url: null
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Execute with a small delay to ensure Telegram WebApp is available
    setTimeout(initializeTelegramData, 100);
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
    <div className="w-full flex justify-between items-center py-3 px-2 mb-4">
      <div className="flex items-center">
        <div className="w-10 h-10 flex items-center justify-center bg-red-800 rounded-full shadow-md">
          <span className="text-white text-xl font-bold">G8</span>
        </div>
        <span className="ml-2 font-orbitron text-lg text-white">G8Day</span>
      </div>
      
      {user && (
        <div 
          className="flex items-center gap-2"
          onClick={() => setActiveTab('profile')}
        >
          <div className="text-right mr-2">
            <p className="text-white text-sm font-medium">{user.first_name}</p>
            <p className="text-red-200 text-xs">{useStore.getState().ghibPoints} G8D</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-500 shadow-md">
            <img 
              src={user.photo_url || "https://i.ibb.co/NyxrmGp/default-avatar.png"} 
              alt={user.first_name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://i.ibb.co/NyxrmGp/default-avatar.png";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );

  // Render appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="w-full">
            <UserStats user={user} />
            <ClaimButton />

            {/* Create Card CTA */}
            <div className="bg-red-800 rounded-lg p-5 shadow-md my-6 border border-red-700">
              <p className="text-center text-white font-unica mb-5">
                Use your G8D to unlock mystical AI creations. Tap into the ancient power of astrology through your imagination.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => useStore.getState().buyTickets(1)}
                  disabled={useStore.getState().ghibPoints < 500}
                  className="bg-white text-red-900 px-5 py-3 rounded-lg font-unica font-bold disabled:opacity-50 shadow-md"
                >
                  🎴 1 Ticket (500 G8D)
                </button>
                <button
                  onClick={() => useStore.getState().buyTickets(5)}
                  disabled={useStore.getState().ghibPoints < 2000}
                  className="bg-white text-red-900 px-5 py-3 rounded-lg font-unica font-bold disabled:opacity-50 shadow-md"
                >
                  🎴 5 Tickets (2,000 G8D)
                </button>
              </div>
            </div>

            {/* AI Agent Access */}
            <button
              onClick={handleAgentAccess}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-unica mb-6 shadow-md border border-red-500 text-lg"
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
            
            {/* Extra space at bottom for navigation */}
            <div className="h-20"></div>
          </div>
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
      <div className="min-h-screen bg-red-900 text-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-t-white border-b-white border-red-300 rounded-full animate-spin"/>
        <p className="mt-4 text-white font-unica">Loading G8Day...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-900 text-white flex flex-col items-center p-4 overflow-x-hidden">
      <div className="w-full max-w-md">
        {/* Top Navigation */}
        <TopNav />
        
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold font-orbitron text-white">G8Day</h1>
          <p className="text-white font-unica">Where Astrology Meets AI</p>
          <p className="text-sm text-red-200 font-cinzel">
            Explore your destiny. Earn, Create, Evolve.
          </p>
        </div>

        {/* Main Content Area */}
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}