export default {
  name: 'ping',
  aliases: ['speed', 'velocidade'],
  category: 'geral',
  description: 'Verifica a velocidade do bot',
  
  async execute(sock, message, args) {
    const start = Date.now();
    
    const sent = await sock.sendMessage(message.key.remoteJid, {
      text: '🏓 Calculando ping...'
    });

    const latency = Date.now() - start;
    
    await sock.sendMessage(message.key.remoteJid, {
      text: `🏓 *PONG!*\n\n⚡ Velocidade: *${latency}ms*`,
      edit: sent.key
    });
  }
};
