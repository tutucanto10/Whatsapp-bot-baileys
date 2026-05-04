import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import config from './config/config.js';
import Logger from './utils/logger.js';
import MessageHandler from './handler.js';

class WhatsAppBot {
  constructor() {
    this.sock = null;
    this.handler = null;
  }

  async start() {
    try {
      Logger.info('Iniciando bot...');

      const { state, saveCreds } = await useMultiFileAuthState('./sessions');
      const { version } = await fetchLatestBaileysVersion();

      this.sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: ['LBOT v2.0', 'Chrome', '4.0.0']
      });

      // Inicializar handler
      this.handler = new MessageHandler(this.sock);

      // Eventos
      this.setupEventHandlers(saveCreds);

      Logger.info('Bot iniciado com sucesso!');
    } catch (error) {
      Logger.error('Erro ao iniciar bot:', error);
      throw error;
    }
  }

  setupEventHandlers(saveCreds) {
    // Conexão atualizada
    this.sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        Logger.info('Escaneie o QR Code:');
        qrcode.generate(qr, { small: true });
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        
        Logger.warn('Conexão fechada. Reconectando...', { shouldReconnect });
        
        if (shouldReconnect) {
          setTimeout(() => this.start(), 3000);
        }
      } else if (connection === 'open') {
        Logger.info('✅ Conectado ao WhatsApp!');
        Logger.info(`Bot: ${this.sock.user.name || 'LBOT'}`);
        Logger.info(`Número: ${this.sock.user.id.split(':')[0]}`);
      }
    });

    // Salvar credenciais
    this.sock.ev.on('creds.update', saveCreds);

    // Novas mensagens
    this.sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;
      
      for (const message of messages) {
        // Ignorar mensagens do próprio bot
        if (message.key.fromMe) continue;
        
        await this.handler.handle(message);
      }
    });

    // Participantes atualizados (entrou/saiu do grupo)
    this.sock.ev.on('group-participants.update', async (update) => {
      const { id, participants, action } = update;
      
      if (action === 'add') {
        const welcomeText = `🎉 *BEM-VINDO(S)!*\n\n` +
                           `Olá @${participants[0].split('@')[0]}!\n\n` +
                           `Use ${config.prefix}menu para ver os comandos! 🤖`;
        
        await this.sock.sendMessage(id, {
          text: welcomeText,
          mentions: participants
        });
      }
    });

    // Logs de erro
    this.sock.ev.on('call', async (call) => {
      Logger.warn('Chamada recebida:', call);
    });
  }

  async stop() {
    Logger.info('Encerrando bot...');
    if (this.sock) {
      await this.sock.logout();
    }
  }
}

export default WhatsAppBot;
