'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../lib/storage';
import { FaStar, FaHistory, FaChartLine, FaMedal, FaUserFriends } from 'react-icons/fa';

export default function Profile({ user }) {
  const { ghibPoints, tickets, invites } = useStore();
  const [userData, setUserData] = useState(user);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    readingsCompleted: 0,
    friendsReferred: 0,
    dayStreak: 0,
    totalEarned: 0
  });

  // Load or simulate profile data
  useEffect(() => {
    // Try to use provided user or load from cache
    if (!userData) {
      const cachedUser = localStorage.getItem('g8day-user');
      if (cachedUser) {
        setUserData(JSON.parse(cachedUser));
      } else {
        setUserData({ 
          first_name: 'Stargazer',
          last_name: 'User',
          username: 'cosmic_voyager',
          id: 'unknown',
          photo_url: 'https://via.placeholder.com/100'
        });
      }
    }

    // Load achievements from local storage or set defaults
    const storedAchievements = localStorage.getItem('g8day-achievements');
    if (storedAchievements) {
      setAchievements(JSON.parse(storedAchievements));
    } else {
      // Default achievements
      setAchievements([
        { id: 1, name: 'First Reading', description: 'Completed your first astrology reading', unlocked: true, date: '2025-05-01' },
        { id: 2, name: 'Cosmic Explorer', description: 'Explored all sections of the app', unlocked: true, date: '2025-05-05' },
        { id: 3, name: 'Social Star', description: 'Referred 3 friends to the platform', unlocked: false },
        { id: 4, name: 'Destiny Master', description: 'Completed 10 readings', unlocked: false },
        { id: 5, name: 'Celestial Patron', description: 'Accumulated 5000 G8D tokens', unlocked: false },
      ]);
    }

    // Load or simulate user stats
    const storedStats = localStorage.getItem('g8day-user-stats');
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    } else {
      // Default stats based on store data
      setStats({
        readingsCompleted: Math.floor(Math.random() * 5) + 1,
        friendsReferred: invites || 3,
        dayStreak: Math.floor(Math.random() * 7) + 1,
        totalEarned: ghibPoints + (Math.floor(Math.random() * 1000))
      });
    }
  }, [user, ghibPoints, tickets, invites]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },  
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="w-full pt-2 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Profile Header */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-5 shadow-lg border border-indigo-800 mb-6"
        variants={itemVariants}
      >
        <div className="flex items-center">
          <div className="relative">
            <motion.div 
              className="w-20 h-20 rounded-full overflow-hidden border-4 border-red-400"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src={userData?.photo_url || "https://via.placeholder.com/100"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div 
              className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1 border-2 border-purple-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <FaStar className="text-white" />
            </motion.div>
          </div>
          
          <div className="ml-4">
            <h2 className="text-xl font-orbitron font-bold text-white">
              {userData?.first_name} {userData?.last_name || ''}
            </h2>
            <p className="text-gray-300 font-unica">
              @{userData?.username || 'cosmic_voyager'}
            </p>
            <div className="mt-2 flex items-center">
              <span className="bg-gradient-to-r from-red-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                Cosmic Explorer
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* User Stats */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl shadow-lg border border-indigo-800 mb-6 overflow-hidden"
        variants={itemVariants}
      >
        <h3 className="text-lg font-orbitron font-bold bg-black bg-opacity-40 p-3 border-b border-indigo-800">
          <FaChartLine className="inline mr-2" />
          Your G8Day Stats
        </h3>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="bg-black bg-opacity-30 rounded-lg p-3 flex flex-col items-center">
            <p className="text-gray-400 text-sm">Readings</p>
            <p className="text-2xl font-bold text-white">{stats.readingsCompleted}</p>
          </div>
          <div className="bg-black bg-opacity-30 rounded-lg p-3 flex flex-col items-center">
            <p className="text-gray-400 text-sm">Day Streak</p>
            <p className="text-2xl font-bold text-white">{stats.dayStreak}</p>
          </div>
          <div className="bg-black bg-opacity-30 rounded-lg p-3 flex flex-col items-center">
            <p className="text-gray-400 text-sm">Referrals</p>
            <p className="text-2xl font-bold text-white">{stats.friendsReferred}</p>
          </div>
          <div className="bg-black bg-opacity-30 rounded-lg p-3 flex flex-col items-center">
            <p className="text-gray-400 text-sm">G8D Earned</p>
            <p className="text-2xl font-bold text-white">{stats.totalEarned}</p>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl shadow-lg border border-indigo-800 mb-6"
        variants={itemVariants}
      >
        <h3 className="text-lg font-orbitron font-bold bg-black bg-opacity-40 p-3 border-b border-indigo-800">
          <FaMedal className="inline mr-2" />
          Achievements
        </h3>
        <div className="p-4">
          {achievements.map((achievement, index) => (
            <motion.div 
              key={achievement.id}
              className={`flex items-center justify-between mb-3 p-2 rounded-lg ${
                achievement.unlocked 
                  ? 'bg-gradient-to-r from-yellow-900 to-amber-800 bg-opacity-30' 
                  : 'bg-gray-900 bg-opacity-30'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500' 
                    : 'bg-gray-700'
                }`}>
                  <FaStar className={`${achievement.unlocked ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className={`font-medium ${achievement.unlocked ? 'text-yellow-300' : 'text-gray-400'}`}>
                    {achievement.name}
                  </p>
                  <p className="text-xs text-gray-400">{achievement.description}</p>
                </div>
              </div>
              {achievement.unlocked && (
                <div className="text-xs text-gray-400">
                  {achievement.date}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Account Settings */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl shadow-lg border border-indigo-800 mb-6"
        variants={itemVariants}
      >
        <h3 className="text-lg font-orbitron font-bold bg-black bg-opacity-40 p-3 border-b border-indigo-800">
          <FaUserFriends className="inline mr-2" />
          Social
        </h3>
        <div className="p-4">
          <button className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-2 rounded-lg mb-3 font-unica flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L21 5V11C21 16.55 17.16 21.74 12 23C6.84 21.74 3 16.55 3 11V5L12 1Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Connect with Friends
          </button>
          <button className="w-full bg-purple-700 hover:bg-purple-600 text-white py-2 rounded-lg font-unica flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sync Cosmic Data
          </button>
        </div>
      </motion.div>

      {/* Spacer for bottom navigation */}
      <div className="h-16"></div>
    </motion.div>
  );
}