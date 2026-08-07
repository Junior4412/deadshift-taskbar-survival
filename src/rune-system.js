(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RuneSystem=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
const NODES=[
 {id:'war1',name:'Mira Estável',icon:'⚔',stat:'attack',value:.05,max:5,cost:1,x:50,y:8,requires:[]},
 {id:'guard1',name:'Pulso Vital',icon:'♥',stat:'hp',value:.06,max:5,cost:1,x:20,y:24,requires:[]},
 {id:'haste1',name:'Reflexos',icon:'»',stat:'rate',value:.04,max:5,cost:1,x:80,y:24,requires:[]},
 {id:'loot1',name:'Olho Clínico',icon:'◇',stat:'scrap',value:.05,max:5,cost:1,x:50,y:38,requires:['war1']},
 {id:'crit1',name:'Ponto Fraco',icon:'◎',stat:'crit',value:.015,max:5,cost:2,x:8,y:45,requires:['guard1']},
 {id:'regen1',name:'Coagulação',icon:'✚',stat:'regen',value:.12,max:5,cost:2,x:28,y:55,requires:['guard1']},
 {id:'rapid1',name:'Fogo Coordenado',icon:'⌁',stat:'rate',value:.05,max:5,cost:2,x:72,y:55,requires:['haste1']},
 {id:'offline1',name:'Turno Fantasma',icon:'◷',stat:'offline',value:.1,max:5,cost:2,x:92,y:45,requires:['haste1']},
 {id:'chest1',name:'Caça ao Cofre',icon:'▣',stat:'chest',value:.04,max:5,cost:3,x:42,y:66,requires:['loot1']},
 {id:'cube1',name:'Engenharia Reversa',icon:'◆',stat:'cube',value:.08,max:5,cost:3,x:58,y:66,requires:['loot1']},
 {id:'elite1',name:'Execução',icon:'☣',stat:'elite',value:.08,max:5,cost:4,x:18,y:78,requires:['crit1','regen1']},
 {id:'formation1',name:'Formação de Ferro',icon:'⬟',stat:'all',value:.04,max:5,cost:4,x:50,y:84,requires:['chest1','cube1']},
 {id:'farm1',name:'Zona Marcada',icon:'⌖',stat:'targetLoot',value:.05,max:5,cost:4,x:82,y:78,requires:['rapid1','offline1']},
 {id:'master1',name:'Protocolo Deadshift',icon:'✦',stat:'all',value:.1,max:1,cost:12,x:50,y:96,requires:['elite1','formation1','farm1']}
];
function ensure(s){s.runes=s.runes||{};s.runePoints=Number(s.runePoints||0);return s}
function node(id){return NODES.find(n=>n.id===id)}
function unlocked(s,n){ensure(s);return n.requires.every(id=>Number(s.runes[id]||0)>0)}
function cost(s,id){let n=node(id),rank=Number(s.runes[id]||0);return n?n.cost+rank:Infinity}
function buy(s,id){ensure(s);let n=node(id),rank=Number(s.runes[id]||0),price=cost(s,id);if(!n||rank>=n.max||!unlocked(s,n)||s.runePoints<price)return false;s.runePoints-=price;s.runes[id]=rank+1;return true}
function bonuses(s){ensure(s);let out={attack:0,hp:0,rate:0,crit:0,scrap:0,regen:0,offline:0,chest:0,cube:0,elite:0,targetLoot:0};for(const n of NODES){let v=Number(s.runes[n.id]||0)*n.value;if(n.stat==='all'){out.attack+=v;out.hp+=v;out.rate+=v}else out[n.stat]=(out[n.stat]||0)+v}return out}
return{NODES,ensure,node,unlocked,cost,buy,bonuses};
});
