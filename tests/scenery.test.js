const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const game=fs.readFileSync(path.join(__dirname,'..','src','game.js'),'utf8');

test('cinco mapas possuem efeitos ambientais próprios',()=>{
  assert.match(game,/map===1/);
  assert.match(game,/map===2/);
  assert.match(game,/map===3/);
  assert.match(game,/map===4/);
  assert.match(game,/else\{for\(let i=0;i<\(reduced\?6:20\)/);
});

test('cenário preserva proporção sem esticar a arte',()=>{
  assert.match(game,/function drawStageBackground/);
  assert.match(game,/sourceRatio/);
  assert.match(game,/ctx\.drawImage\(bg,sx,sy,sw,sh,0,0,w,h\)/);
});

test('centro infectado usa pista limpa revisada',()=>{
  assert.match(game,/deadshift-city-v2\.png/);
  assert.ok(fs.existsSync(path.join(__dirname,'..','assets','deadshift-city-v2.png')));
});
