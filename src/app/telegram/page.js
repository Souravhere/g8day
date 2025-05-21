'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/storage';

// Components
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
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const { tickets, ghibPoints, buyTickets } = useStore();

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

  // Initialize Telegram Web App
  useEffect(() => {
    const initializeTelegramWebApp = async () => {
      try {
        if (typeof window === 'undefined') return;
        
        // Wait for Telegram WebApp to be available
        const waitForTelegramWebApp = () => {
          return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
              if (window.Telegram?.WebApp) {
                clearInterval(checkInterval);
                resolve(window.Telegram.WebApp);
              }
            }, 100);
            
            // Timeout after 3 seconds
            setTimeout(() => {
              clearInterval(checkInterval);
              resolve(null);
            }, 3000);
          });
        };
        
        const webApp = await waitForTelegramWebApp();
        
        if (webApp) {
          // Expand the WebApp to full height
          webApp.expand();
          
          // Signal to Telegram that the WebApp is ready
          webApp.ready();
          
          // Get initData directly from Telegram WebApp
          const initDataStr = webApp.initData;
          
          if (initDataStr) {
            // Parse the URL-encoded string
            const urlParams = new URLSearchParams(initDataStr);
            const userStr = urlParams.get('user');
            
            if (userStr) {
              try {
                const userData = JSON.parse(decodeURIComponent(userStr));
                const parsedUser = {
                  id: userData.id?.toString() || 'unknown',
                  first_name: userData.first_name || 'Stargazer',
                  last_name: userData.last_name || '',
                  username: userData.username || '',
                  language_code: userData.language_code || 'en',
                  photo_url: userData.photo_url || null,
                  is_premium: !!userData.is_premium,
                };
                
                setUser(parsedUser);
                // Cache for development or fallback
                localStorage.setItem('g8day-user', JSON.stringify(parsedUser));
              } catch (e) {
                console.error("Error parsing user data:", e);
                throw new Error('Failed to parse user data');
              }
            } else {
              throw new Error('User data not found in initData');
            }
          } else {
            throw new Error('No initData provided by Telegram WebApp');
          }
        } else {
          throw new Error('Telegram WebApp not available');
        }
      } catch (error) {
        console.error("Telegram WebApp initialization error:", error);
        
        // Try to get user from localStorage as fallback
        const cachedUser = localStorage.getItem('g8day-user');
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
          } catch (e) {
            setUser({ 
              first_name: 'Stargazer', 
              id: 'unknown',
              photo_url: null
            });
          }
        } else {
          // Fallback for development or when no user data is available
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

    initializeTelegramWebApp();
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

  // TopNav component with improved styling
  const TopNav = () => (
    <div className="w-full flex justify-between items-center py-3 px-2 mb-6 bg-gradient-to-r from-red-950 to-red-900 rounded-lg shadow-lg">
      <div className="flex items-center">
        <Image 
          src='/logo.png' 
          height={50} 
          width={100} 
          alt='G8D Logo'
          className="drop-shadow-md"
        />
      </div>
      
      {user && (
        <div 
          className="flex items-center gap-2 group cursor-pointer transition-transform duration-200 hover:scale-105"
          onClick={() => setActiveTab('profile')}
        >
          <div className="text-right mr-2">
            <p className="text-white text-sm font-medium">{user.first_name}</p>
            <p className="text-red-200 text-xs font-medium">{ghibPoints} G8D</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-500 shadow-lg group-hover:border-red-400 transition-all duration-300">
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

  // Render home content with improved UI
  const renderHomeContent = () => (
    <div className="w-full space-y-6">
      {/* User Stats with improved styling */}
      {/* <div className="bg-gradient-to-br from-red-900 to-red-950 rounded-xl p-5 shadow-lg border border-red-800"> */}
        <UserStats user={user} />
      {/* </div> */}    
      
      {/* Daily Claim Button */}
      <div className="bg-gradient-to-br from-red-900 to-red-950 rounded-xl p-5 shadow-lg border border-red-800">
        <ClaimButton />
      </div>

      {/* Create Card CTA with improved styling */}
      <div className="bg-gradient-to-br from-red-800 to-red-900 rounded-xl p-6 shadow-lg border border-red-700">
        <p className="text-center text-white font-unica mb-5 text-lg">
          Use your G8D to unlock mystical AI creations. Tap into the ancient power of astrology through your imagination.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => buyTickets(1)}
            disabled={ghibPoints < 500}
            className={cn(
              "bg-white text-red-900 px-5 py-3 rounded-lg font-unica font-bold shadow-md transform transition-transform duration-200 hover:scale-105",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
          >
            🎴 1 Ticket (500 G8D)
          </button>
          <button
            onClick={() => buyTickets(5)}
            disabled={ghibPoints < 2000}
            className={cn(
              "bg-white text-red-900 px-5 py-3 rounded-lg font-unica font-bold shadow-md transform transition-transform duration-200 hover:scale-105",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
          >
            🎴 5 Tickets (2,000 G8D)
          </button>
        </div>
      </div>

      {/* AI Agent Access Button with animation */}
      <button
        onClick={handleAgentAccess}
        className={cn(
          "w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl",
          "font-unica shadow-lg border border-red-500 text-lg font-bold",
          "transform transition-all duration-300 hover:shadow-red-900/50 hover:shadow-xl hover:scale-105"
        )}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="animate-pulse">✨</span>
          <span>Start AI Astrology Reading</span>
          <span className="animate-pulse">✨</span>
        </div>
      </button>

      {/* Task Center with styled container */}
      <div className="bg-gradient-to-br from-red-900 to-red-950 rounded-xl p-5 shadow-lg border border-red-800">
        <h2 className="text-xl font-unica text-white mb-4 text-center">Daily Tasks</h2>
        <TaskCenter />
      </div>

      {/* Referral Section with improved styling */}
      <div className="bg-gradient-to-br from-red-900 to-red-950 rounded-xl p-5 shadow-lg border border-red-800">
        <h2 className="text-xl font-unica text-white mb-4 text-center">Invite Friends</h2>
        <ReferralSection userId={user?.id} />
      </div>

      {/* Leaderboard with improved styling */}
      <div className="bg-gradient-to-br from-red-900 to-red-950 rounded-xl p-5 shadow-lg border border-red-800">
        <h2 className="text-xl font-unica text-white mb-4 text-center">Leaderboard</h2>
        <Leaderboard user={user} />
      </div>

      {/* Mystic Quote with improved styling */}
      <div className="bg-gradient-to-br from-red-950 to-black rounded-xl p-5 shadow-lg border border-red-900">
        <MysticQuote />
      </div>
      
      {/* Extra space at bottom for navigation */}
      <div className="h-20"></div>
    </div>
  );

  // Render appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) { 
      case 'home':
        return renderHomeContent();
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
      <div className="min-h-screen bg-gradient-to-b from-red-950 to-black text-white flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 border-4 border-t-white border-b-white border-r-red-300 border-l-red-300 rounded-full animate-spin"/>
        <div className="mt-6 text-white font-unica text-xl">
          <span className="inline-block animate-pulse">L</span>
          <span className="inline-block animate-pulse delay-75">o</span>
          <span className="inline-block animate-pulse delay-100">a</span>
          <span className="inline-block animate-pulse delay-150">d</span>
          <span className="inline-block animate-pulse delay-200">i</span>
          <span className="inline-block animate-pulse delay-300">n</span>
          <span className="inline-block animate-pulse delay-400">g</span>
          <span className="inline-block animate-pulse delay-500"> G8Day...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 overflow-x-hidden">
      <div className="w-full max-w-md overflow-hidden">
        {/* Top Navigation */}
        <TopNav />
        
        {/* Main Content Area */}
        {renderContent()}
      </div>

      {/* Bottom Navigation - Floating */}
      <div className="fixed topnav bottom-4 left-0 right-0 flex justify-center z-50">
        <div className="bg-gradient-to-r from-red-950 to-red-900 rounded-full py-2 px-4 shadow-xl border border-red-800">
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}