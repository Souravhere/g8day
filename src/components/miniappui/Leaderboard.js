export default function Leaderboard({ user }) {
    const leaderboard = [
      { rank: 1, username: 'pixelnova', points: 19200000000 },
      { rank: 2, username: 'cryptozone', points: 16700000000 },
      { rank: 3, username: 'netflux', points: 14900000000 },
    ];
  
    return (
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-4 shadow-lg my-6">
        <h2 className="text-xl font-orbitron text-white mb-4">Leaderboard</h2>
        <div className="mb-4">
          <p className="text-red-400 font-unica">
            👤 You: {user?.first_name || 'Stargazer'} — Rank #95426 — 1,250 GHIB
          </p>
        </div>
        {leaderboard.map((entry) => (
          <div key={entry.rank} className="flex justify-between py-2 border-b border-indigo-800 last:border-0">
            <p className="text-white font-unica">
              {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'} {entry.rank}. @{entry.username}
            </p>
            <p className="text-red-400">{(entry.points / 1000000000).toFixed(1)}B GHIB</p>
          </div>
        ))}
      </div>
    );
  }