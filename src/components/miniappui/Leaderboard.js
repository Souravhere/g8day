'use client';
import { useStore } from '@/lib/storage';
import { useState } from 'react';

export default function Leaderboard({ user }) {
  const { leaderboard, ghibPoints, totalUserCount, getUserRank } = useStore();
  const [showAll, setShowAll] = useState(false);
  
  // Get user's rank (above 100K)
  const userRank = getUserRank();
  
  const userEntry = {
    rank: userRank,
    username: user?.username || 'You',
    points: ghibPoints,
  };

  // Display top 50 or top 10 based on toggle
  const displayCount = showAll ? 50 : 10;
  const topUsers = leaderboard.slice(0, displayCount);

  const formatPoints = (points) => {
    if (points >= 1000000) {
      return `${(points / 1000000).toFixed(1)}M`;
    } else if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`;
    }
    return points.toString();
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '⭐';
    if (rank <= 50) return '💎';
    return '👤';
  };

  return (
    <div className="bg-red-950 rounded-xl p-4 border border-red-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-unica text-white">Leaderboard</h2>
        <div className="text-sm text-red-400">
          {totalUserCount.toLocaleString()} total users
        </div>
      </div>
      
      {/* Current User Position */}
      <div className="mb-4 p-3 bg-red-900 rounded-lg border border-red-700">
        <p className="text-red-300 font-unica text-sm mb-1">Your Position</p>
        <p className="text-white font-unica text-lg">
          {getRankIcon(userEntry.rank)} {userEntry.username} — Rank #{userEntry.rank.toLocaleString()} — {formatPoints(userEntry.points)} G8D
        </p>
        <div className="w-full bg-red-800 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${100 - (userEntry.rank / totalUserCount * 100)}%` }}
          ></div>
        </div>
        <p className="text-red-400 text-xs mt-1">
          Top {(100 - (userEntry.rank / totalUserCount * 100)).toFixed(1)}%
        </p>
      </div>

      {/* Top Users List */}
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-red-300 font-unica text-sm">Top Players</h3>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-red-400 hover:text-red-300 text-sm font-unica transition-colors"
          >
            {showAll ? 'Show Top 10' : 'Show Top 50'}
          </button>
        </div>
        
        {topUsers.map((entry) => (
          <div 
            key={entry.rank} 
            className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors
              ${entry.rank <= 3 
                ? 'bg-gradient-to-r from-yellow-900/20 to-red-900/20 border border-yellow-700/30' 
                : 'hover:bg-red-900/50'
              }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{getRankIcon(entry.rank)}</span>
              <div>
                <p className="text-white font-unica text-sm">
                  #{entry.rank} @{entry.username}
                </p>
                {entry.rank <= 3 && (
                  <p className="text-yellow-400 text-xs">Elite Player</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-red-400 font-unica">{formatPoints(entry.points)} G8D</p>
              {entry.rank <= 10 && (
                <p className="text-red-500 text-xs">
                  +{formatPoints(Math.floor(entry.points * 0.05))} today
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Statistics Footer */}
      <div className="mt-4 pt-3 border-t border-red-900">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-red-400 text-xs">Active Today</p>
            <p className="text-white font-unica">{Math.floor(totalUserCount * 0.12).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-red-400 text-xs">Avg. Points</p>
            <p className="text-white font-unica">{formatPoints(Math.floor(leaderboard[25]?.points || 1000000))}</p>
          </div>
        </div>
      </div>
    </div>
  );
}