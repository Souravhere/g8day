import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Destiny = () => {
  const [birthdate, setBirthdate] = useState('');
  const [birthtime, setBirthtime] = useState('');
  const [location, setLocation] = useState('');
  const [destinyReading, setDestinyReading] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/astrology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthdate,
          birthtime,
          location
        }),
      });
      
      const data = await response.json();
      setDestinyReading(data);
    } catch (error) {
      console.error('Error fetching destiny reading:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-b from-purple-900/30 to-indigo-900/30 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20 shadow-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">Discover Your Destiny</h2>
        
        {!destinyReading ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-purple-200 mb-2" htmlFor="birthdate">Birth Date</label>
              <input
                type="date"
                id="birthdate"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full bg-purple-800/30 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            
            <div>
              <label className="block text-purple-200 mb-2" htmlFor="birthtime">Birth Time (if known)</label>
              <input
                type="time"
                id="birthtime"
                value={birthtime}
                onChange={(e) => setBirthtime(e.target.value)}
                className="w-full bg-purple-800/30 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            
            <div>
              <label className="block text-purple-200 mb-2" htmlFor="location">Birth Place</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="w-full bg-purple-800/30 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reading the Stars...
                </span>
              ) : "Reveal My Destiny"}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-purple-700/30 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-purple-100">Your Cosmic Path</h3>
            </div>
            
            <div className="bg-purple-800/20 border border-purple-500/30 rounded-lg p-5">
              <h4 className="font-medium text-purple-200 mb-2">Sun Sign</h4>
              <p className="text-white">{destinyReading.sunSign}</p>
            </div>
            
            <div className="bg-purple-800/20 border border-purple-500/30 rounded-lg p-5">
              <h4 className="font-medium text-purple-200 mb-2">Moon Sign</h4>
              <p className="text-white">{destinyReading.moonSign}</p>
            </div>
            
            <div className="bg-purple-800/20 border border-purple-500/30 rounded-lg p-5">
              <h4 className="font-medium text-purple-200 mb-2">Rising Sign</h4>
              <p className="text-white">{destinyReading.risingSign}</p>
            </div>
            
            <div className="bg-purple-800/20 border border-purple-500/30 rounded-lg p-5">
              <h4 className="font-medium text-purple-200 mb-2">Destiny Reading</h4>
              <p className="text-white whitespace-pre-line">{destinyReading.reading}</p>
            </div>
            
            <button
              onClick={() => setDestinyReading(null)}
              className="w-full mt-4 bg-purple-600/50 hover:bg-purple-700/50 text-white font-semibold py-2 px-4 rounded-lg"
            >
              New Reading
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Destiny;