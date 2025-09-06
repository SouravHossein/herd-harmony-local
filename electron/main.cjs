const { app, BrowserWindow, ipcMain, Menu, dialog, shell, Notification, protocol } = require('electron');
const path = require('path');
const fs = require('fs');
const util = require('util');
const {getMimeType} = require('./helpers/mime.cjs');

// --- Log to file ---
const logDir = app.getPath('userData');
const logFile = path.join(logDir, 'electron.log');

// Function to clear the log file
function clearLogFile() {
  try {
    fs.writeFileSync(logFile, '');
    console.log('Log file cleared.');
  } catch (err) {
    console.error('Failed to clear log file:', err);
  }
}

// Clear the log file at the start of the application
clearLogFile();

const logStream = fs.createWriteStream(logFile, { flags: 'a' });

console.log = (...args) => {
  logStream.write(util.format(...args) + '\n');
  process.stdout.write(util.format(...args) + '\n');
};
console.error = (...args) => {
  logStream.write(util.format('ERROR:', ...args) + '\n');
  process.stderr.write(util.format('ERROR:', ...args) + '\n');
};
console.warn = (...args) => {
  logStream.write(util.format('WARN:', ...args) + '\n');
  process.stdout.write(util.format('WARN:', ...args) + '\n');
};

const DatabaseService = require('./services/databaseService.cjs');

const PedigreeService = require('./services/PedigreeService.cjs');
const FileService = require('./services/fileService.cjs');
const NotificationService = require('./services/NotificationService.cjs');
const BackupService = require('./services/BackupService.cjs');
const MediaService = require('./services/mediaService.cjs');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

const isDev = true
let mainWindow;

// --- Service Instances ---
let databaseService;
let pedigreeService;
let fileService;
let notificationService;
let backupService;

function initializeServices(mainWindow) {
  databaseService = new DatabaseService();
  pedigreeService = new PedigreeService(databaseService);
  fileService = new FileService(mainWindow);
  notificationService = new NotificationService();
  backupService = new BackupService(databaseService);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: 'File',
  //     submenu: [
  //       {
  //         label: 'Open DevTools',
  //         accelerator: 'Ctrl+Shift+I',
  //         click: () => mainWindow.webContents.openDevTools(),
  //       },
  //       { label: 'Exit', accelerator: 'Ctrl+W', click: () => app.quit() },
  //     ],
  //   },
  // ]);
  // Menu.setApplicationMenu(menu);

if (isDev) {
  // ✅ Load Vite Dev Server during development
  mainWindow.loadURL('http://localhost:8080');
  mainWindow.webContents.openDevTools();
} else {
  // ✅ Load built app in production
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
}

// ✅ Ensure external links open in default browser in both modes
mainWindow.webContents.setWindowOpenHandler((details) => {
  shell.openExternal(details.url);
  return { action: 'deny' };
});

}

const MEDIA_ROOT = () => path.join(app.getPath('userData'), 'goat-tracker-media');
// --- App Lifecycle ---
app.whenReady().then(() => {
  createWindow();
  initializeServices(mainWindow);

protocol.registerFileProtocol('app', (request, callback) => {
    try {
      const url = decodeURIComponent(request.url.replace('app://', ''));
      // prevent path traversal
      const safe = path.normalize(url).replace(/^(\.\.(\/|\\|$))+/, '');
      const mediaRoot = path.join(app.getPath('userData'), 'goat-tracker-media');
      const filePath = path.join(mediaRoot, safe);
      callback({ path: filePath });
    } catch (err) {
      console.error('app protocol error', err);
      callback({ error: -6 }); // FILE_NOT_FOUND
    }
  });

  // Auto backup scheduling
  backupService.getBackupSettings().then(settings => {
    if (settings?.autoBackup) backupService.scheduleAutoBackup(settings);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
// Database IPC handlers
ipcMain.handle('db:getGoats', async () => {
  const goats = await databaseService.getAll('goats');
  if (!goats) return [];
  return goats
});
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

// Feed management IPC handlers
ipcMain.handle('db:getFeeds', () => databaseService.getFeeds());
ipcMain.handle('db:addFeed', (event, feed) => databaseService.addFeed(feed));
ipcMain.handle('db:updateFeed', (event, id, updates) => databaseService.updateFeed(id, updates));
ipcMain.handle('db:deleteFeed', (event, id) => databaseService.deleteFeed(id));

ipcMain.handle('db:getFeedPlans', () => databaseService.getFeedPlans());
ipcMain.handle('db:addFeedPlan', (event, plan) => databaseService.addFeedPlan(plan));
ipcMain.handle('db:updateFeedPlan', (event, id, updates) => databaseService.updateFeedPlan(id, updates));
ipcMain.handle('db:deleteFeedPlan', (event, id) => databaseService.deleteFeedPlan(id));

ipcMain.handle('db:getFeedLogs', () => databaseService.getFeedLogs());
ipcMain.handle('db:addFeedLog', (event, log) => databaseService.addFeedLog(log));
ipcMain.handle('db:updateFeedLog', (event, id, updates) => databaseService.updateFeedLog(id, updates));
ipcMain.handle('db:deleteFeedLog', (event, id) => databaseService.deleteFeedLog(id));

// Load services after app ready (they use app.getPath)

// -------------------- IPC handlers (delegate to mediaService) --------------------
ipcMain.handle('media:add-via-dialog', async (event, goatId, category, description, tags) => {
  return await MediaService.addViaDialog(goatId, category, description, tags);
});

ipcMain.handle('media:upload-start', async (event, meta) => {
  return await MediaService.uploadStart(meta);
});

ipcMain.on('media:upload-chunk', (event, uploadId, chunk) => {
  MediaService.uploadChunk(uploadId, chunk);
});

ipcMain.handle('media:upload-complete', async (event, uploadId) => {
  return await MediaService.uploadComplete(uploadId);
});

ipcMain.handle('media:getByGoatId', async (event, goatId) => {
  return await MediaService.getByGoatId(goatId);
});

ipcMain.handle('media:update', async (event, id, updates) => {
  return await MediaService.updateMedia(id, updates);
});

ipcMain.handle('media:delete', async (event, id) => {
  return await MediaService.deleteMedia(id);
});

ipcMain.handle('media:set-primary', async (event, goatId, mediaId) => {
  return await MediaService.setPrimary(goatId, mediaId);
});

ipcMain.handle('media:download', async (event, mediaId) => {
  return await MediaService.downloadMedia(mediaId);
});

ipcMain.handle('media:get-file-path', async (event, mediaId) => {
  return await MediaService.getMediaFilePath(mediaId);
});

ipcMain.handle('media:open-file', async (event, mediaId) => {
  return await MediaService.openMediaFile(mediaId);
});

ipcMain.handle('media:reveal-file', async (event, mediaId) => {
  return await MediaService.revealMediaFileInFolder(mediaId);
});
ipcMain.handle('media:get-thumbnails', async () => {
  return await MediaService.getThumbnails();
});

// ----------------- Optional: expose file helpers for read/write -----------------
ipcMain.handle('file:showSaveDialog', (event, opts) => dialog.showSaveDialog(opts));
ipcMain.handle('file:showOpenDialog', (event, opts) => dialog.showOpenDialog(opts));
ipcMain.handle('file:write', (event, filePath, data) => {
  try { fs.writeFileSync(filePath, data); return true; } catch (e) { console.error(e); return false; }
});
ipcMain.handle('file:read', (event, filePath) => {
  try { return fs.readFileSync(filePath, 'utf8'); } catch (e) { console.error(e); return null; }
});
ipcMain.handle('file:delete', (event, filePath) => {
  try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); return true; } catch (e) { console.error(e); return false; }
});
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

ipcMain.handle('logs:get', async () => {
  try {
    return fs.readFileSync(logFile, 'utf8');
  } catch (e) {
    console.error(e);
    return null;
  }
});
