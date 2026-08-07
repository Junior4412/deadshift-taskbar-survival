const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const main=fs.readFileSync(path.join(__dirname,'..','main.js'),'utf8');

test('aplicativo mantém apenas uma instância',()=>{
  assert.match(main,/app\.requestSingleInstanceLock\(\)/);
  assert.match(main,/app\.on\('second-instance', restoreWindow\)/);
});

test('janela minimizada é restaurada e trazida à frente',()=>{
  assert.match(main,/if \(win\.isMinimized\(\)\) win\.restore\(\)/);
  assert.match(main,/if \(!win\.isVisible\(\)\) win\.show\(\)/);
  assert.match(main,/win\.moveTop\(\)/);
  assert.match(main,/win\.focus\(\)/);
});

test('ativar pelo Windows restaura a janela',()=>{
  assert.match(main,/app\.on\('activate', restoreWindow\)/);
  assert.match(main,/win\.on\('restore'/);
});
