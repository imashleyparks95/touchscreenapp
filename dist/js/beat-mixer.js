// The same channel graph is used by live and OfflineAudioContext rendering.
export const trackFX=t=>({low:0,mid:0,high:0,delay:0,reverb:0,...t?.fx});
export function validateFX(t){const f=trackFX(t);if(!['low','mid','high'].every(k=>Number.isFinite(f[k])&&Math.abs(f[k])<=12)||!['delay','reverb'].every(k=>Number.isFinite(f[k])&&f[k]>=0&&f[k]<=.7))throw Error('Invalid mixer effects.');}
export const effectTail=t=>Math.max(trackFX(t).delay?1.5:0,trackFX(t).reverb?1.2:0);
export function createChannel(context,destination,track,{meter=false}={}){const nodes=[],make=(method,...args)=>{const n=context[method](...args);nodes.push(n);return n;},input=make('createGain'),f=trackFX(track);let last=input;
 for(const [type,hz,gain]of [['lowshelf',200,f.low],['peaking',1200,f.mid],['highshelf',5000,f.high]]){const node=make('createBiquadFilter');node.type=type;node.frequency.value=hz;node.Q.value=.7;node.gain.value=gain;last.connect(node);last=node;}
 const sum=make('createGain');last.connect(sum);
 if(f.delay){const delay=make('createDelay',2),wet=make('createGain');delay.delayTime.value=.25;wet.gain.value=f.delay;last.connect(delay);delay.connect(wet);wet.connect(sum);const second=make('createDelay',2),wet2=make('createGain');second.delayTime.value=.25;wet2.gain.value=f.delay*.35;delay.connect(second);second.connect(wet2);wet2.connect(sum);}
 if(f.reverb){const convolver=make('createConvolver'),wet=make('createGain'),ir=context.createBuffer(2,Math.ceil(context.sampleRate*1.2),context.sampleRate);let seed=19283;for(let c=0;c<2;c++){const a=ir.getChannelData(c);for(let i=0;i<a.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;a[i]=(seed/2147483648-1)*Math.exp(-6*i/a.length)*.15;}}convolver.buffer=ir;wet.gain.value=f.reverb;last.connect(convolver);convolver.connect(wet);wet.connect(sum);}
 let analyser=null;if(meter){analyser=make('createAnalyser');analyser.fftSize=1024;sum.connect(analyser);analyser.connect(destination);}else sum.connect(destination);
 return{input,analyser,dispose(){for(const n of nodes)n.disconnect();}};}
export function readMeter(analyser){if(!analyser)return{peak:0,rms:0};const a=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(a);let peak=0,sum=0;for(const x of a){peak=Math.max(peak,Math.abs(x));sum+=x*x;}return{peak,rms:Math.sqrt(sum/a.length)};}
