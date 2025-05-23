// lib/storage.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateRealisticUsers = () => {
  const firstNames = [
    'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
    'Blake', 'Sage', 'Drew', 'Cameron', 'Skyler', 'Rowan', 'Emery', 'Finley',
    'Parker', 'River', 'Phoenix', 'Dakota', 'Hayden', 'Reese', 'Peyton', 'Charlie',
    'Jamie', 'Sydney', 'Aubrey', 'Logan', 'Kendall', 'Teagan', 'Marley', 'Bryce',
    'Devon', 'Remy', 'Shay', 'Tatum', 'Kai', 'Lane', 'Jules', 'Ari', 'Wren',
    'Ellis', 'Sage', 'Reign', 'Nova', 'Zion', 'Bay', 'Cruz', 'Phoenix', 'Atlas'
  ];

  const suffixes = [
    '2024', '2023', '88', '92', '99', '07', '11', '13', '21', 'X', 'Pro', 'Max',
    'Official', 'Real', 'Prime', 'Elite', 'Star', 'King', 'Queen', 'Boss', 'Legend',
    'Master', 'Ace', 'Alpha', 'Omega', 'Neo', 'Ultra', 'Super', 'Mega', 'Hyper',
    'Crypto', 'Tech', 'Gaming', 'Trader', 'Hodler', 'Moon', 'Diamond', 'Gold',
    'Silver', 'Platinum', 'VIP', 'Premium', 'Plus', 'Pro', 'Expert', 'Ninja'
  ];

  const adjectives = [
    'Smart', 'Quick', 'Bold', 'Swift', 'Bright', 'Sharp', 'Cool', 'Epic', 'Wild',
    'Pure', 'True', 'Fast', 'Lucky', 'Strong', 'Brave', 'Wise', 'Fresh', 'Dark',
    'Light', 'Fire', 'Ice', 'Storm', 'Thunder', 'Lightning', 'Shadow', 'Ghost',
    'Spirit', 'Soul', 'Mind', 'Heart', 'Dream', 'Vision', 'Future', 'Past'
  ];

  const generateUsername = () => {
    const rand = Math.random();
    if (rand < 0.4) {
      return firstNames[Math.floor(Math.random() * firstNames.length)] +
             suffixes[Math.floor(Math.random() * suffixes.length)];
    } else if (rand < 0.7) {
      return adjectives[Math.floor(Math.random() * adjectives.length)] +
             firstNames[Math.floor(Math.random() * firstNames.length)];
    } else {
      return firstNames[Math.floor(Math.random() * firstNames.length)] +
             adjectives[Math.floor(Math.random() * adjectives.length)] +
             Math.floor(Math.random() * 100);
    }
  };

  // Generate 50 users for leaderboard display (not persisted)
  return Array.from({ length: 50 }, (_, i) => ({
    rank: i + 1,
    username: generateUsername(),
    points: Math.floor(50000000 - (i * 800000) + Math.random() * 500000), // 50M down to ~10M
  }));
};

export const useStore = create(
  persist(
    (set, get) => ({
      ghibPoints: 0,
      tickets: 0,
      invites: 0,
      lastClaim: null,
      user: null,
      tasks: {
        'daily-login': { completed: false, lastCompleted: null },
        'rt-tweet': { completed: false, lastCompleted: null },
        'daily-quiz': { completed: false, lastCompleted: null },
        'join-x': { completed: false, lastCompleted: null },
        'invite-5': { completed: false, progress: 0, lastCompleted: null },
        'daily-fortune': { completed: false, lastCompleted: null },
        'cosmic-quiz': { completed: false, lastCompleted: null },
        'astrology-reading': { completed: false, lastCompleted: null },
      },
      stats: {
        readingsCompleted: 0,
        friendsReferred: 0,
        dayStreak: 0,
        totalEarned: 0,
      },
      achievements: [
        { id: 1, name: 'First Reading', description: 'Completed your first astrology reading', unlocked: false, date: null },
        { id: 2, name: 'Cosmic Explorer', description: 'Explored all sections of the app', unlocked: false, date: null },
        { id: 3, name: 'Social Star', description: 'Referred 3 friends to the platform', unlocked: false, date: null },
        { id: 4, name: 'Destiny Master', description: 'Completed 10 readings', unlocked: false, date: null },
        { id: 5, name: 'Celestial Patron', description: 'Accumulated 5000 G8D tokens', unlocked: false, date: null },
      ],
      leaderboard: generateRealisticUsers(),
      totalUserCount: Math.floor(120000 + Math.random() * 10001), // Random: 120,000–130,000
      userRank: Math.floor(100000 + Math.random() * 20000), // Initial rank ~100K–120K
      addGhibPoints: (points) =>
        set((state) => {
          const newPoints = state.ghibPoints + points;
          const newStats = {
            ...state.stats,
            totalEarned: state.stats.totalEarned + Math.max(points, 0),
          };
          const newAchievements = state.achievements.map((ach) =>
            ach.id === 5 && newPoints >= 5000 && !ach.unlocked
              ? { ...ach, unlocked: true, date: new Date().toISOString().split('T')[0] }
              : ach
          );
          // Update userRank based on points (simulate rank improvement)
          const newUserRank = newPoints > 10000
            ? Math.max(50000, state.userRank - Math.floor(newPoints / 1000))
            : state.userRank;
          return {
            ghibPoints: newPoints,
            stats: newStats,
            achievements: newAchievements,
            userRank: newUserRank,
          };
        }),
      addTickets: (count) => set((state) => ({ tickets: state.tickets + count })),
      buyTickets: (count) => {
        const cost = count === 1 ? 500 : 2000;
        if (get().ghibPoints >= cost) {
          set((state) => ({
            ghibPoints: state.ghibPoints - cost,
            tickets: state.tickets + count,
          }));
        }
      },
      updateInvites: (count) =>
        set((state) => {
          const newInvites = state.invites + count;
          const newStats = {
            ...state.stats,
            friendsReferred: newInvites,
          };
          const newAchievements = state.achievements.map((ach) =>
            ach.id === 3 && newInvites >= 3 && !ach.unlocked
              ? { ...ach, unlocked: true, date: new Date().toISOString().split('T')[0] }
              : ach
          );
          return {
            invites: newInvites,
            stats: newStats,
            achievements: newAchievements,
            tasks: {
              ...state.tasks,
              'invite-5': {
                ...state.tasks['invite-5'],
                progress: Math.min(state.tasks['invite-5'].progress + count, 5),
                completed: state.tasks['invite-5'].progress + count >= 5,
              },
            },
          };
        }),
      completeTask: (taskId) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          const newStats = { ...state.stats };
          const newAchievements = [...state.achievements];
          if (taskId === 'daily-login') {
            newStats.dayStreak = state.stats.dayStreak + 1;
          } else if (taskId === 'daily-fortune' || taskId === 'astrology-reading') {
            newStats.readingsCompleted = state.stats.readingsCompleted + 1;
            if (newStats.readingsCompleted >= 1 && !newAchievements.find((ach) => ach.id === 1).unlocked) {
              newAchievements.find((ach) => ach.id === 1).unlocked = true;
              newAchievements.find((ach) => ach.id === 1).date = today;
            }
            if (newStats.readingsCompleted >= 10 && !newAchievements.find((ach) => ach.id === 4).unlocked) {
              newAchievements.find((ach) => ach.id === 4).unlocked = true;
              newAchievements.find((ach) => ach.id === 4).date = today;
            }
          }
          return {
            tasks: {
              ...state.tasks,
              [taskId]: {
                ...state.tasks[taskId],
                completed: true,
                lastCompleted: today,
              },
            },
            stats: newStats,
            achievements: newAchievements,
          };
        });
      },
      resetDailyTasks: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          const updatedTasks = { ...state.tasks };
          Object.keys(updatedTasks).forEach((taskId) => {
            if (updatedTasks[taskId].lastCompleted !== today) {
              updatedTasks[taskId].completed = false;
              if (taskId === 'invite-5') {
                updatedTasks[taskId].progress = 0;
              }
            }
          });
          return { tasks: updatedTasks };
        });
      },
      setUser: (user) => set({ user }),
      completeSectionExploration: () =>
        set((state) => {
          const newAchievements = state.achievements.map((ach) =>
            ach.id === 2 && !ach.unlocked
              ? { ...ach, unlocked: true, date: new Date().toISOString().split('T')[0] }
              : ach
          );
          return { achievements: newAchievements };
        }),
      getUserRank: () => {
        const state = get();
        return state.userRank || Math.floor(100000 + Math.random() * 20000);
      },
      clearStorage: () => {
        localStorage.removeItem('g8day-storage');
        if (window.Telegram?.WebApp?.showPopup) {
          window.Telegram.WebApp.showPopup({
            title: 'Storage Cleared',
            message: 'Storage limit reached. Data cleared. Please reload the app.',
            buttons: [{ type: 'ok', id: 'reload' }],
          }, (buttonId) => {
            if (buttonId === 'reload') window.location.reload();
          });
        } else {
          alert('Storage limit reached. Data cleared. Please reload the app.');
          window.location.reload();
        }
      },
    }),
    {
      name: 'g8day-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        ghibPoints: state.ghibPoints,
        tickets: state.tickets,
        invites: state.invites,
        lastClaim: state.lastClaim,
        user: state.user,
        tasks: state.tasks,
        stats: state.stats,
        achievements: state.achievements,
        userRank: state.userRank,
        totalUserCount: state.totalUserCount,
      }),
    }
  )
);