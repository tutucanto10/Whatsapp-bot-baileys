import config from '../../config/config.js';
import os from 'os';

export default {
  name: 'info',
  aliases: ['botinfo', 'sobre'],
  category: 'geral',
  description: 'Informações do bot',
  
  async execute(sock, message, args) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const memUsage = process.memoryUsage();
    const memUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
    const memTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(2);

    const infoText = `
╔══════════════════════════╗
║    📱 *INFORMAÇÕES DO BOT*
╚══════════════════════════╝

🤖 *Nome:* ${config.botName}
📌 *Versão:* 2.0.0
⚡ *Prefix:* ${config.prefix}

⏱️ *Tempo Online:* ${hours}h ${minutes}m ${seconds}s
💾 *Memória:* ${memUsedMB}MB / ${memTotalMB}MB
🖥️ *Plataforma:* ${os.platform()}
📊 *Node.js:* ${process.version}

✨ *Funcionalidades:*
${config.features.downloads ? '✅' : '❌'} Downloads
${config.features.stickers ? '✅' : '❌'} Stickers
${config.openAI.enabled ? '✅' : '❌'} IA
${config.features.antiSpam ? '✅' : '❌'} Anti-Spam
${config.features.antiLink ? '✅' : '❌'} Anti-Link

🔗 *GitHub:* github.com/seu-repo
👨‍💻 *Desenvolvido com Baileys*

${config.prefix}menu - Ver todos os comandos
`;

    await sock.sendMessage(message.key.remoteJid, { text: infoText });
  }
};
