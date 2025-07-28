const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations for goats
  getGoats: () => ipcRenderer.invoke('db:getGoats'),
  addGoat: (goat) => ipcRenderer.invoke('db:addGoat', goat),
  updateGoat: (id, updates) => ipcRenderer.invoke('db:updateGoat', id, updates),
  deleteGoat: (id) => ipcRenderer.invoke('db:deleteGoat', id),

  // Database operations for weight records
  getWeightRecords: () => ipcRenderer.invoke('db:getWeightRecords'),
  addWeightRecord: (record) => ipcRenderer.invoke('db:addWeightRecord', record),
  updateWeightRecord: (id, updates) => ipcRenderer.invoke('db:updateWeightRecord', id, updates),
  deleteWeightRecord: (id) => ipcRenderer.invoke('db:deleteWeightRecord', id),

  // Database operations for health records
  getHealthRecords: () => ipcRenderer.invoke('db:getHealthRecords'),
  addHealthRecord: (record) => ipcRenderer.invoke('db:addHealthRecord', record),
  updateHealthRecord: (id, updates) => ipcRenderer.invoke('db:updateHealthRecord', id, updates),
  deleteHealthRecord: (id) => ipcRenderer.invoke('db:deleteHealthRecord', id),

  // Database operations for breeding records
  getBreedingRecords: () => ipcRenderer.invoke('db:getBreedingRecords'),
  addBreedingRecord: (record) => ipcRenderer.invoke('db:addBreedingRecord', record),
  updateBreedingRecord: (id, updates) => ipcRenderer.invoke('db:updateBreedingRecord', id, updates),
  deleteBreedingRecord: (id) => ipcRenderer.invoke('db:deleteBreedingRecord', id),

  // Database operations for finance records
  getFinanceRecords: () => ipcRenderer.invoke('db:getFinanceRecords'),
  addFinanceRecord: (record) => ipcRenderer.invoke('db:addFinanceRecord', record),
  updateFinanceRecord: (id, updates) => ipcRenderer.invoke('db:updateFinanceRecord', id, updates),
  deleteFinanceRecord: (id) => ipcRenderer.invoke('db:deleteFinanceRecord', id),

  // Pedigree operations
  getPedigreeTree: (goatId, generations) => ipcRenderer.invoke('pedigree:getTree', goatId, generations),
  calculateInbreedingRisk: (sireId, damId) => ipcRenderer.invoke('pedigree:calculateInbreedingRisk', sireId, damId),

  // Data management
  exportData: () => ipcRenderer.invoke('db:exportData'),
  importData: (data) => ipcRenderer.invoke('db:importData', data),
  clearAll: () => ipcRenderer.invoke('db:clearAll'),

  // File system operations
  showSaveDialog: (options) => ipcRenderer.invoke('dialog:showSaveDialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('dialog:showOpenDialog', options),
  writeFile: (filePath, data) => ipcRenderer.invoke('fs:writeFile', filePath, data),
  readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),

  // Backup operations
  createBackup: (password) => ipcRenderer.invoke('backup:create', password),
  restoreBackup: (backupId, password) => ipcRenderer.invoke('backup:restore', backupId, password),
  getBackupFiles: () => ipcRenderer.invoke('backup:getFiles'),
  deleteBackup: (backupId) => ipcRenderer.invoke('backup:delete', backupId),
  getBackupSettings: () => ipcRenderer.invoke('backup:getSettings'),
  saveBackupSettings: (settings) => ipcRenderer.invoke('backup:saveSettings', settings),
  selectBackupPath: () => ipcRenderer.invoke('backup:selectPath'),

  // Check if running in Electron
  isElectron: true
});
