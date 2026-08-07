const test=require('node:test');const assert=require('node:assert/strict');const Save=require('../src/save-system.js');
test('save exportado mantém todo o progresso',()=>{let state={scrap:99,inventory:[{id:1}],campaign:{map:3,level:7,mode:1},unlocked:['maya','bruno']},decoded=Save.decode(Save.encode(state));assert.deepEqual(decoded.state,state);assert.equal(decoded.summary.items,1)});
test('save alterado é rejeitado',()=>{let file=JSON.parse(Save.encode({scrap:10}));file.payload.scrap=999;assert.throws(()=>Save.decode(JSON.stringify(file)),/corrompido/)});
test('arquivo estranho é rejeitado',()=>assert.throws(()=>Save.decode('{}'),/não é um save/));
