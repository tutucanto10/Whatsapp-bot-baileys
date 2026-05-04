import axios from 'axios';
import fs from 'fs';
import path from 'path';
import Logger from './logger.js';

class Utils {
  // Formatar número de telefone
  static formatPhone(number) {
    return number.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  }

  // Verificar se é administrador
  static isAdmin(participant, groupMetadata) {
    const admins = groupMetadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);
    return admins.includes(participant);
  }

  // Verificar se o bot é admin
  static isBotAdmin(sock, groupId, groupMetadata) {
    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    return this.isAdmin(botNumber, groupMetadata);
  }

  // Extrair menções
  static extractMentions(message) {
    const mentions = [];
    const regex = /@(\d+)/g;
    let match;
    
    while ((match = regex.exec(message)) !== null) {
      mentions.push(match[1] + '@s.whatsapp.net');
    }
    
    return mentions;
  }

  // Download de arquivo
  static async downloadFile(url, filename) {
    try {
      const tempDir = './temp';
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const filepath = path.join(tempDir, filename);
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(filepath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(filepath));
        writer.on('error', reject);
      });
    } catch (error) {
      Logger.error('Erro ao baixar arquivo:', error);
      throw error;
    }
  }

  // Limpar diretório temp
  static cleanTemp() {
    const tempDir = './temp';
    if (fs.existsSync(tempDir)) {
      fs.readdirSync(tempDir).forEach(file => {
        const filepath = path.join(tempDir, file);
        fs.unlinkSync(filepath);
      });
      Logger.info('Diretório temp limpo');
    }
  }

  // Sleep
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Formatar tempo
  static formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  // Gerar ID aleatório
  static generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Escolher aleatório de array
  static random(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Verificar se é URL
  static isUrl(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
  }

  // Extrair URLs
  static extractUrls(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  }

  // Verificar se contém link do WhatsApp
  static hasWhatsAppLink(text) {
    const whatsappRegex = /(chat\.whatsapp\.com|wa\.me)/gi;
    return whatsappRegex.test(text);
  }

  // Limitar texto
  static limitText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Criar diretórios necessários
  static createDirectories() {
    const dirs = ['./temp', './logs', './sessions', './src/database/data'];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        Logger.info(`Diretório criado: ${dir}`);
      }
    });
  }
}

export default Utils;
