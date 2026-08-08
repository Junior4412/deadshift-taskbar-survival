const test=require('node:test');const assert=require('node:assert/strict');const R=require('../src/rune-system.js');
test('bloqueia runa sem requisito',()=>{let s={runePoints:20};assert.equal(R.buy(s,'loot1'),false)});
test('compra caminho e soma bônus',()=>{let s={runePoints:20};assert.equal(R.buy(s,'war1'),true);assert.equal(R.buy(s,'loot1'),true);assert.equal(R.bonuses(s).attack,.05);assert.equal(R.bonuses(s).scrap,.05)});
test('árvore possui ramos e nó mestre',()=>{assert.ok(R.NODES.length>=14);assert.ok(R.NODES.find(n=>n.id==='master1').requires.length>=3)});
