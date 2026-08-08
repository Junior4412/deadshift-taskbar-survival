const test=require('node:test');const assert=require('node:assert/strict');const S=require('../src/speed-system.js');
test('velocidades chegam a vinte vezes',()=>assert.deepEqual(S.STEPS,[2,5,10,20]));
test('save antigo em 3x migra para 10x',()=>assert.equal(S.normalize(3,true),10));
test('projétil não ultrapassa o alvo em alta velocidade',()=>{let r=S.projectilePosition(0,100,.8);assert.equal(r.position,100);assert.equal(r.hit,true)});
