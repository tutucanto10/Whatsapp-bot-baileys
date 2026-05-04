#!/bin/bash

# Script de Instalação Automática - LBOT v2.0
# Para Ubuntu/Debian

echo "╔════════════════════════════════════╗"
echo "║   🤖 LBOT v2.0 - Auto Installer   ║"
echo "╚════════════════════════════════════╝"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função de erro
error_exit() {
    echo -e "${RED}❌ Erro: $1${NC}" 1>&2
    exit 1
}

# Função de sucesso
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Função de aviso
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar se está rodando como root
if [ "$EUID" -eq 0 ]; then 
    warning "Não execute como root! Use sudo quando necessário."
    exit 1
fi

echo "🔍 Verificando sistema..."
echo ""

# Verificar sistema operacional
if ! grep -q "Ubuntu\|Debian" /etc/os-release 2>/dev/null; then
    warning "Este script foi feito para Ubuntu/Debian"
    read -p "Deseja continuar mesmo assim? (s/n): " confirm
    if [ "$confirm" != "s" ]; then
        exit 0
    fi
fi

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update || error_exit "Falha ao atualizar repositórios"

# Instalar Node.js
echo ""
echo "📥 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "Instalando Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - || error_exit "Falha ao configurar Node.js"
    sudo apt install -y nodejs || error_exit "Falha ao instalar Node.js"
    success "Node.js instalado!"
else
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        warning "Node.js versão antiga detectada. Atualizando..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt install -y nodejs
    fi
    success "Node.js $(node -v) já instalado"
fi

# Instalar FFmpeg
echo ""
echo "📥 Verificando FFmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo "Instalando FFmpeg..."
    sudo apt install -y ffmpeg || error_exit "Falha ao instalar FFmpeg"
    success "FFmpeg instalado!"
else
    success "FFmpeg já instalado"
fi

# Instalar yt-dlp
echo ""
echo "📥 Verificando yt-dlp..."
if ! command -v yt-dlp &> /dev/null; then
    echo "Instalando yt-dlp..."
    sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp || error_exit "Falha ao baixar yt-dlp"
    sudo chmod a+rx /usr/local/bin/yt-dlp || error_exit "Falha ao dar permissão ao yt-dlp"
    success "yt-dlp instalado!"
else
    success "yt-dlp já instalado"
    echo "Atualizando yt-dlp..."
    sudo yt-dlp -U 2>/dev/null
fi

# Instalar Git
echo ""
echo "📥 Verificando Git..."
if ! command -v git &> /dev/null; then
    echo "Instalando Git..."
    sudo apt install -y git || error_exit "Falha ao instalar Git"
    success "Git instalado!"
else
    success "Git já instalado"
fi

# Instalar dependências do projeto
echo ""
echo "📦 Instalando dependências do bot..."
npm install || error_exit "Falha ao instalar dependências"
success "Dependências instaladas!"

# Configurar .env
echo ""
if [ ! -f .env ]; then
    echo "⚙️  Configurando .env..."
    cp .env.example .env
    
    echo ""
    echo "Por favor, configure seu .env:"
    echo ""
    read -p "Nome do bot [LBOT v2.0]: " bot_name
    bot_name=${bot_name:-"LBOT v2.0"}
    
    read -p "Prefix [!]: " prefix
    prefix=${prefix:-"!"}
    
    read -p "Seu número com DDI (ex: 5511999999999): " owner_number
    
    read -p "Deseja ativar IA? (s/n) [n]: " enable_ai
    if [ "$enable_ai" = "s" ]; then
        read -p "OpenAI API Key: " openai_key
        sed -i "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=$openai_key/" .env
        sed -i "s/ENABLE_AI=.*/ENABLE_AI=true/" .env
    fi
    
    sed -i "s/BOT_NAME=.*/BOT_NAME=$bot_name/" .env
    sed -i "s/PREFIX=.*/PREFIX=$prefix/" .env
    sed -i "s/OWNER_NUMBER=.*/OWNER_NUMBER=$owner_number/" .env
    
    success ".env configurado!"
else
    warning ".env já existe, pulando configuração"
fi

# Instalar PM2 (opcional)
echo ""
read -p "Deseja instalar PM2 para gerenciar o bot? (s/n) [s]: " install_pm2
install_pm2=${install_pm2:-"s"}

if [ "$install_pm2" = "s" ]; then
    if ! command -v pm2 &> /dev/null; then
        echo "Instalando PM2..."
        sudo npm install -g pm2 || warning "Falha ao instalar PM2 (opcional)"
        success "PM2 instalado!"
    else
        success "PM2 já instalado"
    fi
fi

# Resumo
echo ""
echo "╔════════════════════════════════════╗"
echo "║     ✅ INSTALAÇÃO CONCLUÍDA!      ║"
echo "╚════════════════════════════════════╝"
echo ""
echo "📋 Resumo:"
echo "  Node.js: $(node -v)"
echo "  npm: $(npm -v)"
echo "  FFmpeg: $(ffmpeg -version | head -n1 | cut -d' ' -f3)"
echo "  yt-dlp: $(yt-dlp --version)"
if command -v pm2 &> /dev/null; then
    echo "  PM2: $(pm2 -v)"
fi
echo ""
echo "🚀 Para iniciar o bot:"
echo ""
echo "  Opção 1 - Direto:"
echo "    npm start"
echo ""
if command -v pm2 &> /dev/null; then
    echo "  Opção 2 - Com PM2 (recomendado):"
    echo "    pm2 start src/index.js --name whatsapp-bot"
    echo "    pm2 save"
    echo "    pm2 startup"
    echo ""
fi
echo "📱 Após iniciar, escaneie o QR Code no WhatsApp!"
echo ""
echo "📚 Documentação:"
echo "  - README.md - Documentação completa"
echo "  - QUICKSTART.md - Início rápido"
echo "  - DEPLOY.md - Guia de deploy"
echo ""
success "Instalação finalizada com sucesso!"
