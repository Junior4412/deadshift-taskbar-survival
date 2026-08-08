const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Audio=require('../src/audio-system');
const root=path.join(__dirname,'..');
const game=fs.readFileSync(path.join(root,'src','game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'src','index.html'),'utf8');

test('configurações de áudio são inicializadas e volumes são limitados',()=>{
  let state={settings:{masterVolume:3,musicVolume:-2}};
  let settings=Audio.ensure(state);
  assert.equal(settings.masterVolume,1);
  assert.equal(settings.musicVolume,0);
  assert.equal(settings.sfx,true);
});

test('motor oferece trilha procedural e efeitos sem depender de arquivo externo',()=>{
  let engine=Audio.create();
  assert.equal(engine.snapshot().running,false);
  assert.equal(typeof engine.start,'function');
  assert.equal(typeof engine.sfx,'function');
});

test('interface possui abas geral gráficos áudio e outros',()=>{
  assert.match(html,/data-tab="settings"/);
  assert.match(html,/audio-system\.js/);
  for(const tab of ['general','graphics','audio','other'])assert.match(game,new RegExp(`'${tab}'`));
  assert.match(game,/data-setting-range/);
  assert.match(game,/data-audio-start/);
  assert.match(game,/data-audio-test="shot"/);
  assert.match(game,/data-audio-test="chest"/);
  assert.match(game,/pointerdown/);
});

test('combate e baús possuem efeitos sonoros com limite de repetição',()=>{
  assert.match(game,/audio\.sfx\('shot'\)/);
  assert.match(game,/audio\.sfx\('chest'\)/);
  let source=fs.readFileSync(path.join(root,'src','audio-system.js'),'utf8');
  assert.match(source,/minimum=\{shot:85,hit:70,click:35\}/);
  assert.match(source,/function noise/);
});
