import fs from 'fs';
import path from 'path';
import Logger from '../utils/logger.js';

class Database {
  constructor() {
    this.dataPath = './src/database/data';
    this.files = {
      users: path.join(this.dataPath, 'users.json'),
      groups: path.join(this.dataPath, 'groups.json'),
      economy: path.join(this.dataPath, 'economy.json'),
      settings: path.join(this.dataPath, 'settings.json'),
      spam: path.join(this.dataPath, 'spam.json')
    };
    this.init();
  }

  init() {
    // Criar diretório se não existir
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }

    // Criar arquivos se não existirem
    Object.entries(this.files).forEach(([key, filepath]) => {
      if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, JSON.stringify({}), 'utf8');
        Logger.info(`Database: Arquivo ${key}.json criado`);
      }
    });
  }

  read(type) {
    try {
      const data = fs.readFileSync(this.files[type], 'utf8');
      return JSON.parse(data);
    } catch (error) {
      Logger.error(`Erro ao ler ${type}:`, error);
      return {};
    }
  }

  write(type, data) {
    try {
      fs.writeFileSync(this.files[type], JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      Logger.error(`Erro ao escrever ${type}:`, error);
      return false;
    }
  }

  // USERS
  getUser(userId) {
    const users = this.read('users');
    return users[userId] || null;
  }

  setUser(userId, data) {
    const users = this.read('users');
    users[userId] = {
      id: userId,
      registeredAt: data.registeredAt || Date.now(),
      ...data
    };
    return this.write('users', users);
  }

  // GROUPS
  getGroup(groupId) {
    const groups = this.read('groups');
    return groups[groupId] || null;
  }

  setGroup(groupId, data) {
    const groups = this.read('groups');
    groups[groupId] = {
      id: groupId,
      ...data
    };
    return this.write('groups', groups);
  }

  // ECONOMY
  getBalance(userId) {
    const economy = this.read('economy');
    return economy[userId]?.balance || 0;
  }

  setBalance(userId, amount) {
    const economy = this.read('economy');
    if (!economy[userId]) {
      economy[userId] = { balance: 0, transactions: [] };
    }
    economy[userId].balance = amount;
    economy[userId].transactions.push({
      amount,
      timestamp: Date.now()
    });
    return this.write('economy', economy);
  }

  addBalance(userId, amount) {
    const current = this.getBalance(userId);
    return this.setBalance(userId, current + amount);
  }

  removeBalance(userId, amount) {
    const current = this.getBalance(userId);
    return this.setBalance(userId, Math.max(0, current - amount));
  }

  getRanking(limit = 10) {
    const economy = this.read('economy');
    return Object.entries(economy)
      .map(([id, data]) => ({ id, balance: data.balance }))
      .sort((a, b) => b.balance - a.balance)
      .slice(0, limit);
  }

  // SPAM CONTROL
  getSpamData(userId) {
    const spam = this.read('spam');
    return spam[userId] || { count: 0, lastReset: Date.now(), banned: false };
  }

  updateSpamData(userId, data) {
    const spam = this.read('spam');
    spam[userId] = data;
    return this.write('spam', spam);
  }

  // SETTINGS
  getSetting(key) {
    const settings = this.read('settings');
    return settings[key];
  }

  setSetting(key, value) {
    const settings = this.read('settings');
    settings[key] = value;
    return this.write('settings', settings);
  }
}

export default new Database();
