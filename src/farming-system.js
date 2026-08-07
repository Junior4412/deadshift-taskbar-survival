(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FarmingSystem=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
const FOCUS=['dps','tank','healer','iris','rare'];
const LABELS={dps:'DPS',tank:'TANK',healer:'CURA',iris:'IRIS',rare:'RARIDADE'};
function index(map,level){return(map-1)*10+level}
function required(map,level,mode=0){return Math.round((35+(map-1)*65+level*12)*[1.2,1.9,3,5][mode])}
function efficiency(power,map,level,mode=0){return power/required(map,level,mode)}
function status(power,map,level,mode=0){let e=efficiency(power,map,level,mode);return e>=1.35?{key:'easy',label:'FÁCIL'}:e>=.95?{key:'balanced',label:'IDEAL'}:e>=.72?{key:'hard',label:'ARRISCADO'}:{key:'deadly',label:'MUITO DIFÍCIL'}}
function recommendations({power=10,unlocked=1,mode=0,target='any'}={}){let stages=[];for(let n=1;n<=Math.min(50,unlocked);n++){let map=Math.ceil(n/10),level=(n-1)%10+1,e=efficiency(power,map,level,mode),focus=FOCUS[map-1];stages.push({map,level,index:n,efficiency:Math.round(e*100),focus,status:status(power,map,level,mode)})}let viable=stages.filter(s=>s.efficiency>=72),safe=stages.filter(s=>s.efficiency>=115),pool=safe.length?safe:viable.length?viable:stages,bestSafe=pool[pool.length-1],scrap=[...viable].sort((a,b)=>(b.index*Math.min(140,b.efficiency))-(a.index*Math.min(140,a.efficiency)))[0]||stages[0],wanted=target==='any'?'rare':target,item=[...viable].filter(s=>s.focus===wanted).sort((a,b)=>b.index-a.index)[0]||[...viable].sort((a,b)=>(b.level===10)-(a.level===10)||b.index-a.index)[0]||stages[0],boss=[...viable].filter(s=>s.level===10).sort((a,b)=>b.index-a.index)[0]||item;return{safe:bestSafe,scrap,item,boss}}
return{FOCUS,LABELS,index,required,efficiency,status,recommendations};
});
