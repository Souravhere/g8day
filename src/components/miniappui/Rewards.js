
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Gift, 
  Coins, 
  CalendarCheck, 
  Users, 
  Rocket, 
  Unlock,
  Star
} from 'lucide-react';
import { useStore } from '@/lib/storage';

export default function Rewards() {
  const { ghibPoints, addGhibPoints, addTickets, updateInvites, tasks = {}, completeTask } = useStore();
  const [specialOffers, setSpecialOffers] = useState([]);

  useEffect(() => {
    // Initialize special offers
    setSpecialOffers([
      {
        id: 1,
        title: '2X Rewards Weekend',
        description: 'Earn double G8D points on all tasks this weekend!',
        expires: '2 days',
        image: '/key/card1.png'
      },
      {
        id: 2,
        title: 'Free Reading Pass',
        description: 'Complete 5 daily tasks to unlock a free AI reading',
        expires: '4 days',
        image: '/key/card2.png'
      }
    ]);
  }, []);

  const dailyTasks = [
    { 
      id: 'daily-fortune', 
      title: 'Check Your Daily Horoscope', 
      reward: 20, 
      completed: tasks['daily-fortune']?.completed || false,
      icon: <CalendarCheck className="text-red-400" size={20} />
    },
    { 
      id: 'invite-5', 
      title: 'Share G8Day with Friends', 
      reward: 50, 
      completed: tasks['invite-5']?.completed || false,
      icon: <Users className="text-red-400" size={20} />
    },
    { 
      id: 'cosmic-quiz', 
      title: 'Complete a Cosmic Quiz', 
      reward: 30, 
      completed: tasks['cosmic-quiz']?.completed || false,
      icon: <Rocket className="text-red-400" size={20} />
    },
    { 
      id: 'astrology-reading', 
      title: 'Create an Astrology Reading', 
      reward: 40, 
      completed: tasks['astrology-reading']?.completed || false,
      icon: <Unlock className="text-red-400" size={20} />
    }
  ];

  const availableRewards = [
    { id: 1, name: '1 Creation Ticket', cost: 500, type: 'ghib' },
    { id: 2, name: 'Premium Theme', cost: 1500, type: 'ghib' },
  ];

  const completeTaskHandler = (taskId) => {
    if (!tasks[taskId].completed) {
      const task = dailyTasks.find((t) => t.id === taskId);
      if (taskId === 'invite-5') {
        updateInvites(1);
        addGhibPoints(task.reward);
      } else if (taskId === 'cosmic-quiz') {
        alert('Quiz feature coming soon!');
        return;
      } else {
        addGhibPoints(task.reward);
      }
      completeTask(taskId);
      if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: 'Task Complete!',
          message: `You earned ${task.reward} G8D points!`,
          buttons: [{ type: 'ok' }]
        });
      }
    }
  };

  const redeemReward = (reward) => {
    if (reward.type === 'ghib' && ghibPoints >= reward.cost) {
      addGhibPoints(-reward.cost);
      addTickets(1);
      if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: 'Reward Redeemed!',
          message: `You redeemed ${reward.name}!`,
          buttons: [{ type: 'ok' }]
        });
      }
    } else {
      if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: 'Insufficient Points',
          message: `You need ${reward.cost} G8D to redeem ${reward.name}.`,
          buttons: [{ type: 'ok' }]
        });
      }
    }
  };

  const calculateLoyaltyLevel = () => {
    if (ghibPoints >= 10000) return { level: 3, progress: 100 };
    if (ghibPoints >= 5000) return { level: 2, progress: ((ghibPoints - 5000) / 5000) * 100 };
    return { level: 1, progress: (ghibPoints / 5000) * 100 };
  };

  const { level, progress } = calculateLoyaltyLevel();

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
    hidden: { y: 20, opacity: 0 },  
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="w-full pt-2 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="mb-6 text-center"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-400 to-red-600 mb-2">
          Cosmic Rewards
        </h2>
        <p className="text-gray-300 font-unica">
          Complete tasks to earn G8D tokens and unlock cosmic powers
        </p>
      </motion.div>

      {/* Daily Tasks */}
      <motion.div 
        className="bg-gradient-to-r from-red-950 to-red-900 rounded-xl overflow-hidden shadow-lg border border-red-800 mb-6"
        variants={itemVariants}
      >
        <h3 className="text-lg font-orbitron font-bold bg-black bg-opacity-40 p-3 border-b border-red-800 flex items-center">
          <Gift className="mr-2 text-red-400" size={20} />
          Daily Tasks
        </h3>
        <div className="p-4">
          {dailyTasks.map((task) => (
            <motion.div 
              key={task.id}
              className={cn(
                "flex items-center justify-between p-3 mb-3 rounded-lg border",
                task.completed 
                  ? "bg-red-900 bg-opacity-30 border-red-700" 
                  : "bg-black bg-opacity-30 border-red-800"
              )}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center mr-3">
                  {task.icon}
                </div>
                <div>
                  <p className={`font-medium ${task.completed ? 'text-red-400' : 'text-white'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center">
                    <Coins className="text-yellow-400 mr-1 text-sm" size={14} />
                    <span className="text-yellow-400 text-sm">{task.reward} G8D</span>
                  </div>
                </div>
              </div>
              <motion.button 
                className={cn(
                  "px-3 py-1 rounded-lg font-medium text-sm",
                  task.completed
                    ? "bg-red-700 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md"
                )}
                disabled={task.completed}
                onClick={() => completeTaskHandler(task.id)}
                whileTap={{ scale: 0.95 }}
              >
                {task.completed ? 'Completed' : 'Claim'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Special Offers */}
      <motion.div 
        className="bg-gradient-to-r from-red-950 to-red-900 rounded-xl overflow-hidden shadow-lg border border-red-800 mb-6"
        variants={itemVariants}
      >
        <h3 className="text-lg font-orbitron font-bold bg-black bg-opacity-40 p-3 border-b border-red-800">
          <Rocket className="inline mr-2 text-yellow-400" size={20} />
          Special Offers
        </h3>
        <div className="p-4">
          {specialOffers.map((offer) => (
            <motion.div 
              key={offer.id}
              className="bg-black bg-opacity-30 rounded-lg p-3 mb-3 border border-red-800"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 bg-red-900 shadow-md">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{offer.title}</p>
                  <p className="text-sm text-gray-300">{offer.description}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-red-400">Expires in: {offer.expires}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Loyalty Program */}
      <motion.div 
        className="bg-gradient-to-r from-red-950 to-red-900 rounded-xl overflow-hidden shadow-lg border border-red-800 mb-6"
        variants={itemVariants}
      >
        <h3 className="text-lg font-orbitron font-bold bg-black bg-opacity-40 p-3 border-b border-red-800">
          <Coins className="inline mr-2 text-yellow-400" size={20} />
          Cosmic Loyalty Program
        </h3>
        <div className="p-4">
          <div className="bg-black bg-opacity-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Your Progress</span>
              <span className="text-yellow-400">Level {level}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5 mb-2">
              <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>0 G8D</span>
              <span>5,000 G8D</span>
              <span>10,000 G8D</span>
            </div>
            <div className="mt-4">
              <p className="text-gray-300 text-sm mb-2">Next reward at 5,000 G8D:</p>
              <div className="bg-red-900 bg-opacity-50 p-2 rounded-lg border border-red-700 flex items-center">
                <Gift className="text-red-400 mr-2" size={16} />
                <span className="text-white text-sm">Exclusive Premium Reading + 3 Creation Tickets</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Available Rewards */}
      <motion.div 
        className="bg-gradient-to-r from-red-950 to-red-900 rounded-xl overflow-hidden shadow-lg border border-red-800 mb-6"
        variants={itemVariants}
      >
        <h3 className="text-lg font-orbitron font-bold bg-black bg-opacity-40 p-3 border-b border-red-800">
          <Star className="inline mr-2 text-yellow-400" size={20} />
          Available Rewards
        </h3>
        <div className="p-4 grid grid-cols-2 gap-3">
          {/* Reward Cards */}
          {availableRewards.map((reward) => (
            <div key={reward.id} className="bg-black bg-opacity-30 rounded-lg p-3 border border-red-800 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-900 flex items-center justify-center mb-2">
                {reward.name.includes('Ticket') ? <Gift size={24} className="text-red-400" /> : <Star size={24} className="text-yellow-400" />}
              </div>
              <p className="text-white text-center text-sm font-medium">{reward.name}</p>
              <div className="flex items-center mt-2">
                <Coins size={12} className="text-yellow-400 mr-1" />
                <span className="text-yellow-400 text-xs">{reward.cost} G8D</span>
              </div>
              <button
                className={cn(
                  "mt-2 px-3 py-1 bg-red-700 text-white text-xs rounded-lg w-full",
                  ghibPoints < reward.cost && "opacity-50 cursor-not-allowed"
                )}
                disabled={ghibPoints < reward.cost}
                onClick={() => redeemReward(reward)}
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Spacer for bottom navigation */}
      <div className="h-16"></div>
    </motion.div>
  );
}