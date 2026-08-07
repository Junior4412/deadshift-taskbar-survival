const test=require('node:test');const assert=require('node:assert/strict');const F=require('../src/farming-system.js');
test('dificuldade cresce entre mapas e modos',()=>{assert.ok(F.required(5,10,0)>F.required(1,1,0));assert.ok(F.required(1,1,3)>F.required(1,1,0))});
test('recomendação nunca usa fase bloqueada',()=>{let r=F.recommendations({power:1000,unlocked:17});for(const x of Object.values(r))assert.ok(F.index(x.map,x.level)<=17)});
test('alvo de cura prefere mapa especializado',()=>{let r=F.recommendations({power:1000,unlocked:40,target:'healer'});assert.equal(r.item.focus,'healer')});
