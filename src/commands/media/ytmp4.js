import MediaService from '../../services/mediaService.js';
import config from '../../config/config.js';
import fs from 'fs';

export default {
  name: 'ytmp4',
  aliases: ['ytvideo', 'playvideo'],
  category: 'media',
  description: 'Baixar vídeo do YouTube',
  
  async execute(sock, message, args) {
    if (args.length === 0) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Use: ${config.prefix}ytmp4 [URL do YouTube]\n\nExemplo: ${config.prefix}ytmp4 https://youtube.com/watch?v=...`
      });
    }

    const url = args[0];
    
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ URL inválida! Use uma URL do YouTube.'
      });
    }

    await sock.sendMessage(message.key.remoteJid, {
      text: '⏳ Baixando vídeo do YouTube...\n\n_Isso pode levar alguns minutos..._'
    });

    try {
      const filepath = await MediaService.downloadYouTube(url, 'video');
      
      // Enviar vídeo
      const buffer = fs.readFileSync(filepath);
      
      await sock.sendMessage(message.key.remoteJid, {
        video: buffer,
        caption: '✅ Vídeo baixado com sucesso!'
      });

      // Limpar arquivo
      fs.unlinkSync(filepath);
      
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Erro ao baixar!\n\n${error.message}\n\n💡 Certifique-se de que:\n• A URL está correta\n• yt-dlp está instalado\n• O vídeo não é privado ou muito grande`
      });
    }
  }
};
