(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AudioSystem=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
const DEFAULTS={music:true,sfx:true,masterVolume:.65,musicVolume:.45,sfxVolume:.7,alwaysOnTop:true,reducedEffects:false,showDamage:true,autoUpdate:true,language:'pt-BR'};
function ensure(state){state.settings=Object.assign({},DEFAULTS,state.settings||{});for(const key of ['masterVolume','musicVolume','sfxVolume'])state.settings[key]=Math.max(0,Math.min(1,Number(state.settings[key])));return state.settings}
function create(){let context=null,master=null,musicGain=null,sfxGain=null,timer=null,step=0,settings={...DEFAULTS};const melody=[45,48,52,50,43,47,50,55,45,48,57,52,43,50,47,40],bass=[33,33,31,31,29,29,28,28];
 function init(){if(context)return context;let AC=globalThis.AudioContext||globalThis.webkitAudioContext;if(!AC)return null;context=new AC();master=context.createGain();musicGain=context.createGain();sfxGain=context.createGain();musicGain.connect(master);sfxGain.connect(master);master.connect(context.destination);apply(settings);return context}
 function tone(midi,duration=.24,type='triangle',gain=.04,target){if(!init())return;let now=context.currentTime,osc=context.createOscillator(),amp=context.createGain();osc.type=type;osc.frequency.value=440*Math.pow(2,(midi-69)/12);amp.gain.setValueAtTime(.0001,now);amp.gain.exponentialRampToValueAtTime(gain,now+.025);amp.gain.exponentialRampToValueAtTime(.0001,now+duration);osc.connect(amp);amp.connect(target||musicGain);osc.start(now);osc.stop(now+duration+.03)}
 function tick(){if(!settings.music||!context||context.state!=='running')return;tone(melody[step%melody.length],.38,step%4?'triangle':'sawtooth',.025);if(step%4===0)tone(bass[Math.floor(step/4)%bass.length],.72,'sine',.055);if(step%8===6)tone(69,.08,'square',.009);step++}
 function start(next=settings){settings={...DEFAULTS,...next};if(!settings.music)return stop();let c=init();if(!c)return;c.resume();apply(settings);if(!timer){tick();timer=setInterval(tick,360)}}
 function stop(){if(timer){clearInterval(timer);timer=null}if(musicGain&&context)musicGain.gain.setTargetAtTime(0,context.currentTime,.06)}
 function apply(next){settings={...DEFAULTS,...next};if(!init())return;master.gain.setTargetAtTime(settings.masterVolume,context.currentTime,.03);musicGain.gain.setTargetAtTime(settings.music?settings.musicVolume:0,context.currentTime,.04);sfxGain.gain.setTargetAtTime(settings.sfx?settings.sfxVolume:0,context.currentTime,.03);if(settings.music&&!timer&&context.state==='running')start(settings);if(!settings.music)stop()}
 function sfx(kind='click'){if(!settings.sfx)return;let notes={click:[72,.05,'square',.018],equip:[64,.15,'triangle',.04],level:[60,.25,'sine',.05],error:[38,.22,'sawtooth',.035],boss:[34,.45,'square',.045]},p=notes[kind]||notes.click;tone(p[0],p[1],p[2],p[3],sfxGain)}
 function snapshot(){return{running:Boolean(timer),settings:{...settings}}}
 return{start,stop,apply,sfx,snapshot};
}
return{DEFAULTS,ensure,create};
});
