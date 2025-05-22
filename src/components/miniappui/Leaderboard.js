// components/miniappui/Leaderboard.js
'use client';

import { useStore } from '@/lib/storage';

export default function Leaderboard({ user }) {
  const { leaderboard, G8DPoints } = useStore();

  const userEntry = {
    rank: leaderboard.find((entry) => entry.username === (user?.username || 'You'))?.rank || 999,
    username: user?.username || 'You',
    points: G8DPoints,
  };

  return (
    <div className="bg-red-950 rounded-xl p-4 border border-red-800">
      <h2 className="text-xl font-unica text-white mb-4">Leaderboard</h2>
      <div className="mb-4">
        <p className="text-red-400 font-unica">
          👤 {userEntry.username} — Rank #{userEntry.rank} — {userEntry.points} G8D
        </p>
      </div>
      {leaderboard.slice(0, 5).map((entry) => (
        <div key={entry.rank} className="flex justify-between py-2 border-b border-red-900 last:border-0">
          <p className="text-white font-unica">
            {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'} {entry.rank}. @{entry.username}
          </p>
          <p className="text-red-400">{(entry.points / 1000).toFixed(1)}K G8D</p>
        </div>
      ))}
    </div>
  );
}