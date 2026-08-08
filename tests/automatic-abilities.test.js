const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const game=fs.readFileSync(require.resolve('../src/game.js'),'utf8');
const css=fs.readFileSync(require.resolve('../src/style.css'),'utf8');

test('todas as habilidades dos heróis ativos são executadas automaticamente',()=>{
  assert.match(game,/abilities\.forEach\(\(a,index\)/);
  assert.doesNotMatch(game,/abilities\.slice\(1\)\.forEach/);
});

test('barra automática fica na lateral direita do combate',()=>{
  assert.match(css,/#ability-bar\{left:auto;right:7px;top:8px/);
  assert.match(css,/flex-direction:column/);
  assert.match(css,/content:'AUTO'/);
});
