(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.OfflineSystem=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
const MAX_SECONDS=8*60*60;
function simulate({seconds=0,power=10,night=1,wave=1,heroCount=1,offlineBonus=0}={}){
  const elapsed=Math.max(0,Math.min(MAX_SECONDS,Number(seconds)||0));
  if(elapsed<60)return{elapsed,eligible:false,kills:0,waves:0,bosses:0,scrap:0,xpEach:0,drops:0,chests:0,expeditionPoints:0,endWave:wave,endNight:night};
  const required=18+night*12+wave*2,efficiency=Math.max(.25,Math.min(1.6,power/required));
  const kills=Math.floor(elapsed/60*(3.5+heroCount*2.2)*efficiency);
  const waves=Math.floor(kills/Math.max(8,13-night*.25));
  const totalWave=(wave-1)+waves,bosses=Math.floor(totalWave/10),endNight=night+bosses,endWave=totalWave%10+1;
  const scrap=Math.floor(kills*(5+night*1.8)*(1+offlineBonus));
  const xpEach=Math.floor(kills*7/Math.max(1,heroCount));
  const drops=Math.min(24,Math.floor(kills*.035)+bosses*2);
  return{elapsed,eligible:true,kills,waves,bosses,scrap,xpEach,drops,chests:bosses,expeditionPoints:bosses,endWave,endNight};
}
function formatDuration(seconds){let h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60);return h?`${h}h ${m}min`:`${m}min`}
return{MAX_SECONDS,simulate,formatDuration};
});
