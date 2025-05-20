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
 * Parses Telegram Web App initialization data
 * 
 * Handles different formats of initData and provides robust error handling
 * 
 * @param {string|object} initDataUnsafe - The raw initData from Telegram WebApp
 * @returns {object} - Parsed user data with fallbacks
 */
export function parseTelegramData(initDataUnsafe) {
  try {
    // Handle both string and object formats
    let parsedData;
    
    if (typeof initDataUnsafe === 'string') {
      // For URL-encoded string format (common in Telegram WebApp)
      if (initDataUnsafe.startsWith('query_id=') || initDataUnsafe.includes('&')) {
        const params = new URLSearchParams(initDataUnsafe);
        const userStr = params.get('user');
        
        if (userStr) {
          const userData = JSON.parse(decodeURIComponent(userStr));
          return {
            user: {
              id: userData.id?.toString() || 'unknown',
              first_name: userData.first_name || 'Stargazer',
              last_name: userData.last_name || '',
              username: userData.username || '',
              language_code: userData.language_code || 'en',
              photo_url: userData.photo_url || null,
              is_premium: !!userData.is_premium,
            },
            auth_date: params.get('auth_date'),
            hash: params.get('hash'),
            query_id: params.get('query_id'),
            start_param: params.get('start_param')
          };
        }
      } else {
        // Try parsing as JSON string
        try {
          parsedData = JSON.parse(initDataUnsafe);
        } catch (e) {
          console.error('Failed to parse JSON:', e);
        }
      }
    } else if (typeof initDataUnsafe === 'object') {
      // Already an object
      parsedData = initDataUnsafe;
    }
    
    // Extract user data from parsed object
    const userData = parsedData?.user || {};
    
    return {
      user: {
        id: userData.id?.toString() || 'unknown',
        first_name: userData.first_name || 'Stargazer',
        last_name: userData.last_name || '',
        username: userData.username || '',
        language_code: userData.language_code || 'en',
        photo_url: userData.photo_url || null,
        is_premium: !!userData.is_premium,
      },
      auth_date: parsedData?.auth_date,
      hash: parsedData?.hash,
      query_id: parsedData?.query_id,
      start_param: parsedData?.start_param
    };
  } catch (error) {
    console.error('Error parsing Telegram data:', error);
    return { 
      user: { 
        id: 'unknown', 
        first_name: 'Stargazer',
        last_name: '',
        username: '',
        language_code: 'en',
        photo_url: null,
        is_premium: false
      } 
    };
  }
}

/**
 * Helper function to safely access Telegram WebApp functionality
 * Ensures WebApp is available before attempting to use any methods
 */
export function getTelegramWebApp() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
}

/**
 * Safely shows a popup alert using Telegram WebApp when available
 * Falls back to regular browser alert when unavailable
 */
export function showTelegramAlert(title, message) {
  const webApp = getTelegramWebApp();
  
  if (webApp?.showPopup) {
    webApp.showPopup({
      title,
      message,
      buttons: [{type: 'ok'}]
    });
  } else {
    alert(`${title}: ${message}`);
  }
}