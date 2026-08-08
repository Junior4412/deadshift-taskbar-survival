(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MissionSystem=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
const DEFINITIONS=[
 {id:'kills',name:'Limpeza sem fim',desc:'Elimine infectados',icon:'☣',base:50,growth:1.34,reward:{scrap:180}},
 {id:'waves',name:'Linha de resistência',desc:'Conclua ondas',icon:'⌁',base:10,growth:1.28,reward:{scrap:240}},
 {id:'bosses',name:'Caça aos gigantes',desc:'Derrote chefes',icon:'♛',base:1,growth:1.22,reward:{cores:1,runePoints:1}},
 {id:'chests',name:'Arsenal recuperado',desc:'Abra baús de qualquer categoria',icon:'▣',base:5,growth:1.3,reward:{scrap:320}},
 {id:'crafts',name:'Engenharia de campo',desc:'Fabrique ou sintetize itens',icon:'◇',base:3,growth:1.27,reward:{scrap:400,cubeXp:25}},
 {id:'training',name:'Veteranos do turno',desc:'Treine níveis de campeões',icon:'✦',base:5,growth:1.32,reward:{scrap:300}},
 {id:'loot',name:'Catador da quarentena',desc:'Encontre equipamentos',icon:'◆',base:12,growth:1.3,reward:{scrap:260}},
 {id:'campaign',name:'Marcha impossível',desc:'Avance níveis da campanha',icon:'↗',base:3,growth:1.25,reward:{cores:1,expeditionPoints:1}}
];
function target(def,tier){return Math.max(1,Math.round(def.base*Math.pow(def.growth,Math.max(0,tier-1))))}
function ensure(state){state.missionSystem=state.missionSystem||{};state.missionSystem.autoClaim=state.missionSystem.autoClaim!==false;state.missionSystem.totalCompleted=Number(state.missionSystem.totalCompleted||0);state.missionSystem.entries=state.missionSystem.entries||{};for(const def of DEFINITIONS){let entry=state.missionSystem.entries[def.id]||{};state.missionSystem.entries[def.id]={tier:Math.max(1,Number(entry.tier||1)),progress:Math.max(0,Number(entry.progress||0)),completed:Number(entry.completed||0)}}return state.missionSystem}
function record(state,id,amount=1){ensure(state);let entry=state.missionSystem.entries[id];if(entry)entry.progress+=Math.max(0,Number(amount)||0);return entry}
function rewardFor(def,tier){let scale=1+(tier-1)*.22,out={};for(const [key,value] of Object.entries(def.reward))out[key]=Math.max(1,Math.round(value*scale));return out}
function grant(state,reward){state.scrap=Number(state.scrap||0)+Number(reward.scrap||0);state.cores=Number(state.cores||0)+Number(reward.cores||0);state.runePoints=Number(state.runePoints||0)+Number(reward.runePoints||0);state.expeditionPoints=Number(state.expeditionPoints||0)+Number(reward.expeditionPoints||0);if(reward.cubeXp){state.cube=state.cube||{level:1,xp:0,uses:0};state.cube.xp=Number(state.cube.xp||0)+reward.cubeXp}}
function claimCompleted(state){ensure(state);let claimed=[];for(const def of DEFINITIONS){let entry=state.missionSystem.entries[def.id],guard=0;while(entry.progress>=target(def,entry.tier)&&guard++<100){let required=target(def,entry.tier),reward=rewardFor(def,entry.tier);entry.progress-=required;grant(state,reward);claimed.push({id:def.id,name:def.name,tier:entry.tier,reward});entry.tier++;entry.completed++;state.missionSystem.totalCompleted++}}return claimed}
function active(state){ensure(state);return DEFINITIONS.map(def=>{let entry=state.missionSystem.entries[def.id];return {...def,...entry,target:target(def,entry.tier),reward:rewardFor(def,entry.tier)}})}
function rewardText(reward){return [['scrap','☣'],['cores','◆'],['runePoints','✦ runa'],['expeditionPoints','↗ expedição'],['cubeXp','XP cubo']].filter(([key])=>reward[key]).map(([key,label])=>`${reward[key]} ${label}`).join(' · ')}
return{DEFINITIONS,ensure,record,claimCompleted,active,target,rewardFor,rewardText};
});
