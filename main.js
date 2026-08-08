const { app, BrowserWindow, ipcMain, screen, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let win;
let updateCheckInFlight = false;
let updatePollTimer = null;
let automaticUpdatesEnabled = true;
const UPDATE_POLL_INTERVAL = 5 * 60 * 1000;
const sizes = { compact: { width: 920, height: 240 }, expanded: { width: 1120, height: 720 } };
const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) app.quit();

function restoreWindow() {
  if (!win || win.isDestroyed()) return;
  if (win.isMinimized()) win.restore();
  const bounds = win.getBounds();
  const visible = screen.getAllDisplays().some(display => {
    const area = display.workArea;
    return bounds.x < area.x + area.width && bounds.x + bounds.width > area.x && bounds.y < area.y + area.height && bounds.y + bounds.height > area.y;
  });
  if (!visible) place('compact');
  if (!win.isVisible()) win.show();
  win.setOpacity(1);
  win.setSkipTaskbar(false);
  win.setAlwaysOnTop(win.isAlwaysOnTop(), 'floating');
  win.moveTop();
  win.focus();
  win.flashFrame(false);
}

function place(mode = 'compact') {
  const area = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea;
  const s = sizes[mode];
  win.setBounds({ x: area.x + Math.round((area.width - s.width) / 2), y: area.y + area.height - s.height, ...s }, true);
}

function createWindow() {
  let launchFinished = false;
  win = new BrowserWindow({
    ...sizes.compact, frame: false, transparent: false, resizable: false, alwaysOnTop: true,
    skipTaskbar: false, show: true, backgroundColor: '#080d0b', paintWhenInitiallyHidden: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, backgroundThrottling: false }
  });
  place('compact');
  win.setOpacity(1);
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.webContents.on('console-message', (_, level, message, line, sourceId) => {
    if (level >= 2) console.error(`[renderer] ${message} (${sourceId}:${line})`);
  });
  win.webContents.on('render-process-gone', (_, details) => console.error('[renderer-gone]', details));
  win.on('restore', () => setTimeout(restoreWindow, 30));
  win.on('show', () => win.setSkipTaskbar(false));
  const finishLaunch = async () => {
    if (launchFinished || !win || win.isDestroyed()) return;
    launchFinished = true;
    const visualTest = process.argv.includes('--screenshot');
    place(visualTest ? 'expanded' : 'compact');
    win.setOpacity(1);
    win.show();
    win.setSkipTaskbar(false);
    win.focus();
    if (visualTest) {
      setTimeout(async () => {
        await win.webContents.executeJavaScript("document.body.className='expanded'; document.querySelector('#dashboard').style.display='flex'; document.querySelector('#combat').style.height='137px'; window.__seedVisualTest?.(); document.querySelector('[data-tab=squad]')?.click(); window.__showOfflineTest?.()").catch(()=>{});
        await new Promise(resolve => setTimeout(resolve, 300));
        const png = (await win.webContents.capturePage()).toPNG();
        fs.writeFileSync(path.join(__dirname, 'outputs', 'visual-test.png'), png);
        app.quit();
      }, 1800);
    }
  };
  win.once('ready-to-show', finishLaunch);
  win.webContents.once('did-finish-load', () => setTimeout(finishLaunch, 50));
  win.webContents.on('did-fail-load', () => { launchFinished = false; win.loadFile(path.join(__dirname, 'src', 'index.html')); });
  win.on('unresponsive', () => { if (!win.isDestroyed()) win.webContents.reload(); });
  setTimeout(finishLaunch, 1800);
}

function updateStatus(status, detail = '') {
  if (win && !win.isDestroyed()) win.webContents.send('update-status', { status, detail });
}

async function checkUpdatesSafely() {
  if (!automaticUpdatesEnabled || !app.isPackaged || updateCheckInFlight) return;
  updateCheckInFlight = true;
  try {
    await autoUpdater.checkForUpdates();
  } catch {
    updateCheckInFlight = false;
    updateStatus('error', 'Servidor de atualização temporariamente indisponível.');
  }
}

function configureUpdates() {
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => { updateCheckInFlight = true; updateStatus('checking'); });
  autoUpdater.on('update-available', info => { updateCheckInFlight = true; updateStatus('downloading', info.version); });
  autoUpdater.on('update-not-available', () => { updateCheckInFlight = false; updateStatus('current', app.getVersion()); });
  autoUpdater.on('download-progress', p => updateStatus('progress', String(Math.round(p.percent))));
  autoUpdater.on('update-downloaded', info => {
    updateCheckInFlight = false;
    updateStatus('ready', info.version);
    setTimeout(() => {
      updateStatus('installing', info.version);
      autoUpdater.quitAndInstall(true, true);
    }, 3000);
  });
  autoUpdater.on('error', () => { updateCheckInFlight = false; updateStatus('error', 'Servidor de atualização temporariamente indisponível.'); });
  setTimeout(checkUpdatesSafely, 3500);
  updatePollTimer = setInterval(checkUpdatesSafely, UPDATE_POLL_INTERVAL);
}

ipcMain.on('window-mode', (_, mode) => place(mode === 'expanded' ? 'expanded' : 'compact'));
ipcMain.on('window-minimize', () => { if (win && !win.isDestroyed()) win.minimize(); });
ipcMain.on('window-close', () => win.close());
ipcMain.on('window-pin', (_, value) => win.setAlwaysOnTop(Boolean(value)));
ipcMain.on('set-auto-update', (_, value) => {
  automaticUpdatesEnabled = Boolean(value);
  if (updatePollTimer) clearInterval(updatePollTimer);
  updatePollTimer = automaticUpdatesEnabled ? setInterval(checkUpdatesSafely, UPDATE_POLL_INTERVAL) : null;
  updateStatus('current', app.getVersion());
  if (automaticUpdatesEnabled) checkUpdatesSafely();
});
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
app.on('second-instance', restoreWindow);
app.whenReady().then(() => { if (hasSingleInstanceLock) { createWindow(); configureUpdates(); } });
app.on('activate', restoreWindow);
app.on('window-all-closed', () => app.quit());
app.on('before-quit', () => { if (updatePollTimer) clearInterval(updatePollTimer); });
