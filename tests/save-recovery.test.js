const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync(require.resolve('../src/game.js'),'utf8');

test('carregamento valida coleções de saves antigos antes de usá-las',()=>{
  assert.match(source,/Array\.isArray\(raw\.inventory\)/);
  assert.match(source,/isRecord\(raw\.heroProgress\)/);
  assert.match(source,/isRecord\(raw\.missionSystem\)/);
  assert.match(source,/isRecord\(raw\.equipped\)/);
});

test('save ilegível recebe cópia de recuperação e estado seguro',()=>{
  assert.match(source,/deadshift-save-recovery/);
  assert.match(source,/return hydrate\(\{\}\)/);
});
