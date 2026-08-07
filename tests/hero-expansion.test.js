const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const P=require('../src/progression-system');
const R=require('../src/recommendation-system');
const root=path.join(__dirname,'..');
const game=fs.readFileSync(path.join(root,'src','game.js'),'utf8');

test('expansão possui quatorze heróis completos',()=>{
  assert.equal(Object.keys(P.HEROES).length,14);
  assert.equal(Object.keys(R.WEIGHTS).length,14);
  for(const id of Object.keys(P.HEROES))assert.ok(R.WEIGHTS[id],`peso ausente: ${id}`);
});

test('dez novos heróis possuem arte e habilidades próprias',()=>{
  for(const id of ['vega','atlas','luna','knox','sombra','raio','hana','muralha','echo','padre']){
    assert.match(game,new RegExp(`id:'${id}'`));
    assert.equal(P.HEROES[id].abilities.length,3);
  }
  assert.ok(fs.existsSync(path.join(root,'assets','deadshift-heroes-expansion-a.png')));
  assert.ok(fs.existsSync(path.join(root,'assets','deadshift-heroes-expansion-b.png')));
});

test('formação limita quatro heróis e oferece builds prontas',()=>{
  assert.match(game,/slice\(0,4\)/);
  assert.match(game,/S\.lineup\.length>=4/);
  assert.match(game,/const BUILD_PRESETS=\[/);
  assert.match(game,/FARM AFK SEGURO/);
  assert.match(game,/CAÇA-CHEFES/);
});
