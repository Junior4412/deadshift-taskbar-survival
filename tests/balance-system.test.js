const test=require('node:test');
const assert=require('node:assert/strict');
const B=require('../src/balance-system');

test('todos os quatorze campeões possuem curva própria',()=>{
  assert.equal(Object.keys(B.HERO_BASE).length,14);
  assert.equal(Object.keys(B.GROWTH).length,14);
  assert.ok(B.expectedHero('atlas',20).maxHp>B.expectedHero('vega',20).maxHp);
  assert.ok(B.expectedHero('vega',20).attack>B.expectedHero('atlas',20).attack);
});

test('normalização preserva função e elimina atributos fora da curva',()=>{
  let hero={id:'maya',level:10,hp:99999,maxHp:99999,atk:99999,rate:99};
  B.normalizeHero(hero);
  assert.deepEqual(hero,{id:'maya',level:10,hp:200,maxHp:200,atk:30,rate:1.25});
});

test('itens são ajustados ao orçamento de nível raridade e qualidade',()=>{
  let item={level:10,rarity:'rare',quality:90,stats:{attack:9999,hp:9999,rate:4,crit:2,scrap:2,healing:2}};
  B.normalizeItem(item);
  assert.ok(item.power<=Math.round(B.itemBudget(item)*1.35)+10);
  assert.ok(item.salvage>0);
});

test('estado migrado nunca mantém mais de três campeões',()=>{
  let state={lineup:['maya','bruno','yuri','iris'],inventory:[]};
  B.normalizeState(state,[]);
  assert.deepEqual(state.lineup,['maya','bruno','yuri']);
});
