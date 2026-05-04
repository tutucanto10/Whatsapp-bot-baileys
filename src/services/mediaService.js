import axios from 'axios';
import fs from 'fs';
import path from 'path';
import Logger from '../utils/logger.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class MediaService {
  constructor() {
    this.tempDir = './temp';
    this.maxSize = 100 * 1024 * 1024; // 100MB
  }

  // Download de YouTube
  async downloadYouTube(url, type = 'video') {
    try {
      Logger.info(`Baixando do YouTube: ${url}`);

      // Usando yt-dlp (você precisa instalá-lo no sistema)
      // sudo apt install yt-dlp (Linux)
      // brew install yt-dlp (Mac)
      
      const filename = `yt_${Date.now()}`;
      const output = path.join(this.tempDir, filename);
      
      let command;
      if (type === 'audio') {
        command = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "${output}.%(ext)s" "${url}"`;
      } else {
        command = `yt-dlp -f "best[height<=480]" -o "${output}.%(ext)s" "${url}"`;
      }

      await execAsync(command);
      
      // Encontrar arquivo gerado
      const files = fs.readdirSync(this.tempDir).filter(f => f.startsWith(filename));
      if (files.length === 0) throw new Error('Arquivo não encontrado');

      const filepath = path.join(this.tempDir, files[0]);
      
      // Verificar tamanho
      const stats = fs.statSync(filepath);
      if (stats.size > this.maxSize) {
        fs.unlinkSync(filepath);
        throw new Error('Arquivo muito grande (máx 100MB)');
      }

      return filepath;
    } catch (error) {
      Logger.error('Erro no download YouTube:', error);
      throw new Error('Erro ao baixar do YouTube. Certifique-se de que yt-dlp está instalado.');
    }
  }

  // Download de TikTok
  async downloadTikTok(url) {
    try {
      Logger.info(`Baixando do TikTok: ${url}`);

      // Usando API alternativa
      const response = await axios.post('https://www.tikwm.com/api/', {
        url: url
      });

      if (response.data.code !== 0) {
        throw new Error('Erro ao processar vídeo do TikTok');
      }

      const videoUrl = response.data.data.play;
      const filename = `tiktok_${Date.now()}.mp4`;
      const filepath = path.join(this.tempDir, filename);

      // Download do vídeo
      const videoResponse = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(filepath);
      videoResponse.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          const stats = fs.statSync(filepath);
          if (stats.size > this.maxSize) {
            fs.unlinkSync(filepath);
            reject(new Error('Arquivo muito grande'));
          }
          resolve(filepath);
        });
        writer.on('error', reject);
      });
    } catch (error) {
      Logger.error('Erro no download TikTok:', error);
      throw new Error('Erro ao baixar do TikTok');
    }
  }

  // Download de Instagram
  async downloadInstagram(url) {
    try {
      Logger.info(`Baixando do Instagram: ${url}`);

      // Usando yt-dlp (também funciona para Instagram)
      const filename = `ig_${Date.now()}`;
      const output = path.join(this.tempDir, filename);
      
      const command = `yt-dlp -o "${output}.%(ext)s" "${url}"`;
      await execAsync(command);
      
      const files = fs.readdirSync(this.tempDir).filter(f => f.startsWith(filename));
      if (files.length === 0) throw new Error('Arquivo não encontrado');

      const filepath = path.join(this.tempDir, files[0]);
      
      const stats = fs.statSync(filepath);
      if (stats.size > this.maxSize) {
        fs.unlinkSync(filepath);
        throw new Error('Arquivo muito grande');
      }

      return filepath;
    } catch (error) {
      Logger.error('Erro no download Instagram:', error);
      throw new Error('Erro ao baixar do Instagram');
    }
  }

  // Detectar plataforma
  detectPlatform(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('tiktok.com')) {
      return 'tiktok';
    } else if (url.includes('instagram.com')) {
      return 'instagram';
    }
    return null;
  }

  // Download universal
  async download(url, options = {}) {
    const platform = this.detectPlatform(url);
    
    if (!platform) {
      throw new Error('Plataforma não suportada');
    }

    switch (platform) {
      case 'youtube':
        return await this.downloadYouTube(url, options.type);
      case 'tiktok':
        return await this.downloadTikTok(url);
      case 'instagram':
        return await this.downloadInstagram(url);
      default:
        throw new Error('Plataforma não suportada');
    }
  }
}

export default new MediaService();
