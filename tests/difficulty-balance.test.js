const test=require('node:test');const assert=require('node:assert/strict');const C=require('../src/campaign-system.js');const F=require('../src/farming-system.js');
test('modo normal começa com pressão maior',()=>assert.ok(C.difficulty({campaign:{map:1,level:1,mode:0,cycles:0}})>=1.2));
test('hardcore tem ao menos quatro vezes a pressão do normal',()=>{let normal=C.difficulty({campaign:{map:1,level:1,mode:0,cycles:0}}),hard=C.difficulty({campaign:{map:1,level:1,mode:3,cycles:0}});assert.ok(hard/normal>=4)});
test('radar reflete o novo balanceamento',()=>assert.ok(F.required(5,10,3)>F.required(1,1,0)*20));
