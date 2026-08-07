(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BalanceSystem=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
const HERO_BASE={maya:[110,12,1.25],bruno:[180,17,.72],yuri:[100,7,.9],iris:[120,25,.55],vega:[92,32,.48],atlas:[250,12,.55],luna:[112,9,1.05],knox:[138,16,.92],sombra:[88,24,1.45],raio:[126,19,1.32],hana:[145,35,.76],muralha:[205,15,1.65],echo:[105,13,1.02],padre:[168,20,.82]};
const GROWTH={maya:[10,2],bruno:[15,1.7],yuri:[11,1.35],iris:[11,2.15],vega:[8,2.35],atlas:[18,1.45],luna:[12,1.25],knox:[12,1.8],sombra:[8,2.15],raio:[10,1.9],hana:[12,2.25],muralha:[15,1.65],echo:[10,1.55],padre:[14,1.6]};
const RARITY={common:1,uncommon:1.3,rare:1.75,epic:2.4,legendary:3.25};
const SCORE={attack:10,hp:.7,rate:260,crit:180,scrap:120,healing:220};
const MAX_LEVEL=750;
const round=(n,d=0)=>Number(Number(n||0).toFixed(d));
function expectedHero(id,level=1){let base=HERO_BASE[id]||HERO_BASE.maya,growth=GROWTH[id]||GROWTH.maya,l=Math.min(MAX_LEVEL,Math.max(1,Number(level||1)));return{maxHp:Math.round(base[0]+(l-1)*growth[0]),attack:round(base[1]+(l-1)*growth[1],1),rate:base[2]}}
function normalizeHero(hero){hero.level=Math.min(MAX_LEVEL,Math.max(1,Number(hero.level||1)));let expected=expectedHero(hero.id,hero.level);hero.maxHp=expected.maxHp;hero.atk=expected.attack;hero.rate=expected.rate;hero.hp=Math.min(expected.maxHp,Math.max(0,Number(hero.hp||expected.maxHp)));return hero}
function itemBudget(item){let level=Math.max(1,Number(item?.level||1)),rarity=RARITY[item?.rarity]||1,quality=Math.min(1,Math.max(.72,Number(item?.quality||85)/100));return(32+level*5.4)*rarity*quality}
function normalizeItem(item){if(!item?.stats)return item;let budget=itemBudget(item),stats=item.stats,raw=Object.keys(SCORE).reduce((n,k)=>n+Math.max(0,Number(stats[k]||0))*SCORE[k],0),max=budget*1.35,min=budget*.58,scale=raw>max?max/raw:raw&&raw<min?min/raw:1;for(const key of Object.keys(SCORE)){let value=Math.max(0,Number(stats[key]||0))*scale;stats[key]=key==='attack'||key==='hp'?Math.round(value):round(value,3)}item.power=Math.round(Object.keys(SCORE).reduce((n,k)=>n+stats[k]*SCORE[k],0));item.salvage=Math.max(8,Math.round(item.power*(RARITY[item.rarity]||1)*.4));return item}
function normalizeState(state,heroes){heroes.forEach(normalizeHero);state.inventory=(state.inventory||[]).map(normalizeItem);state.lineup=(state.lineup||[]).filter((id,i,a)=>HERO_BASE[id]&&a.indexOf(id)===i).slice(0,3);if(!state.lineup.length)state.lineup=['maya'];return state}
function report(state,heroes){let active=heroes.filter(h=>(state.lineup||[]).includes(h.id)),powers=active.map(h=>Math.round(h.atk*10+h.maxHp*.7+h.rate*260));return{heroes:active.length,average:powers.length?Math.round(powers.reduce((a,b)=>a+b,0)/powers.length):0,items:(state.inventory||[]).length}}
return{MAX_LEVEL,HERO_BASE,GROWTH,expectedHero,normalizeHero,itemBudget,normalizeItem,normalizeState,report};
});
