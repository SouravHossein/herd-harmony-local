
const { dialog } = require('electron');
const fs = require('fs');

class FileService {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  async showSaveDialog(options) {
    const result = await dialog.showSaveDialog(this.mainWindow, options);
    return result;
  }

  async showOpenDialog(options) {
    const result = await dialog.showOpenDialog(this.mainWindow, options);
    return result;
  }

  async writeFile(filePath, data) {
    try {
      fs.writeFileSync(filePath, data);
      return true;
    } catch (error) {
      console.error('Error writing file:', error);
      return false;
    }
  }

  async readFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return data;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }
}

module.exports = FileService;
