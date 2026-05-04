import pino from 'pino';
import fs from 'fs';
import path from 'path';

// Criar diretório de logs se não existir
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configuração do logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
          ignore: 'pid,hostname'
        },
        level: 'info'
      },
      {
        target: 'pino/file',
        options: { 
          destination: path.join(logsDir, `bot-${new Date().toISOString().split('T')[0]}.log`),
          mkdir: true
        },
        level: 'info'
      }
    ]
  }
});

class Logger {
  static info(message, data = {}) {
    logger.info(data, message);
  }

  static error(message, error = {}) {
    logger.error({ error: error.message || error, stack: error.stack }, message);
  }

  static warn(message, data = {}) {
    logger.warn(data, message);
  }

  static debug(message, data = {}) {
    logger.debug(data, message);
  }

  static command(command, from, isGroup) {
    logger.info({
      type: 'COMMAND',
      command,
      from,
      isGroup
    }, `Comando executado: ${command}`);
  }

  static message(from, isGroup, messageType) {
    logger.info({
      type: 'MESSAGE',
      from,
      isGroup,
      messageType
    }, 'Nova mensagem recebida');
  }
}

export default Logger;
