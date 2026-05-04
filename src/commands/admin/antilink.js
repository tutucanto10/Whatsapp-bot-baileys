import Database from '../../database/database.js';
import Utils from '../../utils/utils.js';
import config from '../../config/config.js';

export default {
  name: 'antilink',
  aliases: [],
  category: 'admin',
  description: 'Ativar/desativar anti-link',
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

    if (args.length === 0) {
      return await sock.sendMessage(groupId, {
        text: `❌ Use: ${config.prefix}antilink on/off`
      });
    }

    const action = args[0].toLowerCase();
    
    if (action !== 'on' && action !== 'off') {
      return await sock.sendMessage(groupId, {
        text: `❌ Use apenas: ${config.prefix}antilink on ou ${config.prefix}antilink off`
      });
    }

    const groupData = Database.getGroup(groupId) || {};
    groupData.antiLink = action === 'on';
    Database.setGroup(groupId, groupData);

    await sock.sendMessage(groupId, {
      text: `✅ *ANTI-LINK ${action === 'on' ? 'ATIVADO' : 'DESATIVADO'}*\n\n${action === 'on' ? '🚫 Links serão removidos automaticamente' : '✅ Links agora são permitidos'}`
    });
  }
};
