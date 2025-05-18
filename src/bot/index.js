import TelegramBot from 'node-telegram-bot-api';

// Replace with your BotFather API token
const token = '7571919034:AAF6VCSCXV4ZNiSeH5ttDIzd-2d1e-a2rzA';

// Replace with your deployed Mini App URL
const miniAppUrl = 'https://www.g8dai.xyz/telegram';

// Social media links
const twitterUrl = 'https://twitter.com/G8DayApp';
const telegramChatUrl = 'https://t.me/g8daycommunity';

// Image URL for the card
const appImageUrl = 'https://www.g8dai.xyz/_next/image?url=%2Fvision.png&w=1920&q=75';

// Create a bot instance (polling mode)
const bot = new TelegramBot(token, { polling: true });

// Set the menu button programmatically
bot.setChatMenuButton({
  chat_id: 0, // 0 applies to all chats
  menu_button: {
    type: 'web_app',
    text: 'Open G8Day App',
    web_app: { url: miniAppUrl },
  },
}).then(() => {
  console.log('Menu button set successfully');
}).catch((error) => {
  console.error('Error setting menu button:', error);
});

// Handle /start command with enhanced card interface
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  // First, send the welcome image with caption
  bot.sendPhoto(chatId, appImageUrl, {
    caption: '✨ *Welcome to G8Day!* ✨\n\nExplore your destiny through the power of AI and astrology. Discover personalized insights and cosmic guidance tailored just for you.',
    parse_mode: 'Markdown',
  }).then(() => {
    // Then send the message with inline buttons
    bot.sendMessage(chatId, '🔮 *What would you like to do?*', {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Launch G8Day App', web_app: { url: miniAppUrl } }],
          [
            { text: '🐦 Follow on Twitter', url: twitterUrl },
            { text: '💬 Join Community', url: telegramChatUrl }
          ]
        ]
      }
    });
    
    // Also provide a persistent keyboard for easy access
    bot.sendMessage(chatId, '👇 Or use this button anytime to open the app:', {
      reply_markup: {
        keyboard: [[{ text: 'Open G8Day App', web_app: { url: miniAppUrl } }]],
        resize_keyboard: true,
      },
    });
  });
});

// Handle /webapp command
bot.onText(/\/webapp/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '🌟 Launch the G8Day Mini App to claim rewards and explore your fate!', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🚀 Open G8Day App', web_app: { url: miniAppUrl } }]
      ]
    },
  });
});

// Handle data sent from Mini App
bot.on('web_app_data', (msg) => {
  const chatId = msg.chat.id;
  const data = msg.web_app_data.data;
  console.log('Received data from Mini App:', data);
  
  // Handle mention data
  if (data.startsWith('mention:')) {
    const username = data.replace('mention:', '');
    bot.sendMessage(chatId, `You mentioned @${username}! They've been invited to join G8Day.`);
  }
  
  // Respond to the user
  bot.sendMessage(chatId, '✅ Action received! Keep exploring your cosmic journey.');
});

// Log errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('G8Day Bot is running...');