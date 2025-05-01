"use client"
import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Sun, Moon, Star, Loader, AlertTriangle } from 'lucide-react';

// Planet icon mapping
const PlanetIcons = {
  "Sun": <Sun className="text-yellow-400" size={24} />,
  "Moon": <Moon className="text-blue-200" size={24} />,
  "Mercury": <Star className="text-gray-400" size={24} />,
  "Venus": <Star className="text-pink-400" size={24} />,
  "Mars": <Star className="text-red-500" size={24} />,
  "Jupiter": <Star className="text-orange-400" size={24} />,
  "Saturn": <Star className="text-yellow-700" size={24} />,
  "Rahu": <Star className="text-purple-500" size={24} />,
  "Ketu": <Star className="text-green-400" size={24} />,
  "Uranus": <Star className="text-teal-400" size={24} />,
  "Neptune": <Star className="text-blue-500" size={24} />,
  "Pluto": <Star className="text-indigo-800" size={24} />,
};

export default function Home() {
  // Form state
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    date: new Date().getDate(),
    hours: 12,
    minutes: 0,
    seconds: 0,
    latitude: 18.9333,
    longitude: 72.8166,
    timezone: 5.5,
    settings: {
      observation_point: "topocentric",
      ayanamsha: "lahiri",
      language: "en"
    }
  });

  // App state
  const [planetData, setPlanetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en");

  // Handler for form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested settings object
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      // Handle top-level fields
      setFormData({
        ...formData,
        [name]: name === 'timezone' || name === 'latitude' || name === 'longitude' 
               ? parseFloat(value) 
               : parseInt(value, 10)
      });
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Update language setting before making the request
      const requestData = {
        ...formData,
        settings: {
          ...formData.settings,
          language: language
        }
      };

      const response = await fetch('https://json.freeastrologyapi.com/planets/extended', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_ASTRO_API_KEY || 'YOUR_ACTUAL_API_KEY'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      setPlanetData(data);
    } catch (err) {
      console.error('Error fetching astrological data:', err);
      setError(err.message || 'Failed to fetch astrological data');
    } finally {
      setLoading(false);
    }
  };

  // Language toggle handler
  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "te" : "en");
  };

  // Translations
  const translations = {
    en: {
      title: "Cosmic Chart",
      subtitle: "Discover your astrological profile",
      birth: "Birth Details",
      date: "Date of Birth",
      time: "Time of Birth",
      location: "Location",
      settings: "Chart Settings",
      observation: "Observation Point",
      ayanamsha: "Ayanamsha",
      language: "Language",
      submit: "Generate Chart",
      results: "Your Cosmic Profile",
      planet: "Planet",
      sign: "Zodiac Sign",
      nakshatra: "Nakshatra",
      pada: "Pada",
      house: "House",
      degree: "Degree",
      retrograde: "Retrograde",
      latitude: "Latitude",
      longitude: "Longitude",
      timezone: "Timezone",
      loading: "Consulting the stars...",
      error: "Error",
      toggleLang: "తెలుగులో చూడండి" // View in Telugu
    },
    te: {
      title: "రాశి చక్రం",
      subtitle: "మీ జ్యోతిష ప్రొఫైల్‌ని కనుగొనండి",
      birth: "జన్మ వివరాలు",
      date: "పుట్టిన తేదీ",
      time: "జన్మ సమయం",
      location: "స్థానం",
      settings: "చార్ట్ సెట్టింగ్‌లు",
      observation: "పరిశీలన పాయింట్",
      ayanamsha: "అయనాంశ",
      language: "భాష",
      submit: "చార్ట్ సృష్టించండి",
      results: "మీ కాస్మిక్ ప్రొఫైల్",
      planet: "గ్రహం",
      sign: "రాశి",
      nakshatra: "నక్షత్రం",
      pada: "పాద",
      house: "భవనం",
      degree: "డిగ్రీ",
      retrograde: "వక్రీ",
      latitude: "అక్షాంశం",
      longitude: "రేఖాంశం",
      timezone: "టైమ్‌జోన్",
      loading: "నక్షత్రాలను సంప్రదిస్తోంది...",
      error: "లోపం",
      toggleLang: "View in English" // View in English
    }
  };

  // Get current language texts
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>{t.title} - Astrological Chart Generator</title>
        <meta name="description" content="Detailed astrological chart generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">{t.title}</h1>
          <p className="text-purple-300">{t.subtitle}</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/3 bg-gray-800 rounded-lg p-6 shadow-lg border border-purple-900"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Birth Details */}
              <div>
                <h2 className="text-xl font-semibold text-purple-400 mb-4">{t.birth}</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t.date}</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-400">Year</label>
                        <input
                          type="number"
                          name="year"
                          value={formData.year}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-purple-500 text-white py-2 px-3"
                          min="1900"
                          max="2100"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400">Month</label>
                        <input
                          type="number"
                          name="month"
                          value={formData.month}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-purple-500 text-white py-2 px-3"
                          min="1"
                          max="12"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400">Day</label>
                        <input
                          type="number"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-purple-500 text-white py-2 px-3"
                          min="1"
                          max="31"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t.time}</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-400">Hours</label>
                        <input
                          type="number"
                          name="hours"
                          value={formData.hours}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-purple-500 text-white py-2 px-3"
                          min="0"
                          max="23"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400">Minutes</label>
                        <input
                          type="number"
                          name="minutes"
                          value={formData.minutes}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-purple-500 text-white py-2 px-3"
                          min="0"
                          max="59"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400">Seconds</label>
                        <input
                          type="number"
                          name="seconds"
                          value={formData.seconds}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-purple-500 text-white py-2 px-3"
                          min="0"
                          max="59"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t.location}</label>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-400">{t.latitude}</label>
                        <input
                          type="number"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-purple-500 text-white py-2 px-3"
                          step="0.0001"
                          min="-90"
                          max="90"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400">{t.longitude}</label>
                        <input
                          type="number"
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-purple-500 text-white py-2 px-3"
                          step="0.0001"
                          min="-180"
                          max="180"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400">{t.timezone}</label>
                        <input
                          type="number"
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-purple-500 text-white py-2 px-3"
                          step="0.5"
                          min="-12"
                          max="14"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Settings */}
              <div>
                <h2 className="text-xl font-semibold text-purple-400 mb-4">{t.settings}</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t.observation}</label>
                    <select
                      name="settings.observation_point"
                      value={formData.settings.observation_point}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-purple-500 text-white py-2 px-3"
                    >
                      <option value="topocentric">Topocentric</option>
                      <option value="geocentric">Geocentric</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{t.ayanamsha}</label>
                    <select
                      name="settings.ayanamsha"
                      value={formData.settings.ayanamsha}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded border border-gray-600 focus:ring-2 focus:ring-purple-500 text-white py-2 px-3"
                    >
                      <option value="lahiri">Lahiri</option>
                      <option value="raman">Raman</option>
                      <option value="krishnamurti">Krishnamurti</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="text-sm text-purple-400 hover:text-purple-300 transition"
                >
                  {t.toggleLang}
                </button>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-6 rounded-md shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      {t.loading}
                    </span>
                  ) : t.submit}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:w-2/3"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full min-h-64 bg-gray-800 rounded-lg p-8 border border-purple-900">
                <Loader className="animate-spin h-12 w-12 text-purple-500 mb-4" />
                <p className="text-purple-300 text-lg">{t.loading}</p>
              </div>
            ) : error ? (
              <div className="bg-gray-800 rounded-lg p-8 border border-red-800">
                <div className="flex items-center text-red-500 mb-4">
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  <h2 className="text-xl font-semibold">{t.error}</h2>
                </div>
                <p className="text-gray-300">{error}</p>
              </div>
            ) : planetData ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
                  {t.results}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {planetData.planets.map((planet, index) => (
                    <motion.div
                      key={planet.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`bg-gray-800 rounded-lg p-4 border ${
                        planet.isRetro 
                          ? 'border-red-700 shadow-md shadow-red-900/30' 
                          : 'border-purple-900'
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <div className="mr-3">
                          {PlanetIcons[planet.name] || <Star className="text-white" size={24} />}
                        </div>
                        <h3 className="text-lg font-medium">
                          {planet.name}
                          {planet.isRetro && (
                            <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-red-900 text-red-200 animate-pulse">
                              {t.retrograde}
                            </span>
                          )}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">{t.sign}:</span>
                          <p className="text-white">{planet.zodiac_sign_name}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">{t.house}:</span>
                          <p className="text-white">{planet.house_number}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">{t.nakshatra}:</span>
                          <p className="text-white">{planet.nakshatra_name}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">{t.pada}:</span>
                          <p className="text-white">{planet.nakshatra_pada}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-400">{t.degree}:</span>
                          <p className="text-white">{parseFloat(planet.full_degree).toFixed(2)}°</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-64 bg-gray-800 bg-opacity-50 rounded-lg p-8 border border-gray-700 border-dashed">
                <Star className="h-16 w-16 text-purple-500/30 mb-4" />
                <p className="text-gray-400 text-center">
                  {language === "en" 
                    ? "Enter your birth details and generate your cosmic profile" 
                    : "మీ జన్మ వివరాలను నమోదు చేసి మీ కాస్మిక్ ప్రొఫైల్‌ని సృష్టించండి"}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Cosmic Chart Generator
        </div>
      </footer>
    </div>
  );
}