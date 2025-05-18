import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function parseTelegramData(initDataUnsafe) {
  try {
    const user = initDataUnsafe?.user || {};
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