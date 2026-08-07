const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const game=fs.readFileSync(path.join(__dirname,'..','src','game.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'..','src','index.html'),'utf8');

test('inventário protege equipamentos em uso ao atingir o limite',()=>{
  assert.match(game,/function limitInventory/);
  assert.match(game,/protectedIds\.has\(item\.id\)/);
  assert.match(game,/function equipItem/);
});

test('equipamento rápido salva e transfere o item com segurança',()=>{
  assert.match(game,/equipItem\(heroId,item\)/);
  assert.match(game,/set\?\.\[item\.slot\]===item\.id/);
  assert.match(game,/equipado permanentemente/);
});

test('sucata possui ajuda contextual e treino em massa',()=>{
  assert.match(html,/id="scrap-advice"/);
  assert.match(game,/data-level-max/);
  assert.match(game,/function maxHeroTraining/);
  assert.match(game,/TREINAR TUDO/);
});
