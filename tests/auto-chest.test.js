const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const R=require('../src/rune-system');
const game=fs.readFileSync(path.join(__dirname,'..','src','game.js'),'utf8');

test('árvore possui habilidade de abertura automática de baús',()=>{
  let rune=R.node('autochest1');
  assert.ok(rune);
  assert.equal(rune.max,1);
  assert.deepEqual(rune.requires,['chest1']);
});

test('bônus só ativa depois de comprar a chave mestra',()=>{
  let state={runes:{chest1:1},runePoints:8};
  assert.equal(R.bonuses(state).autoChest,0);
  assert.equal(R.buy(state,'autochest1'),true);
  assert.equal(R.bonuses(state).autoChest,1);
});

test('automação prioriza os melhores baús e recicla excedentes',()=>{
  assert.match(game,/S\.chests\.outbreak\?'outbreak':S\.chests\.military/);
  assert.match(game,/openChest\(tier,true\)/);
  assert.match(game,/limitInventory\(60,silent\)/);
  assert.match(game,/recycleOverflow/);
});
