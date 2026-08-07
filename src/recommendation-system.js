(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RecommendationSystem=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
const WEIGHTS={
  maya:{attack:1.35,hp:.45,rate:1.5,crit:1.3,scrap:.35,healing:.15},
  bruno:{attack:.7,hp:1.55,rate:.55,crit:.35,scrap:.3,healing:.3},
  yuri:{attack:.45,hp:1.05,rate:1.35,crit:.4,scrap:.85,healing:1.8},
  iris:{attack:1.5,hp:.6,rate:.85,crit:.8,scrap:.4,healing:.2}
};
const SCALE={attack:10,hp:.7,rate:260,crit:180,scrap:120,healing:220};
const LABELS={attack:'ATQ',hp:'VIDA',rate:'VEL',crit:'CRÍT',scrap:'SUCATA',healing:'CURA'};
function score(item,heroId){let stats=item?.stats||{},weights=WEIGHTS[heroId]||WEIGHTS.maya;return Object.keys(SCALE).reduce((sum,key)=>sum+Number(stats[key]||0)*SCALE[key]*weights[key],0)}
function bestHero(item,heroIds=Object.keys(WEIGHTS)){return heroIds.map(id=>({id,score:score(item,id)})).sort((a,b)=>b.score-a.score)[0]}
function compare(item,current,heroId){let next=score(item,heroId),before=score(current,heroId),delta=next-before,percent=before?Math.round(delta/before*100):next?100:0,stats=Object.keys(SCALE).map(key=>({key,label:LABELS[key],delta:Number(item?.stats?.[key]||0)-Number(current?.stats?.[key]||0)})).filter(x=>Math.abs(x.delta)>.0001);return{next,before,delta,percent,stats,verdict:!current?'upgrade':percent>=6?'upgrade':percent<=-6?'downgrade':'sidegrade'}}
function suitability(item,heroId){let best=bestHero(item),value=score(item,heroId),ratio=best.score?value/best.score:0;return{bestHero:best.id,ratio,label:ratio>=.96?'Excelente':ratio>=.78?'Bom':ratio>=.6?'Situacional':'Fraco'}}
function category(item){let s=item?.stats||{},scores={dps:Number(s.attack||0)*10+Number(s.rate||0)*220+Number(s.crit||0)*180,tank:Number(s.hp||0)*.85,healer:Number(s.healing||0)*280+Number(s.rate||0)*65+Number(s.scrap||0)*45};return Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0]}
return{WEIGHTS,SCALE,score,bestHero,compare,suitability,category};
});
