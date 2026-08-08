const test=require('node:test');
const assert=require('node:assert/strict');
const M=require('../src/mission-system');

test('sistema oferece oito missões contínuas',()=>{
  let state={};
  assert.equal(M.active(state).length,8);
  assert.equal(state.missionSystem.autoClaim,true);
});

test('missão concluída sobe de nível e aumenta a próxima meta',()=>{
  let state={scrap:0,cores:0,runePoints:0,expeditionPoints:0,cube:{xp:0}};
  M.record(state,'kills',50);
  let before=M.active(state).find(m=>m.id==='kills');
  let claimed=M.claimCompleted(state);
  let after=M.active(state).find(m=>m.id==='kills');
  assert.equal(claimed.length,1);
  assert.equal(after.tier,2);
  assert.ok(after.target>before.target);
  assert.equal(state.scrap,180);
});

test('progresso excedente continua na missão seguinte',()=>{
  let state={};
  M.record(state,'waves',30);
  let claimed=M.claimCompleted(state);
  assert.ok(claimed.length>=2);
  assert.ok(M.active(state).find(m=>m.id==='waves').progress>=0);
});

test('chefes concedem recursos diversos automaticamente',()=>{
  let state={};
  M.record(state,'bosses',1);
  M.claimCompleted(state);
  assert.equal(state.cores,1);
  assert.equal(state.runePoints,1);
});
