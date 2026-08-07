const test=require('node:test');const assert=require('node:assert/strict');const P=require('../src/progression-system');
test('inicializa progressão sem apagar estado',()=>{let s={scrap:99};P.ensure(s);assert.equal(s.scrap,99);assert.equal(s.skillPoints.maya,0);assert.equal(s.chests.field,0)});
test('compra talento e aumenta bônus',()=>{let s={skillPoints:{maya:3}};P.ensure(s);assert.equal(P.buyHero(s,'maya','m_atk'),true);assert.equal(P.heroBonuses(s,'maya').attack,.08);assert.equal(s.skillPoints.maya,2)});
test('bloqueia compra sem pontos',()=>{let s={};P.ensure(s);assert.equal(P.buyHero(s,'bruno','b_hp'),false)});
test('árvores possuem três habilidades e cinco talentos por herói',()=>{for(const h of Object.values(P.HEROES)){assert.equal(h.abilities.length,3);assert.equal(h.tree.length,5)}});
