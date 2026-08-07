const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const main=fs.readFileSync(path.join(__dirname,'..','main.js'),'utf8');
test('atualizador instala silenciosamente e reabre o jogo',()=>assert.match(main,/quitAndInstall\(true, true\)/));
test('download concluído dispara instalação automática',()=>{assert.match(main,/update-downloaded/);assert.match(main,/updateStatus\('installing'/)});
test('procura atualizações continuamente em segundo plano',()=>{assert.match(main,/UPDATE_POLL_INTERVAL = 5 \* 60 \* 1000/);assert.match(main,/setInterval\(checkUpdatesSafely, UPDATE_POLL_INTERVAL\)/)});
test('bloqueia consultas duplicadas durante download',()=>{assert.match(main,/updateCheckInFlight/);assert.match(main,/update-available[\s\S]*updateCheckInFlight = true/)});
