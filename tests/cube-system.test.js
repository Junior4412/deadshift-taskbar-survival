const test=require('node:test');const assert=require('node:assert/strict');const C=require('../src/cube-system.js');
test('seleciona nove itens não equipados da mesma raridade',()=>{let items=Array.from({length:10},(_,i)=>({id:String(i),rarity:'common',power:10-i}));let g=C.synthesisGroup(items,['0']);assert.equal(g.length,9);assert.ok(!g.some(i=>i.id==='0'))});
test('síntese avança raridade',()=>{assert.equal(C.nextRarity('rare'),'epic');assert.equal(C.nextRarity('legendary'),'legendary')});
test('uso do cubo concede níveis',()=>{let s={};C.gain(s,500);assert.ok(s.cube.level>1);assert.equal(s.cube.uses,1)});
