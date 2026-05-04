# ⚡ Início Rápido - 5 Minutos

Comece a usar o bot em menos de 5 minutos!

## 🚀 Passos Rápidos

### 1️⃣ Instalar Node.js

**Já tem Node.js 18+?** Pule para o passo 2.

- **Windows/Mac:** https://nodejs.org/ (baixe a versão LTS)
- **Linux:**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install -y nodejs
  ```

### 2️⃣ Clonar e Instalar

```bash
# Clone o projeto
git clone https://github.com/seu-usuario/whatsapp-bot-baileys.git
cd whatsapp-bot-baileys

# Instale dependências
npm install

# Configure
cp .env.example .env
```

### 3️⃣ Configurar (Mínimo)

Edite o `.env`:

```env
BOT_NAME=Meu Bot
PREFIX=!
OWNER_NUMBER=seu_numero_aqui
ENABLE_AI=false
```

**Pronto!** O bot já funciona com essa configuração mínima.

### 4️⃣ Iniciar

```bash
npm start
```

### 5️⃣ Conectar WhatsApp

1. **QR Code aparecerá no terminal**
2. **Abra WhatsApp no celular**
3. **Vá em:** Menu → Aparelhos Conectados
4. **Toque em:** Conectar um aparelho
5. **Escaneie o QR Code**

✅ **PRONTO!** Seu bot está online!

---

## 📱 Testar Rapidamente

Envie no WhatsApp:

```
!menu
```

Você verá a lista de comandos!

```
!ping
```

Verifica a velocidade do bot.

---

## ⚙️ Configuração Completa (Opcional)

### Instalar FFmpeg (para stickers e downloads)

**Linux:**
```bash
sudo apt install ffmpeg
```

**Mac:**
```bash
brew install ffmpeg
```

**Windows:** https://ffmpeg.org/download.html

### Instalar yt-dlp (para downloads do YouTube)

**Linux/Mac:**
```bash
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

**Windows:**
```bash
winget install yt-dlp
```

### Ativar IA (Opcional)

1. Crie conta em https://platform.openai.com/
2. Obtenha API Key em https://platform.openai.com/api-keys
3. Adicione no `.env`:
   ```env
   OPENAI_API_KEY=sk-sua-chave-aqui
   ENABLE_AI=true
   ```
4. Reinicie o bot

---

## 🎯 Próximos Passos

1. **Customize:** Edite `src/config/config.js` para personalizar
2. **Adicione comandos:** Crie novos em `src/commands/`
3. **Deploy:** Veja `DEPLOY.md` para hospedar online
4. **APIs:** Leia `API_GUIDE.md` para funcionalidades avançadas

---

## 🆘 Problemas?

### Bot não conecta

```bash
# Limpe a sessão
rm -rf sessions/
npm start
```

### Erro ao instalar

```bash
# Limpe e reinstale
rm -rf node_modules package-lock.json
npm install
```

### QR Code não aparece

- Aguarde alguns segundos
- Verifique sua conexão com internet
- Reinicie o bot

---

## 📚 Documentação Completa

- **README.md** - Documentação completa
- **DEPLOY.md** - Guia de deploy
- **API_GUIDE.md** - Configuração de APIs
- **CONTRIBUTING.md** - Como contribuir

---

## 💡 Dicas

✅ Use `npm run dev` para desenvolvimento (com auto-reload)
✅ Mantenha o `.env` seguro (nunca commite no Git)
✅ Teste comandos em grupo privado primeiro
✅ Leia os logs se algo der errado

---

**Aproveite seu bot! 🎉**

Para mais ajuda, abra uma issue no GitHub.
