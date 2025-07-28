
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const DatabaseService = require('./services/DatabaseService');
const PedigreeService = require('./services/PedigreeService');
const FileService = require('./services/FileService');

let db;
let pedigreeService;
let fileService;
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

  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  db = new DatabaseService();
  pedigreeService = new PedigreeService(db);
  fileService = new FileService(mainWindow);
  
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

// Standard database operations
ipcMain.handle('db:getGoats', () => db.getAll('goats'));
ipcMain.handle('db:addGoat', (event, goat) => db.add('goats', goat));
ipcMain.handle('db:updateGoat', (event, id, updates) => db.update('goats', id, updates));
ipcMain.handle('db:deleteGoat', (event, id) => {
  const weightRecords = db.getAll('weightRecords');
  const healthRecords = db.getAll('healthRecords');
  const filteredWeights = weightRecords.filter(record => record.goatId !== id);
  const filteredHealth = healthRecords.filter(record => record.goatId !== id);
  db.writeTable('weightRecords', filteredWeights);
  db.writeTable('healthRecords', filteredHealth);
  return db.delete('goats', id);
});

ipcMain.handle('db:getWeightRecords', () => db.getAll('weightRecords'));
ipcMain.handle('db:addWeightRecord', (event, record) => db.add('weightRecords', record));
ipcMain.handle('db:updateWeightRecord', (event, id, updates) => db.update('weightRecords', id, updates));
ipcMain.handle('db:deleteWeightRecord', (event, id) => db.delete('weightRecords', id));

ipcMain.handle('db:getHealthRecords', () => db.getAll('healthRecords'));
ipcMain.handle('db:addHealthRecord', (event, record) => db.add('healthRecords', record));
ipcMain.handle('db:updateHealthRecord', (event, id, updates) => db.update('healthRecords', id, updates));
ipcMain.handle('db:deleteHealthRecord', (event, id) => db.delete('healthRecords', id));

ipcMain.handle('db:getBreedingRecords', () => db.getAll('breedingRecords'));
ipcMain.handle('db:addBreedingRecord', (event, record) => db.add('breedingRecords', record));
ipcMain.handle('db:updateBreedingRecord', (event, id, updates) => db.update('breedingRecords', id, updates));
ipcMain.handle('db:deleteBreedingRecord', (event, id) => db.delete('breedingRecords', id));

// Pedigree operations
ipcMain.handle('pedigree:getTree', (event, goatId, generations) => 
  pedigreeService.getPedigreeTree(goatId, generations)
);
ipcMain.handle('pedigree:calculateInbreedingRisk', (event, sireId, damId) => 
  pedigreeService.calculateInbreedingRisk(sireId, damId)
);

// Data management
ipcMain.handle('db:exportData', () => db.exportData());
ipcMain.handle('db:importData', (event, data) => db.importData(data));
ipcMain.handle('db:clearAll', () => db.clearAll());

// File operations
ipcMain.handle('dialog:showSaveDialog', async (event, options) => fileService.showSaveDialog(options));
ipcMain.handle('dialog:showOpenDialog', async (event, options) => fileService.showOpenDialog(options));
ipcMain.handle('fs:writeFile', async (event, filePath, data) => fileService.writeFile(filePath, data));
ipcMain.handle('fs:readFile', async (event, filePath) => fileService.readFile(filePath));
