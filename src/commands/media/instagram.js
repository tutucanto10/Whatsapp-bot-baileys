import MediaService from '../../services/mediaService.js';
import config from '../../config/config.js';
import fs from 'fs';

export default {
  name: 'instagram',
  aliases: ['ig', 'insta', 'igdl'],
  category: 'media',
  description: 'Baixar mídia do Instagram',
  
  async execute(sock, message, args) {
    if (args.length === 0) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Use: ${config.prefix}instagram [URL do Instagram]\n\nExemplo: ${config.prefix}instagram https://www.instagram.com/p/...`
      });
    }

    const url = args[0];
    
    if (!url.includes('instagram.com')) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ URL inválida! Use uma URL do Instagram.'
      });
    }

    await sock.sendMessage(message.key.remoteJid, {
      text: '⏳ Baixando do Instagram...\n\n_Isso pode levar alguns segundos..._'
    });

    try {
      const filepath = await MediaService.downloadInstagram(url);
      
      // Verificar tipo de arquivo
      const isVideo = filepath.endsWith('.mp4');
      const buffer = fs.readFileSync(filepath);
      
      if (isVideo) {
        await sock.sendMessage(message.key.remoteJid, {
          video: buffer,
          caption: '✅ Vídeo do Instagram baixado!'
        });
      } else {
        await sock.sendMessage(message.key.remoteJid, {
          image: buffer,
          caption: '✅ Imagem do Instagram baixada!'
        });
      }

      // Limpar arquivo
      fs.unlinkSync(filepath);
      
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Erro ao baixar!\n\n${error.message}\n\n💡 Certifique-se de que:\n• A URL está correta\n• yt-dlp está instalado\n• O post não é privado`
      });
    }
  }
};
