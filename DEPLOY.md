# 🚀 Guia Completo de Deploy

Este guia contém instruções detalhadas para fazer deploy do bot em diferentes plataformas.

## 📋 Índice

1. [Deploy Local](#deploy-local)
2. [Deploy em VPS (Linux)](#deploy-em-vps-linux)
3. [Deploy no Render](#deploy-no-render)
4. [Deploy no Railway](#deploy-no-railway)
5. [Deploy no Heroku](#deploy-no-heroku)
6. [Manutenção](#manutenção)

---

## 🏠 Deploy Local

### Windows

1. **Instalar Node.js**
   - Baixe em: https://nodejs.org/
   - Instale a versão LTS (18+)

2. **Instalar FFmpeg**
   - Baixe em: https://ffmpeg.org/download.html
   - Extraia e adicione ao PATH

3. **Instalar yt-dlp**
   ```cmd
   winget install yt-dlp
   ```

4. **Clonar e configurar**
   ```cmd
   git clone https://github.com/seu-usuario/whatsapp-bot-baileys.git
   cd whatsapp-bot-baileys
   npm install
   copy .env.example .env
   notepad .env
   ```

5. **Executar**
   ```cmd
   npm start
   ```

### Linux/macOS

```bash
# Instalar dependências
sudo apt update
sudo apt install -y nodejs npm ffmpeg

# yt-dlp
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Clonar e configurar
git clone https://github.com/seu-usuario/whatsapp-bot-baileys.git
cd whatsapp-bot-baileys
npm install
cp .env.example .env
nano .env

# Executar
npm start
```

---

## 🖥️ Deploy em VPS (Linux)

### 1. Preparar Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar dependências
sudo apt install -y ffmpeg git

# Instalar yt-dlp
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

### 2. Configurar Projeto

```bash
# Criar usuário para o bot (recomendado)
sudo adduser botuser
sudo su - botuser

# Clonar repositório
git clone https://github.com/seu-usuario/whatsapp-bot-baileys.git
cd whatsapp-bot-baileys

# Instalar dependências
npm install --production

# Configurar .env
cp .env.example .env
nano .env
```

### 3. Usar PM2 (Gerenciador de Processos)

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar bot
pm2 start src/index.js --name whatsapp-bot

# Configurar para iniciar no boot
pm2 startup
pm2 save

# Comandos úteis
pm2 status           # Ver status
pm2 logs whatsapp-bot # Ver logs
pm2 restart whatsapp-bot # Reiniciar
pm2 stop whatsapp-bot    # Parar
```

### 4. Nginx (Opcional - para webhook)

```bash
sudo apt install -y nginx

# Configurar
sudo nano /etc/nginx/sites-available/whatsapp-bot

# Adicionar:
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Ativar
sudo ln -s /etc/nginx/sites-available/whatsapp-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## ☁️ Deploy no Render

### 1. Preparar Repositório

Adicione um arquivo `render.yaml`:

```yaml
services:
  - type: web
    name: whatsapp-bot
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: BOT_NAME
        sync: false
      - key: PREFIX
        sync: false
      - key: OPENAI_API_KEY
        sync: false
```

### 2. Deploy

1. Acesse [render.com](https://render.com)
2. Conecte seu GitHub
3. New → Web Service
4. Selecione o repositório
5. Configure:
   - **Name:** whatsapp-bot
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Adicione variáveis de ambiente do `.env`
7. Create Web Service

### 3. Conectar WhatsApp

- Acesse os logs do Render
- Copie o QR Code que aparecerá
- Escaneie no WhatsApp

**Nota:** Render pode reiniciar o serviço, causando desconexão.

---

## 🚂 Deploy no Railway

### 1. Conectar GitHub

1. Acesse [railway.app](https://railway.app)
2. Login com GitHub
3. New Project → Deploy from GitHub repo
4. Selecione o repositório

### 2. Configurar Variáveis

- Vá em Variables
- Adicione todas do `.env`:
  ```
  BOT_NAME=LBOT v2.0
  PREFIX=!
  OPENAI_API_KEY=sua-chave
  ENABLE_AI=true
  ...
  ```

### 3. Deploy Automático

- Railway detecta automaticamente Node.js
- Build e deploy acontecem automaticamente
- Acesse os logs para ver o QR Code

### 4. Persistência

Railway pode perder a sessão. Para manter:

1. Adicione volume persistente
2. Configure para salvar `/sessions`

---

## 🟣 Deploy no Heroku

### 1. Preparar Projeto

Crie `Procfile`:
```
worker: npm start
```

Crie `heroku.yml`:
```yaml
build:
  docker:
    worker: Dockerfile
```

Crie `Dockerfile`:
```dockerfile
FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y ffmpeg

RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["npm", "start"]
```

### 2. Deploy

```bash
# Instalar Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Criar app
heroku create seu-whatsapp-bot

# Configurar variáveis
heroku config:set BOT_NAME="LBOT v2.0"
heroku config:set PREFIX="!"
heroku config:set OPENAI_API_KEY="sua-chave"

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

---

## 🔧 Manutenção

### Atualizar Bot

```bash
git pull origin main
npm install
pm2 restart whatsapp-bot
```

### Backup de Dados

```bash
# Backup manual
tar -czf backup-$(date +%Y%m%d).tar.gz sessions/ src/database/data/

# Restaurar
tar -xzf backup-20240101.tar.gz
```

### Monitoramento

```bash
# Ver logs
pm2 logs whatsapp-bot

# Ver uso de recursos
pm2 monit
```

### Limpar Sessão

```bash
pm2 stop whatsapp-bot
rm -rf sessions/
pm2 start whatsapp-bot
# Escanear novo QR Code
```

---

## 🆘 Problemas Comuns

### Bot desconecta frequentemente

**Causa:** Plataforma gratuita com reinicializações
**Solução:** Use VPS ou plano pago

### QR Code não aparece

**Causa:** Sessão anterior corrompida
**Solução:**
```bash
rm -rf sessions/
npm start
```

### Downloads não funcionam

**Causa:** yt-dlp desatualizado
**Solução:**
```bash
sudo yt-dlp -U
```

### Erro de memória

**Causa:** Pouca RAM
**Solução:**
```bash
# Aumentar limite Node.js
node --max-old-space-size=2048 src/index.js
```

---

## 📊 Recomendações

| Plataforma | Custo | Uptime | Dificuldade | Recomendação |
|------------|-------|--------|-------------|--------------|
| **VPS** | $5-10/mês | 99.9% | Médio | ⭐⭐⭐⭐⭐ Melhor |
| **Railway** | Gratuito* | 95% | Fácil | ⭐⭐⭐⭐ Bom |
| **Render** | Gratuito* | 90% | Fácil | ⭐⭐⭐ OK |
| **Heroku** | $7/mês | 99% | Médio | ⭐⭐⭐⭐ Bom |

*Planos gratuitos podem ter limitações

---

**Para produção séria, recomendamos VPS!** 🚀
