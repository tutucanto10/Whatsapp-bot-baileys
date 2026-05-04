import WhatsAppBot from './bot.js';
import Logger from './utils/logger.js';
import Utils from './utils/utils.js';
import config from './config/config.js';

// Banner
console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║     🤖  ${config.botName}           ║
║                                       ║
║     Bot de WhatsApp Profissional      ║
║     Powered by Baileys                ║
║                                       ║
╚═══════════════════════════════════════╝
`);

// Criar diretórios necessários
Utils.createDirectories();

// Inicializar bot
const bot = new WhatsAppBot();

// Tratamento de erros globais
process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  Logger.error('Unhandled Rejection:', error);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  Logger.info('Recebido SIGINT, encerrando...');
  await bot.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  Logger.info('Recebido SIGTERM, encerrando...');
  await bot.stop();
  process.exit(0);
});

// Iniciar bot
(async () => {
  try {
    Logger.info('Iniciando aplicação...');
    Logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    Logger.info(`Prefix: ${config.prefix}`);
    Logger.info(`Features: ${JSON.stringify(config.features)}`);
    
    await bot.start();
  } catch (error) {
    Logger.error('Erro fatal ao iniciar bot:', error);
    process.exit(1);
  }
})();

// Limpar temp a cada 1 hora
setInterval(() => {
  Utils.cleanTemp();
}, 60 * 60 * 1000);

export default bot;
