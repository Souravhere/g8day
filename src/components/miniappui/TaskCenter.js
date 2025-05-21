'use client'

import { useStore } from '@/lib/storage';
import { useState } from 'react';
export default function TaskCenter() {
  const { addGhibPoints, addTickets, updateInvites } = useStore();
  const [tasks, setTasks] = useState([
    { id: 'daily-login', name: 'Daily Login', reward: 100, type: 'ghib', completed: false },
    { id: 'rt-tweet', name: 'RT Our Tweet', reward: 1, type: 'ghib', completed: false },
    { id: 'daily-quiz', name: 'Daily Quiz', reward: 50, type: 'ghib', completed: false },
    { id: 'join-x', name: 'Join Our X', reward: 1000, type: 'ghib', completed: false },
    { id: 'invite-5', name: 'Invite 5 Users', reward: 5000, type: 'ghib', completed: false, progress: 0, max: 5 },
  ]);

  const handleClaim = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId && !task.completed
          ? { ...task, completed: true }
          : task
      )
    );
    const task = tasks.find((t) => t.id === taskId);
    if (task.type === 'ghib') {
      addGhibPoints(task.reward);
    }
    if (task.id === 'invite-5') {
      updateInvites(5);
    }
  };

  const handlePlayQuiz = () => {
    alert('Quiz feature coming soon!');
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-4 shadow-lg my-6">
      <h2 className="text-xl font-orbitron text-white mb-4">Task Center</h2>
      {tasks.map((task) => (
        <div key={task.id} className="flex justify-between items-center py-2 border-b border-indigo-800 last:border-0">
          <div>
            <p className="text-white font-unica">{task.name}</p>
            <p className="text-sm text-red-400">{task.reward} {task.type === 'ghib' ? 'GHIB' : 'Tickets'}</p>
            {task.progress !== undefined && (
              <p className="text-sm text-gray-300">{task.progress}/{task.max} Completed</p>
            )}
          </div>
          <button
            onClick={() => task.id === 'daily-quiz' ? handlePlayQuiz() : handleClaim(task.id)}
            disabled={task.completed}
            className={`px-4 py-2 rounded-lg font-unica text-sm ${
              task.completed
                ? 'bg-gray-600 text-gray-300'
                : 'bg-gradient-to-r from-red-600 to-red-800 text-white'
            }`}
          >
            {task.completed ? 'Claimed' : task.id === 'daily-quiz' ? 'Play Now' : 'Claim'}
          </button>
        </div>
      ))}
    </div>
  );
}