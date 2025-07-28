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
    const tables = ['goats', 'weightRecords', 'healthRecords', 'breedingRecords', 'financeRecords', 'feeds', 'feedPlans', 'feedLogs'];
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

  // Feed management methods
  addFeed(feed) {
    const data = this.readTable('feeds');
    const newFeed = { 
      ...feed, 
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(newFeed);
    this.writeTable('feeds', data);
    return newFeed;
  }

  updateFeed(id, updates) {
    const data = this.readTable('feeds');
    const index = data.findIndex(feed => feed.id === id);
    if (index !== -1) {
      data[index] = { 
        ...data[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      this.writeTable('feeds', data);
      return data[index];
    }
    return null;
  }

  deleteFeed(id) {
    const data = this.readTable('feeds');
    const filteredData = data.filter(feed => feed.id !== id);
    this.writeTable('feeds', filteredData);
    return filteredData.length < data.length;
  }

  getFeeds() {
    return this.readTable('feeds');
  }

  // Feed plan methods
  addFeedPlan(plan) {
    const data = this.readTable('feedPlans');
    const newPlan = { 
      ...plan, 
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(newPlan);
    this.writeTable('feedPlans', data);
    return newPlan;
  }

  updateFeedPlan(id, updates) {
    const data = this.readTable('feedPlans');
    const index = data.findIndex(plan => plan.id === id);
    if (index !== -1) {
      data[index] = { 
        ...data[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      this.writeTable('feedPlans', data);
      return data[index];
    }
    return null;
  }

  deleteFeedPlan(id) {
    const data = this.readTable('feedPlans');
    const filteredData = data.filter(plan => plan.id !== id);
    this.writeTable('feedPlans', filteredData);
    return filteredData.length < data.length;
  }

  getFeedPlans() {
    return this.readTable('feedPlans');
  }

  // Feed log methods
  addFeedLog(log) {
    const data = this.readTable('feedLogs');
    const newLog = { 
      ...log, 
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };
    data.push(newLog);
    this.writeTable('feedLogs', data);
    return newLog;
  }

  getFeedLogs() {
    return this.readTable('feedLogs');
  }

  exportData() {
    const data = {
      goats: this.readTable('goats'),
      weightRecords: this.readTable('weightRecords'),
      healthRecords: this.readTable('healthRecords'),
      breedingRecords: this.readTable('breedingRecords'),
      financeRecords: this.readTable('financeRecords'),
      feeds: this.readTable('feeds'),
      feedPlans: this.readTable('feedPlans'),
      feedLogs: this.readTable('feedLogs'),
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
      this.writeTable('financeRecords', data.financeRecords || []);
      this.writeTable('feeds', data.feeds || []);
      this.writeTable('feedPlans', data.feedPlans || []);
      this.writeTable('feedLogs', data.feedLogs || []);
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
      this.writeTable('financeRecords', []);
      this.writeTable('feeds', []);
      this.writeTable('feedPlans', []);
      this.writeTable('feedLogs', []);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}

module.exports = DatabaseService;
