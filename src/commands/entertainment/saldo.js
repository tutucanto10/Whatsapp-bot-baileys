import Database from '../../database/database.js';

export default {
  name: 'saldo',
  aliases: ['balance', 'carteira', 'money'],
  category: 'economia',
  description: 'Ver seu saldo',
  
  async execute(sock, message, args) {
    const sender = message.key.participant || message.key.remoteJid;
    const balance = Database.getBalance(sender);

    await sock.sendMessage(message.key.remoteJid, {
      text: `💰 *SEU SALDO*\n\n👤 Usuário: @${sender.split('@')[0]}\n💵 Saldo: *${balance} moedas*`,
      mentions: [sender]
    });
  }
};
