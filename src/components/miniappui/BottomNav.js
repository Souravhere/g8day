
import { FaHome, FaGift, FaStar, FaUser, FaRobot } from 'react-icons/fa';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: <FaHome /> },
    { id: 'rewards', label: 'Rewards', icon: <FaGift /> },
    { id: 'destiny', label: 'Destiny', icon: <FaStar /> },
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'agent', label: 'Agent', icon: <FaRobot /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 border-t border-indigo-800 flex justify-around py-2 max-w-md mx-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center text-sm font-unica ${
            activeTab === tab.id ? 'text-red-400' : 'text-gray-300'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}