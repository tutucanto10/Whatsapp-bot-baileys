import SearchService from '../../services/searchService.js';
import config from '../../config/config.js';

export default {
  name: 'videosearch',
  aliases: ['ytsearch', 'searchvideo'],
  category: 'busca',
  description: 'Buscar vídeos no YouTube',
  
  async execute(sock, message, args) {
    if (args.length === 0) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Use: ${config.prefix}videosearch [termo]\n\nExemplo: ${config.prefix}videosearch tutorial javascript`
      });
    }

    const query = args.join(' ');
    
    await sock.sendMessage(message.key.remoteJid, {
      text: '🎥 Buscando vídeos...'
    });

    try {
      const results = await SearchService.searchVideos(query, 5);
      const formattedResults = SearchService.formatVideoResults(results);

      await sock.sendMessage(message.key.remoteJid, {
        text: formattedResults
      });
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Erro ao buscar vídeos. Tente novamente!'
      });
    }
  }
};
