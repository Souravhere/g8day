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
      tasks: {
        'daily-login': { completed: false, lastCompleted: null },
        'rt-tweet': { completed: false, lastCompleted: null },
        'daily-quiz': { completed: false, lastCompleted: null },
        'join-x': { completed: false, lastCompleted: null },
        'invite-5': { completed: false, progress: 0, lastCompleted: null },
        'daily-fortune': { completed: false, lastCompleted: null },
      },
      leaderboard: generateRandomUsers(),
      addGhibPoints: (points) =>
        set((state) => ({
          ghibPoints: state.ghibPoints + points,
          leaderboard: [
            ...state.leaderboard,
            { username: get().user?.username || 'You', points: state.ghibPoints + points },
          ].sort((a, b) => b.points - a.points).map((entry, i) => ({ ...entry, rank: i + 1 })),
        })),
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
        set((state) => ({
          invites: state.invites + count,
          tasks: {
            ...state.tasks,
            'invite-5': {
              ...state.tasks['invite-5'],
              progress: Math.min(state.tasks['invite-5'].progress + count, 5),
              completed: state.tasks['invite-5'].progress + count >= 5,
            },
          },
        })),
      completeTask: (taskId) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              completed: true,
              lastCompleted: today,
            },
          },
        }));
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
    }),
    {
      name: 'g8day-storage',
      getStorage: () => localStorage,
    }
  )
);