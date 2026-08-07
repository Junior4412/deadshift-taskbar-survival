const test=require('node:test');
const assert=require('node:assert/strict');
const P=require('../src/patch-notes.js');
test('patch notes possuem versão, data e mudanças',()=>{assert.ok(P.NOTES.length>=6);for(const note of P.NOTES){assert.match(note.version,/^\d+\.\d+\.\d+$/);assert.ok(note.date);assert.ok(note.sections.flatMap(s=>s[1]).length)}});
test('versão mais recente aparece primeiro',()=>assert.equal(P.NOTES[0].version,'4.2.0'));
