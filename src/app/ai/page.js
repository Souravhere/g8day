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
      
      // Process successful response
      setPlanetData(data);
      
      // Generate AI interpretation if data was successfully retrieved
      if (data && data.planets) {
        generateAIInterpretation(data);
      }
    } catch (err) {
      console.error("Error fetching astrological data:", err);
      setError(`Error fetching astrological data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate AI interpretation of chart
  const generateAIInterpretation = async (data) => {
    if (!data || !data.planets) return;
    
    setAiLoading(true);
    try {
      const planetsInfo = data.planets.map(p => 
        `${p.name} in ${p.zodiac_sign_name} (${p.isRetro ? 'Retrograde' : 'Direct'}) in House ${p.house_number}`
      ).join(', ');
      
      const prompt = `As an astrologer, interpret this birth chart: ${planetsInfo}. Give a short, insightful reading.`;
      
      // Use our API route instead of direct OpenAI API call
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const aiData = await response.json();
      const interpretation = aiData.reply;
      
      setAiResponse(interpretation);
      setAiChat([
        { role: 'system', content: 'Welcome to AI Astrology Advisor! I can help interpret your chart and answer questions.' },
        { role: 'user', content: prompt },
        { role: 'assistant', content: interpretation }
      ]);
    } catch (err) {
      console.error('Error generating AI interpretation:', err);
      setAiResponse("Sorry, I couldn't generate an interpretation at this time.");
    } finally {
      setAiLoading(false);
    }
  };

  // Handle AI chat question submission
  const handleAiQuestion = async (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    
    // Add user question to chat
    const updatedChat = [...aiChat, { role: 'user', content: aiQuestion }];
    setAiChat(updatedChat);
    
    // Clear input and set loading
    setAiQuestion("");
    setAiLoading(true);
    
    try {
      // Include full chat history for context
      const messages = updatedChat.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Use our API route instead of direct OpenAI API call
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages })
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add AI response to chat
      setAiChat([...updatedChat, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('Error getting AI response:', err);
      setAiChat([...updatedChat, { 
        role: 'assistant', 
        content: "Sorry, I couldn't process your question at this time. Please try again later." 
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

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Head>
        <title>{t.title} - Astrological Chart Generator</title>
        <meta name="description" content="Detailed astrological chart generator with AI interpretation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 mt-18">
          {/* Form Section */}
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
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-400">Year</label>
                        <input
                          type="number"
                          name="year"
                          value={formData.year}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-red-500 text-white py-2 px-3"
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
                          className="w-full bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-red-500 text-white py-2 px-3"
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
                          className="w-full bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-red-500 text-white py-2 px-3"
                          min="1"
                          max="31"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">{t.time}</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-400">Hours</label>
                        <input
                          type="number"
                          name="hours"
                          value={formData.hours}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-red-500 text-white py-2 px-3"
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
                          className="w-full bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-red-500 text-white py-2 px-3"
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
                          className="w-full bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-red-500 text-white py-2 px-3"
                          min="0"
                          max="59"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">{t.location}</label>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-400">{t.latitude}</label>
                        <input
                          type="number"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-red-500 text-white py-2 px-3"
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
                          className="w-full bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-red-500 text-white py-2 px-3"
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
                          className="w-full bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-red-500 text-white py-2 px-3"
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
                      className="w-full bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-red-500 text-white py-2 px-3"
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
                      className="w-full bg-gray-800 rounded border border-gray-700 focus:ring-2 focus:ring-red-500 text-white py-2 px-3"
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
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 px-6 rounded-md shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
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
            ) : planetData ? (
              currentTab === "chart" ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-6">
                    {t.results}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {planetData.planets && planetData.planets.map((planet, index) => (
                      <motion.div
                        key={planet.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`bg-gray-900 rounded-lg p-4 border ${
                          planet.isRetro 
                            ? 'border-red-700 shadow-md shadow-red-900/30' 
                            : 'border-gray-800'
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
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-6">
                    {t.aiAdvisor}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="h-64 lg:h-96 overflow-y-auto bg-black rounded-md p-4 border border-gray-800">
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
                        className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
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