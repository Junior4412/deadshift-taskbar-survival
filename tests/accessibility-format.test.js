const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const game=fs.readFileSync(path.join(root,'src/game.js'),'utf8');
const css=fs.readFileSync(path.join(root,'src/style.css'),'utf8');

test('poder da equipe sempre é exibido como inteiro',()=>{
  assert.match(game,/function teamPower\(\)\{return Math\.round\(/);
  assert.doesNotMatch(game,/\$\{teamPower\(\)\}\.\d/);
});

test('interface oferece foco visível e preferência de movimento reduzido',()=>{
  assert.match(css,/:focus-visible/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(game,/function enhanceAccessibility\(\)/);
  assert.match(game,/setAttribute\('aria-label'/);
});
