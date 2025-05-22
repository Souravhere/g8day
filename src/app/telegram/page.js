'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/storage';
import { motion } from 'framer-motion';

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
import CustomLoader from '@/components/miniappui/Loader';

export default function TelegramMiniApp() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const { tickets, ghibPoints, buyTickets, resetDailyTasks } = useStore();

  // Show loader for 4 seconds
  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    return () => clearTimeout(loaderTimer);
  }, []);

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

  // loader animatinos
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.5 }
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
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
      <div className="bg-red-950 rounded-xl p-3 border border-red-800">
        <h2 className="text-xl text-white font-semibold text-center mb-4">Daily Tasks</h2>
        <TaskCenter />
      </div>
      <div className="bg-red-950 rounded-xl p-3 border border-red-800">
        <h2 className="text-xl text-white font-semibold text-center mb-4">Invite Friends</h2>
        <ReferralSection userId={user?.id} />
      </div>
      <div className="bg-red-950 rounded-xl p-3 border border-red-800">
        <h2 className="text-xl text-white font-semibold text-center mb-4">Leaderboard</h2>
        <Leaderboard user={user} />
      </div>
      <div className="bg-black rounded-xl p-3 border border-red-900">
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
    <motion.div
    className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-950 to-black text-white p-6"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <motion.div
      className="mb-8"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
    >
      <svg 
        width="217" 
        height="74" 
        viewBox="0 0 217 74" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-64 h-auto"
      >
        {/* D Letter */}
        <motion.path 
          d="M169.512 52.0588C178.314 52.0588 183.732 46.5485 183.732 36.8277C183.732 27.1059 178.314 21.5336 169.512 21.5336H161.782V52.0588H169.512ZM151.513 11.5654H169.343C184.577 11.5654 194 21.906 194 36.8277C194 51.7494 184.577 62.027 169.343 62.027H151.513V11.5654Z" 
          fill="transparent"
          stroke="white"
          strokeWidth="2"
          variants={pathVariants}
        />
        
        {/* G Letter (Complex path) */}
        <motion.path 
          d="M153.873 36.3631C153.873 50.9151 143.123 62.7116 129.861 62.7116C124.568 62.7116 119.675 60.8267 115.705 57.6394C118.175 54.8838 120.088 51.5331 121.263 47.8017C123.604 49.9166 126.597 51.1908 129.861 51.1908C137.32 51.1908 143.367 44.5478 143.367 36.3631C143.367 28.1784 137.32 21.5436 129.861 21.5436C129.631 21.5436 129.393 21.5509 129.169 21.5655C129.027 21.5728 128.891 21.5801 128.748 21.5956C128.416 21.6248 128.084 21.6623 127.758 21.7216C127.649 21.7371 127.541 21.759 127.432 21.7818C127.269 21.811 127.113 21.8485 126.957 21.8859C126.767 21.9306 126.584 21.9826 126.393 22.042C126.245 22.0794 126.095 22.1241 125.953 22.1761C125.77 22.2355 125.592 22.2957 125.416 22.3696C125.22 22.4372 125.029 22.5184 124.84 22.6079C124.561 22.7275 124.29 22.8616 124.019 23.0031C123.218 23.4202 122.457 23.9259 121.751 24.5219C120.998 25.1326 120.299 25.8472 119.682 26.6295C117.611 29.229 116.356 32.6318 116.356 36.3631C116.356 36.6762 116.349 36.9883 116.343 37.2941L116.322 37.6957V37.7185C116.309 38.0161 116.295 38.3073 116.268 38.5975C116.241 38.9699 116.206 39.3341 116.167 39.6992V39.722C116.118 40.0789 116.071 40.4294 116.017 40.7863C115.963 41.1441 115.895 41.5019 115.827 41.8588C115.779 42.1198 115.725 42.3882 115.664 42.6483V42.6556C115.542 43.1777 115.413 43.6989 115.271 44.2046C115.196 44.4656 115.121 44.7184 115.039 44.9722C113.872 48.7026 111.952 52.0616 109.481 54.8172C109.237 55.0928 108.986 55.353 108.734 55.614C108.654 55.7034 108.572 55.7856 108.491 55.8668C108.253 56.0978 108.016 56.3287 107.771 56.5523C107.473 56.828 107.167 57.0963 106.855 57.3564C106.502 57.6549 106.135 57.9379 105.769 58.2135C105.49 58.4143 105.213 58.6151 104.927 58.8086C104.717 58.9501 104.506 59.0843 104.296 59.2185C104.126 59.3225 103.957 59.4266 103.794 59.5315C103.522 59.6876 103.251 59.8437 102.973 59.9934C102.898 60.0372 102.83 60.0746 102.755 60.1121C102.444 60.2763 102.125 60.4397 101.799 60.5885C101.765 60.604 101.731 60.6259 101.69 60.6405C101.378 60.782 101.066 60.9162 100.753 61.0504C100.333 61.222 99.9123 61.378 99.4848 61.5268C99.1313 61.6464 98.7786 61.7578 98.4126 61.8618C98.005 61.9814 97.5975 62.0854 97.1841 62.1749C96.8106 62.257 96.4304 62.3319 96.0437 62.3985C95.6436 62.4651 95.236 62.5254 94.8292 62.5701C94.4424 62.6139 94.0548 62.6513 93.668 62.6669C93.2338 62.6961 92.7863 62.7116 92.3447 62.7116C85.7144 62.7116 79.708 59.7625 75.3652 54.9961C71.0215 50.2297 68.334 43.6387 68.334 36.3631C68.334 21.811 79.0841 10.0146 92.3447 10.0146C97.6382 10.0146 102.532 11.8994 106.502 15.0868C104.031 17.8424 102.117 21.1931 100.944 24.9244C98.6023 22.8096 95.6095 21.5354 92.3447 21.5354C84.8868 21.5354 78.8396 28.1784 78.8396 36.3631C78.8396 44.5478 84.8868 51.1826 92.3447 51.1826C92.5759 51.1826 92.813 51.1753 93.0375 51.1607C93.1798 51.1534 93.3154 51.1461 93.4576 51.1305C93.7903 51.1013 94.123 51.0639 94.4491 51.0046C94.5572 50.9891 94.6662 50.9672 94.7743 50.9443C94.9374 50.9151 95.0937 50.8777 95.2493 50.8403C95.4398 50.7956 95.6228 50.7435 95.8132 50.6842C95.9621 50.6468 96.1119 50.6021 96.2541 50.55C96.4371 50.4907 96.6134 50.4305 96.7906 50.3565C96.9869 50.289 97.1774 50.2078 97.367 50.1183C97.6457 49.9987 97.9169 49.8646 98.188 49.7231C98.9891 49.306 99.7493 48.8003 100.455 48.2043C101.208 47.5936 101.907 46.8789 102.525 46.0967C104.595 43.4972 105.851 40.0944 105.851 36.3631C105.851 36.05 105.857 35.7379 105.864 35.4321L105.885 35.0305V35.0077C105.898 34.7101 105.911 34.4189 105.939 34.1287C105.966 33.7563 105.999 33.3921 106.04 33.027V33.0042C106.088 32.6473 106.135 32.2968 106.19 31.9399C106.244 31.5821 106.312 31.2243 106.38 30.8674C106.583 29.8095 106.848 28.7671 107.167 27.754C108.334 24.0236 110.255 20.6646 112.725 17.909C112.97 17.6334 113.221 17.3732 113.471 17.1122C113.553 17.0227 113.635 16.9406 113.716 16.8594C113.954 16.6284 114.191 16.3975 114.436 16.1739C114.734 15.8982 115.039 15.6299 115.351 15.3697C115.705 15.0713 116.071 14.7883 116.438 14.5127C116.715 14.3119 116.994 14.111 117.279 13.9175C117.49 13.7761 117.7 13.6419 117.91 13.5077C118.08 13.4037 118.249 13.2996 118.412 13.1946C118.684 13.0386 118.956 12.8825 119.233 12.7328C119.308 12.689 119.376 12.6516 119.45 12.6141C119.763 12.4498 120.082 12.2864 120.408 12.1377C120.442 12.1222 120.475 12.1003 120.516 12.0856C120.829 11.9442 121.141 11.81 121.453 11.6758C121.873 11.5042 122.294 11.3481 122.722 11.1994C123.075 11.0798 123.428 10.9684 123.794 10.8644C124.202 10.7448 124.608 10.6408 125.023 10.5513C125.396 10.4692 125.776 10.3943 126.163 10.3277C126.563 10.2611 126.971 10.2008 127.377 10.1561C127.764 10.1123 128.151 10.0748 128.538 10.0593C128.973 10.0301 129.42 10.0146 129.861 10.0146C136.492 10.0146 142.499 12.9637 146.842 17.7301C151.185 22.4965 153.873 29.0875 153.873 36.3631Z" 
          fill="transparent"
          stroke="#BE2327"
          strokeWidth="2"
          variants={pathVariants}
        />
        
        {/* G Letter (simplified G shape) */}
        <motion.path 
          d="M71.9631 27.1076H60.4423C58.484 23.4137 54.0487 20.5812 48.3456 20.5812C39.8198 20.5812 33.484 27.2928 33.484 36.6509C33.484 46.0699 39.8198 52.9031 48.3456 52.9031C55.6613 52.9031 60.731 48.101 61.8247 43.1765H47.4811V33.6958H73V36.6509C73 51.8575 62.3436 63 48.1155 63C33.6564 63 23 51.8575 23 36.6509C23 21.4443 33.6564 10.3 48.1155 10.3C60.3845 10.3 69.2559 17.6878 71.9631 27.1076Z" 
          fill="transparent"
          stroke="white"
          strokeWidth="2"
          variants={pathVariants}
        />
      </svg>
    </motion.div>
  </motion.div>
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

  // Show loader for the first 4 seconds
  if (showLoader) return renderLoader();
  
  if (isLoading) return renderLoader();
  if (authError && !user) return renderAuthError();

  return (
    <div className="min-h-screen relative text-white flex flex-col items-center p-4">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/miniappbg.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>
      <div className="w-full max-w-md">
        <TopNav />
        {renderContent()}
      </div>
      <div className="fixed topnav bottom-4 left-0 right-0 flex justify-center z-50">
        <div className="bg-red-950 rounded-full py-2 px-4 border border-red-800 shadow-xl">
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}