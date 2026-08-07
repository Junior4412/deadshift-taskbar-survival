const test=require('node:test');const assert=require('node:assert/strict');const E=require('../src/enemy-system.js');
test('novos arquétipos possuem comportamentos diferentes',()=>{for(const id of ['flyer','ember','exploder','acid','phase','frostflyer'])assert.ok(E.DEFS[id]?.trait)});
test('criaturas especiais surgem conforme a fase avança',()=>{let pool=['walker','runner','flyer','exploder'];assert.deepEqual(E.unlocked(pool,1),['walker','runner']);assert.equal(E.unlocked(pool,10).length,4)});
test('blindados reduzem dano recebido',()=>assert.ok(E.damageTaken({trait:'armored'},100)<E.damageTaken({trait:'normal'},100)));
test('inimigos surgem perto da área de combate',()=>{assert.ok(E.spawnX(920,()=>0)<600);assert.ok(E.spawnX(1120,()=>1)<720)});
test('inimigos especiais atacam antes dos comuns',()=>{assert.ok(E.attackReach('toxic')>E.attackReach('normal'));assert.ok(E.attackReach('flying')>E.attackReach('normal'))});
