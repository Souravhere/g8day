import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      ghibPoints: 1250,
      tickets: 2,
      invites: 3,
      addGhibPoints: (amount) =>
        set((state) => ({ ghibPoints: state.ghibPoints + amount })),
      buyTickets: (count) => {
        const cost = count === 1 ? 500 : 2000;
        set((state) => {
          if (state.ghibPoints >= cost) {
            return {
              ghibPoints: state.ghibPoints - cost,
              tickets: state.tickets + count,
            };
          }
          return state;
        });
      },
      useTicket: () =>
        set((state) => ({
          tickets: state.tickets > 0 ? state.tickets - 1 : 0,
        })),
      updateInvites: (count) =>
        set((state) => ({
          invites: state.invites + count,
          tickets: state.tickets + count,
        })),
    }),
    {
      name: 'g8day-storage',
      getStorage: () => localStorage,
    }
  )
);