const test=require('node:test');
const assert=require('node:assert/strict');
const C=require('../src/campaign-system.js');
test('campanha possui quatro modos',()=>assert.deepEqual(C.MODES.map(m=>m.name),['NORMAL','SOBREVIVÊNCIA','LOUCURA','HARDCORE']));
test('cada mapa possui dez níveis',()=>{let s={campaign:{map:1,level:10,mode:0,cycles:0}};let r=C.advance(s);assert.equal(s.campaign.map,2);assert.equal(s.campaign.level,1);assert.equal(r.mapChanged,true)});
test('concluir cinco mapas muda o modo',()=>{let s={campaign:{map:5,level:10,mode:0,cycles:0}};let r=C.advance(s);assert.equal(s.campaign.map,1);assert.equal(s.campaign.mode,1);assert.equal(r.modeChanged,true)});
test('hardcore continua em ciclos progressivos',()=>{let s={campaign:{map:5,level:10,mode:3,cycles:2}};C.advance(s);assert.equal(s.campaign.mode,3);assert.equal(s.campaign.cycles,3);assert.equal(s.campaign.map,1)});
test('dificuldade cresce por mapa nível e modo',()=>{let a={campaign:{map:1,level:1,mode:0,cycles:0}},b={campaign:{map:5,level:10,mode:3,cycles:0}};assert.ok(C.difficulty(b)>C.difficulty(a))});
