export default {
  name: 'ship',
  aliases: ['shippar', 'casal'],
  category: 'diversao',
  description: 'Shippar dois usuários',
  groupOnly: true,
  
  async execute(sock, message, args, { isGroup }) {
    if (!isGroup) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Este comando só funciona em grupos!'
      });
    }

    const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentions.length < 2) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Mencione 2 pessoas para shippar!\n\nExemplo: !ship @pessoa1 @pessoa2'
      });
    }

    const user1 = mentions[0];
    const user2 = mentions[1];
    
    const percentage = Math.floor(Math.random() * 101);
    const hearts = percentage > 70 ? '❤️❤️❤️' : percentage > 40 ? '❤️❤️' : '❤️';
    
    const messages = [
      'Casal perfeito! 😍',
      'Vai dar namoro! 💕',
      'Shippo muito! 🔥',
      'Só amizade... talvez 😏',
      'Nem ferrando! 😂',
      'Friendzone detectada! 💀'
    ];
    
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    const text = `💘 *SHIPPANDO*\n\n` +
                 `👤 @${user1.split('@')[0]}\n` +
                 `${hearts}\n` +
                 `👤 @${user2.split('@')[0]}\n\n` +
                 `💕 Compatibilidade: *${percentage}%*\n\n` +
                 `${randomMsg}`;

    await sock.sendMessage(message.key.remoteJid, {
      text: text,
      mentions: [user1, user2]
    });
  }
};
