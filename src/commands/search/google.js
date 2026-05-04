import SearchService from '../../services/searchService.js';
import config from '../../config/config.js';

export default {
  name: 'google',
  aliases: ['search', 'buscar'],
  category: 'busca',
  description: 'Buscar no Google',
  
  async execute(sock, message, args) {
    if (args.length === 0) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Use: ${config.prefix}google [termo de busca]\n\nExemplo: ${config.prefix}google melhores celulares 2024`
      });
    }

    const query = args.join(' ');
    
    await sock.sendMessage(message.key.remoteJid, {
      text: '🔍 Buscando no Google...'
    });

    try {
      const results = await SearchService.google(query, 5);
      const formattedResults = SearchService.formatGoogleResults(results);

      await sock.sendMessage(message.key.remoteJid, {
        text: formattedResults
      });
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Erro ao buscar. Tente novamente!'
      });
    }
  }
};
