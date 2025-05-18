'use client'

import { useStore } from '@/lib/storage';
import { useState } from 'react';

export default function ReferralSection({ userId }) {
  const { invites, addTickets } = useStore();
  const [mention, setMention] = useState('');

  const referralLink = `https://t.me/qr_me_bot?start=${userId || 'unknown'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied!');
  };

  const handleMention = () => {
    if (mention && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.sendData(`mention:${mention}`); // Send mention data to bot
      addTickets(1);
      setMention('');
      alert(`Mentioned @${mention}! You earned 1 Creation Ticket.`);
    } else {
      alert('Please enter a username to mention.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-4 shadow-lg my-6">
      <h2 className="text-xl font-orbitron text-white mb-4">Invite Your Tribe</h2>
      <p className="text-gray-300 font-unica mb-4">
        Each invited friend = 1 Creation Ticket
      </p>
      <p className="text-sm text-red-400 mb-2">{invites} friends invited</p>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={mention}
          onChange={(e) => setMention(e.target.value)}
          placeholder="Mention a friend (e.g., username)"
          className="flex-1 bg-indigo-800 text-white rounded-lg p-2 font-unica"
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
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-800 text-white py-2 rounded-lg font-unica"
      >
        Copy Referral Link
      </button>
    </div>
  );
}