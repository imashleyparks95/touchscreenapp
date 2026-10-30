import assert from 'node:assert/strict';
import {createTouchNative} from '../dist/js/touch-native.js';
import {NinjaModel} from '../dist/js/ninja-core.js';
import {SlimeModel} from '../dist/js/slime-core.js';
import {motionPose} from '../dist/js/motion-art.js';
const pad=i=>({index:i,id:'Fixture '+i,mapping:'standard',connected:true,axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))});
for(const game of ['ninja','slime']){
 let devices=[pad(0),pad(1)],pauses=0;const models=[0,1].map(()=>game==='slime'?new SlimeModel({level:25}):new NinjaModel({level:1})),native=createTouchNative({game,getPads:()=>devices,onPause:()=>pauses++}),press=(i,b,value)=>devices[i].buttons[b]={pressed:value,value:value?1:0},tick=(n=1)=>{for(let j=0;j<n;j++){native.update(models,1/60,true);models.forEach(m=>m.update(1000/60));}};
 native.update(models,0,false);tick();
 if(game==='ninja'){
  const x=models[0].ninja.x,other=models[1].ninja.x;devices[0].axes[0]=1;tick(20);assert.ok(models[0].ninja.x>x+25);assert.equal(models[1].ninja.x,other);devices[0].axes[0]=0;tick();const stop=models[0].ninja.x;tick(5);assert.equal(models[0].ninja.x,stop);
  press(0,2,true);tick();assert.ok(models[0].energy<models[0].maxEnergy);assert.equal(models[1].energy,models[1].maxEnergy);press(0,2,false);tick(25);press(0,0,true);tick();press(0,0,false);tick(15);assert.equal(models[0].dashCount,1);assert.ok(models[0].ninja.x>stop+50,'button-only dash continues after release');
  press(1,4,true);tick(3);assert.ok(models[1].shieldPointers.size);native.cancel(models);assert.equal(models[1].shieldPointers.size,0);
  const a=motionPose(models[0]),b=motionPose(models[0]);assert.equal(a.walk,b.walk,'stationary characters do not walk');
 }else{
  devices[0].axes=[1,-.3,0,0];press(0,7,true);tick(40);assert.equal(models[0].pointers.size,1);assert.equal(models[1].pointers.size,0);const before=models[0].blobs[0].center.x;press(0,7,false);tick(12);assert.equal(models[0].pointers.size,0);assert.ok(models[0].blobs[0].center.x>before+10,'release uses real forward physics impulse');
  press(0,2,true);tick();assert.equal(models[0].blobs.length,2);press(0,2,false);tick();press(0,5,true);tick();press(0,5,false);press(0,3,true);tick();assert.equal(models[0].blobs.length,1,'reset remains safe after selecting blob two');press(0,3,false);tick();press(0,4,true);tick();assert.equal(models[0].pointers.size,1);native.cancel(models);assert.equal(models[0].pointers.size,0);
 }
 tick();devices=[null,devices[1]];native.update(models,1/60,true);assert.equal(pauses,1);native.dispose(models);assert.equal(native.hub.slots.filter(Boolean).length,0);
}
console.log('PASS: actual two-player controller ownership, neutral edges, movement/stopping, sustained dash, real star/shield rules, real charged slime impulse, split/select/reset/anchor cleanup, disconnect pause and disposal. Controller devices are fixtures, not hardware evidence.');

// Held launch buttons must be released after joining/context changes.
const heldPad=pad(5);heldPad.buttons[7]={pressed:true,value:1};const slime=new SlimeModel({level:1}),safe=createTouchNative({game:'slime',getPads:()=>[heldPad]});for(let i=0;i<10;i++)safe.update([slime],1/60,true);assert.equal(slime.pointers.size,0);heldPad.buttons[7]={pressed:false,value:0};safe.update([slime],1/60,true);heldPad.buttons[7]={pressed:true,value:1};safe.update([slime],1/60,true);assert.equal(slime.pointers.size,1);safe.dispose([slime]);assert.equal(slime.pointers.size,0);
for(const [button,field]of [[1,'slideCount'],[3,'blinkCount'],[5,'jumpCount']]){const p=pad(0),m=new NinjaModel({level:1});if(button===5){m.ninja.x=370;m.ninja.y=150;}const control=createTouchNative({game:'ninja',getPads:()=>[p]});control.update([m],1/60,true);p.buttons[button]={pressed:true,value:1};control.update([m],1/60,true);assert.equal(m[field],1);control.dispose([m]);}
console.log('PASS: held-trigger join protection plus native slide, blink and legal wall-adjacent jump invoke actual core abilities (isolated position fixture for wall jump).');
// Exercise native selection and aim overlays with actual soft bodies and finite drawing coordinates.
globalThis.devicePixelRatio=1;const {renderSlime,renderNinja}=await import('../dist/js/touch-render.js'),context=new Proxy({}, {get:(o,k)=>o[k]??(k==='createLinearGradient'?()=>({addColorStop(){}}):(...args)=>{assert.ok(args.every(a=>typeof a!=='number'||Number.isFinite(a)));}),set:(o,k,v)=>(o[k]=v,true)}),canvas={width:1000,height:640,getBoundingClientRect:()=>({width:1000,height:640}),getContext:()=>context},split=new SlimeModel({level:25});split.split();renderSlime(canvas,split,'cosmic',{showNative:true,selected:1,reduceMotion:true,effects:'off'});renderNinja(canvas,new NinjaModel({level:13}),'moon',{showAim:true,aim:{x:1,y:0},reduceMotion:true,effects:'off'});
console.log('PASS: selected split-blob/aim overlays and reduced-effects motion artwork render with finite coordinates.');
const pinPad=pad(0),resetSlime=new SlimeModel({level:25}),pinControl=createTouchNative({game:'slime',getPads:()=>[pinPad]});pinControl.update([resetSlime],1/60,true);pinPad.buttons[4]={pressed:true,value:1};pinControl.update([resetSlime],1/60,true);assert.equal(resetSlime.pointers.size,1);resetSlime.reset();pinPad.buttons[4]={pressed:false,value:0};pinControl.update([resetSlime],1/60,true);pinPad.buttons[4]={pressed:true,value:1};pinControl.update([resetSlime],1/60,true);assert.equal(resetSlime.pointers.size,1,'an external model reset must not consume the next anchor press');pinControl.dispose([resetSlime]);
console.log('PASS: native anchor selection recovers after a model-driven reset without a lost button press.');
