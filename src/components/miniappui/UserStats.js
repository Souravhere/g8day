'use client';

import { motion } from 'framer-motion';
import { useStore } from '../../lib/storage';
import { FaCoins, FaTicketAlt } from 'react-icons/fa';

export default function UserStats({ user }) {
  const { ghibPoints, tickets } = useStore();

  return (
    <motion.div 
      className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-4 shadow-lg mb-6 border border-indigo-800 overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600 rounded-full opacity-10 -mr-8 -mt-8" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-600 rounded-full opacity-10 -ml-4 -mb-4" />

      <div className="flex justify-between items-center">
        <motion.div 
          className="text-center flex flex-col items-center"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 text-white font-orbitron text-lg mb-1">
            <FaCoins className="text-yellow-400" />
            <p>G8D Points</p>
          </div>
          <motion.p 
            className="text-2xl text-yellow-400 font-bold"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: 0 }}
          >
            {ghibPoints}
          </motion.p>
        </motion.div>

        <motion.div 
          className="h-10 w-px bg-indigo-600"
          initial={{ height: 0 }}
          animate={{ height: 40 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        />

        <motion.div 
          className="text-center flex flex-col items-center"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 text-white font-orbitron text-lg mb-1">
            <FaTicketAlt className="text-red-400" />
            <p>Creation Tickets</p>
          </div>
          <motion.p 
            className="text-2xl text-red-400 font-bold"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: 0, delay: 0.2 }}
          >
            {tickets}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}