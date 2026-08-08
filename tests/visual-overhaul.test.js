const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const game=fs.readFileSync(path.join(root,'src/game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'src/index.html'),'utf8');

test('nova folha de campeões existe e é usada pelo combate',()=>{
  const sprite=path.join(root,'assets/deadshift-heroes-v4.png');
  assert.ok(fs.existsSync(sprite));
  assert.ok(fs.statSync(sprite).size>100000);
  assert.match(game,/deadshift-heroes-v4\.png/);
  assert.match(game,/drawSurvivor/);
  const infected=path.join(root,'assets/deadshift-infected-v1.png');
  assert.ok(fs.existsSync(infected));
  assert.match(game,/deadshift-infected-v1\.png/);
  assert.match(game,/drawInfected/);
});

test('interface carrega o acabamento visual completo',()=>{
  assert.match(html,/visual-overhaul\.css/);
  assert.ok(fs.existsSync(path.join(root,'src/visual-overhaul.css')));
  assert.match(game,/drawAtmosphere/);
});
