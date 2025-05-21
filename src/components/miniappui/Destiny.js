import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Destiny = () => {
  const [birthdate, setBirthdate] = useState('');
  const [birthtime, setBirthtime] = useState('');
  const [location, setLocation] = useState('');
  const [destinyReading, setDestinyReading] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); 

  // Location data with coordinates and timezone for each city
  const locationData = {
    "New York, United States": { latitude: 40.7128, longitude: -74.0060, timezone: -4 },
    "London, United Kingdom": { latitude: 51.5074, longitude: -0.1278, timezone: 1 },
    "Tokyo, Japan": { latitude: 35.6762, longitude: 139.6503, timezone: 9 },
    "Delhi, India": { latitude: 28.6139, longitude: 77.2090, timezone: 5.5 },
    "Mumbai, India": { latitude: 19.0760, longitude: 72.8777, timezone: 5.5 },
    "Sydney, Australia": { latitude: -33.8688, longitude: 151.2093, timezone: 10 },
    "Los Angeles, United States": { latitude: 34.0522, longitude: -118.2437, timezone: -7 },
    "Paris, France": { latitude: 48.8566, longitude: 2.3522, timezone: 2 },
    "Beijing, China": { latitude: 39.9042, longitude: 116.4074, timezone: 8 },
    "Shanghai, China": { latitude: 31.2304, longitude: 121.4737, timezone: 8 },
    "Guangzhou, China": { latitude: 23.1291, longitude: 113.2644, timezone: 8 },
    "Shenzhen, China": { latitude: 22.5431, longitude: 114.0579, timezone: 8 },
    "Chengdu, China": { latitude: 30.5728, longitude: 104.0668, timezone: 8 },
    "Wuhan, China": { latitude: 30.5928, longitude: 114.3055, timezone: 8 },
    "Hangzhou, China": { latitude: 30.2741, longitude: 120.1551, timezone: 8 },
    "Seoul, South Korea": { latitude: 37.5665, longitude: 126.9780, timezone: 9 },
    "Busan, South Korea": { latitude: 35.1796, longitude: 129.0756, timezone: 9 },
    "Incheon, South Korea": { latitude: 37.4563, longitude: 126.7052, timezone: 9 },
    "Daegu, South Korea": { latitude: 35.8714, longitude: 128.6014, timezone: 9 },
    "Daejeon, South Korea": { latitude: 36.3504, longitude: 127.3845, timezone: 9 },
    "Gwangju, South Korea": { latitude: 35.1601, longitude: 126.8515, timezone: 9 },
    "Ulsan, South Korea": { latitude: 35.5384, longitude: 129.3114, timezone: 9 },
    "Jeju, South Korea": { latitude: 33.4996, longitude: 126.5312, timezone: 9 },
    "Dubai, UAE": { latitude: 25.2048, longitude: 55.2708, timezone: 4 }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Parse birthdate into year, month, day
    const birthDateObj = new Date(birthdate);
    const year = birthDateObj.getFullYear();
    const month = birthDateObj.getMonth() + 1; // JavaScript months are 0-indexed
    const date = birthDateObj.getDate();
    
    // Extract hours, minutes from birthtime
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    
    if (birthtime) {
      const [hour, minute] = birthtime.split(':');
      hours = parseInt(hour, 10);
      minutes = parseInt(minute, 10);
    }
    
    // Get location coordinates and timezone
    const selectedLocation = locationData[location] || { latitude: 0, longitude: 0, timezone: 0 };
    
    // Create request payload matching the API requirements
    const requestPayload = {
      year,
      month,
      date,
      hours,
      minutes,
      seconds,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      timezone: selectedLocation.timezone,
      config: {
        observation_point: "topocentric",
        ayanamsha: "lahiri"
      }
    };
    
    // Log the data being sent for debugging
    console.log("Sending data:", requestPayload);
    
    try {
      const response = await fetch('/api/astrology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });
      
      // Check if response is OK first before trying to parse JSON
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(`API responded with status ${response.status}: ${errorData.error || 'Unknown error'}`);
      }
      
      // Parse JSON response
      const data = await response.json();
      console.log("Received data:", data);
      
      // Process the response data
      if (data && data.output) {
        // Transform the API response to our expected format
        const processedData = processAstrologyData(data);
        setDestinyReading(processedData);
      } else {
        throw new Error('Invalid response data format');
      }
    } catch (error) {
      console.error('Error fetching destiny reading:', error);
      setError(error.message || 'Failed to fetch your cosmic reading. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Process the API response data
  const processAstrologyData = (data) => {
    const signNames = {
      1: "Aries",
      2: "Taurus",
      3: "Gemini",
      4: "Cancer",
      5: "Leo",
      6: "Virgo",
      7: "Libra",
      8: "Scorpio",
      9: "Sagittarius",
      10: "Capricorn",
      11: "Aquarius",
      12: "Pisces"
    };
    
    // Extract planets data
    const planetsData = data.output[1] || {};
    const planets = Object.entries(planetsData)
      .filter(([key]) => !["ayanamsa", "debug"].includes(key))
      .map(([name, details]) => ({
        name,
        sign: signNames[details.current_sign] || "Unknown",
        degrees: details.normDegree,
        isRetrograde: details.isRetro === "true"
      }));
    
    // Create houses data (12 houses)
    const houses = Array.from({ length: 12 }, (_, i) => {
      const houseNumber = i + 1;
      // For simplicity, we'll use the ascendant to determine the houses
      // In a real app, you'd calculate this properly based on house system
      const ascendantSign = planetsData.Ascendant?.current_sign || 1;
      const houseSign = ((ascendantSign + i) % 12) || 12; // Ensure 1-12 range
      
      return {
        number: houseNumber,
        sign: signNames[houseSign],
        degrees: 0 // This would need actual calculation
      };
    });
    
    return {
      sunSign: signNames[planetsData.Sun?.current_sign] || "Unknown",
      moonSign: signNames[planetsData.Moon?.current_sign] || "Unknown",
      ascendant: {
        sign: signNames[planetsData.Ascendant?.current_sign] || "Unknown",
        degrees: planetsData.Ascendant?.normDegree || 0
      },
      planets,
      houses
    };
  };

  const copyToClipboard = () => {
    if (!destinyReading) return;
    
    const textToCopy = `
My Cosmic Reading:
Birth Date: ${birthdate}
Birth Time: ${birthtime || 'Not specified'}
Birth Location: ${location}

Sun Sign: ${destinyReading.sunSign || 'Unknown'}
Moon Sign: ${destinyReading.moonSign || 'Unknown'}
Rising Sign: ${destinyReading.ascendant?.sign || 'Unknown'}

Planets:
${destinyReading.planets?.map(planet => 
  `${planet.name}: ${planet.sign} (${planet.degrees}°)${planet.isRetrograde ? ' Retrograde' : ''}`
).join('\n') || 'No planetary data available'}

Houses:
${destinyReading.houses?.map(house => 
  `House ${house.number}: ${house.sign} (${house.degrees}°)`
).join('\n') || 'No house data available'}
    `;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert('Cosmic reading copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
;
  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-b from-red-900/40 to-red-950/40 rounded-xl p-8 backdrop-blur-sm border border-red-500/20 shadow-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-bold text-center text-red-100 mb-8">
          <span className="inline-block">✨</span> 
          <span className="mx-2">Cosmic Destiny Reader</span>
          <span className="inline-block">✨</span>
        </h2>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-800/30 border border-red-500 text-red-100 px-4 py-3 rounded mb-6"
          >
            <p>{error}</p>
          </motion.div>
        )}
        
        {!destinyReading ? (
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-red-200 mb-2 font-medium" htmlFor="birthdate">Birth Date*</label>
                <input
                  type="date"
                  id="birthdate"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full bg-red-900/20 border border-red-500/40 rounded-lg px-4 py-3 text-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-red-200 mb-2 font-medium" htmlFor="birthtime">Birth Time (if known)</label>
                <input
                  type="time"
                  id="birthtime"
                  value={birthtime}
                  onChange={(e) => setBirthtime(e.target.value)}
                  className="w-full bg-red-900/20 border border-red-500/40 rounded-lg px-4 py-3 text-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-red-200 mb-2 font-medium" htmlFor="location">Birth Location*</label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-red-900/20 border border-red-500/40 rounded-lg px-4 py-3 text-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
                required
              >
                <option value="">Select Location</option>
                {Object.keys(locationData).map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Consulting the Cosmos...
                </span>
              ) : "Reveal My Cosmic Destiny"}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-red-700/30 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-red-100">Your Cosmic Blueprint</h3>
              <p className="text-red-300 mt-2">Born on {birthdate} {birthtime ? `at ${birthtime}` : ''} in {location}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                className="bg-gradient-to-br from-red-800/30 to-red-900/30 border border-red-500/30 rounded-lg p-5 shadow-lg"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.1), 0 8px 10px -6px rgba(220, 38, 38, 0.1)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-red-600/40 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-red-200">Sun Sign</h4>
                </div>
                <p className="text-white text-lg font-semibold">{destinyReading.sunSign}</p>
                <p className="text-red-300 mt-2 text-sm">Your core identity and life purpose</p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-red-800/30 to-red-900/30 border border-red-500/30 rounded-lg p-5 shadow-lg"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.1), 0 8px 10px -6px rgba(220, 38, 38, 0.1)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-red-600/40 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-red-200">Moon Sign</h4>
                </div>
                <p className="text-white text-lg font-semibold">{destinyReading.moonSign}</p>
                <p className="text-red-300 mt-2 text-sm">Your emotional nature and inner self</p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-red-800/30 to-red-900/30 border border-red-500/30 rounded-lg p-5 shadow-lg"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.1), 0 8px 10px -6px rgba(220, 38, 38, 0.1)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-red-600/40 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-red-200">Rising Sign</h4>
                </div>
                <p className="text-white text-lg font-semibold">{destinyReading.ascendant.sign}</p>
                <p className="text-red-300 mt-2 text-sm">Your outer personality and approach to life</p>
              </motion.div>
            </div>
            
            <motion.div 
              className="bg-gradient-to-br from-red-800/20 to-red-900/20 border border-red-500/30 rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="font-semibold text-red-200 text-lg mb-4">Planetary Positions</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {destinyReading.planets?.map((planet) => (
                  <div key={planet.name} className="bg-red-950/30 rounded-lg p-3 border border-red-500/20">
                    <h5 className="font-medium text-red-300">{planet.name}</h5>
                    <p className="text-white">{planet.sign}</p>
                    <p className="text-red-400 text-sm">
                      {planet.degrees?.toFixed(2)}° 
                      {planet.isRetrograde && <span className="ml-1">(R)</span>}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-red-800/20 to-red-900/20 border border-red-500/30 rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h4 className="font-semibold text-red-200 text-lg mb-4">Houses</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {destinyReading.houses?.map((house) => (
                  <div key={house.number} className="bg-red-950/30 rounded-lg p-3 border border-red-500/20">
                    <h5 className="font-medium text-red-300">House {house.number}</h5>
                    <p className="text-white">{house.sign}</p>
                    <p className="text-red-400 text-sm">{house.degrees?.toFixed(2)}°</p>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-red-800/20 to-red-900/20 border border-red-500/30 rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="font-semibold text-red-200 text-lg mb-4">Cosmic Insights</h4>
              <p className="text-white leading-relaxed">
                Your chart reveals a unique cosmic signature that influences your life path and potentials. 
                The positions of the planets at your birth time create a celestial blueprint that can offer 
                insights into your personality, talents, challenges, and life direction.
              </p>
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                <p className="text-red-200 italic">
                  "The cosmos is within us. We are made of star-stuff. 
                  We are a way for the universe to know itself." - Carl Sagan
                </p>
              </div>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 mb-20">
              <motion.button
                onClick={() => setDestinyReading(null)}
                className="flex-1 bg-red-800/50 hover:bg-red-700/50 text-white font-semibold py-3 px-4 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                New Reading
              </motion.button>
              
              <motion.button
                onClick={copyToClipboard}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Reading for AI Analysis
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Destiny;