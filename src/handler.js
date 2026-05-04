import config from './config/config.js';
import Logger from './utils/logger.js';
import Database from './database/database.js';
import AntiSpamMiddleware from './middlewares/antiSpam.js';
import AntiLinkMiddleware from './middlewares/antiLink.js';

// Importar comandos
import menu from './commands/general/menu.js';
import ping from './commands/general/ping.js';
import ai from './commands/general/ai.js';
import info from './commands/general/info.js';
import google from './commands/search/google.js';
import imagem from './commands/search/imagem.js';
import videosearch from './commands/search/videosearch.js';
import ytmp3 from './commands/media/ytmp3.js';
import ytmp4 from './commands/media/ytmp4.js';
import tiktok from './commands/media/tiktok.js';
import instagram from './commands/media/instagram.js';
import sticker from './commands/media/sticker.js';
import ban from './commands/admin/ban.js';
import promote from './commands/admin/promote.js';
import demote from './commands/admin/demote.js';
import antilink from './commands/admin/antilink.js';
import saldo from './commands/entertainment/saldo.js';
import daily from './commands/entertainment/daily.js';
import ranking from './commands/entertainment/ranking.js';
import ship from './commands/entertainment/ship.js';

class MessageHandler {
  constructor(sock) {
    this.sock = sock;
    this.commands = new Map();
    this.loadCommands();
  }

  loadCommands() {
    const commandList = [
      menu, ping, ai, info,
      google, imagem, videosearch,
      ytmp3, ytmp4, tiktok, instagram, sticker,
      ban, promote, demote, antilink,
      saldo, daily, ranking, ship
    ];

    commandList.forEach(cmd => {
      this.commands.set(cmd.name, cmd);
      if (cmd.aliases) {
        cmd.aliases.forEach(alias => {
          this.commands.set(alias, cmd);
        });
      }
    });

    Logger.info(`${this.commands.size} comandos carregados`);
  }

  async handle(message) {
    try {
      // Verificar se é mensagem válida
      if (!message.message) return;
      
      const messageType = Object.keys(message.message)[0];
      if (messageType === 'protocolMessage' || messageType === 'senderKeyDistributionMessage') return;

      // Extrair informações
      const from = message.key.remoteJid;
      const isGroup = from.endsWith('@g.us');
      const sender = message.key.participant || message.key.remoteJid;
      
      // Texto da mensagem
      const text = message.message?.conversation || 
                   message.message?.extendedTextMessage?.text || '';

      // Log da mensagem
      Logger.message(from, isGroup, messageType);

      // Anti-Spam
      const passedSpam = await AntiSpamMiddleware.check(this.sock, from, message);
      if (!passedSpam) return;

      // Anti-Link
      await AntiLinkMiddleware.check(this.sock, message, from, isGroup);

      // Verificar se é comando
      if (!text.startsWith(config.prefix)) return;

      // Processar comando
      const args = text.slice(config.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command = this.commands.get(commandName);
      
      if (!command) return;

      // Verificações
      if (command.groupOnly && !isGroup) {
        return await this.sock.sendMessage(from, {
          text: '❌ Este comando só funciona em grupos!'
        });
      }

      // Log do comando
      Logger.command(commandName, from, isGroup);

      // Executar comando
      try {
        await command.execute(this.sock, message, args, { 
          isGroup, 
          sender,
          from
        });
      } catch (error) {
        Logger.error(`Erro ao executar comando ${commandName}:`, error);
        await this.sock.sendMessage(from, {
          text: '❌ Erro ao executar comando. Tente novamente!'
        });
      }

    } catch (error) {
      Logger.error('Erro no handler:', error);
    }
  }
}

export default MessageHandler;
