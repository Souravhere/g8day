// components/miniappui/TaskCenter.js
'use client';

import { useStore } from '@/lib/storage';

export default function TaskCenter() {
  const { addG8DPoints, updateInvites, tasks, completeTask } = useStore();

  const taskList = [
    { id: 'daily-login', name: 'Daily Login', reward: 20, type: 'G8D' },
    { id: 'rt-tweet', name: 'RT Our Tweet', reward: 30, type: 'G8D', url: 'https://x.com/G8DAI/status/1923741186877161844' },
    { id: 'daily-quiz', name: 'Daily Quiz', reward: 25, type: 'G8D' },
    { id: 'join-x', name: 'Join Our X', reward: 50, type: 'G8D', url: 'https://x.com/G8DAI' },
    { id: 'invite-5', name: 'Invite 5 Users', reward: 100, type: 'G8D', max: 5 },
  ];

  const handleClaim = (task) => {
    if (!tasks[task.id].completed) {
      if (task.url) {
        window.open(task.url, '_blank');
      }
      if (task.type === 'G8D') {
        addG8DPoints(task.reward);
      }
      if (task.id === 'invite-5') {
        updateInvites(5);
      }
      completeTask(task.id);
    }
  };

  const handlePlayQuiz = () => {
    alert('Quiz feature coming soon!');
  };

  return (
    <div className="bg-red-950 rounded-xl p-4 border border-red-800">
      {taskList.map((task) => (
        <div key={task.id} className="flex justify-between items-center py-2 border-b border-red-900 last:border-0">
          <div>
            <p className="text-white font-unica">{task.name}</p>
            <p className="text-sm text-red-400">{task.reward} G8D</p>
            {task.max && (
              <p className="text-sm text-red-300">{tasks[task.id].progress || 0}/{task.max} Completed</p>
            )}
          </div>
          <button
            onClick={() => (task.id === 'daily-quiz' ? handlePlayQuiz() : handleClaim(task))}
            disabled={tasks[task.id].completed}
            className={`px-4 py-2 rounded-lg font-unica text-sm ${
              tasks[task.id].completed
                ? 'bg-gray-600 text-gray-300'
                : 'bg-gradient-to-r from-red-600 to-red-800 text-white'
            }`}
          >
            {tasks[task.id].completed ? 'Claimed' : task.id === 'daily-quiz' ? 'Play Now' : 'Claim'}
          </button>
        </div>
      ))}
    </div>
  );
}