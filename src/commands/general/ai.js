import AIService from '../../services/aiService.js';
import config from '../../config/config.js';

export default {
  name: 'ai',
  aliases: ['gpt', 'chatgpt', 'pergunta'],
  category: 'ia',
  description: 'Conversar com a IA',
  
  async execute(sock, message, args, { isGroup }) {
    if (args.length === 0) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Use: ${config.prefix}ai [sua pergunta]\n\nExemplo: ${config.prefix}ai o que é JavaScript?`
      });
    }

    const query = args.join(' ');
    
    await sock.sendMessage(message.key.remoteJid, {
      text: '🤖 Pensando...'
    });

    try {
      let response;
      
      if (config.openAI.enabled && config.openAI.apiKey) {
        response = await AIService.chat(query, isGroup);
      } else {
        response = await AIService.simulateChat(query, isGroup);
      }

      const finalText = isGroup 
        ? `🤖 *IA ZOEIRA MODE* 🔥\n\n${response}`
        : `🤖 *Assistente IA*\n\n${response}`;

      await sock.sendMessage(message.key.remoteJid, {
        text: finalText
      });
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Erro ao processar sua pergunta. Tente novamente!'
      });
    }
  }
};
