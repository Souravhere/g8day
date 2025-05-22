import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateRandomUsers = () => {
  const usernames = [
    'StarVoyager', 'CosmicWanderer', 'AstroSage', 'MoonDancer', 'NebulaKnight',
    'GalacticSeer', 'ZodiacRider', 'EclipseHunter', 'StellarMage', 'OrbitWeaver',
    'AstraLad', 'NovaScribe', 'CelestialDrift', 'LunarMystic', 'CometChaser',
  ];
  return Array.from({ length: 20 }, (_, i) => ({
    rank: i + 1,
    username: usernames[i % usernames.length] + Math.floor(Math.random() * 1000),
    points: Math.floor(1000000000 * (20 - i) + Math.random() * 100000000),
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
      leaderboard: generateRandomUsers(),
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
          return {
            ghibPoints: newPoints,
            stats: newStats,
            achievements: newAchievements,
            leaderboard: [
              ...state.leaderboard.filter((entry) => entry.username !== (state.user?.username || 'You')),
              { username: state.user?.username || 'You', points: newPoints },
            ]
              .sort((a, b) => b.points - a.points)
              .map((entry, i) => ({ ...entry, rank: i + 1 })),
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
    }),
    {
      name: 'g8day-storage',
      getStorage: () => localStorage,
    }
  )
);