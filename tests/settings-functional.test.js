const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const main=fs.readFileSync(path.join(root,'main.js'),'utf8');
const preload=fs.readFileSync(path.join(root,'preload.js'),'utf8');
const game=fs.readFileSync(path.join(root,'src/game.js'),'utf8');
const css=fs.readFileSync(path.join(root,'src/style.css'),'utf8');

test('atualização automática controla o processo principal',()=>{
  assert.match(main,/automaticUpdatesEnabled/);
  assert.match(main,/ipcMain\.on\('set-auto-update'/);
  assert.match(preload,/autoUpdate: v => ipcRenderer\.send\('set-auto-update'/);
  assert.match(game,/window\.desktop\?\.autoUpdate\(toggle\.checked\)/);
});

test('opções utilizam evento de mudança e salvam imediatamente',()=>{
  assert.match(game,/addEventListener\('change'/);
  assert.match(game,/S\.settings\[key\]=toggle\.checked/);
  assert.match(game,/save\(\);toast/);
});

test('números de dano e controles gráficos obedecem às opções',()=>{
  assert.match(game,/if\(!S\.settings\.showDamage\)return/);
  assert.match(game,/classList\.toggle\('reduced-effects'/);
  assert.match(css,/\.setting-row input\{display:block/);
});
