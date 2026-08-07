(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PetSystem=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
const PETS={
 rex:{name:'Rex',species:'Cão de patrulha',icon:'🐕',color:'#b88a58',cost:0,desc:'Fareja ameaças e aumenta dano e crítico.',perLevel:{attack:2.4,crit:.006}},
 luna:{name:'Luna',species:'Gata sucateira',icon:'🐈',color:'#8f91a8',cost:650,desc:'Encontra recursos e acelera os ataques.',perLevel:{rate:.012,scrap:.012}},
 casco:{name:'Casco',species:'Tartaruga blindada',icon:'🐢',color:'#69a16a',cost:1200,desc:'Protege seu parceiro e aumenta a vida.',perLevel:{hp:18,rate:.004}},
 corvo:{name:'Nox',species:'Corvo contaminado',icon:'🐦',color:'#75658f',cost:1900,desc:'Marca pontos fracos e acha sucata rara.',perLevel:{crit:.012,scrap:.01}}
};
function ensure(state){state.pets=state.pets||{};state.pets.unlocked=Array.isArray(state.pets.unlocked)?state.pets.unlocked:['rex'];if(!state.pets.unlocked.includes('rex'))state.pets.unlocked.unshift('rex');state.pets.levels=state.pets.levels||{rex:1};state.pets.equipped=state.pets.equipped||{maya:'rex'};for(const id of state.pets.unlocked)state.pets.levels[id]=Math.max(1,Number(state.pets.levels[id]||1));return state}
function bonus(state,heroId){ensure(state);let id=state.pets.equipped[heroId],def=PETS[id],level=Number(state.pets.levels[id]||1),out={attack:0,hp:0,rate:0,crit:0,scrap:0};if(def)for(const [key,value] of Object.entries(def.perLevel))out[key]=Number((value*level).toFixed(6));return out}
function unlock(state,id){ensure(state);let pet=PETS[id];if(!pet||state.pets.unlocked.includes(id)||Number(state.scrap||0)<pet.cost)return false;state.scrap-=pet.cost;state.pets.unlocked.push(id);state.pets.levels[id]=1;return true}
function equip(state,heroId,id){ensure(state);if(!state.pets.unlocked.includes(id))return false;for(const hero of Object.keys(state.pets.equipped))if(state.pets.equipped[hero]===id)delete state.pets.equipped[hero];state.pets.equipped[heroId]=id;return true}
function trainCost(state,id){ensure(state);return Number(state.pets.levels[id]||1)*220}
function train(state,id){ensure(state);let level=Number(state.pets.levels[id]||1),cost=trainCost(state,id);if(!state.pets.unlocked.includes(id)||level>=10||Number(state.scrap||0)<cost)return false;state.scrap-=cost;state.pets.levels[id]=level+1;return true}
return{PETS,ensure,bonus,unlock,equip,train,trainCost};
});
