import MediaService from '../../services/mediaService.js';
import config from '../../config/config.js';
import fs from 'fs';

export default {
  name: 'tiktok',
  aliases: ['tt', 'ttdl'],
  category: 'media',
  description: 'Baixar vídeo do TikTok',
  
  async execute(sock, message, args) {
    if (args.length === 0) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Use: ${config.prefix}tiktok [URL do TikTok]\n\nExemplo: ${config.prefix}tiktok https://www.tiktok.com/@user/video/...`
      });
    }

    const url = args[0];
    
    if (!url.includes('tiktok.com')) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ URL inválida! Use uma URL do TikTok.'
      });
    }

    await sock.sendMessage(message.key.remoteJid, {
      text: '⏳ Baixando vídeo do TikTok...\n\n_Aguarde..._'
    });

    try {
      const filepath = await MediaService.downloadTikTok(url);
      
      // Enviar vídeo
      const buffer = fs.readFileSync(filepath);
      
      await sock.sendMessage(message.key.remoteJid, {
        video: buffer,
        caption: '✅ Vídeo do TikTok baixado com sucesso!'
      });

      // Limpar arquivo
      fs.unlinkSync(filepath);
      
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Erro ao baixar!\n\n${error.message}`
      });
    }
  }
};
