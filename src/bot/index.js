const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const miniAppUrl = 'https://www.g8dai.xyz/telegram';

const bot = new TelegramBot(token, { polling: true });

bot.setChatMenuButton({
  chat_id: 0,
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

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to G8Day! 🌟 Explore your destiny with AI and astrology.', {
    reply_markup: {
      keyboard: [[{ text: 'Open G8Day App', web_app: { url: miniAppUrl } }]],
      resize_keyboard: true,
    },
  });
});

bot.onText(/\/webapp/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Launch the G8Day Mini App to claim rewards and explore your fate!', {
    reply_markup: {
      keyboard: [[{ text: 'Open G8Day App', web_app: { url: miniAppUrl } }]],
      resize_keyboard: true,
    },
  });
});

bot.on('web_app_data', (msg) => {
  const chatId = msg.chat.id;
  const data = msg.web_app_data.data;
  console.log('Received data from Mini App:', data);
  if (data.startsWith('mention:')) {
    const username = data.replace('mention:', '');
    bot.sendMessage(chatId, `You mentioned @${username}! They’ve been invited to join G8Day.`);
  }
  bot.sendMessage(chatId, 'Action received! Keep exploring your cosmic journey.');
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('G8Day Bot is running...');