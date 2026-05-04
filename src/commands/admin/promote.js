import Utils from '../../utils/utils.js';
import config from '../../config/config.js';

export default {
  name: 'promote',
  aliases: ['promover', 'admin'],
  category: 'admin',
  description: 'Promover usuário a admin',
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
        text: '❌ Preciso ser administrador para promover membros!'
      });
    }

    const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentions.length === 0) {
      return await sock.sendMessage(groupId, {
        text: `❌ Use: ${config.prefix}promote @usuario`
      });
    }

    const userToPromote = mentions[0];

    if (Utils.isAdmin(userToPromote, groupMetadata)) {
      return await sock.sendMessage(groupId, {
        text: '❌ Este usuário já é administrador!'
      });
    }

    try {
      await sock.groupParticipantsUpdate(groupId, [userToPromote], 'promote');
      
      await sock.sendMessage(groupId, {
        text: `👑 *NOVO ADMINISTRADOR*\n\n@${userToPromote.split('@')[0]} agora é admin!`,
        mentions: [userToPromote]
      });
    } catch (error) {
      await sock.sendMessage(groupId, {
        text: '❌ Erro ao promover usuário!'
      });
    }
  }
};
