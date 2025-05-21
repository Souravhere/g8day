'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function TelegramMiniApp() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const userInfo = tg.initDataUnsafe?.user;
      if (userInfo) {
        setUser(userInfo);
      }

      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="w-16 h-16 border-4 border-white border-t-red-600 rounded-full animate-spin mb-4"></div>
        <p className="text-lg">Loading your stars...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
        <div className="text-center">
          <p>❗ Unable to get user info.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-700 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="text-center">
        <Image
          src={user.photo_url || 'https://i.ibb.co/NyxrmGp/default-avatar.png'}
          alt="User Avatar"
          width={100}
          height={100}
          className="rounded-full mx-auto"
        />
        <h1 className="text-xl font-bold mt-4">Welcome, {user.first_name}!</h1>
        <p className="text-red-300">User ID: {user.id}</p>
        <p className="text-red-300">Username: @{user.username || 'N/A'}</p>
      </div>
    </div>
  );
}
