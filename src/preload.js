const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  readDatabase: () => ipcRenderer.invoke('read-database'),
  writeDatabase: (data) => ipcRenderer.invoke('write-database', data),
});