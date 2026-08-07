const test=require('node:test');const assert=require('node:assert/strict');const O=require('../src/offline-system');
test('não concede progresso com menos de um minuto',()=>{assert.equal(O.simulate({seconds:59}).eligible,false)});
test('limita o farm AFK a oito horas',()=>{assert.equal(O.simulate({seconds:99*3600}).elapsed,8*3600)});
test('concede todos os recursos do farm',()=>{let r=O.simulate({seconds:3600,power:100,night:2,wave:5,heroCount:3});assert.ok(r.kills>0);assert.ok(r.waves>0);assert.ok(r.scrap>0);assert.ok(r.xpEach>0);assert.ok(r.drops>0)});
test('mais poder aumenta o resultado',()=>{let low=O.simulate({seconds:3600,power:10}),high=O.simulate({seconds:3600,power:100});assert.ok(high.kills>low.kills)});
test('progresso mantém onda entre 1 e 10',()=>{let r=O.simulate({seconds:28800,power:500,night:5,wave:9,heroCount:4});assert.ok(r.endWave>=1&&r.endWave<=10);assert.ok(r.endNight>=5)});
