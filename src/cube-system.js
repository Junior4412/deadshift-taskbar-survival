(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CubeSystem=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
const ORDER=['common','uncommon','rare','epic','legendary'];
function ensure(s){s.cube=s.cube||{level:1,xp:0,uses:0};s.cube.level=Math.max(1,Number(s.cube.level||1));s.cube.xp=Math.max(0,Number(s.cube.xp||0));s.cube.uses=Math.max(0,Number(s.cube.uses||0));return s}
function required(level){return 50+level*35}
function gain(s,xp){ensure(s);s.cube.xp+=xp;s.cube.uses++;while(s.cube.level<100&&s.cube.xp>=required(s.cube.level)){s.cube.xp-=required(s.cube.level);s.cube.level++}return s.cube.level}
function nextRarity(r){let i=ORDER.indexOf(r);return ORDER[Math.min(ORDER.length-1,i+1)]}
function synthesisGroup(items,equippedIds=[]){let blocked=new Set(equippedIds),groups={};for(const i of items)if(!blocked.has(i.id)&&i.rarity!=='legendary')(groups[i.rarity]||(groups[i.rarity]=[])).push(i);return ORDER.map(r=>(groups[r]||[]).sort((a,b)=>a.power-b.power)).find(g=>g.length>=9)?.slice(0,9)||[]}
function craftCost(s,slot){ensure(s);return Math.round((300+s.cube.level*55)*({weapon:1.15,armor:1,charm:.9}[slot]||1))}
return{ORDER,ensure,required,gain,nextRarity,synthesisGroup,craftCost};
});
