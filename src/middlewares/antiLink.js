import Database from '../database/database.js';
import config from '../config/config.js';
import Utils from '../utils/utils.js';
import Logger from '../utils/logger.js';

class AntiLinkMiddleware {
  static async check(sock, message, from, isGroup) {
    if (!config.features.antiLink || !isGroup) return true;

    const groupData = Database.getGroup(from);
    if (!groupData?.antiLink) return true;

    const text = message.conversation || message.extendedTextMessage?.text || '';
    
    // Verificar se contém link do WhatsApp
    if (Utils.hasWhatsAppLink(text)) {
      const sender = message.key.participant || message.key.remoteJid;
      
      // Buscar metadados do grupo
      const groupMetadata = await sock.groupMetadata(from);
      
      // Verificar se o remetente é admin
      if (Utils.isAdmin(sender, groupMetadata)) {
        return true;
      }

      // Verificar se o bot é admin
      if (!Utils.isBotAdmin(sock, from, groupMetadata)) {
        await sock.sendMessage(from, {
          text: '⚠️ Link detectado, mas não sou admin para remover!'
        });
        return true;
      }

      // Deletar mensagem
      try {
        await sock.sendMessage(from, {
          delete: message.key
        });

        await sock.sendMessage(from, {
          text: `🚫 *ANTI-LINK*\n\n@${sender.split('@')[0]} enviou um link não autorizado!\n\nMensagem deletada automaticamente.`,
          mentions: [sender]
        });

        Logger.info(`Link removido de: ${sender}`);
        return false;
      } catch (error) {
        Logger.error('Erro ao deletar mensagem:', error);
        return true;
      }
    }

    return true;
  }
}

export default AntiLinkMiddleware;
