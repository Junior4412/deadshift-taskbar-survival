const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const main=fs.readFileSync(path.join(root,'main.js'),'utf8');
const preload=fs.readFileSync(path.join(root,'preload.js'),'utf8');
const game=fs.readFileSync(path.join(root,'src','game.js'),'utf8');

test('botão solicita verificação manual ao processo principal',()=>{
  assert.match(preload,/checkUpdate: \(\) => ipcRenderer\.invoke\('check-update'\)/);
  assert.match(main,/ipcMain\.handle\('check-update'/);
  assert.match(main,/autoUpdater\.checkForUpdates\(\)/);
  assert.match(game,/window\.desktop\.checkUpdate\(\)/);
});

test('verificação manual informa progresso e permite tentar novamente',()=>{
  assert.match(game,/VERIFICANDO\.\.\./);
  assert.match(game,/ERRO · TENTAR NOVAMENTE/);
  assert.match(game,/Clique para procurar uma nova versão/);
  assert.match(main,/updateCheckInFlight/);
});
