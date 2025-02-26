const { app, BrowserWindow, ipcMain } = require('electron');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1150,
    height: 750,
    resize: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('../dist/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 处理读取数据库的请求
ipcMain.handle('read-database', () => {
  const dbPath = join(__dirname, 'logDatabase.json');
  try {
    const data = readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
});

// 处理写入数据库的请求
ipcMain.handle('write-database', (event, data) => {
  const dbPath = join(__dirname, 'logDatabase.json');
  try {
    writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
  }
});