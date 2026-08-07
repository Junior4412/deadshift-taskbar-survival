(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ProceduralSystem=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
const BIOMES=[
 {name:'Neblina Hemorrágica',color:'#a34d56',enemy:'Sanguinário',trait:'leech',hp:1.18,atk:1.16,speed:1.02,reward:1.2,desc:'Infectados drenam vida e resistem mais.'},
 {name:'Tempestade Cinzenta',color:'#d47846',enemy:'Carbonizado',trait:'fire',hp:1.08,atk:1.3,speed:1.06,reward:1.22,desc:'Ataques incendiários causam pressão extra.'},
 {name:'Queda Criônica',color:'#69cbe0',enemy:'Congelado',trait:'frost',hp:1.22,atk:1.08,speed:.94,reward:1.18,desc:'Mutantes lentos congelam seus alvos.'},
 {name:'Eclipse Tóxico',color:'#62c96e',enemy:'Virulento',trait:'toxic',hp:1.12,atk:1.2,speed:1.08,reward:1.2,desc:'Nuvens tóxicas favorecem ataques à distância.'},
 {name:'Ruptura de Fase',color:'#9b79da',enemy:'Fásico',trait:'phase',hp:1.05,atk:1.22,speed:1.2,reward:1.28,desc:'Criaturas alternam entre matéria e sombra.'},
 {name:'Cerco Blindado',color:'#9b8a6d',enemy:'Encouraçado',trait:'armored',hp:1.48,atk:1.1,speed:.86,reward:1.3,desc:'Armadura pesada exige dano concentrado.'},
 {name:'Enxame Alado',color:'#8ea6c9',enemy:'Alado',trait:'flying',hp:.92,atk:1.18,speed:1.35,reward:1.22,desc:'Predadores voadores atacam antes da linha terrestre.'},
 {name:'Marcha Frenética',color:'#e0c057',enemy:'Febril',trait:'fast',hp:.9,atk:1.12,speed:1.5,reward:1.18,desc:'Uma horda rápida testa a cadência da equipe.'},
 {name:'Zona de Detonação',color:'#ee6d42',enemy:'Instável',trait:'explode',hp:1.02,atk:1.42,speed:1.15,reward:1.32,desc:'Corpos explosivos ameaçam toda a formação.'},
 {name:'Colônia Regenerativa',color:'#55ae86',enemy:'Regenerado',trait:'regen',hp:1.38,atk:1.08,speed:.96,reward:1.24,desc:'Mutantes recompõem tecidos durante o avanço.'},
 {name:'Lua do Predador',color:'#d45c80',enemy:'Caçador',trait:'fast-leech',hp:1.2,atk:1.32,speed:1.28,reward:1.4,desc:'Caçadores de elite perseguem os sobreviventes.'},
 {name:'Evento Ômega',color:'#e5b34c',enemy:'Ômega',trait:'armored-phase',hp:1.7,atk:1.45,speed:1.12,reward:1.65,desc:'Anomalia máxima com mutações combinadas.'}
];
const PREFIX=['Faminto','Militar','Contaminado','Abissal','Rastejante','Deformado','Renascido','Implacável'];
function hash(value){let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function threatTier(power=0,state={}){let raw=Math.log2(Math.max(1,Number(power)/120+1)),progress=Number(state?.campaign?.mode||0)*2+Number(state?.campaign?.cycles||0)*1.5+(Number(state?.campaign?.map||1)-1)*.35;return Math.max(0,Math.min(12,Math.floor(raw+progress)))}
function stage(state,power=0){let c=state?.campaign||{},tier=threatTier(power,state),seed=hash(`${c.mode||0}:${c.cycles||0}:${c.map||1}:${c.level||1}`),max=Math.min(BIOMES.length,Math.max(3,tier+2)),biome=BIOMES[seed%max];return{...biome,index:seed%max,tier,seed,danger:1+tier*.065,reward:biome.reward*(1+tier*.035)}}
function mutate(enemy,context,random=Math.random){let tier=context?.tier||0,mutations=1+(tier>=4?1:0)+(tier>=9?1:0),available=BIOMES.slice(0,Math.min(BIOMES.length,Math.max(3,tier+2))),chosen=[context],cursor=0;while(chosen.length<mutations&&cursor<available.length*2){let next=available[(Math.floor(random()*available.length)+cursor++)%available.length];if(!chosen.some(x=>x.trait===next.trait))chosen.push(next)}for(const mod of chosen){enemy.hp*=mod.hp;enemy.maxHp*=mod.hp;enemy.atk*=mod.atk;enemy.speed*=mod.speed;enemy.reward=Math.round(enemy.reward*mod.reward);if(!enemy.trait.includes(mod.trait))enemy.trait+=`-${mod.trait}`}enemy.name=`${PREFIX[(context.seed+Math.floor(random()*PREFIX.length))%PREFIX.length]} ${context.enemy} ${enemy.name}`;enemy.mutations=chosen.map(x=>x.enemy);enemy.threatTier=tier;return enemy}
return{BIOMES,threatTier,stage,mutate,hash};
});
