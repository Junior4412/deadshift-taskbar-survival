const test=require('node:test');
const assert=require('node:assert/strict');
const Loot=require('../src/loot-system.js');
function seeded(seed=1){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}}
test('gera itens válidos em todos os níveis',()=>{const rng=seeded(42);for(let n=1;n<=200;n++){const item=Loot.generate({level:n,pity:n%12,rng});assert.ok(['weapon','armor','charm'].includes(item.slot));assert.ok(Loot.RARITIES[item.rarity]);assert.ok(item.power>0);assert.ok(item.salvage>0);assert.ok(item.quality>=72&&item.quality<=100);assert.equal(item.level,n)}});
test('chefe sempre entrega item épico ou lendário',()=>{const rng=seeded(9);for(let n=0;n<100;n++)assert.ok(['epic','legendary'].includes(Loot.generate({level:10,boss:true,rng}).rarity))});
test('pity alto garante lendário no chefe',()=>{assert.equal(Loot.generate({level:10,pity:15,boss:true,rng:seeded(4)}).rarity,'legendary')});
test('atributos equipados são somados sem mutação',()=>{const a={stats:{attack:4,hp:10,rate:.1}},b={stats:{attack:6,crit:.2}};assert.deepEqual(Loot.total([a,b]),{attack:10,hp:10,rate:.1,crit:.2,scrap:0,healing:0});assert.equal(a.stats.attack,4)});
test('distribuição contém todas as raridades',()=>{const rng=seeded(123),seen=new Set();for(let n=0;n<5000;n++)seen.add(Loot.generate({level:5,pity:0,rng}).rarity);for(const r of ['common','uncommon','rare','epic','legendary'])assert.ok(seen.has(r),`raridade ausente: ${r}`)});
