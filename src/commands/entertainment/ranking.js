import Database from '../../database/database.js';

export default {
  name: 'ranking',
  aliases: ['rank', 'top', 'leaderboard'],
  category: 'economia',
  description: 'Ver ranking de economia',
  
  async execute(sock, message, args) {
    const ranking = Database.getRanking(10);
    
    if (ranking.length === 0) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Ainda não há dados no ranking!'
      });
    }

    let text = '🏆 *TOP 10 - RANKING DE MOEDAS*\n\n';
    
    ranking.forEach((user, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
      text += `${medal} *${index + 1}.* @${user.id.split('@')[0]}\n`;
      text += `   💰 ${user.balance} moedas\n\n`;
    });

    const mentions = ranking.map(user => user.id);

    await sock.sendMessage(message.key.remoteJid, {
      text: text,
      mentions: mentions
    });
  }
};
