const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const main=fs.readFileSync(path.join(root,'main.js'),'utf8');
const game=fs.readFileSync(path.join(root,'src/game.js'),'utf8');

test('modo compacto possui altura suficiente para enxergar o combate',()=>{
  assert.match(main,/compact:\s*\{\s*width:\s*920,\s*height:\s*240\s*\}/);
});

test('heróis atacam qualquer inimigo visível à frente',()=>{
  assert.match(game,/target=enemies\.filter\(e=>e\.x>hx\)/);
  assert.doesNotMatch(game,/e\.x-hx<=hero\.range/);
});

test('tiros possuem rastro visível e cercas não são desenhadas',()=>{
  assert.match(game,/moveTo\(b\.x-18/);
  assert.match(game,/wallLevel=S\.upgrades\.walls,w=0/);
});
