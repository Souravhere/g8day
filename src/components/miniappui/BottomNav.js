'use client'

import { FaHome, FaGift, FaStar, FaUser, FaRobot } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function BottomNav({ activeTab, setActiveTab }) {
    const router = useRouter();
    
    const tabs = [
        { id: 'home', label: 'Home', icon: <FaHome /> },
        { id: 'rewards', label: 'Rewards', icon: <FaGift /> },
        { id: 'destiny', label: 'Destiny', icon: <FaStar /> },
        { id: 'profile', label: 'Profile', icon: <FaUser /> },
        { id: 'agent', label: 'Agent', icon: <FaRobot /> },
    ];

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        
        if (tabId === 'agent' && window.location.pathname !== '/telegram/agent') {
            router.push('/telegram/agent');
        }
    };

    return (
        <nav 
            className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 border-t border-indigo-800 flex justify-around py-2 px-1 max-w-md mx-auto backdrop-blur-md z-50"
        >
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg w-16 ${
                        activeTab === tab.id ? 'text-red-500' : 'text-gray-400'
                    }`}
                >
                    <span className="text-xl mb-1">
                        {tab.icon}
                    </span>
                    <span className="text-xs">
                        {tab.label}
                    </span>
                </button>
            ))}
        </nav>
    );
}
