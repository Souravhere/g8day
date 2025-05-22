// components/miniappui/ReferralSection.js
'use client';

import { useStore } from '@/lib/storage';
import { useState } from 'react';

export default function ReferralSection({ userId }) {
  const { invites, addG8DPoints, updateInvites } = useStore();
  const [mention, setMention] = useState('');

  const referralLink = `https://t.me/G8DayBot?start=${userId || 'unknown'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    const popup = window.Telegram?.WebApp?.showPopup;
    popup
      ? popup({ message: 'Referral link copied!', buttons: [{ type: 'ok' }] })
      : alert('Referral link copied!');
  };

  const handleMention = () => {
    if (mention && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.sendData(`mention:${mention}`);
      addG8DPoints(50);
      updateInvites(1);
      setMention('');
      const popup = window.Telegram?.WebApp?.showPopup;
      popup
        ? popup({
            message: `Mentioned @${mention}! You earned 50 G8D.`,
            buttons: [{ type: 'ok' }],
          })
        : alert(`Mentioned @${mention}! You earned 50 G8D.`);
    } else {
      const popup = window.Telegram?.WebApp?.showPopup;
      popup
        ? popup({
            message: 'Please enter a username to mention.',
            buttons: [{ type: 'ok' }],
          })
        : alert('Please enter a username to mention.');
    }
  };

  return (
    <div className="bg-red-950 rounded-xl p-4 border border-red-800">
      <h2 className="text-xl font-unica text-white mb-4">Invite Your Tribe</h2>
      <p className="text-red-300 font-unica mb-4">Each invite = 50 G8D</p>
      <p className="text-sm text-red-400 mb-2">{invites} friends invited</p>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={mention}
          onChange={(e) => setMention(e.target.value)}
          placeholder="Mention a friend (e.g., username)"
          className="flex-1 bg-red-900 text-white rounded-lg p-2 font-unica"
        />
        <button
          onClick={handleMention}
          className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg font-unica"
        >
          Mention
        </button>
      </div>
      <button
        onClick={handleCopyLink}
        className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-2 rounded-lg font-unica"
      >
        Copy Referral Link
      </button>
    </div>
  );
}