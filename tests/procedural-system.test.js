const test=require('node:test');
const assert=require('node:assert/strict');
const P=require('../src/procedural-system');

const state=(map=1,level=1,mode=0,cycles=0)=>({campaign:{map,level,mode,cycles}});

test('diretor aumenta a ameaça conforme o poder do jogador',()=>{
  assert.ok(P.threatTier(20000,state(5,10,3,2))>P.threatTier(100,state()));
  assert.ok(P.threatTier(1e9,state(5,10,3,20))<=12);
});

test('fases procedurais são determinísticas para o mesmo progresso',()=>{
  assert.deepEqual(P.stage(state(3,7,2,1),5000),P.stage(state(3,7,2,1),5000));
  assert.notEqual(P.stage(state(3,7,2,1),5000).seed,P.stage(state(3,8,2,1),5000).seed);
});

test('poder alto libera novas fases e múltiplas mutações',()=>{
  let low=P.stage(state(),50),high=P.stage(state(5,10,3,5),100000);
  assert.ok(high.tier>low.tier);
  assert.equal(P.BIOMES.length,12);
  let enemy={name:'Errante',trait:'normal',hp:100,maxHp:100,atk:10,speed:10,reward:10};
  P.mutate(enemy,high,()=>.2);
  assert.ok(enemy.mutations.length>=3);
  assert.ok(enemy.hp>100);
  assert.ok(enemy.reward>10);
});
