// Updated utility functions for working with Telegram Web App data

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes with proper merging of conflicting styles
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function parseTelegramData(initDataUnsafe) {
  console.log('Raw initDataUnsafe:', initDataUnsafe);
  try {
    const user = initDataUnsafe?.user || {};
    if (!user.id) {
      console.warn('No user ID found in initDataUnsafe');
    }
    return {
      user: {
        id: user.id || 'unknown',
        first_name: user.first_name || 'Stargazer',
        last_name: user.last_name || '',
        username: user.username || '',
      },
    };
  } catch (error) {
    console.error('Error parsing Telegram data:', error);
    return { user: { id: 'unknown', first_name: 'Stargazer' } };
  }
}