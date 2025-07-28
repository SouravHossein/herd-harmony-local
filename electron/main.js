const { app, BrowserWindow, ipcMain, Menu, dialog, shell, Notification } = require('electron');
const path = require('path');
const DatabaseService = require('./services/DatabaseService');
const PedigreeService = require('./services/PedigreeService');
const FileService = require('./services/FileService');
const NotificationService = require('./services/NotificationService');
const BackupService = require('./services/BackupService');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Open DevTools',
          accelerator: 'Ctrl+Shift+I',
          click() {
            mainWindow.webContents.openDevTools();
          }
        },
        {
          label: 'Exit',
          accelerator: 'Ctrl+W',
          click() {
            app.quit();
          }
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);

  const startURL = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
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

// Services
let databaseService;
let pedigreeService;
let fileService;
let notificationService;
let backupService;

// Initialize services
function initializeServices(mainWindow) {
  databaseService = new DatabaseService();
  pedigreeService = new PedigreeService(databaseService);
  fileService = new FileService(mainWindow);
  notificationService = new NotificationService();
  backupService = new BackupService(databaseService);
}

app.whenReady().then(() => {
  createWindow();
  initializeServices(mainWindow);

  // Schedule automatic backups on app start
  backupService.getBackupSettings().then(settings => {
    if (settings.autoBackup) {
      backupService.scheduleAutoBackup(settings);
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Database IPC handlers
ipcMain.handle('db:getGoats', () => databaseService.getAll('goats'));
ipcMain.handle('db:addGoat', (event, goat) => databaseService.add('goats', goat));
ipcMain.handle('db:updateGoat', (event, id, updates) => databaseService.update('goats', id, updates));
ipcMain.handle('db:deleteGoat', (event, id) => databaseService.delete('goats', id));

ipcMain.handle('db:getWeightRecords', () => databaseService.getAll('weightRecords'));
ipcMain.handle('db:addWeightRecord', (event, record) => databaseService.add('weightRecords', record));
ipcMain.handle('db:updateWeightRecord', (event, id, updates) => databaseService.update('weightRecords', id, updates));
ipcMain.handle('db:deleteWeightRecord', (event, id) => databaseService.delete('weightRecords', id));

ipcMain.handle('db:getHealthRecords', () => databaseService.getAll('healthRecords'));
ipcMain.handle('db:addHealthRecord', (event, record) => databaseService.add('healthRecords', record));
ipcMain.handle('db:updateHealthRecord', (event, id, updates) => databaseService.update('healthRecords', id, updates));
ipcMain.handle('db:deleteHealthRecord', (event, id) => databaseService.delete('healthRecords', id));

ipcMain.handle('db:getBreedingRecords', () => databaseService.getAll('breedingRecords'));
ipcMain.handle('db:addBreedingRecord', (event, record) => databaseService.add('breedingRecords', record));
ipcMain.handle('db:updateBreedingRecord', (event, id, updates) => databaseService.update('breedingRecords', id, updates));
ipcMain.handle('db:deleteBreedingRecord', (event, id) => databaseService.delete('breedingRecords', id));

ipcMain.handle('db:getFinanceRecords', () => databaseService.getFinanceRecords());
ipcMain.handle('db:addFinanceRecord', (event, record) => databaseService.addFinanceRecord(record));
ipcMain.handle('db:updateFinanceRecord', (event, id, updates) => databaseService.updateFinanceRecord(id, updates));
ipcMain.handle('db:deleteFinanceRecord', (event, id) => databaseService.deleteFinanceRecord(id));

// Pedigree IPC handlers
ipcMain.handle('pedigree:getTree', async (event, goatId, generations) => {
  return await pedigreeService.getPedigreeTree(goatId, generations);
});

ipcMain.handle('pedigree:calculateInbreedingRisk', async (event, sireId, damId) => {
  return await pedigreeService.calculateInbreedingRisk(sireId, damId);
});

// Data management IPC handlers
ipcMain.handle('db:exportData', () => databaseService.exportData());
ipcMain.handle('db:importData', (event, data) => databaseService.importData(JSON.parse(data)));
ipcMain.handle('db:clearAll', () => databaseService.clearAll());

// File system IPC handlers
ipcMain.handle('dialog:showSaveDialog', (event, options) => fileService.showSaveDialog(options));
ipcMain.handle('dialog:showOpenDialog', (event, options) => fileService.showOpenDialog(options));
ipcMain.handle('fs:writeFile', (event, filePath, data) => fileService.writeFile(filePath, data));
ipcMain.handle('fs:readFile', (event, filePath) => fileService.readFile(filePath));

// Notification IPC handlers
ipcMain.handle('notifications:showNotification', (event, options) => {
  notificationService.showNotification(options);
});

// Backup IPC handlers
ipcMain.handle('backup:create', async (event, password) => {
  return await backupService.createBackup(password);
});

ipcMain.handle('backup:restore', async (event, backupId, password) => {
  return await backupService.restoreBackup(backupId, password);
});

ipcMain.handle('backup:getFiles', async () => {
  return await backupService.getBackupFiles();
});

ipcMain.handle('backup:delete', async (event, backupId) => {
  return await backupService.deleteBackup(backupId);
});

ipcMain.handle('backup:getSettings', async () => {
  return await backupService.getBackupSettings();
});

ipcMain.handle('backup:saveSettings', async (event, settings) => {
  const result = await backupService.saveBackupSettings(settings);
  
  // Schedule automatic backups if enabled
  if (settings.autoBackup) {
    await backupService.scheduleAutoBackup(settings);
  }
  
  return result;
});

ipcMain.handle('backup:selectPath', async () => {
  return await backupService.selectBackupPath(mainWindow);
});
