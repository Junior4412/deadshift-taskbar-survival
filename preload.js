const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('desktop', {
  mode: m => ipcRenderer.send('window-mode', m),
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close'),
  pin: v => ipcRenderer.send('window-pin', v),
  autoUpdate: v => ipcRenderer.send('set-auto-update', v),
  version: () => ipcRenderer.invoke('app-version'),
  checkUpdate: () => ipcRenderer.invoke('check-update'),
  onUpdate: callback => ipcRenderer.on('update-status', (_, data) => callback(data)),
  installUpdate: () => ipcRenderer.send('install-update'),
  exportSave: content => ipcRenderer.invoke('save-export', content),
  importSave: () => ipcRenderer.invoke('save-import')
});
