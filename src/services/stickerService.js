import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import Logger from '../utils/logger.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class StickerService {
  constructor() {
    this.tempDir = './temp';
  }

  // Criar sticker de imagem
  async createFromImage(inputPath) {
    try {
      const outputPath = path.join(this.tempDir, `sticker_${Date.now()}.webp`);

      await sharp(inputPath)
        .resize(512, 512, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .webp({ quality: 100 })
        .toFile(outputPath);

      Logger.info('Sticker criado com sucesso');
      return outputPath;
    } catch (error) {
      Logger.error('Erro ao criar sticker de imagem:', error);
      throw error;
    }
  }

  // Criar sticker de vídeo (animated)
  async createFromVideo(inputPath) {
    try {
      const outputPath = path.join(this.tempDir, `sticker_${Date.now()}.webp`);

      // Usando ffmpeg para converter vídeo para webp animado
      // Limitando a 6 segundos
      const command = `ffmpeg -i "${inputPath}" -t 6 -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=0x00000000" -loop 0 -preset default -an -vsync 0 "${outputPath}"`;

      await execAsync(command);

      if (!fs.existsSync(outputPath)) {
        throw new Error('Erro ao gerar sticker animado');
      }

      Logger.info('Sticker animado criado com sucesso');
      return outputPath;
    } catch (error) {
      Logger.error('Erro ao criar sticker de vídeo:', error);
      throw error;
    }
  }

  // Criar sticker a partir de buffer
  async createFromBuffer(buffer, isVideo = false) {
    try {
      const tempInput = path.join(this.tempDir, `input_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`);
      fs.writeFileSync(tempInput, buffer);

      const result = isVideo 
        ? await this.createFromVideo(tempInput)
        : await this.createFromImage(tempInput);

      // Limpar arquivo temporário de entrada
      fs.unlinkSync(tempInput);

      return result;
    } catch (error) {
      Logger.error('Erro ao criar sticker:', error);
      throw error;
    }
  }

  // Adicionar metadata ao sticker
  async addMetadata(stickerPath, metadata = {}) {
    try {
      const { 
        pack = 'LBOT v2.0', 
        author = 'Bot',
        categories = ['😀', '🎉']
      } = metadata;

      // Aqui você pode adicionar metadata usando bibliotecas específicas
      // Por enquanto, retorna o sticker sem alterações
      return stickerPath;
    } catch (error) {
      Logger.error('Erro ao adicionar metadata:', error);
      return stickerPath;
    }
  }
}

export default new StickerService();
