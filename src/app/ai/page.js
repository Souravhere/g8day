'use client'
import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Sun, Moon, Star, Loader, AlertTriangle, Send, Sparkles } from 'lucide-react';


// Planet icon mapping
const PlanetIcons = {
  "Sun": <Sun className="text-yellow-500" size={24} />,
  "Moon": <Moon className="text-blue-500" size={24} />,
  "Mercury": <Star className="text-gray-500" size={24} />,
  "Venus": <Star className="text-pink-500" size={24} />,
  "Mars": <Star className="text-red-500" size={24} />,
  "Jupiter": <Star className="text-orange-500" size={24} />,
  "Saturn": <Star className="text-yellow-600" size={24} />,
  "Rahu": <Star className="text-purple-500" size={24} />,
  "Ketu": <Star className="text-green-500" size={24} />,
  "Uranus": <Star className="text-teal-500" size={24} />,
  "Neptune": <Star className="text-blue-600" size={24} />,
  "Pluto": <Star className="text-indigo-600" size={24} />,
};

export default function Home() {
  // Language state
  const [language, setLanguage] = useState("en");

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

const handleDateChange = (date) => {
    setFormData({
        ...formData,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
    });
};
  
  // App state
  const [planetData, setPlanetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiChat, setAiChat] = useState([]);
  const [currentTab, setCurrentTab] = useState("chart"); // 'chart' or 'ai'

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
      // Log the data being sent for debugging
      console.log("Sending data:", formData);
      
      const response = await fetch('/api/astrology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      // Check if response is OK first before trying to parse JSON
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(`API responded with status ${response.status}: ${errorData.error || 'Unknown error'}`);
      }
      
      // Parse JSON response
      const data = await response.json();
      
      // Process successful response - store the data
      setPlanetData(data);
      console.log("Received planetData:", data);
      
      // Generate AI interpretation if data was successfully retrieved
      if (data && data.output) {
        generateAIInterpretation(data);
      }
    } catch (err) {
      console.error("Error fetching astrological data:", err);
      setError(`Error fetching astrological data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInterpretation = async (data) => {
    if (!data || !data.output) return;
  
    setAiLoading(true);
    try {
      const planetEntries = Object.entries(data.output)
        .filter(([key]) => key !== "Ascendant")
        .map(([name, info]) => 
          `${name}: in ${info.zodiac_sign_name} (${info.isRetro === "true" ? 'Retrograde' : 'Direct'}) in House ${info.house_number}`
        );
  
      if (data.output.Ascendant) {
        planetEntries.unshift(`Ascendant: in ${data.output.Ascendant.zodiac_sign_name}`);
      }
  
      const planetsInfo = planetEntries.join('\n\n');
  
      const prompt = `Interpret this birth chart in a short, friendly way:\n\n${planetsInfo}\n\nKeep it concise and human-like. Use plain language.`;
  
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
      });
  
      if (!response.ok) throw new Error(`API responded with status ${response.status}`);
  
      const aiData = await response.json();
      const interpretation = aiData.reply
        .replace(/\*\*|\*/g, '')
        .replace(/\s+/g, ' ')
        .trim();
  
      setAiResponse(interpretation);
      setAiChat([
        { role: 'system', content: 'Welcome! I’ll give short, friendly readings of your chart. Ask only astrology-related stuff!' },
        { role: 'user', content: prompt },
        { role: 'assistant', content: interpretation }
      ]);
    } catch (err) {
      console.error('Error generating AI interpretation:', err);
      setAiResponse("Oops! Couldn't read your chart right now.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiQuestion = async (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
  
    const updatedChat = [...aiChat, { role: 'user', content: aiQuestion }];
    setAiChat(updatedChat);
    setAiQuestion("");
    setAiLoading(true);
  
    try {
      const messages = updatedChat.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
  
      // Add system prompt for strict topic control and tone
      messages.unshift({
        role: 'system',
        content: 'Only respond to astrology-related questions. If the question is off-topic, say: "Sorry, I can only answer astrology-related questions 😊". Keep all answers short, in human-friendly and casual language. No markdown or extra formatting.'
      });
  
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });
  
      if (!response.ok) throw new Error(`API responded with status ${response.status}`);
  
      const data = await response.json();
      setAiChat([...updatedChat, { role: 'assistant', content: data.reply.trim() }]);
    } catch (err) {
      console.error('Error getting AI response:', err);
      setAiChat([...updatedChat, { 
        role: 'assistant', 
        content: "Hmm, I couldn't get that. Try again in a bit!" 
      }]);
    } finally {
      setAiLoading(false);
    }
  };
  

  // Language toggle handler
  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "zh" : "en");
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
      toggleLang: "查看中文版", // View in Chinese
      aiAdvisor: "AI Astrology Advisor",
      askQuestion: "Ask a question about your chart",
      send: "Send",
      aiLoading: "AI thinking...",
      chartTab: "Birth Chart",
      aiTab: "AI Advisor"
    },
    zh: {
      title: "星盘解析",
      subtitle: "探索你的星座图谱",
      birth: "出生详情",
      date: "出生日期",
      time: "出生时间",
      location: "出生地点",
      settings: "图表设置",
      observation: "观测点",
      ayanamsha: "黄道修正",
      language: "语言",
      submit: "生成星盘",
      results: "您的宇宙档案",
      planet: "行星",
      sign: "星座",
      nakshatra: "星宿",
      pada: "星宿部分",
      house: "宫位",
      degree: "度数",
      retrograde: "逆行",
      latitude: "纬度",
      longitude: "经度",
      timezone: "时区",
      loading: "咨询星象中...",
      error: "错误",
      toggleLang: "View in English", // View in English
      aiAdvisor: "AI 占星顾问",
      askQuestion: "询问关于您星盘的问题",
      send: "发送",
      aiLoading: "AI 思考中...",
      chartTab: "星盘",
      aiTab: "AI 顾问"
    }
  };

  // Get current language texts
  const t = translations[language];

const locations = [
    { city: "New York", country: "United States", lat: 40.7128, lng: -74.0060, timezone: -5 },
    { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, timezone: 0 },
    { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, timezone: 9 },
    { city: "Delhi", country: "India", lat: 28.6139, lng: 77.2090, timezone: 5.5 },
    { city: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777, timezone: 5.5 },
    { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, timezone: 10 },
    { city: "Los Angeles", country: "United States", lat: 34.0522, lng: -118.2437, timezone: -8 },
    { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522, timezone: 1 },
    { city: "Beijing", country: "China", lat: 39.9042, lng: 116.4074, timezone: 8 },
    { city: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737, timezone: 8 },
    { city: "Guangzhou", country: "China", lat: 23.1291, lng: 113.2644, timezone: 8 },
    { city: "Shenzhen", country: "China", lat: 22.5431, lng: 114.0579, timezone: 8 },
    { city: "Chengdu", country: "China", lat: 30.5728, lng: 104.0668, timezone: 8 },
    { city: "Wuhan", country: "China", lat: 30.5928, lng: 114.3055, timezone: 8 },
    { city: "Hangzhou", country: "China", lat: 30.2741, lng: 120.1551, timezone: 8 },
    { city: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780, timezone: 9 },
    { city: "Busan", country: "South Korea", lat: 35.1796, lng: 129.0756, timezone: 9 },
    { city: "Incheon", country: "South Korea", lat: 37.4563, lng: 126.7052, timezone: 9 },
    { city: "Daegu", country: "South Korea", lat: 35.8714, lng: 128.6014, timezone: 9 },
    { city: "Daejeon", country: "South Korea", lat: 36.3504, lng: 127.3845, timezone: 9 },
    { city: "Gwangju", country: "South Korea", lat: 35.1595, lng: 126.8526, timezone: 9 },
    { city: "Ulsan", country: "South Korea", lat: 35.5384, lng: 129.3114, timezone: 9 },
    { city: "Jeju", country: "South Korea", lat: 33.4996, lng: 126.5312, timezone: 9 },
    { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, timezone: 4 }
];
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 mt-18">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/3 bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-800"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Birth Details */}
                <div>
                    <h2 className="text-xl font-semibold text-red-500 mb-4">{t.birth}</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">{t.date}</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={`${formData.year}-${String(formData.month).padStart(2, '0')}-${String(formData.date).padStart(2, '0')}`}
                                onChange={(e) => {
                                    const [year, month, date] = e.target.value.split('-');
                                    setFormData({
                                        ...formData,
                                        year: parseInt(year, 10),
                                        month: parseInt(month, 10),
                                        date: parseInt(date, 10),
                                    });
                                }}
                                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none text-white py-2 px-3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">{t.time}</label>
                            <div>
                                <input
                                    type="time"
                                    name="time"
                                    value={`${String(formData.hours).padStart(2, '0')}:${String(formData.minutes).padStart(2, '0')}`}
                                    onChange={(e) => {
                                        const [hours, minutes] = e.target.value.split(':');
                                        setFormData({
                                            ...formData,
                                            hours: parseInt(hours, 10),
                                            minutes: parseInt(minutes, 10),
                                            seconds: 0, // Reset seconds to 0 for simplicity
                                        });
                                    }}
                                    className="w-full bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none text-white py-2 px-3"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">{t.location}</label>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-xs text-gray-400">Select Location</label>
                                    <select
                                        onChange={(e) => {
                                            const selectedLocation = locations.find(
                                                (loc) => `${loc.city}, ${loc.country}` === e.target.value
                                            );
                                            if (selectedLocation) {
                                                setFormData({
                                                    ...formData,
                                                    latitude: selectedLocation.lat,
                                                    longitude: selectedLocation.lng,
                                                    timezone: selectedLocation.timezone,
                                                });
                                            }
                                        }}
                                        className="w-full bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none text-white py-2 px-3"
                                    >
                                        <option value="">Select a location</option>
                                        {locations.map((loc) => (
                                            <option key={loc.city} value={`${loc.city}, ${loc.country}`}>
                                                {loc.city}, {loc.country}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400">{t.latitude}</label>
                                    <input
                                        type="number"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none text-white py-2 px-3"
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
                                        className="w-full bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none text-white py-2 px-3"
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
                                        className="w-full bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none text-white py-2 px-3"
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
                    <h2 className="text-xl font-semibold text-red-500 mb-4">{t.settings}</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">{t.observation}</label>
                            <select
                                name="settings.observation_point"
                                value={formData.settings.observation_point}
                                onChange={handleInputChange}
                                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none text-white py-2 px-3"
                            >
                                <option value="topocentric">Topocentric</option>
                                <option value="geocentric">Geocentric</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">{t.ayanamsha}</label>
                            <select
                                name="settings.ayanamsha"
                                value={formData.settings.ayanamsha}
                                onChange={handleInputChange}
                                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none text-white py-2 px-3"
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
                        className="text-sm text-red-400 hover:text-red-300 transition"
                    >
                        {t.toggleLang}
                    </button>

                    <button
                        type="submit"
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 px-6 rounded-md shadow-lg transition transform hover:scale-105 focus:outline-none focus:border-red-500 outline-none disabled:opacity-50"
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
         <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:w-2/3"
          >
            {/* Tab Navigation */}
            {planetData && (
              <div className="flex border-b border-gray-800 mb-6">
                <button
                  onClick={() => setCurrentTab("chart")}
                  className={`py-2 px-4 font-medium ${
                    currentTab === "chart" 
                      ? "text-red-500 border-b-2 border-red-500" 
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Star className="inline mr-2 h-4 w-4" />
                  {t.chartTab}
                </button>
                <button
                  onClick={() => setCurrentTab("ai")}
                  className={`py-2 px-4 font-medium ${
                    currentTab === "ai" 
                      ? "text-red-500 border-b-2 border-red-500" 
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Sparkles className="inline mr-2 h-4 w-4" />
                  {t.aiTab}
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center h-full min-h-64 bg-gray-900 rounded-lg p-8 border border-gray-800">
                <Loader className="animate-spin h-12 w-12 text-red-500 mb-4" />
                <p className="text-gray-300 text-lg">{t.loading}</p>
              </div>
            ) : error ? (
              <div className="bg-gray-900 rounded-lg p-8 border border-red-800">
                <div className="flex items-center text-red-500 mb-4">
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  <h2 className="text-xl font-semibold">{t.error}</h2>
                </div>
                <p className="text-gray-300">{error}</p>
              </div>
            ) : planetData && planetData.output ? (
              currentTab === "chart" ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-6">
                    {t.results}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(planetData.output).map(([planetName, planetInfo], index) => (
                      <motion.div
                        key={planetName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`bg-gray-900 rounded-lg p-4 border ${
                          planetInfo.isRetro === "true"
                            ? 'border-red-700 shadow-md shadow-red-900/30' 
                            : 'border-gray-800'
                        }`}
                      >
                        <div className="flex items-center mb-3">
                          <div className="mr-3">
                            {PlanetIcons[planetName] || <Star className="text-white" size={24} />}
                          </div>
                          <h3 className="text-lg font-medium">
                            {planetName}
                            {planetInfo.isRetro === "true" && (
                              <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-red-900 text-red-200 animate-pulse">
                                {t.retrograde}
                              </span>
                            )}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-400">{t.sign}:</span>
                            <p className="text-white">{planetInfo.zodiac_sign_name}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">{t.house}:</span>
                            <p className="text-white">{planetInfo.house_number}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">{t.nakshatra}:</span>
                            <p className="text-white">{planetInfo.nakshatra_name}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">{t.pada}:</span>
                            <p className="text-white">{planetInfo.nakshatra_pada}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-400">{t.degree}:</span>
                            <p className="text-white">{parseFloat(planetInfo.fullDegree).toFixed(2)}°</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 h-[78vh] rounded-lg p-6 border border-gray-800">
                  <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-6">
                    {t.aiAdvisor}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="h-[60vh] md:h-[62vh]  overflow-y-auto bg-black rounded-md p-4 border border-gray-800">
                      {aiChat.map((message, index) => (
                        <div 
                          key={index} 
                          className={`mb-4 ${
                            message.role === 'user' 
                              ? 'text-right' 
                              : message.role === 'system' ? 'text-center italic' : ''
                          }`}
                        >
                          {message.role === 'user' ? (
                            <div className="flex justify-end">
                              <span className="bg-red-800 text-white px-4 py-2 rounded-lg inline-block max-w-xs lg:max-w-md">
                                {message.content}
                              </span>
                            </div>
                          ) : message.role === 'system' ? (
                            <div className="text-gray-500 text-sm py-2">{message.content}</div>
                          ) : (
                            <div className="flex justify-start">
                              <span className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg inline-block max-w-xs lg:max-w-md">
                                {message.content}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                      {aiLoading && (
                        <div className="flex justify-start">
                          <div className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg flex items-center">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                            </div>
                            <span className="ml-2">{t.aiLoading}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <form onSubmit={handleAiQuestion} className="flex space-x-2">
                      <input
                        type="text"
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        placeholder={t.askQuestion}
                        className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-4 focus:outline-none focus:border-red-500 outline-none"
                        disabled={aiLoading}
                      />
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 flex items-center justify-center disabled:opacity-50"
                        disabled={aiLoading || !aiQuestion.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-64 bg-gray-900 bg-opacity-50 rounded-lg p-8 border border-gray-800 border-dashed">
                <Star className="h-16 w-16 text-red-500/30 mb-4" />
                <p className="text-gray-400 text-center">
                  {language === "en" 
                    ? "Enter your birth details and generate your cosmic profile" 
                    : "输入您的出生详情，生成您的宇宙档案"}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      </div>
  )
}