const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let win;
const sizes = { compact: { width: 920, height: 176 }, expanded: { width: 1120, height: 720 } };

function place(mode = 'compact') {
  const area = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea;
  const s = sizes[mode];
  win.setBounds({ x: area.x + Math.round((area.width - s.width) / 2), y: area.y + area.height - s.height, ...s }, true);
}

function createWindow() {
  win = new BrowserWindow({
    ...sizes.compact, frame: false, transparent: true, resizable: false, alwaysOnTop: true,
    skipTaskbar: false, show: false, backgroundColor: '#00000000',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true }
  });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.once('ready-to-show', async () => {
    const visualTest = process.argv.includes('--screenshot');
    place(visualTest ? 'expanded' : 'compact'); win.show();
    if (visualTest) {
      setTimeout(async () => {
        await win.webContents.executeJavaScript("document.body.className='expanded'; document.querySelector('#dashboard').style.display='flex'; document.querySelector('#combat').style.height='137px'; renderPanel?.('arsenal')").catch(()=>{});
        await new Promise(resolve => setTimeout(resolve, 300));
        const png = (await win.webContents.capturePage()).toPNG();
        fs.writeFileSync(path.join(__dirname, 'outputs', 'visual-test.png'), png);
        app.quit();
      }, 1800);
    }
  });
}

ipcMain.on('window-mode', (_, mode) => place(mode === 'expanded' ? 'expanded' : 'compact'));
ipcMain.on('window-minimize', () => win.minimize());
ipcMain.on('window-close', () => win.close());
ipcMain.on('window-pin', (_, value) => win.setAlwaysOnTop(Boolean(value)));
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
