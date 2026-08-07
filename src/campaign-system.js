(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CampaignSystem=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
const MODES=[{id:'normal',name:'NORMAL',mult:1,desc:'A ameaça original.'},{id:'survival',name:'SOBREVIVÊNCIA',mult:1.55,desc:'Hordas maiores e mais resistentes.'},{id:'madness',name:'LOUCURA',mult:2.35,desc:'Inimigos velozes e brutais.'},{id:'hardcore',name:'HARDCORE',mult:3.5,desc:'Sem misericórdia. Recompensas máximas.'}];
const MAP_COUNT=5,LEVELS_PER_MAP=10;
function ensure(state){if(!state.campaign)state.campaign={map:Math.min(MAP_COUNT,Math.max(1,Number(state.night||1))),level:Math.min(LEVELS_PER_MAP,Math.max(1,Number(state.wave||1))),mode:0,cycles:0};state.campaign.map=Math.min(MAP_COUNT,Math.max(1,Number(state.campaign.map||1)));state.campaign.level=Math.min(LEVELS_PER_MAP,Math.max(1,Number(state.campaign.level||1)));state.campaign.mode=Math.min(3,Math.max(0,Number(state.campaign.mode||0)));state.campaign.cycles=Math.max(0,Number(state.campaign.cycles||0));sync(state);return state}
function sync(state){state.night=state.campaign.map;state.wave=state.campaign.level}
function advance(state,amount=1){ensure(state);let modeChanged=false,mapChanged=false;for(let i=0;i<amount;i++){state.campaign.level++;if(state.campaign.level>LEVELS_PER_MAP){state.campaign.level=1;state.campaign.map++;mapChanged=true;if(state.campaign.map>MAP_COUNT){state.campaign.map=1;state.campaign.cycles++;let before=state.campaign.mode;state.campaign.mode=Math.min(3,before+1);modeChanged=state.campaign.mode!==before}}}sync(state);return{...state.campaign,mapChanged,modeChanged}}
function difficulty(state){ensure(state);let c=state.campaign,mode=MODES[c.mode];return mode.mult*(1+(c.map-1)*.32+(c.level-1)*.075+c.cycles*.28)}
function reward(state){ensure(state);return 1+state.campaign.mode*.5+(state.campaign.map-1)*.1+state.campaign.cycles*.2}
function absolute(state){ensure(state);let c=state.campaign;return c.mode*50+c.cycles*50+(c.map-1)*10+c.level}
return{MODES,MAP_COUNT,LEVELS_PER_MAP,ensure,advance,difficulty,reward,absolute};
});
