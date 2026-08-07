(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PacingSystem=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
const MAP_MINUTES=[8,12,18,25,35],BASE_SPEED=2;
function mapSeconds(map){return MAP_MINUTES[Math.max(0,Math.min(4,Number(map||1)-1))]*60*BASE_SPEED}
function stageSeconds(map){return mapSeconds(map)/10}
function progress(state){return Math.max(0,Math.min(1,Number(state?.campaign?.stageTime||0)/stageSeconds(state?.campaign?.map||1)))}
function ready(state){return progress(state)>=1}
function finalBoss(state){return Number(state?.campaign?.level)===10&&progress(state)>=.8}
function displayMinutes(map,speed=BASE_SPEED){return Math.ceil(mapSeconds(map)/Math.max(1,Number(speed)||BASE_SPEED)/60)}
return{MAP_MINUTES,BASE_SPEED,mapSeconds,stageSeconds,progress,ready,finalBoss,displayMinutes};
});
