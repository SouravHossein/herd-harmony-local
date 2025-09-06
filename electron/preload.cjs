
const { contextBridge, ipcRenderer } = require('electron');

console.log('Exposing electronAPI to main ...');
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

  // Database operations for feeds
  getFeeds: () => ipcRenderer.invoke('db:getFeeds'),
  addFeed: (feed) => ipcRenderer.invoke('db:addFeed', feed),
  updateFeed: (id, updates) => ipcRenderer.invoke('db:updateFeed', id, updates),
  deleteFeed: (id) => ipcRenderer.invoke('db:deleteFeed', id),

  // Database operations for feed plans
  getFeedPlans: () => ipcRenderer.invoke('db:getFeedPlans'),
  addFeedPlan: (plan) => ipcRenderer.invoke('db:addFeedPlan', plan),
  updateFeedPlan: (id, updates) => ipcRenderer.invoke('db:updateFeedPlan', id, updates),
  deleteFeedPlan: (id) => ipcRenderer.invoke('db:deleteFeedPlan', id),

  // Database operations for feed logs
  getFeedLogs: () => ipcRenderer.invoke('db:getFeedLogs'),
  addFeedLog: (log) => ipcRenderer.invoke('db:addFeedLog', log),
  updateFeedLog: (id, updates) => ipcRenderer.invoke('db:updateFeedLog', id, updates),
  deleteFeedLog: (id) => ipcRenderer.invoke('db:deleteFeedLog', id),

  // Pedigree operations
  getPedigreeTree: (goatId, generations) => ipcRenderer.invoke('pedigree:getTree', goatId, generations),
  calculateInbreedingRisk: (sireId, damId) => ipcRenderer.invoke('pedigree:calculateInbreedingRisk', sireId, damId),
  




  // Data management
  exportData: () => ipcRenderer.invoke('db:exportData'),
  importData: (data) => ipcRenderer.invoke('db:importData', data),
  clearAll: () => ipcRenderer.invoke('db:clearAll'),



  // Backup operations
  createBackup: (password) => ipcRenderer.invoke('backup:create', password),
  restoreBackup: (backupId, password) => ipcRenderer.invoke('backup:restore', backupId, password),
  getBackupFiles: () => ipcRenderer.invoke('backup:getFiles'),
  deleteBackup: (backupId) => ipcRenderer.invoke('backup:delete', backupId),
  getBackupSettings: () => ipcRenderer.invoke('backup:getSettings'),
  saveBackupSettings: (settings) => ipcRenderer.invoke('backup:saveSettings', settings),
  selectBackupPath: () => ipcRenderer.invoke('backup:selectPath'),

  
  
  
  getMediaByGoatId: (goatId) => ipcRenderer.invoke('media:getByGoatId', goatId),
  getThumbnails: () => ipcRenderer.invoke('media:get-thumbnails'),
  addMediaViaDialog: (goatId, category, description, tags) => ipcRenderer.invoke('media:add-via-dialog', goatId, category, description, tags),
  uploadStart: (meta) => ipcRenderer.invoke('media:upload-start', meta),
  uploadChunk: (uploadId, chunk) => ipcRenderer.send('media:upload-chunk', uploadId, chunk),
  uploadComplete: (uploadId) => ipcRenderer.invoke('media:upload-complete', uploadId),
  updateMedia: (id, updates) => ipcRenderer.invoke('media:update', id, updates),
  deleteMedia: (id) => ipcRenderer.invoke('media:delete', id),
  setPrimaryMedia: (goatId, mediaId) => ipcRenderer.invoke('media:set-primary', goatId, mediaId),
  downloadMedia: (mediaId) => ipcRenderer.invoke('media:download', mediaId),
  getMediaFilePath: (mediaId) => ipcRenderer.invoke('media:get-file-path', mediaId),
  openMediaFile: (mediaId) => ipcRenderer.invoke('media:open-file', mediaId),
  revealMediaFileInFolder: (mediaId) => ipcRenderer.invoke('media:reveal-file', mediaId),
  
  // file helpers (optional)
  showSaveDialog: (opts) => ipcRenderer.invoke('file:showSaveDialog', opts),
  showOpenDialog: (opts) => ipcRenderer.invoke('file:showOpenDialog', opts),
  writeFile: (p, data) => ipcRenderer.invoke('file:write', p, data),
  readFile: (p) => ipcRenderer.invoke('file:read', p),
  deleteFile: (p) => ipcRenderer.invoke('file:delete', p),
  
  // Check if running in Electron
  isElectron: true,


});
