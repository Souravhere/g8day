'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/storage';
import confetti from 'canvas-confetti';

export default function ClaimButton() {
  const { addGhibPoints, tasks, completeTask } = useStore();
  const [isClaimed, setIsClaimed] = useState(tasks['daily-fortune'].completed);

  useEffect(() => {
    setIsClaimed(tasks['daily-fortune'].completed);
  }, [tasks]);

  const handleClaim = () => {
    if (!isClaimed) {
      addGhibPoints(50);
      completeTask('daily-fortune');
      setIsClaimed(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <button
      onClick={handleClaim}
      disabled={isClaimed}
      className={`w-full py-3 rounded-lg font-unica text-lg ${
        isClaimed
          ? 'bg-gray-600 text-gray-300'
          : 'bg-gradient-to-r from-red-600 to-red-800 text-white'
      }`}
    >
      {isClaimed ? 'Claimed Today' : 'Claim Daily Fortune'}
    </button>
  );
}