const test=require('node:test');
const assert=require('node:assert/strict');
const R=require('../src/rune-system.js');

test('interface calcula custo finito usando o objeto da runa',()=>{
  const state={runes:{},runePoints:98};
  const root=R.NODES[0];
  assert.equal(R.cost(state,root),1);
  assert.ok(Number.isFinite(R.cost(state,root)));
  assert.ok(R.available(state).length>=3);
});

test('compra continua descontando o custo e aumentando o nível',()=>{
  const state={runes:{},runePoints:98};
  assert.equal(R.buy(state,'war1'),true);
  assert.equal(state.runes.war1,1);
  assert.equal(state.runePoints,97);
  assert.equal(R.cost(state,R.node('war1')),2);
});
