# 🤖 WhatsApp Bot - LBOT v2.0

Bot profissional de WhatsApp desenvolvido com **Baileys**, apresentando arquitetura modular, dual-mode (zoeiro/profissional) e funcionalidades completas de automação.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Baileys](https://img.shields.io/badge/Baileys-6.7.8-blue.svg)](https://github.com/WhiskeySockets/Baileys)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Índice

- [Características](#-características)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#️-configuração)
- [Como Usar](#-como-usar)
- [Comandos](#-comandos)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Deploy](#-deploy)
- [Troubleshooting](#-troubleshooting)
- [Contribuindo](#-contribuindo)

## ✨ Características

- 🎭 **Dual Mode Automático**: Modo zoeiro em grupos, profissional em conversas privadas
- 🤖 **Integração com IA**: OpenAI GPT para conversas inteligentes
- 📥 **Download de Mídia**: YouTube, TikTok, Instagram
- 🎨 **Criação de Stickers**: Imagens e vídeos animados
- 🔍 **Busca Inteligente**: Google, imagens e vídeos
- 👑 **Administração de Grupos**: Ban, kick, promote, demote
- 🛡️ **Proteção**: Anti-spam e anti-link configuráveis
- 💰 **Sistema de Economia**: Moedas, ranking, recompensas
- 📊 **Logs Completos**: Sistema de logging profissional
- 🔧 **Arquitetura Modular**: Código limpo e escalável

## 🚀 Funcionalidades

### Comandos Gerais
- Menu interativo
- Sistema de ajuda
- Ping/latência
- Informações do bot

### Mídia
- Download de YouTube (MP3/MP4)
- Download de TikTok
- Download de Instagram
- Criação de figurinhas

### Busca
- Busca no Google
- Busca de imagens
- Busca de vídeos

### Admin
- Banir/remover usuários
- Promover/rebaixar admins
- Anti-link configurável
- Anti-spam automático

### Diversão
- Ship (compatibilidade)
- Economia (moedas)
- Ranking
- Recompensa diária

### IA
- Chat com GPT
- Modo duplo (zoeiro/profissional)

## 📦 Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **FFmpeg** ([Instalação](#instalando-ffmpeg))
- **yt-dlp** ([Instalação](#instalando-yt-dlp))
- Conta OpenAI (opcional, para IA)

### Instalando FFmpeg

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
Baixe em: https://ffmpeg.org/download.html

### Instalando yt-dlp

**Linux/macOS:**
```bash
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

**Windows:**
```bash
winget install yt-dlp
```

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/whatsapp-bot-baileys.git
cd whatsapp-bot-baileys
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo .env

```bash
cp .env.example .env
nano .env
```

Edite as variáveis necessárias (veja [Configuração](#️-configuração))

### 4. Inicie o bot

```bash
npm start
```

### 5. Escaneie o QR Code

Abra o WhatsApp no celular:
1. Vá em **Configurações** → **Aparelhos conectados**
2. Toque em **Conectar um aparelho**
3. Escaneie o QR Code que apareceu no terminal

## ⚙️ Configuração

Edite o arquivo `.env` com suas configurações:

```env
# Informações do Bot
BOT_NAME=LBOT v2.0
PREFIX=!
OWNER_NUMBER=5511999999999

# IA (OpenAI)
OPENAI_API_KEY=sk-seu-token-aqui
AI_MODEL=gpt-3.5-turbo
ENABLE_AI=true

# Funcionalidades
ENABLE_DOWNLOADS=true
ENABLE_STICKERS=true
ENABLE_ANTI_SPAM=true
ENABLE_ANTI_LINK=true

# Anti-Spam
MAX_MESSAGES_PER_MINUTE=10
SPAM_BAN_DURATION=300000

# Banco de Dados
DB_TYPE=json
```

### Obtendo API Keys

**OpenAI (para IA):**
1. Acesse: https://platform.openai.com/
2. Crie uma conta
3. Vá em API Keys
4. Crie uma nova chave

## 📱 Como Usar

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

### Limpar dados

```bash
npm run clean
```

## 📖 Comandos

### Geral
```
!menu - Lista todos os comandos
!ping - Velocidade do bot
!help - Ajuda
!info - Informações do bot
```

### Mídia
```
!ytmp3 [url] - Baixar áudio do YouTube
!ytmp4 [url] - Baixar vídeo do YouTube
!tiktok [url] - Baixar vídeo do TikTok
!instagram [url] - Baixar mídia do Instagram
!sticker - Criar figurinha (responda a imagem/vídeo)
```

### Busca
```
!google [termo] - Buscar no Google
!imagem [termo] - Buscar imagens
!videosearch [termo] - Buscar vídeos
```

### Admin (apenas admins)
```
!ban @usuario - Banir membro
!promote @usuario - Promover a admin
!demote @usuario - Rebaixar admin
!antilink on/off - Ativar/desativar anti-link
```

### Diversão
```
!ship @user1 @user2 - Shippar usuários
!saldo - Ver seu saldo
!daily - Recompensa diária
!ranking - Top 10 usuários
```

### IA
```
!ai [pergunta] - Conversar com IA
!gpt [pergunta] - Chat GPT
```

## 🏗️ Estrutura do Projeto

```
whatsapp-bot-baileys/
├── src/
│   ├── commands/          # Comandos do bot
│   │   ├── admin/         # Comandos de administração
│   │   ├── entertainment/ # Comandos de diversão
│   │   ├── general/       # Comandos gerais
│   │   ├── media/         # Downloads e stickers
│   │   └── search/        # Buscas
│   ├── services/          # Serviços (IA, downloads, etc)
│   ├── middlewares/       # Anti-spam, anti-link
│   ├── utils/             # Utilitários
│   ├── database/          # Sistema de dados
│   ├── config/            # Configurações
│   ├── bot.js             # Configuração do Baileys
│   ├── handler.js         # Roteamento de mensagens
│   └── index.js           # Ponto de entrada
├── sessions/              # Sessão do WhatsApp
├── temp/                  # Arquivos temporários
├── logs/                  # Logs do bot
├── .env                   # Variáveis de ambiente
├── package.json
└── README.md
```

## 🌐 Deploy

### Render

1. Crie uma conta em [render.com](https://render.com)
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Adicione as variáveis de ambiente do `.env`
6. Clique em "Create Web Service"

### Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Selecione o repositório
4. Adicione as variáveis de ambiente
5. Deploy automático!

### VPS (Linux)

```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Clonar projeto
git clone seu-repo
cd whatsapp-bot-baileys
npm install

# Instalar PM2
npm install -g pm2

# Iniciar com PM2
pm2 start src/index.js --name whatsapp-bot
pm2 save
pm2 startup
```

## 🔍 Troubleshooting

### Erro ao conectar

```bash
# Limpe a sessão e reconecte
rm -rf sessions/
npm start
```

### Erro de dependências

```bash
rm -rf node_modules package-lock.json
npm install
```

### FFmpeg não encontrado

Certifique-se de que o FFmpeg está instalado:
```bash
ffmpeg -version
```

### yt-dlp não funciona

Atualize o yt-dlp:
```bash
sudo yt-dlp -U
```

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ por [Seu Nome]

## 🙏 Agradecimentos

- [Baileys](https://github.com/WhiskeySockets/Baileys) - Biblioteca WhatsApp Web
- [OpenAI](https://openai.com) - API de IA
- Comunidade open-source

---

⭐ Se este projeto foi útil, deixe uma estrela!
