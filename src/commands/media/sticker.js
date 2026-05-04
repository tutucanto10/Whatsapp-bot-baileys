import StickerService from '../../services/stickerService.js';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import config from '../../config/config.js';
import fs from 'fs';

export default {
  name: 'sticker',
  aliases: ['s', 'fig', 'figurinha'],
  category: 'sticker',
  description: 'Criar figurinha de imagem ou vídeo',
  
  async execute(sock, message, args) {
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    
    if (!quoted) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Responda a uma imagem ou vídeo com ${config.prefix}sticker`
      });
    }

    const imageMessage = quoted.imageMessage;
    const videoMessage = quoted.videoMessage;

    if (!imageMessage && !videoMessage) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Responda a uma imagem ou vídeo!'
      });
    }

    await sock.sendMessage(message.key.remoteJid, {
      text: '⏳ Criando figurinha...'
    });

    try {
      let buffer;
      let isVideo = false;

      if (imageMessage) {
        const stream = await downloadContentFromMessage(imageMessage, 'image');
        buffer = Buffer.concat(await streamToBuffer(stream));
      } else if (videoMessage) {
        const stream = await downloadContentFromMessage(videoMessage, 'video');
        buffer = Buffer.concat(await streamToBuffer(stream));
        isVideo = true;
      }

      const stickerPath = await StickerService.createFromBuffer(buffer, isVideo);
      const stickerBuffer = fs.readFileSync(stickerPath);

      await sock.sendMessage(message.key.remoteJid, {
        sticker: stickerBuffer
      });

      // Limpar
      fs.unlinkSync(stickerPath);

    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Erro ao criar figurinha!\n\n${error.message}`
      });
    }
  }
};

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return chunks;
}
