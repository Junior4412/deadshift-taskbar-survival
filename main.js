const { app, BrowserWindow, ipcMain, screen, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let win;
let updateCheckInFlight = false;
const sizes = { compact: { width: 920, height: 240 }, expanded: { width: 1120, height: 720 } };

function place(mode = 'compact') {
  const area = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea;
  const s = sizes[mode];
  win.setBounds({ x: area.x + Math.round((area.width - s.width) / 2), y: area.y + area.height - s.height, ...s }, true);
}

function createWindow() {
  win = new BrowserWindow({
    ...sizes.compact, frame: false, transparent: true, resizable: false, alwaysOnTop: true,
    skipTaskbar: false, show: false, backgroundColor: '#00000000',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, backgroundThrottling: false }
  });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.once('ready-to-show', async () => {
    const visualTest = process.argv.includes('--screenshot');
    place(visualTest ? 'expanded' : 'compact'); win.show();
    if (visualTest) {
      setTimeout(async () => {
        await win.webContents.executeJavaScript("document.body.className='expanded'; document.querySelector('#dashboard').style.display='flex'; document.querySelector('#combat').style.height='137px'; window.__seedVisualTest?.(); document.querySelector('[data-tab=squad]')?.click(); window.__showOfflineTest?.()").catch(()=>{});
        await new Promise(resolve => setTimeout(resolve, 300));
        const png = (await win.webContents.capturePage()).toPNG();
        fs.writeFileSync(path.join(__dirname, 'outputs', 'visual-test.png'), png);
        app.quit();
      }, 1800);
    }
  });
}

function updateStatus(status, detail = '') {
  if (win && !win.isDestroyed()) win.webContents.send('update-status', { status, detail });
}

function configureUpdates() {
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => { updateCheckInFlight = true; updateStatus('checking'); });
  autoUpdater.on('update-available', info => { updateCheckInFlight = false; updateStatus('downloading', info.version); });
  autoUpdater.on('update-not-available', () => { updateCheckInFlight = false; updateStatus('current', app.getVersion()); });
  autoUpdater.on('download-progress', p => updateStatus('progress', String(Math.round(p.percent))));
  autoUpdater.on('update-downloaded', info => {
    updateStatus('ready', info.version);
    setTimeout(() => {
      updateStatus('installing', info.version);
      autoUpdater.quitAndInstall(true, true);
    }, 3000);
  });
  autoUpdater.on('error', () => { updateCheckInFlight = false; updateStatus('error', 'Servidor de atualização temporariamente indisponível.'); });
  setTimeout(() => autoUpdater.checkForUpdates().catch(() => updateStatus('error', 'Servidor de atualização temporariamente indisponível.')), 3500);
}

ipcMain.on('window-mode', (_, mode) => place(mode === 'expanded' ? 'expanded' : 'compact'));
ipcMain.on('window-minimize', () => win.minimize());
ipcMain.on('window-close', () => win.close());
ipcMain.on('window-pin', (_, value) => win.setAlwaysOnTop(Boolean(value)));
ipcMain.on('install-update', () => autoUpdater.quitAndInstall(true, true));
ipcMain.handle('app-version', () => app.getVersion());
ipcMain.handle('check-update', async () => {
  if (!app.isPackaged) return { status: 'current', detail: app.getVersion() };
  if (updateCheckInFlight) return { status: 'checking' };
  updateCheckInFlight = true;
  updateStatus('checking');
  try {
    await autoUpdater.checkForUpdates();
    return { status: 'started' };
  } catch (error) {
    updateCheckInFlight = false;
    updateStatus('error', 'Não foi possível consultar as atualizações agora.');
    throw error;
  }
});
ipcMain.handle('save-export',async(_,content)=>{let result=await dialog.showSaveDialog(win,{title:'Compartilhar save do Deadshift',defaultPath:`Deadshift-Save-${new Date().toISOString().slice(0,10)}.deadshift`,filters:[{name:'Save do Deadshift',extensions:['deadshift']},{name:'JSON',extensions:['json']}]});if(result.canceled||!result.filePath)return null;fs.writeFileSync(result.filePath,content,'utf8');return result.filePath});
ipcMain.handle('save-import',async()=>{let result=await dialog.showOpenDialog(win,{title:'Importar save do Deadshift',properties:['openFile'],filters:[{name:'Save do Deadshift',extensions:['deadshift','json']}]});if(result.canceled||!result.filePaths[0])return null;return fs.readFileSync(result.filePaths[0],'utf8')});
app.whenReady().then(() => { createWindow(); configureUpdates(); });
app.on('window-all-closed', () => app.quit());
