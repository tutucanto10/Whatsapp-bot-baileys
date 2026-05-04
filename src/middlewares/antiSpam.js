import Database from '../database/database.js';
import config from '../config/config.js';
import Logger from '../utils/logger.js';

class AntiSpamMiddleware {
  static async check(sock, from, message) {
    if (!config.features.antiSpam) return true;

    const userId = from;
    const spamData = Database.getSpamData(userId);
    const now = Date.now();

    // Reset contador se passou 1 minuto
    if (now - spamData.lastReset > 60000) {
      spamData.count = 0;
      spamData.lastReset = now;
    }

    // Verificar se está banido
    if (spamData.banned && now - spamData.bannedAt < config.antiSpam.banDuration) {
      Logger.warn(`Usuário banido por spam: ${userId}`);
      return false;
    }

    // Remover ban se o tempo passou
    if (spamData.banned && now - spamData.bannedAt >= config.antiSpam.banDuration) {
      spamData.banned = false;
      spamData.count = 0;
      Logger.info(`Ban de spam removido: ${userId}`);
    }

    // Incrementar contador
    spamData.count++;

    // Verificar limite
    if (spamData.count > config.antiSpam.maxMessagesPerMinute) {
      spamData.banned = true;
      spamData.bannedAt = now;
      Database.updateSpamData(userId, spamData);

      await sock.sendMessage(from, {
        text: `⚠️ *ANTI-SPAM*\n\nVocê foi temporariamente banido por enviar muitas mensagens!\n\n⏱️ Duração: ${config.antiSpam.banDuration / 1000}s`
      });

      Logger.warn(`Usuário banido por spam: ${userId}`);
      return false;
    }

    // Atualizar dados
    Database.updateSpamData(userId, spamData);
    return true;
  }
}

export default AntiSpamMiddleware;
