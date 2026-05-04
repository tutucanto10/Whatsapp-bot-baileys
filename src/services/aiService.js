import axios from 'axios';
import config from '../config/config.js';
import Logger from '../utils/logger.js';

class AIService {
  constructor() {
    this.apiKey = config.openAI.apiKey;
    this.model = config.openAI.model;
    this.enabled = config.openAI.enabled;
  }

  async chat(message, isGroup = false) {
    if (!this.enabled || !this.apiKey) {
      return 'IA não configurada. Configure sua OPENAI_API_KEY no .env';
    }

    try {
      const personality = isGroup ? this.getZoeiroPrompt() : this.getProfissionalPrompt();
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.model,
          messages: [
            { role: 'system', content: personality },
            { role: 'user', content: message }
          ],
          temperature: isGroup ? 0.9 : 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      Logger.error('Erro na API OpenAI:', error);
      
      if (error.response?.status === 401) {
        return 'Erro: API Key inválida';
      }
      
      return 'Desculpe, ocorreu um erro ao processar sua mensagem.';
    }
  }

  getZoeiroPrompt() {
    return `Você é um bot de WhatsApp ZOEIRO e ENGRAÇADO chamado ${config.botName}.
Características:
- Responda de forma informal, descontraída e cômica
- Use gírias brasileiras, emojis e expressões engraçadas
- Faça piadas, seja sarcástico mas sem ofender
- Use "KKKKKK", "kkkkk", emojis como 😂🔥💀
- Seja criativo e divertido
- Responda de forma curta e direta
- Não seja robótico, seja natural como um amigo zoando`;
  }

  getProfissionalPrompt() {
    return `Você é ${config.botName}, um assistente virtual profissional e educado.
Características:
- Responda de forma formal e cortês
- Seja claro, objetivo e prestativo
- Use linguagem profissional
- Evite gírias e linguagem informal
- Seja respeitoso e atencioso
- Responda de forma completa mas concisa
- Ajude o usuário da melhor forma possível`;
  }

  // Simular IA quando não configurada (respostas automáticas)
  async simulateChat(message, isGroup = false) {
    const zoeiroResponses = [
      'KKKKKKKK rapaz, essa foi boa! 😂',
      'Eita, calma aí meu consagrado! 🔥',
      'Brabo demais! 💀',
      'Tá maluco, patrão? 🤪',
      'Isso aí, parceiro! 👊',
      'Opa, bora! 🚀'
    ];

    const profissionalResponses = [
      'Entendi sua solicitação. Como posso ajudá-lo?',
      'Estou à disposição para auxiliá-lo.',
      'Claro, vou processar sua solicitação.',
      'Compreendo. Posso ajudar com mais alguma coisa?',
      'Certamente. Estou aqui para ajudar.'
    ];

    const responses = isGroup ? zoeiroResponses : profissionalResponses;
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export default new AIService();
