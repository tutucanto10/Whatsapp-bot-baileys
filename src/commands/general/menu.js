import config from '../../config/config.js';

export default {
  name: 'menu',
  aliases: ['ajuda', 'comandos'],
  category: 'geral',
  description: 'Mostra todos os comandos disponíveis',
  
  async execute(sock, message, args, { isGroup }) {
    const prefix = config.prefix;
    
    const menuText = `
╔══════════════════════╗
║  🤖 *${config.botName}*
╚══════════════════════╝

${isGroup ? '🎭 *MODO: ZOEIRO* 🔥' : '💼 *MODO: PROFISSIONAL*'}

┌─⊷ *GERAL*
│• ${prefix}menu - Lista de comandos
│• ${prefix}help - Ajuda
│• ${prefix}ping - Velocidade do bot
│• ${prefix}info - Informações do bot
└───────────

┌─⊷ *ADMIN* 👑
│• ${prefix}ban @user - Banir usuário
│• ${prefix}kick @user - Remover usuário
│• ${prefix}promote @user - Promover a admin
│• ${prefix}demote @user - Remover admin
│• ${prefix}antilink on/off - Anti-link
│• ${prefix}antispam on/off - Anti-spam
└───────────

┌─⊷ *MÍDIA* 📥
│• ${prefix}play [nome] - Baixar música
│• ${prefix}video [nome] - Baixar vídeo
│• ${prefix}ytmp3 [url] - YouTube para MP3
│• ${prefix}ytmp4 [url] - YouTube para MP4
│• ${prefix}tiktok [url] - Baixar TikTok
│• ${prefix}instagram [url] - Baixar Instagram
└───────────

┌─⊷ *STICKERS* 🎨
│• ${prefix}sticker - Criar figurinha
│• ${prefix}s - Criar figurinha
│• ${prefix}stickergif - Figurinha animada
└───────────

┌─⊷ *BUSCA* 🔍
│• ${prefix}google [termo] - Buscar no Google
│• ${prefix}imagem [termo] - Buscar imagens
│• ${prefix}videosearch [termo] - Buscar vídeos
└───────────

┌─⊷ *IA* 🤖
│• ${prefix}ai [pergunta] - Perguntar à IA
│• ${prefix}gpt [pergunta] - Chat GPT
└───────────

┌─⊷ *DIVERSÃO* 🎮
│• ${prefix}jail @user - Prender usuário
│• ${prefix}ship @user1 @user2 - Shippar
│• ${prefix}ranking - Ver ranking
│• ${prefix}daily - Recompensa diária
│• ${prefix}saldo - Ver saldo
└───────────

┌─⊷ *ECONOMIA* 💰
│• ${prefix}saldo - Ver seu saldo
│• ${prefix}daily - Recompensa diária
│• ${prefix}ranking - Top usuários
│• ${prefix}transfer @user [valor] - Transferir
└───────────

📱 *Total de comandos:* 30+
⚡ *Desenvolvido com Baileys*
🔗 *GitHub:* github.com/seu-repo

${isGroup ? '✨ _Bora zoar!_ 🔥' : '📞 _Estou aqui para ajudar!_'}
`;

    await sock.sendMessage(message.key.remoteJid, { text: menuText });
  }
};
