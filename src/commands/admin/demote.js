import Utils from '../../utils/utils.js';
import config from '../../config/config.js';

export default {
  name: 'demote',
  aliases: ['rebaixar', 'removeradmin'],
  category: 'admin',
  description: 'Rebaixar admin a membro',
  adminOnly: true,
  groupOnly: true,
  
  async execute(sock, message, args, { isGroup }) {
    if (!isGroup) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Este comando só funciona em grupos!'
      });
    }

    const groupId = message.key.remoteJid;
    const groupMetadata = await sock.groupMetadata(groupId);
    const sender = message.key.participant || message.key.remoteJid;

    if (!Utils.isAdmin(sender, groupMetadata)) {
      return await sock.sendMessage(groupId, {
        text: '❌ Apenas administradores podem usar este comando!'
      });
    }

    if (!Utils.isBotAdmin(sock, groupId, groupMetadata)) {
      return await sock.sendMessage(groupId, {
        text: '❌ Preciso ser administrador para rebaixar membros!'
      });
    }

    const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentions.length === 0) {
      return await sock.sendMessage(groupId, {
        text: `❌ Use: ${config.prefix}demote @usuario`
      });
    }

    const userToDemote = mentions[0];

    if (!Utils.isAdmin(userToDemote, groupMetadata)) {
      return await sock.sendMessage(groupId, {
        text: '❌ Este usuário não é administrador!'
      });
    }

    try {
      await sock.groupParticipantsUpdate(groupId, [userToDemote], 'demote');
      
      await sock.sendMessage(groupId, {
        text: `⬇️ *ADMIN REMOVIDO*\n\n@${userToDemote.split('@')[0]} agora é membro comum.`,
        mentions: [userToDemote]
      });
    } catch (error) {
      await sock.sendMessage(groupId, {
        text: '❌ Erro ao rebaixar usuário!'
      });
    }
  }
};
