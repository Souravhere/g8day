'use client';

import { useStore } from '../../lib/storage';

export default function UserStats({ user }) {
  const { ghibPoints, tickets } = useStore();

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-4 shadow-lg flex justify-between items-center mb-6">
      <div className="text-center">
        <p className="text-white font-orbitron text-lg">G8D Points</p>
        <p className="text-2xl text-red-400 font-bold">{ghibPoints}</p>
      </div>
      <div className="text-center">
        <p className="text-white font-orbitron text-lg">Creation Tickets</p>
        <p className="text-2xl text-red-400 font-bold">{tickets}</p>
      </div>
    </div>
  );
}