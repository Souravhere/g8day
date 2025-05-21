// Updated utility functions for working with Telegram Web App data

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes with proper merging of conflicting styles
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get user data from Telegram Mini App
 * This function safely extracts user information from the Telegram WebApp API
 * @returns {Object|null} User data object or null if unavailable
 */
function getUserData() {
  // Check if the Telegram WebApp is available
  if (!window.Telegram || !window.Telegram.WebApp) {
    console.error('Telegram WebApp is not available. Are you running this outside Telegram?');
    return null;
  }

  // Access the user data from Telegram WebApp
  const webApp = window.Telegram.WebApp;
  
  // Check if user data is available
  if (!webApp.initDataUnsafe || !webApp.initDataUnsafe.user) {
    console.warn('User data is not available in Telegram WebApp');
    return null;
  }

  // Extract user data
  const user = webApp.initDataUnsafe.user;
  
  // Create a standardized user data object
  const userData = {
    id: user.id,
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    username: user.username || '',
    language_code: user.language_code || 'en',
    is_premium: user.is_premium || false,
    photo_url: user.photo_url || ''
  };

  return userData;
}

// Example of using the function
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Try to get user data
    const userData = getUserData();
    
    if (userData) {
      console.log('Telegram user data successfully retrieved:', userData);
      // Do something with the user data...
      
      // For example, display user name on the page
      const userInfoElement = document.getElementById('user-info');
      if (userInfoElement) {
        userInfoElement.textContent = `Hello, ${userData.first_name}!`;
      }
    } else {
      console.log('Could not retrieve user data. Please ensure this app is running in Telegram.');
    }
  } catch (error) {
    console.error('Error retrieving Telegram user data:', error);
  }
});