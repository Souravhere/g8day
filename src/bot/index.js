// bot/index.js
const TelegramBot = require('node-telegram-bot-api');

// Replace with your BotFather API token
const token = '7571919034:AAF6VCSCXV4ZNiSeH5ttDIzd-2d1e-a2rzA';

// Create a bot instance (polling mode for simplicity)
const bot = new TelegramBot(token, { polling: true });

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to G8Day! 🌟 Explore your destiny with AI and astrology.', {
    reply_markup: {
      keyboard: [[{ text: 'Open G8Day App', web_app: { url: 'https://your-app.vercel.app/telegram' } }]],
      resize_keyboard: true,
    },
  });
});

// Handle /webapp command
bot.onText(/\/webapp/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Launch the G8Day Mini App to claim rewards and explore your fate!', {
    reply_markup: {
      keyboard: [[{ text: 'Open G8Day App', web_app: { url: 'https://your-app.vercel.app/telegram' } }]],
      resize_keyboard: true,
    },
  });
});

// Handle data sent from Mini App
bot.on('web_app_data', (msg) => {
  const chatId = msg.chat.id;
  const data = msg.web_app_data.data;
  console.log('Received data from Mini App:', data);

  // Example: Handle mention data (e.g., from ReferralSection)
  if (data.startsWith('mention:')) {
    const username = data.replace('mention:', '');
    bot.sendMessage(chatId, `You mentioned @${username}! They’ve been invited to join G8Day.`);
  }

  // Respond to the user
  bot.sendMessage(chatId, 'Action received! Keep exploring your cosmic journey.');
});

// Log errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('G8Day Bot is running...');