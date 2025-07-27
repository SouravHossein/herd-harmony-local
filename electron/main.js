const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Database simulation using JSON files
class JsonDatabase {
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
    const tables = ['goats', 'weightRecords', 'healthRecords', 'breedingRecords'];
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

  // Generic CRUD operations
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

  // Export all data
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

  // Import data
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

  // Clear all data
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

let db;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'GoatTracker - Farm Management',
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load React app
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Initialize database
  db = new JsonDatabase();
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for database operations
ipcMain.handle('db:getGoats', () => {
  return db.getAll('goats');
});

ipcMain.handle('db:addGoat', (event, goat) => {
  return db.add('goats', goat);
});

ipcMain.handle('db:updateGoat', (event, id, updates) => {
  return db.update('goats', id, updates);
});

ipcMain.handle('db:deleteGoat', (event, id) => {
  // Also delete related records
  const weightRecords = db.getAll('weightRecords');
  const healthRecords = db.getAll('healthRecords');
  
  const filteredWeights = weightRecords.filter(record => record.goatId !== id);
  const filteredHealth = healthRecords.filter(record => record.goatId !== id);
  
  db.writeTable('weightRecords', filteredWeights);
  db.writeTable('healthRecords', filteredHealth);
  
  return db.delete('goats', id);
});

// Weight records
ipcMain.handle('db:getWeightRecords', () => {
  return db.getAll('weightRecords');
});

ipcMain.handle('db:addWeightRecord', (event, record) => {
  return db.add('weightRecords', record);
});

ipcMain.handle('db:updateWeightRecord', (event, id, updates) => {
  return db.update('weightRecords', id, updates);
});

ipcMain.handle('db:deleteWeightRecord', (event, id) => {
  return db.delete('weightRecords', id);
});

// Health records
ipcMain.handle('db:getHealthRecords', () => {
  return db.getAll('healthRecords');
});

ipcMain.handle('db:addHealthRecord', (event, record) => {
  return db.add('healthRecords', record);
});

ipcMain.handle('db:updateHealthRecord', (event, id, updates) => {
  return db.update('healthRecords', id, updates);
});

ipcMain.handle('db:deleteHealthRecord', (event, id) => {
  return db.delete('healthRecords', id);
});

// Breeding records
ipcMain.handle('db:getBreedingRecords', () => {
  return db.getAll('breedingRecords');
});

ipcMain.handle('db:addBreedingRecord', (event, record) => {
  return db.add('breedingRecords', record);
});

ipcMain.handle('db:updateBreedingRecord', (event, id, updates) => {
  return db.update('breedingRecords', id, updates);
});

ipcMain.handle('db:deleteBreedingRecord', (event, id) => {
  return db.delete('breedingRecords', id);
});

// Data management
ipcMain.handle('db:exportData', () => {
  return db.exportData();
});

ipcMain.handle('db:importData', (event, data) => {
  return db.importData(data);
});

ipcMain.handle('db:clearAll', () => {
  return db.clearAll();
});

// File operations
ipcMain.handle('dialog:showSaveDialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('dialog:showOpenDialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle('fs:writeFile', async (event, filePath, data) => {
  try {
    fs.writeFileSync(filePath, data);
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
});

ipcMain.handle('fs:readFile', async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
});