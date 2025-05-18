import { useEffect, useState } from 'react';

export default function MysticQuote() {
  const quotes = [
    'Your third house is vibrating—expect a surprising message today.',
    'The stars align in your favor—seize this moment.',
    'Mars is in retrograde—reflect before you act.',
    'The moon guides your path—trust your intuition.',
  ];

  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="text-center my-6">
      <p className="text-gray-300 font-cinzel italic">🔮 {quote}</p>
    </div>
  );
}