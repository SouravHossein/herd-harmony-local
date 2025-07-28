
const crypto = require('crypto');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const { app, dialog } = require('electron');

class BackupService {
  constructor(databaseService) {
    this.databaseService = databaseService;
    this.userDataPath = app.getPath('userData');
    this.backupDir = path.join(this.userDataPath, 'backups');
    this.settingsFile = path.join(this.userDataPath, 'backup-settings.json');
    this.ensureBackupDir();
  }

  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  generateBackupFilename() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    return `goat-backup-${timestamp}.goatbackup`;
  }

  encrypt(data, password) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(password, 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key);
    cipher.setAutoPadding(true);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      iv: iv.toString('hex'),
      data: encrypted
    };
  }

  decrypt(encryptedData, password) {
    try {
      const algorithm = 'aes-256-cbc';
      const key = crypto.scryptSync(password, 'salt', 32);
      
      const decipher = crypto.createDecipher(algorithm, key);
      decipher.setAutoPadding(true);
      
      let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error('Invalid password or corrupted backup file');
    }
  }

  async createBackup(password, customPath = null) {
    try {
      // Export all data
      const exportData = this.databaseService.exportData();
      
      // Add finance records to export
      exportData.financeRecords = this.databaseService.getFinanceRecords();
      
      // Convert to JSON string
      const jsonData = JSON.stringify(exportData, null, 2);
      
      // Compress data
      const compressed = zlib.gzipSync(jsonData);
      
      // Encrypt compressed data
      const encrypted = this.encrypt(compressed.toString('base64'), password);
      
      // Create backup file content
      const backupContent = JSON.stringify({
        version: '1.0',
        timestamp: new Date().toISOString(),
        ...encrypted
      });
      
      // Generate filename and path
      const filename = this.generateBackupFilename();
      const backupPath = customPath || this.backupDir;
      const fullPath = path.join(backupPath, filename);
      
      // Write backup file
      fs.writeFileSync(fullPath, backupContent);
      
      // Clean up old backups
      await this.cleanupOldBackups();
      
      return {
        success: true,
        filename,
        path: fullPath,
        size: fs.statSync(fullPath).size
      };
    } catch (error) {
      console.error('Backup creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async restoreBackup(backupId, password) {
    try {
      // Find backup file
      const backupFiles = await this.getBackupFiles();
      const backupFile = backupFiles.find(f => f.id === backupId);
      
      if (!backupFile) {
        throw new Error('Backup file not found');
      }
      
      // Read backup file
      const backupContent = fs.readFileSync(backupFile.path, 'utf8');
      const backupData = JSON.parse(backupContent);
      
      // Decrypt data
      const decrypted = this.decrypt(backupData, password);
      
      // Decompress data
      const decompressed = zlib.gunzipSync(Buffer.from(decrypted, 'base64'));
      
      // Parse JSON
      const importData = JSON.parse(decompressed.toString());
      
      // Validate data structure
      if (!importData.goats || !Array.isArray(importData.goats)) {
        throw new Error('Invalid backup file format');
      }
      
      // Import data
      const success = this.databaseService.importData(importData);
      
      if (!success) {
        throw new Error('Failed to import data');
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Backup restore failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getBackupFiles() {
    try {
      const files = fs.readdirSync(this.backupDir);
      const backupFiles = [];
      
      for (const file of files) {
        if (file.endsWith('.goatbackup')) {
          const filePath = path.join(this.backupDir, file);
          const stats = fs.statSync(filePath);
          
          backupFiles.push({
            id: file,
            filename: file,
            timestamp: stats.mtime,
            size: stats.size,
            path: filePath
          });
        }
      }
      
      // Sort by timestamp, newest first
      backupFiles.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return backupFiles;
    } catch (error) {
      console.error('Error getting backup files:', error);
      return [];
    }
  }

  async deleteBackup(backupId) {
    try {
      const backupFiles = await this.getBackupFiles();
      const backupFile = backupFiles.find(f => f.id === backupId);
      
      if (!backupFile) {
        throw new Error('Backup file not found');
      }
      
      fs.unlinkSync(backupFile.path);
      return true;
    } catch (error) {
      console.error('Error deleting backup:', error);
      return false;
    }
  }

  async cleanupOldBackups() {
    try {
      const settings = await this.getBackupSettings();
      const backupFiles = await this.getBackupFiles();
      
      if (backupFiles.length > settings.keepVersions) {
        const filesToDelete = backupFiles.slice(settings.keepVersions);
        
        for (const file of filesToDelete) {
          try {
            fs.unlinkSync(file.path);
          } catch (error) {
            console.error('Error deleting old backup:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up old backups:', error);
    }
  }

  async getBackupSettings() {
    try {
      if (fs.existsSync(this.settingsFile)) {
        const data = fs.readFileSync(this.settingsFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading backup settings:', error);
    }
    
    // Default settings
    return {
      autoBackup: false,
      schedule: 'weekly',
      keepVersions: 5,
      backupPath: this.backupDir
    };
  }

  async saveBackupSettings(settings) {
    try {
      fs.writeFileSync(this.settingsFile, JSON.stringify(settings, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving backup settings:', error);
      return false;
    }
  }

  async selectBackupPath(mainWindow) {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Select Backup Folder'
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      return {
        path: result.filePaths[0]
      };
    }
    
    return { canceled: true };
  }

  // Schedule automatic backups
  async scheduleAutoBackup(settings) {
    if (!settings.autoBackup) return;
    
    const now = new Date();
    let nextBackup;
    
    if (settings.schedule === 'daily') {
      nextBackup = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    } else if (settings.schedule === 'weekly') {
      nextBackup = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else {
      return; // Manual only
    }
    
    const timeUntilBackup = nextBackup.getTime() - now.getTime();
    
    setTimeout(async () => {
      // Create automatic backup with a default password (you might want to handle this differently)
      const result = await this.createBackup('auto-backup-' + Date.now());
      
      if (result.success) {
        console.log('Automatic backup created:', result.filename);
        // Schedule next backup
        this.scheduleAutoBackup(settings);
      }
    }, timeUntilBackup);
  }
}

module.exports = BackupService;
