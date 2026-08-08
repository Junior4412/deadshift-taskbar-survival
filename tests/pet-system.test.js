const test=require('node:test');
const assert=require('node:assert/strict');
const Pets=require('../src/pet-system.js');
test('novo jogo recebe Rex equipado na Maya',()=>{let s={};Pets.ensure(s);assert.deepEqual(s.pets.unlocked,['rex']);assert.equal(s.pets.equipped.maya,'rex')});
test('pet concede bônus escalado por nível',()=>{let s={pets:{unlocked:['rex'],levels:{rex:3},equipped:{maya:'rex'}}};assert.equal(Pets.bonus(s,'maya').attack,7.2)});
test('pet não pode acompanhar dois heróis',()=>{let s={pets:{unlocked:['rex'],levels:{rex:1},equipped:{maya:'rex'}}};Pets.equip(s,'bruno','rex');assert.equal(s.pets.equipped.maya,undefined);assert.equal(s.pets.equipped.bruno,'rex')});
test('desbloqueia e treina consumindo sucata',()=>{let s={scrap:2000};Pets.ensure(s);assert.equal(Pets.unlock(s,'luna'),true);assert.equal(Pets.train(s,'luna'),true);assert.equal(s.pets.levels.luna,2);assert.equal(s.scrap,1130)});
