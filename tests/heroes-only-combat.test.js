const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const game=fs.readFileSync(path.join(root,'src/game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'src/index.html'),'utf8');
const PetSystem=require('../src/pet-system.js');

test('combate não exibe base nem torre para proteger',()=>{
  assert.doesNotMatch(html,/data-tab="base"/);
  assert.doesNotMatch(game,/drawBase\(\);/);
  assert.doesNotMatch(game,/if\(S\.upgrades\.turret/);
});

test('inimigos atacam heróis e a derrota depende da formação',()=>{
  assert.match(game,/function zombieTarget\(\)\{return fightingHeroes\(\)/);
  assert.match(game,/if\(activeHeroes\(\)\.length&&!fightingHeroes\(\)\.length\)return defeat\(\)/);
  assert.match(game,/S\.scrap=Math\.floor\(S\.scrap\*\.9\)/);
});

test('todos os pets possuem perfil completo e recomendações',()=>{
  for(const pet of Object.values(PetSystem.PETS)){
    assert.ok(pet.rarity);
    assert.ok(pet.role);
    assert.ok(pet.ability);
    assert.ok(Array.isArray(pet.recommended)&&pet.recommended.length>0);
  }
  assert.match(game,/className='pet-profile'/);
});
