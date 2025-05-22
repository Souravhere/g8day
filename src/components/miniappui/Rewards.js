import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Gift, 
  Coins, 
  CalendarCheck, 
  Users, 
  Rocket, 
  Unlock,
  Star,
  Crown,
  Zap,
  Trophy,
  Sparkles,
  Target,
  Timer,
  CheckCircle,
  Lock
} from 'lucide-react';
import { useStore } from '@/lib/storage';

export default function Rewards() {
  const { ghibPoints, addGhibPoints, addTickets, updateInvites, tasks = {}, completeTask } = useStore();
  const [specialOffers, setSpecialOffers] = useState([]);
  const [activeTab, setActiveTab] = useState('daily');
  const [showCelebration, setShowCelebration] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Initialize special offers with more attractive data
    setSpecialOffers([
      {
        id: 1,
        title: '🌟 Cosmic Jackpot Weekend',
        description: 'Triple G8D rewards + Mystery bonus chest',
        expires: '2 days',
        multiplier: '3x',
        rarity: 'legendary',
        image: '/key/card1.png',
        participants: 1247
      },
      {
        id: 2,
        title: '🔮 Oracle\'s Gift',
        description: 'Unlock premium AI readings + exclusive themes',
        expires: '4 days',
        rarity: 'epic',
        image: '/key/card2.png',
        participants: 892
      },
      {
        id: 3,
        title: '⚡ Lightning Strike Bonus',
        description: 'Complete any 3 tasks in 1 hour for mega rewards',
        expires: '1 day',
        rarity: 'rare',
        image: '/key/card1.png',
        participants: 2156
      }
    ]);

    // Update countdown timer
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dailyTasks = [
    { 
      id: 'daily-fortune', 
      title: 'Divine Daily Reading', 
      description: 'Unlock your cosmic destiny for today',
      reward: 20, 
      streak: 3,
      xp: 50,
      completed: tasks['daily-fortune']?.completed || false,
      icon: <CalendarCheck className="text-purple-400" size={24} />,
      difficulty: 'easy',
      category: 'spiritual'
    },
    { 
      id: 'invite-5', 
      title: 'Cosmic Ambassador', 
      description: 'Share the magic with your tribe',
      reward: 50, 
      streak: 1,
      xp: 100,
      completed: tasks['invite-5']?.completed || false,
      icon: <Users className="text-blue-400" size={24} />,
      difficulty: 'medium',
      category: 'social'
    },
    { 
      id: 'cosmic-quiz', 
      title: 'Stellar Knowledge Test', 
      description: 'Prove your cosmic wisdom',
      reward: 30, 
      streak: 2,
      xp: 75,
      completed: tasks['cosmic-quiz']?.completed || false,
      icon: <Rocket className="text-orange-400" size={24} />,
      difficulty: 'medium',
      category: 'challenge'
    },
    { 
      id: 'astrology-reading', 
      title: 'Create Destiny Map', 
      description: 'Craft a personalized astrology reading',
      reward: 40, 
      streak: 1,
      xp: 120,
      completed: tasks['astrology-reading']?.completed || false,
      icon: <Unlock className="text-green-400" size={24} />,
      difficulty: 'hard',
      category: 'creative'
    }
  ];

  const weeklyTasks = [
    {
      id: 'weekly-master',
      title: 'Cosmic Master Challenge',
      description: 'Complete all daily tasks for 7 days straight',
      reward: 500,
      xp: 1000,
      progress: 3,
      total: 7,
      completed: false,
      icon: <Crown className="text-yellow-400" size={24} />,
      rarity: 'legendary'
    },
    {
      id: 'social-butterfly',
      title: 'Social Constellation',
      description: 'Invite 10 friends this week',
      reward: 300,
      xp: 600,
      progress: 2,
      total: 10,
      completed: false,
      icon: <Star className="text-pink-400" size={24} />,
      rarity: 'epic'
    }
  ];

  const availableRewards = [
    { 
      id: 1, 
      name: '🎫 Cosmic Ticket',
      description: 'Unlock premium readings',
      cost: 500, 
      type: 'ghib',
      rarity: 'common',
      stock: 'unlimited'
    },
    { 
      id: 2, 
      name: '🌌 Nebula Theme',
      description: 'Exclusive cosmic interface',
      cost: 1500, 
      type: 'ghib',
      rarity: 'rare',
      stock: '47 left'
    },
    { 
      id: 3, 
      name: '👑 VIP Status',
      description: '30 days premium access',
      cost: 5000, 
      type: 'ghib',
      rarity: 'legendary',
      stock: '12 left'
    },
    { 
      id: 4, 
      name: '⚡ Power Boost',
      description: '2x rewards for 24h',
      cost: 2000, 
      type: 'ghib',
      rarity: 'epic',
      stock: '23 left'
    }
  ];

  const completeTaskHandler = (taskId) => {
    if (!tasks[taskId]?.completed) {
      const task = dailyTasks.find((t) => t.id === taskId);
      
      // Show celebration animation
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);

      if (taskId === 'invite-5') {
        updateInvites(1);
        addGhibPoints(task.reward);
      } else if (taskId === 'cosmic-quiz') {
        // Simulate quiz completion
        addGhibPoints(task.reward);
      } else {
        addGhibPoints(task.reward);
      }
      
      completeTask(taskId);
      
      if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: '🎉 Cosmic Success!',
          message: `Amazing! You earned ${task.reward} G8D + ${task.xp} XP!`,
          buttons: [{ type: 'ok', text: 'Stellar!' }]
        });
      }
    }
  };

  const redeemReward = (reward) => {
    if (reward.type === 'ghib' && ghibPoints >= reward.cost) {
      addGhibPoints(-reward.cost);
      if (reward.name.includes('Ticket')) {
        addTickets(1);
      }
      
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
      
      if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: '🎁 Reward Claimed!',
          message: `Congratulations! You redeemed ${reward.name}!`,
          buttons: [{ type: 'ok', text: 'Amazing!' }]
        });
      }
    } else {
      if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: '💫 Need More Power',
          message: `You need ${reward.cost} G8D to unlock ${reward.name}. Complete more tasks!`,
          buttons: [{ type: 'ok', text: 'Got it!' }]
        });
      }
    }
  };

  const calculateLoyaltyLevel = () => {
    if (ghibPoints >= 50000) return { level: 7, name: 'Cosmic Emperor', progress: 100, color: 'from-purple-500 to-pink-500' };
    if (ghibPoints >= 25000) return { level: 6, name: 'Stellar Master', progress: ((ghibPoints - 25000) / 25000) * 100, color: 'from-blue-500 to-purple-500' };
    if (ghibPoints >= 10000) return { level: 5, name: 'Galaxy Guardian', progress: ((ghibPoints - 10000) / 15000) * 100, color: 'from-green-500 to-blue-500' };
    if (ghibPoints >= 5000) return { level: 4, name: 'Star Navigator', progress: ((ghibPoints - 5000) / 5000) * 100, color: 'from-yellow-500 to-green-500' };
    if (ghibPoints >= 2000) return { level: 3, name: 'Moon Walker', progress: ((ghibPoints - 2000) / 3000) * 100, color: 'from-orange-500 to-yellow-500' };
    if (ghibPoints >= 500) return { level: 2, name: 'Cosmic Seeker', progress: ((ghibPoints - 500) / 1500) * 100, color: 'from-red-500 to-orange-500' };
    return { level: 1, name: 'Stardust Novice', progress: (ghibPoints / 500) * 100, color: 'from-gray-500 to-red-500' };
  };

  const { level, name, progress, color } = calculateLoyaltyLevel();

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 via-orange-500 to-red-500';
      case 'epic': return 'from-purple-400 via-pink-500 to-red-500';
      case 'rare': return 'from-blue-400 via-cyan-500 to-green-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },  
    visible: { y: 0, opacity: 1 }
  };

  const celebrationVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      className="w-full pt-2 pb-24 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            variants={celebrationVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="text-6xl">
              ✨🎉⭐
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Stats */}
      <motion.div
        className="mb-6"
        variants={itemVariants}
      >
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold  mb-2">
            ✨ Cosmic Rewards Hub ✨
          </h2>
          <p className="text-gray-300 font-unica">
            Unlock the mysteries of the universe through divine tasks
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gradient-to-br from-red-950 to-red-900 rounded-xl p-3 border border-red-700 text-center">
            <div className="text-2xl font-bold text-yellow-400">{ghibPoints.toLocaleString()}</div>
            <div className="text-red-300 text-sm font-unica">G8D Balance</div>
          </div>
          <div className="bg-gradient-to-br from-purple-950 to-purple-900 rounded-xl p-3 border border-purple-700 text-center">
            <div className="text-2xl font-bold text-purple-400">{level}</div>
            <div className="text-purple-300 text-sm font-unica">Cosmic Level</div>
          </div>
          <div className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-xl p-3 border border-blue-700 text-center">
            <div className="text-2xl font-bold text-blue-400">{Math.floor(Math.random() * 50) + 10}</div>
            <div className="text-blue-300 text-sm font-unica">Daily Streak</div>
          </div>
        </div>

        {/* Reset Timer */}
        <div className="bg-gradient-to-r from-orange-950 to-red-950 rounded-xl p-3 border border-orange-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="text-orange-400" size={20} />
            <span className="text-white font-unica">Daily Reset</span>
          </div>
          <div className="text-orange-400 font-bold">{timeLeft}</div>
        </div>
      </motion.div>

      {/* Loyalty Level Card */}
      <motion.div 
        className="bg-gradient-to-r from-red-950 via-purple-950 to-blue-950 rounded-xl overflow-hidden shadow-2xl border border-purple-800 mb-6"
        variants={itemVariants}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${color} flex items-center justify-center`}>
                <Crown className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{name}</h3>
                <p className="text-gray-300 text-sm">Level {level} Cosmic Being</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl">🌟</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
            <div 
              className={`bg-gradient-to-r ${color} h-3 rounded-full transition-all duration-1000`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-400">
            <span>Current Level</span>
            <span>{progress.toFixed(1)}% to next level</span>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="flex bg-red-950 rounded-xl p-1 mb-6 border border-red-800"
        variants={itemVariants}
      >
        {[
          { id: 'daily', label: 'Daily Tasks', icon: <Target size={16} /> },
          { id: 'weekly', label: 'Weekly', icon: <Trophy size={16} /> },
          { id: 'offers', label: 'Special', icon: <Sparkles size={16} /> },
          { id: 'rewards', label: 'Shop', icon: <Gift size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg font-unica transition-all",
              activeTab === tab.id 
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg" 
                : "text-red-300 hover:text-white"
            )}
          >
            {tab.icon}
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'daily' && (
          <motion.div
            key="daily"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {dailyTasks.map((task, index) => (
              <motion.div 
                key={task.id}
                className={cn(
                  "bg-gradient-to-r from-red-950 to-red-900 rounded-xl p-4 border shadow-lg",
                  task.completed 
                    ? "border-green-700 bg-opacity-50" 
                    : "border-red-800 hover:border-red-700"
                )}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center",
                      task.completed ? "bg-green-900/50" : "bg-black/50"
                    )}>
                      {task.completed ? <CheckCircle className="text-green-400" size={28} /> : task.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={cn(
                          "font-semibold text-[13px]",
                          task.completed ? "text-green-400" : "text-white"
                        )}>
                          {task.title}
                        </h4>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          task.difficulty === 'easy' ? "bg-green-900/50 text-green-400" :
                          task.difficulty === 'medium' ? "bg-yellow-900/50 text-yellow-400" :
                          "bg-red-900/50 text-red-400"
                        )}>
                          {task.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2 text-[10px]">{task.description}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Coins className="text-yellow-400" size={14} />
                          <span className="text-yellow-400 text-[9px]">{task.reward} G8D</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="text-blue-400" size={14} />
                          <span className="text-blue-400 text-[9px]">{task.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="text-purple-400" size={14} />
                          <span className="text-purple-400 text-[9px]">{task.streak}d streak</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button 
                    className={cn(
                      "px-4 py-2 rounded-xl font-bold text-sm transition-all",
                      task.completed
                        ? "bg-green-700 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl"
                    )}
                    disabled={task.completed}
                    onClick={() => completeTaskHandler(task.id)}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: task.completed ? 1 : 1.05 }}
                  >
                    {task.completed ? '✅ Done' : '🚀 Start'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'weekly' && (
          <motion.div
            key="weekly"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {weeklyTasks.map((task) => (
              <div key={task.id} className={`bg-gradient-to-r ${getRarityColor(task.rarity)} p-1 rounded-xl`}>
                <div className="bg-red-950 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                        {task.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{task.title}</h4>
                        <p className="text-gray-300 text-sm">{task.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">{task.reward} G8D</div>
                      <div className="text-blue-400 text-sm">{task.xp} XP</div>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{task.progress}/{task.total}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(task.progress / task.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'offers' && (
          <motion.div
            key="offers"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {specialOffers.map((offer) => (
              <div key={offer.id} className={`bg-gradient-to-r ${getRarityColor(offer.rarity)} p-1 rounded-xl`}>
                <div className="bg-red-950 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-red-900 shadow-lg">
                      <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white">{offer.title}</h4>
                        {offer.multiplier && (
                          <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded-full font-bold">
                            {offer.multiplier}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{offer.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-red-400">⏰ {offer.expires}</span>
                          <span className="text-blue-400">👥 {offer.participants} joined</span>
                        </div>
                        <button className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:shadow-lg transition-all">
                          🎯 Join Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'rewards' && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-2 gap-4"
          >
            {availableRewards.map((reward) => (
              <div key={reward.id} className={`bg-gradient-to-r ${getRarityColor(reward.rarity)} p-1 rounded-xl`}>
                <div className="bg-red-950 rounded-lg p-4 h-full flex flex-col">
                  <div className="text-center mb-3">
                    <div className="text-3xl mb-2">{reward.name.split(' ')[0]}</div>
                    <h4 className="text-white font-bold text-sm">{reward.name.substring(2)}</h4>
                    <p className="text-gray-300 text-xs">{reward.description}</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-end">
                    <div className="text-center mb-2">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Coins className="text-yellow-400" size={14} />
                        <span className="text-yellow-400 font-bold">{reward.cost.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-400">{reward.stock}</div>
                    </div>
                    
                    <button
                      className={cn(
                        "w-full py-2 rounded-lg font-bold text-sm transition-all",
                        ghibPoints >= reward.cost
                          ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      )}
                      disabled={ghibPoints < reward.cost}
                      onClick={() => redeemReward(reward)}
                    >
                      {ghibPoints >= reward.cost ? '🛒 Buy Now' : '🔒 Locked'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for bottom navigation */}
      <div className="h-16"></div>
    </motion.div>
  );
}