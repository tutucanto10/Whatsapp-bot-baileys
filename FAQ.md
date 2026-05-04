# ❓ FAQ - Perguntas Frequentes

## 📋 Índice

1. [Instalação e Configuração](#instalação-e-configuração)
2. [Conexão e QR Code](#conexão-e-qr-code)
3. [Comandos](#comandos)
4. [Downloads](#downloads)
5. [IA e APIs](#ia-e-apis)
6. [Administração](#administração)
7. [Erros Comuns](#erros-comuns)
8. [Deploy e Hospedagem](#deploy-e-hospedagem)

---

## 🔧 Instalação e Configuração

### **Q: Qual versão do Node.js preciso?**
**A:** Node.js 18 ou superior. Verifique com:
```bash
node -v
```

### **Q: Preciso de todas as dependências?**
**A:** Não! O bot funciona sem FFmpeg e yt-dlp, mas sem downloads e stickers.

Essencial: `Node.js`
Opcional: `FFmpeg`, `yt-dlp`

### **Q: Como edito o arquivo .env?**
**A:** 
```bash
# Linux/Mac
nano .env

# Windows
notepad .env
```

### **Q: O bot funciona no Windows?**
**A:** Sim! Mas recomendamos Linux para produção.

---

## 📱 Conexão e QR Code

### **Q: O QR Code não aparece!**
**A:** 
1. Aguarde 10-30 segundos
2. Verifique sua internet
3. Limpe a sessão:
```bash
rm -rf sessions/
npm start
```

### **Q: O bot desconecta toda hora!**
**A:** Causas comuns:
- Internet instável
- Plataforma gratuita com reinicializações
- Múltiplas instâncias rodando

**Solução:** Use VPS ou plano pago para produção.

### **Q: Posso conectar o mesmo número em vários bots?**
**A:** NÃO! Um número = uma conexão apenas.

### **Q: Como manter o bot online 24/7?**
**A:** Use PM2:
```bash
pm2 start src/index.js --name whatsapp-bot
pm2 save
pm2 startup
```

---

## 💬 Comandos

### **Q: Como mudar o prefixo?**
**A:** Edite no `.env`:
```env
PREFIX=/
```
Agora os comandos serão `/menu`, `/ping`, etc.

### **Q: Como adicionar novos comandos?**
**A:**
1. Crie arquivo em `src/commands/categoria/`
2. Siga o padrão dos comandos existentes
3. Importe no `handler.js`
4. Reinicie o bot

### **Q: Os comandos não funcionam!**
**A:** Verifique:
- ✅ Você está usando o prefixo correto (padrão: `!`)
- ✅ O comando existe (`!menu` para ver todos)
- ✅ Você tem permissão (alguns são apenas para admins)

### **Q: Como desativar um comando?**
**A:** Comente a importação no `handler.js`:
```javascript
// import ban from './commands/admin/ban.js';
```

---

## 📥 Downloads

### **Q: Download do YouTube não funciona!**
**A:** 
1. Instale o yt-dlp:
```bash
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

2. Atualize-o:
```bash
sudo yt-dlp -U
```

### **Q: TikTok não baixa!**
**A:** A API gratuita do TikTok pode estar instável. Tente novamente ou use outro vídeo.

### **Q: Instagram dá erro!**
**A:** 
- Certifique-se que yt-dlp está instalado
- Verifique se o post não é privado
- Alguns reels podem não funcionar

### **Q: Posso baixar playlists?**
**A:** Não nativamente. Use vídeos individuais.

---

## 🤖 IA e APIs

### **Q: A IA é obrigatória?**
**A:** NÃO! O bot funciona sem IA. Configure assim:
```env
ENABLE_AI=false
```

### **Q: Quanto custa a IA?**
**A:** 
- GPT-3.5-turbo: ~$0.002/1K tokens
- 1000 mensagens ≈ $1-3 USD
- Você paga apenas o que usar

### **Q: Onde pego a OpenAI API Key?**
**A:** https://platform.openai.com/api-keys

### **Q: Posso usar outra IA?**
**A:** Sim! Edite `src/services/aiService.js` para usar Anthropic, Cohere, etc.

### **Q: As buscas precisam de API?**
**A:** NÃO! O bot tem fallbacks gratuitos. APIs melhoram a qualidade.

---

## 👑 Administração

### **Q: Comandos de admin não funcionam!**
**A:** Verifique:
1. O bot é admin do grupo?
2. Você é admin do grupo?
3. O comando existe?

### **Q: Como fazer o bot admin?**
**A:** 
1. Vá nas configurações do grupo
2. Toque nos participantes
3. Encontre o bot
4. Promova a administrador

### **Q: O anti-link não funciona!**
**A:** 
1. Ative: `!antilink on`
2. Certifique-se que o bot é admin
3. O bot não pode deletar mensagens de outros admins

### **Q: Como banir alguém?**
**A:** `!ban @usuario`

Requisitos:
- Você deve ser admin
- O bot deve ser admin
- Não pode banir outro admin

---

## 🐛 Erros Comuns

### **Q: Erro "Cannot find module"**
**A:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Q: Erro de memória**
**A:**
```bash
node --max-old-space-size=2048 src/index.js
```

### **Q: Erro "ENOSPC"**
**A:** Pouco espaço em disco. Limpe:
```bash
npm run clean
```

### **Q: Erro "EADDRINUSE"**
**A:** Porta já em uso. Mate o processo:
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Ou mude a porta no .env
PORT=3001
```

### **Q: Bot trava/congela**
**A:**
```bash
pm2 restart whatsapp-bot
# Ou
pm2 delete whatsapp-bot
pm2 start src/index.js --name whatsapp-bot
```

---

## 🌐 Deploy e Hospedagem

### **Q: Qual a melhor plataforma?**
**A:** 
1. **VPS** (Melhor) - DigitalOcean, Linode, Vultr
2. **Railway** (Bom) - Fácil, plano gratuito
3. **Render** (OK) - Pode desconectar
4. **Heroku** (Pago) - $7/mês

### **Q: Posso usar hospedagem compartilhada?**
**A:** NÃO. Precisa de VPS ou PaaS.

### **Q: Quanto custa hospedar?**
**A:**
- **Gratuito:** Railway, Render (com limitações)
- **Pago:** $5-10/mês (VPS)

### **Q: Como fazer backup?**
**A:**
```bash
# Backup
tar -czf backup.tar.gz sessions/ src/database/data/

# Restaurar
tar -xzf backup.tar.gz
```

### **Q: Perdi a sessão, e agora?**
**A:** Reconecte:
```bash
rm -rf sessions/
npm start
# Escaneie novo QR Code
```

---

## 🔐 Segurança

### **Q: É seguro?**
**A:** Sim, mas:
- ✅ Não compartilhe o arquivo `sessions/`
- ✅ Mantenha `.env` privado
- ✅ Use senhas fortes nas APIs
- ✅ Não commite credenciais no Git

### **Q: Meu bot foi hackeado!**
**A:**
1. Desconecte imediatamente
2. Delete `sessions/`
3. Troque todas as API Keys
4. Reconecte com novo QR Code

---

## 💡 Dicas

### **Q: Como economizar na IA?**
**A:**
- Use GPT-3.5 em vez de GPT-4
- Limite tokens: `max_tokens: 500`
- Desative em grupos grandes
- Cobre moedas virtuais dos usuários

### **Q: Como melhorar performance?**
**A:**
- Use VPS com SSD
- Mínimo 1GB RAM
- Node.js 18+
- PM2 para gerenciamento

### **Q: Posso monetizar o bot?**
**A:** Sim!
- Crie sistema de assinaturas
- Venda moedas virtuais
- Ofereça comandos premium
- Seja criativo!

---

## 🆘 Ainda com problemas?

1. **Verifique os logs:**
```bash
pm2 logs whatsapp-bot
```

2. **Procure no GitHub Issues**

3. **Abra uma issue:**
   - Descreva o problema
   - Inclua logs de erro
   - Informe versões (Node.js, sistema)

4. **Leia a documentação:**
   - README.md
   - DEPLOY.md
   - API_GUIDE.md

---

**Lembre-se:** 90% dos problemas são resolvidos com:
- Limpar sessões
- Reinstalar dependências
- Atualizar yt-dlp
- Verificar permissões

Boa sorte! 🚀
