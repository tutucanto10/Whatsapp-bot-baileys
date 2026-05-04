# 🔑 Guia de APIs

Este documento explica como obter e configurar todas as APIs necessárias para funcionalidades completas do bot.

## 📋 Índice

1. [OpenAI (IA)](#openai-ia)
2. [Google Custom Search (Busca)](#google-custom-search)
3. [Unsplash (Imagens)](#unsplash-imagens)
4. [YouTube Data API (Vídeos)](#youtube-data-api)
5. [Resumo](#resumo)

---

## 🤖 OpenAI (IA)

### Para que serve?
Permite que o bot converse inteligentemente usando GPT-3.5 ou GPT-4.

### Como obter?

1. **Criar conta**
   - Acesse: https://platform.openai.com/
   - Clique em "Sign Up"
   - Confirme seu email

2. **Obter API Key**
   - Faça login
   - Vá em: https://platform.openai.com/api-keys
   - Clique em "Create new secret key"
   - Copie a chave (aparece apenas uma vez!)

3. **Adicionar créditos** (necessário)
   - Vá em "Billing" → "Payment methods"
   - Adicione cartão de crédito
   - Adicione pelo menos $5 de créditos

### Configurar no bot

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxx
AI_MODEL=gpt-3.5-turbo
ENABLE_AI=true
```

### Modelos disponíveis

| Modelo | Custo | Qualidade | Velocidade |
|--------|-------|-----------|------------|
| `gpt-3.5-turbo` | $0.0015/1K tokens | Boa | Rápido |
| `gpt-4` | $0.03/1K tokens | Excelente | Médio |
| `gpt-4-turbo` | $0.01/1K tokens | Excelente | Rápido |

**Recomendação:** Use `gpt-3.5-turbo` para começar (mais barato).

### Custos estimados

- 1000 mensagens de IA: ~$1-3 USD
- Recompense usuários com moedas por usar IA

---

## 🔍 Google Custom Search

### Para que serve?
Permite buscar no Google através do comando `!google`.

### Como obter?

1. **Criar projeto no Google Cloud**
   - Acesse: https://console.cloud.google.com/
   - Clique em "Select a project" → "New Project"
   - Nome: "WhatsApp Bot"
   - Criar

2. **Ativar Custom Search API**
   - No menu, vá em "APIs & Services" → "Library"
   - Busque "Custom Search API"
   - Clique em "Enable"

3. **Criar credenciais**
   - Vá em "APIs & Services" → "Credentials"
   - "Create Credentials" → "API Key"
   - Copie a chave

4. **Criar Search Engine ID**
   - Acesse: https://programmablesearchengine.google.com/
   - Clique em "Add"
   - Nome: "WhatsApp Bot Search"
   - Sites a pesquisar: deixe vazio ou adicione "*"
   - Criar
   - Copie o "Search engine ID"

### Configurar no bot

```env
GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxx
GOOGLE_SEARCH_ENGINE_ID=xxxxxxxxxxxxxxxxx
```

### Limites gratuitos

- **100 buscas/dia** gratuitamente
- Para mais: $5 por 1000 queries adicionais

### Alternativa gratuita

Se não quiser pagar, o bot já tem um fallback que gera links do Google.

---

## 🖼️ Unsplash (Imagens)

### Para que serve?
Busca de imagens de alta qualidade através do comando `!imagem`.

### Como obter?

1. **Criar conta**
   - Acesse: https://unsplash.com/
   - Clique em "Join"
   - Cadastre-se gratuitamente

2. **Criar aplicação**
   - Vá em: https://unsplash.com/developers
   - Clique em "Register as a developer"
   - Aceite os termos
   - "New Application"

3. **Configurar app**
   - Application name: "WhatsApp Bot"
   - Description: "Bot de WhatsApp para busca de imagens"
   - Aceite guidelines
   - Submit

4. **Copiar chave**
   - Na página da aplicação, copie o "Access Key"

### Configurar no bot

```env
UNSPLASH_ACCESS_KEY=xxxxxxxxxxxxxxxxxx
```

### Limites gratuitos

- **50 requisições/hora** (Demo)
- **5000 requisições/hora** (Production - após aprovação)

### Alternativa

O bot já tem um fallback que redireciona para o Google Imagens.

---

## 🎥 YouTube Data API

### Para que serve?
Busca de vídeos do YouTube através do comando `!videosearch`.

### Como obter?

1. **Usar mesmo projeto do Google**
   - Acesse: https://console.cloud.google.com/
   - Selecione o projeto criado anteriormente

2. **Ativar YouTube Data API v3**
   - Menu → "APIs & Services" → "Library"
   - Busque "YouTube Data API v3"
   - Clique em "Enable"

3. **Usar mesma API Key**
   - A mesma chave do Google Custom Search funciona

### Configurar no bot

```env
YOUTUBE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxx
```

### Limites gratuitos

- **10.000 unidades/dia** gratuitamente
- 1 busca = 100 unidades
- ~100 buscas/dia grátis

### Alternativa

O bot redireciona para pesquisa do YouTube se a API não estiver configurada.

---

## 📊 Resumo

### Essencial (para funcionalidades completas)

| API | Custo | Funcionalidade | Prioridade |
|-----|-------|----------------|------------|
| **OpenAI** | ~$5-10/mês | IA conversacional | 🔴 Alta |
| **Google Search** | Grátis (100/dia) | Busca no Google | 🟡 Média |
| **Unsplash** | Grátis | Busca de imagens | 🟢 Baixa |
| **YouTube** | Grátis | Busca de vídeos | 🟢 Baixa |

### Configuração mínima funcional

```env
# Apenas isso já funciona!
BOT_NAME=LBOT v2.0
PREFIX=!
ENABLE_AI=false
ENABLE_DOWNLOADS=true
ENABLE_STICKERS=true
```

O bot funciona **sem nenhuma API**, mas com funcionalidades limitadas:
- ✅ Comandos básicos (menu, ping)
- ✅ Admin (ban, promote)
- ✅ Downloads (YouTube, TikTok, Instagram)
- ✅ Stickers
- ✅ Economia
- ✅ Anti-spam/anti-link
- ❌ IA conversacional
- ⚠️ Buscas (com fallback para links diretos)

### Configuração recomendada

Para experiência completa:

```env
# Mínimo recomendado
OPENAI_API_KEY=sk-...        # Para IA
GOOGLE_API_KEY=AIza...       # Para buscas
GOOGLE_SEARCH_ENGINE_ID=...  # Para buscas
```

Isso já garante:
- ✅ IA funcionando
- ✅ Buscas no Google
- ✅ Busca de vídeos no YouTube
- ⚠️ Busca de imagens (fallback para Google Images)

### Custo mensal estimado

**Uso moderado (100 usuários):**
- OpenAI: $5-15/mês
- Google/YouTube: Grátis
- Unsplash: Grátis
- **Total: $5-15/mês**

**Uso intenso (500+ usuários):**
- OpenAI: $20-50/mês
- Google: $5-10/mês
- **Total: $25-60/mês**

---

## 🔒 Segurança

### Proteja suas chaves

✅ **FAÇA:**
- Use variáveis de ambiente (`.env`)
- Adicione `.env` ao `.gitignore`
- Rotacione chaves periodicamente
- Use limites de uso nas APIs

❌ **NÃO FAÇA:**
- Commitar chaves no Git
- Compartilhar chaves publicamente
- Usar mesma chave em múltiplos projetos
- Ignorar alertas de uso

### Limitar uso

No Google Cloud Console:
1. Vá em "APIs & Services" → "Credentials"
2. Edite sua API Key
3. Em "API restrictions", selecione apenas as necessárias
4. Em "Application restrictions", adicione restrições de IP

---

## 🆘 Problemas Comuns

### "Invalid API Key"

**Causa:** Chave incorreta ou expirada
**Solução:**
1. Verifique se copiou a chave completa
2. Regenere a chave se necessário
3. Aguarde alguns minutos para propagar

### "Quota exceeded"

**Causa:** Limite diário atingido
**Solução:**
1. Aguarde 24h para resetar
2. Upgrade para plano pago
3. Use alternativas gratuitas

### "API not enabled"

**Causa:** API não ativada no projeto
**Solução:**
1. Vá no Google Cloud Console
2. Library → Busque a API
3. Clique em "Enable"

---

## 📚 Documentação Oficial

- **OpenAI:** https://platform.openai.com/docs
- **Google Custom Search:** https://developers.google.com/custom-search
- **Unsplash:** https://unsplash.com/documentation
- **YouTube API:** https://developers.google.com/youtube/v3

---

**Dúvidas?** Abra uma issue no GitHub! 🚀
