'use client';

import { useStore } from '@/lib/storage';
import { useState, useEffect } from 'react';

export default function ReferralSection({ userId }) {
  const { invites, ghibPoints, addGhibPoints, updateInvites, stats } = useStore();
  const [mention, setMention] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [recentInvites, setRecentInvites] = useState([]);

  const referralLink = `https://t.me/g8day_bot?start=${userId || 'demo123'}`;
  const shareText = `🌟 Join me on G8Day - the ultimate astrology and fortune app! 🔮\n\n✨ Get personalized readings\n🎯 Complete daily challenges\n💎 Earn G8D tokens\n🏆 Climb the leaderboard\n\nUse my link to get started:`;

  // Simulate recent invites for demo
  useEffect(() => {
    if (invites > 0) {
      const demoInvites = [
        { username: 'AstroMike21', joinedAt: '2 hours ago', earned: 50 },
        { username: 'LunaSeeker', joinedAt: '1 day ago', earned: 50 },
        { username: 'CosmicVibes88', joinedAt: '3 days ago', earned: 50 },
      ].slice(0, invites);
      setRecentInvites(demoInvites);
    }
  }, [invites]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      const popup = window.Telegram?.WebApp?.showPopup;
      popup
        ? popup({ 
            message: '🔗 Referral link copied to clipboard!', 
            buttons: [{ type: 'ok', text: 'Great!' }] 
          })
        : null;
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleShareToTelegram = () => {
    setIsSharing(true);
    const fullMessage = `${shareText}\n${referralLink}`;
    
    if (window.Telegram?.WebApp) {
      // Use Telegram WebApp share functionality
      const tg = window.Telegram.WebApp;
      tg.switchInlineQuery(fullMessage, ['users', 'groups']);
    } else {
      // Fallback to Telegram share URL
      const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`;
      window.open(telegramShareUrl, '_blank');
    }
    
    setTimeout(() => setIsSharing(false), 1000);
  };

  const handleMention = () => {
    if (mention.trim() && window.Telegram?.WebApp) {
      const cleanMention = mention.replace('@', '');
      const tg = window.Telegram.WebApp;
      
      // Send mention data to bot
      tg.sendData(`mention:${cleanMention}`);
      
      // Update local state
      addGhibPoints(50);
      updateInvites(1);
      
      // Add to recent invites
      setRecentInvites(prev => [{
        username: cleanMention,
        joinedAt: 'Just now',
        earned: 50
      }, ...prev.slice(0, 4)]);
      
      setMention('');
      
      const popup = window.Telegram?.WebApp?.showPopup;
      popup
        ? popup({
            message: `🎉 Successfully mentioned @${cleanMention}!\n\n💰 +50 G8D earned\n👥 Total invites: ${invites + 1}`,
            buttons: [{ type: 'ok', text: 'Awesome!' }],
          })
        : null;
    } else {
      const popup = window.Telegram?.WebApp?.showPopup;
      popup
        ? popup({
            message: '❌ Please enter a valid username to mention.',
            buttons: [{ type: 'ok', text: 'Got it' }],
          })
        : null;
    }
  };

  const getReferralTier = () => {
    if (invites >= 100) return { name: 'Cosmic Master', icon: '🌌', color: 'from-purple-600 to-pink-600' };
    if (invites >= 50) return { name: 'Star Guide', icon: '⭐', color: 'from-yellow-500 to-orange-600' };
    if (invites >= 20) return { name: 'Moon Walker', icon: '🌙', color: 'from-blue-500 to-indigo-600' };
    if (invites >= 10) return { name: 'Rising Star', icon: '🌟', color: 'from-green-500 to-teal-600' };
    if (invites >= 5) return { name: 'Seeker', icon: '🔮', color: 'from-red-500 to-red-600' };
    return { name: 'Newcomer', icon: '✨', color: 'from-gray-500 to-gray-600' };
  };

  const tier = getReferralTier();
  const nextTierThreshold = [5, 10, 20, 50, 100].find(t => t > invites) || 100;
  const progressPercent = invites >= 100 ? 100 : (invites / nextTierThreshold) * 100;

  return (
    <div className="bg-red-950 rounded-xl p-6 border border-red-800 space-y-6">
      {/* Header with Stats */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${tier.color} text-white font-unica text-sm`}>
          <span className="text-lg">{tier.icon}</span>
          <span>{tier.name}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-900/50 rounded-lg p-3 text-center border border-red-800">
          <div className="text-2xl font-bold text-white">{invites}</div>
          <div className="text-red-300 text-sm font-unica">Friends Invited</div>
        </div>
        <div className="bg-red-900/50 rounded-lg p-3 text-center border border-red-800">
          <div className="text-2xl font-bold text-yellow-400">{invites * 50}</div>
          <div className="text-red-300 text-sm font-unica">G8D Earned</div>
        </div>
        <div className="bg-red-900/50 rounded-lg p-3 text-center border border-red-800">
          <div className="text-2xl font-bold text-green-400">#{Math.max(1, Math.floor(Math.random() * 1000))}</div>
          <div className="text-red-300 text-sm font-unica">Referral Rank</div>
        </div>
      </div>

      {/* Progress to Next Tier */}
      {invites < 100 && (
        <div className="bg-red-900/30 rounded-lg p-4 border border-red-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-red-300 font-unica text-sm">Progress to Next Tier</span>
            <span className="text-white font-unica text-sm">{invites}/{nextTierThreshold}</span>
          </div>
          <div className="w-full bg-red-800 rounded-full h-3">
            <div 
              className={`bg-gradient-to-r ${tier.color} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="text-red-400 text-xs mt-1 text-center">
            {nextTierThreshold - invites} more invites to unlock the next tier!
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopyLink}
            disabled={copied}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-unica transition-all ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white'
            }`}
          >
            {copied ? (
              <>
                <span>✅</span>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <span>🔗</span>
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            onClick={handleShareToTelegram}
            disabled={isSharing}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3 px-4 rounded-lg font-unica transition-all"
          >
            {isSharing ? (
              <>
                <span>📤</span>
                <span>Sharing...</span>
              </>
            ) : (
              <>
                <span>📱</span>
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* Mention Section */}
        <div className="bg-red-900/30 rounded-lg p-4 border border-red-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💬</span>
            <span className="text-white font-unica">Quick Mention</span>
            <span className="text-yellow-400 text-sm">+50 G8D</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={mention}
                onChange={(e) => setMention(e.target.value)}
                placeholder="Enter username (e.g., john_doe)"
                className="w-full bg-red-900 text-white rounded-lg p-3 font-unica pl-8 border border-red-700 focus:border-red-500 focus:outline-none"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400">@</span>
            </div>
            <button
              onClick={handleMention}
              disabled={!mention.trim()}
              className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 disabled:from-gray-600 disabled:to-gray-800 text-white px-6 py-3 rounded-lg font-unica transition-all"
            >
              Mention
            </button>
          </div>
        </div>
      </div>

      {/* Recent Invites */}
      {recentInvites.length > 0 && (
        <div className="bg-red-900/30 rounded-lg p-4 border border-red-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">👥</span>
            <span className="text-white font-unica">Recent Invites</span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentInvites.map((invite, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-red-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm">
                    {invite.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-unica text-sm">@{invite.username}</div>
                    <div className="text-red-400 text-xs">{invite.joinedAt}</div>
                  </div>
                </div>
                <div className="text-yellow-400 font-unica text-sm">+{invite.earned} G8D</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referral Benefits */}
      <div className="bg-gradient-to-r from-red-900/20 to-purple-900/20 rounded-lg p-4 border border-red-700">
        <h3 className="text-white font-unica mb-3 flex items-center gap-2">
          <span>🎁</span>
          <span>Referral Benefits</span>
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-green-300">
            <span>💰</span>
            <span>50 G8D per invite</span>
          </div>
          <div className="flex items-center gap-2 text-blue-300">
            <span>🏆</span>
            <span>Leaderboard boost</span>
          </div>
          <div className="flex items-center gap-2 text-purple-300">
            <span>⭐</span>
            <span>Exclusive badges</span>
          </div>
          <div className="flex items-center gap-2 text-yellow-300">
            <span>🎯</span>
            <span>Bonus rewards</span>
          </div>
        </div>
      </div>
    </div>
  );
}