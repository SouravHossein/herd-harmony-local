const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class DatabaseService {
  constructor() {
    this.userDataPath = app.getPath('userData');
    this.dbPath = path.join(this.userDataPath, 'goat-tracker-db');
    this.ensureDatabaseDir();
    this.initDatabase();
  }

  ensureDatabaseDir() {
    if (!fs.existsSync(this.dbPath)) {
      fs.mkdirSync(this.dbPath, { recursive: true });
    }
  }

  initDatabase() {
    const tables = ['goats', 'weightRecords', 'healthRecords', 'breedingRecords', 'financeRecords'];
    tables.forEach(table => {
      const tablePath = path.join(this.dbPath, `${table}.json`);
      if (!fs.existsSync(tablePath)) {
        fs.writeFileSync(tablePath, JSON.stringify([], null, 2));
      }
    });
  }

  readTable(tableName) {
    try {
      const tablePath = path.join(this.dbPath, `${tableName}.json`);
      const data = fs.readFileSync(tablePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading table ${tableName}:`, error);
      return [];
    }
  }

  writeTable(tableName, data) {
    try {
      const tablePath = path.join(this.dbPath, `${tableName}.json`);
      fs.writeFileSync(tablePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing table ${tableName}:`, error);
      return false;
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getAll(tableName) {
    return this.readTable(tableName);
  }

  add(tableName, item) {
    const data = this.readTable(tableName);
    const newItem = { ...item, id: this.generateId() };
    data.push(newItem);
    this.writeTable(tableName, data);
    return newItem;
  }

  update(tableName, id, updates) {
    const data = this.readTable(tableName);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      this.writeTable(tableName, data);
      return data[index];
    }
    return null;
  }

  delete(tableName, id) {
    const data = this.readTable(tableName);
    const filteredData = data.filter(item => item.id !== id);
    this.writeTable(tableName, filteredData);
    return filteredData.length < data.length;
  }

  addFinanceRecord(record) {
    const data = this.readTable('financeRecords');
    const newRecord = { 
      ...record, 
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(newRecord);
    this.writeTable('financeRecords', data);
    return newRecord;
  }

  updateFinanceRecord(id, updates) {
    const data = this.readTable('financeRecords');
    const index = data.findIndex(record => record.id === id);
    if (index !== -1) {
      data[index] = { 
        ...data[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      this.writeTable('financeRecords', data);
      return data[index];
    }
    return null;
  }

  deleteFinanceRecord(id) {
    const data = this.readTable('financeRecords');
    const filteredData = data.filter(record => record.id !== id);
    this.writeTable('financeRecords', filteredData);
    return filteredData.length < data.length;
  }

  getFinanceRecords() {
    return this.readTable('financeRecords');
  }

  exportData() {
    const data = {
      goats: this.readTable('goats'),
      weightRecords: this.readTable('weightRecords'),
      healthRecords: this.readTable('healthRecords'),
      breedingRecords: this.readTable('breedingRecords'),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return data;
  }

  importData(data) {
    try {
      this.writeTable('goats', data.goats || []);
      this.writeTable('weightRecords', data.weightRecords || []);
      this.writeTable('healthRecords', data.healthRecords || []);
      this.writeTable('breedingRecords', data.breedingRecords || []);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  clearAll() {
    try {
      this.writeTable('goats', []);
      this.writeTable('weightRecords', []);
      this.writeTable('healthRecords', []);
      this.writeTable('breedingRecords', []);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}

module.exports = DatabaseService;
