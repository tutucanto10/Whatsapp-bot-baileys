import Utils from '../../utils/utils.js';
import config from '../../config/config.js';

export default {
  name: 'ban',
  aliases: ['kick', 'remover'],
  category: 'admin',
  description: 'Banir usuário do grupo',
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

    // Verificar se quem enviou é admin
    if (!Utils.isAdmin(sender, groupMetadata)) {
      return await sock.sendMessage(groupId, {
        text: '❌ Apenas administradores podem usar este comando!'
      });
    }

    // Verificar se o bot é admin
    if (!Utils.isBotAdmin(sock, groupId, groupMetadata)) {
      return await sock.sendMessage(groupId, {
        text: '❌ Preciso ser administrador para banir membros!'
      });
    }

    // Verificar menções
    const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentions.length === 0) {
      return await sock.sendMessage(groupId, {
        text: `❌ Use: ${config.prefix}ban @usuario\n\nMencione o usuário que deseja banir!`
      });
    }

    const userToBan = mentions[0];

    // Verificar se o usuário a ser banido é admin
    if (Utils.isAdmin(userToBan, groupMetadata)) {
      return await sock.sendMessage(groupId, {
        text: '❌ Não posso banir um administrador!'
      });
    }

    try {
      await sock.groupParticipantsUpdate(groupId, [userToBan], 'remove');
      
      await sock.sendMessage(groupId, {
        text: `✅ *USUÁRIO BANIDO*\n\n@${userToBan.split('@')[0]} foi removido do grupo!`,
        mentions: [userToBan]
      });
    } catch (error) {
      await sock.sendMessage(groupId, {
        text: '❌ Erro ao banir usuário. Verifique minhas permissões!'
      });
    }
  }
};
