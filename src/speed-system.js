(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SpeedSystem=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
const STEPS=[2,5,10,20];
function normalize(value,legacy=false){let n=Number(value||1);if(legacy)return({1:2,2:5,3:10}[n]||2);return STEPS.includes(n)?n:2}
function next(value){let i=STEPS.indexOf(Number(value));return STEPS[(i+1+STEPS.length)%STEPS.length]}
function projectilePosition(x,targetX,dt,velocity=520){let distance=targetX-x,step=Math.max(0,dt)*velocity;if(Math.abs(distance)<=step)return{position:targetX,hit:true};return{position:x+Math.sign(distance)*step,hit:false}}
return{STEPS,normalize,next,projectilePosition};
});
