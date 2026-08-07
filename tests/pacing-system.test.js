const test=require('node:test');const assert=require('node:assert/strict');const P=require('../src/pacing-system.js');
test('mapa um dura oito minutos na velocidade básica',()=>assert.equal(P.displayMinutes(1,2),8));
test('cada mapa demora mais que o anterior',()=>{for(let m=2;m<=5;m++)assert.ok(P.mapSeconds(m)>P.mapSeconds(m-1))});
test('chefe só aparece na parte final do nível dez',()=>{let s={campaign:{map:1,level:10,stageTime:P.stageSeconds(1)*.79}};assert.equal(P.finalBoss(s),false);s.campaign.stageTime=P.stageSeconds(1)*.81;assert.equal(P.finalBoss(s),true)});
