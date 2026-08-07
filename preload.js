const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('desktop', {
  mode: m => ipcRenderer.send('window-mode', m),
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close'),
  pin: v => ipcRenderer.send('window-pin', v)
});
