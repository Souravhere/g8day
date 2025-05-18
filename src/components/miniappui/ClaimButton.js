'use client'

import { useState, useEffect } from 'react';
import Confetti from 'confetti-js';
import { useStore } from '../../lib/storage';

export default function ClaimButton() {
  const [isCooldown, setIsCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const { addGhibPoints } = useStore();

  useEffect(() => {
    const lastClaim = localStorage.getItem('lastClaim');
    if (lastClaim) {
      const timeSinceClaim = Date.now() - parseInt(lastClaim);
      const cooldownDuration = 24 * 60 * 60 * 1000; // 24 hours
      if (timeSinceClaim < cooldownDuration) {
        setIsCooldown(true);
        setTimeLeft(cooldownDuration - timeSinceClaim);
      }
    }
  }, []);

  useEffect(() => {
    if (isCooldown && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1000) {
            setIsCooldown(false);
            localStorage.removeItem('lastClaim');
            return null;
          }
          return prev - 1000;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCooldown, timeLeft]);

  const handleClaim = () => {
    if (!isCooldown) {
      localStorage.setItem('lastClaim', Date.now());
      setIsCooldown(true);
      setTimeLeft(24 * 60 * 60 * 1000);
      addGhibPoints(100);

      // Trigger confetti
      const confettiSettings = { target: 'confetti-canvas', max: 100, size: 1, rotate: true };
      const confetti = new Confetti(confettiSettings);
      confetti.start();
      setTimeout(() => confetti.stop(), 3000);
    }
  };

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <canvas id="confetti-canvas" className="absolute inset-0 pointer-events-none" />
      <button
        onClick={handleClaim}
        disabled={isCooldown}
        className={`w-full py-3 rounded-lg font-unica text-lg text-white shadow-lg transition-transform transform hover:scale-105 ${
          isCooldown ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-red-800 animate-glow'
        }`}
      >
        {isCooldown ? `Next Claim in ${formatTime(timeLeft)}` : 'Claim Daily Reward'}
      </button>
    </>
  );
}