import SearchService from '../../services/searchService.js';
import config from '../../config/config.js';
import axios from 'axios';

export default {
  name: 'imagem',
  aliases: ['img', 'image', 'foto'],
  category: 'busca',
  description: 'Buscar imagens',
  
  async execute(sock, message, args) {
    if (args.length === 0) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Use: ${config.prefix}imagem [termo de busca]\n\nExemplo: ${config.prefix}imagem paisagem montanhas`
      });
    }

    const query = args.join(' ');
    
    await sock.sendMessage(message.key.remoteJid, {
      text: '🖼️ Buscando imagens...'
    });

    try {
      const results = await SearchService.searchImages(query, 3);
      
      if (results.length === 0 || !results[0].url) {
        return await sock.sendMessage(message.key.remoteJid, {
          text: `📷 *BUSCA DE IMAGENS*\n\n🔗 ${results[0].link}`
        });
      }

      // Enviar cada imagem
      for (const img of results.slice(0, 3)) {
        if (img.url) {
          try {
            const response = await axios.get(img.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);

            await sock.sendMessage(message.key.remoteJid, {
              image: buffer,
              caption: `📷 ${img.description || query}\n👤 ${img.author || 'Autor desconhecido'}`
            });
          } catch (err) {
            console.log('Erro ao enviar imagem:', err.message);
          }
        }
      }
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Erro ao buscar imagens. Tente novamente!'
      });
    }
  }
};
