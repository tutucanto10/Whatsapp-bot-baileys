import Database from '../../database/database.js';

export default {
  name: 'daily',
  aliases: ['diaria', 'recompensa'],
  category: 'economia',
  description: 'Recompensa diária',
  
  async execute(sock, message, args) {
    const sender = message.key.participant || message.key.remoteJid;
    const userData = Database.getUser(sender) || {};
    
    const now = Date.now();
    const lastDaily = userData.lastDaily || 0;
    const cooldown = 24 * 60 * 60 * 1000; // 24 horas

    if (now - lastDaily < cooldown) {
      const timeLeft = cooldown - (now - lastDaily);
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      return await sock.sendMessage(message.key.remoteJid, {
        text: `⏰ *RECOMPENSA DIÁRIA*\n\n❌ Você já coletou hoje!\n\n⏳ Volte em: ${hours}h ${minutes}m`
      });
    }

    const reward = Math.floor(Math.random() * 500) + 100; // 100-600 moedas
    Database.addBalance(sender, reward);
    
    userData.lastDaily = now;
    Database.setUser(sender, userData);

    await sock.sendMessage(message.key.remoteJid, {
      text: `🎁 *RECOMPENSA DIÁRIA*\n\n✅ Você recebeu *${reward} moedas*!\n\n💰 Saldo atual: ${Database.getBalance(sender)} moedas`,
      mentions: [sender]
    });
  }
};
