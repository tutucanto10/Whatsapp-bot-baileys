import dotenv from 'dotenv';
dotenv.config();

export default {
  // Bot Info
  botName: process.env.BOT_NAME || 'LBOT v2.0',
  prefix: process.env.PREFIX || '!',
  ownerNumber: process.env.OWNER_NUMBER || '5511999999999',
  
  // AI Configuration
  openAI: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.AI_MODEL || 'gpt-3.5-turbo',
    enabled: process.env.ENABLE_AI === 'true'
  },
  
  // Features
  features: {
    downloads: process.env.ENABLE_DOWNLOADS === 'true',
    stickers: process.env.ENABLE_STICKERS === 'true',
    antiSpam: process.env.ENABLE_ANTI_SPAM === 'true',
    antiLink: process.env.ENABLE_ANTI_LINK === 'true'
  },
  
  // Anti-Spam
  antiSpam: {
    maxMessagesPerMinute: parseInt(process.env.MAX_MESSAGES_PER_MINUTE) || 10,
    banDuration: parseInt(process.env.SPAM_BAN_DURATION) || 300000 // 5 minutos
  },
  
  // Database
  database: {
    type: process.env.DB_TYPE || 'json',
    mongoURI: process.env.MONGODB_URI
  },
  
  // Paths
  paths: {
    sessions: './sessions',
    temp: './temp',
    logs: './logs',
    database: './src/database/data'
  },
  
  // Bot Personalities
  personalities: {
    zoeiro: {
      greeting: ['E aí, meu consagrado! 😎', 'Fala, patrão! Tô aqui pra zoar', 'Opa, bora bagunçar! 🔥'],
      responses: ['KKKKKKKK', 'Eita! 😂', 'Rapaz...', 'Tá maluco? 🤪'],
      style: 'informal'
    },
    profissional: {
      greeting: ['Olá! Como posso ajudá-lo hoje?', 'Bem-vindo! Estou à disposição.', 'Olá! Em que posso ser útil?'],
      responses: ['Entendo.', 'Certamente.', 'Claro, vou ajudá-lo.'],
      style: 'formal'
    }
  },
  
  // Limits
  limits: {
    downloadSize: 100 * 1024 * 1024, // 100MB
    stickerSize: 10 * 1024 * 1024,   // 10MB
    messageLength: 4096
  }
};
