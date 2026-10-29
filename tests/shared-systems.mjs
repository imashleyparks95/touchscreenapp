import assert from 'node:assert/strict';
import {createLifetime} from '../dist/js/shared/lifetime.js';
import {bindPointers,pointerPoint} from '../dist/js/shared/pointers.js';
import {menuUsable,stepSelect,menuNeighbor} from '../dist/js/shared/menu.js';
import {presentationSettings,validatePresentationSettings,decorativeCount} from '../dist/js/shared/presentation.js';
import {createMusicClock} from '../dist/js/shared/music-clock.js';

const errors=[],order=[],owner=createLifetime({onError:e=>errors.push(e.message)}),events=new EventTarget();let calls=0;
owner.listen(events,'ping',()=>calls++);events.dispatchEvent(new Event('ping'));
owner.defer(()=>order.push('first'));owner.defer(()=>{throw Error('one resource failed');});owner.defer(()=>order.push('last'));
owner.dispose();owner.dispose();events.dispatchEvent(new Event('ping'));owner.defer(()=>order.push('late'));
assert.equal(calls,1);assert.deepEqual(order,['last','first','late']);assert.deepEqual(errors,['one resource failed']);

const win=new EventTarget(),doc=new EventTarget();doc.defaultView=win;doc.hidden=false;
class Surface extends EventTarget{
 constructor(){super();this.ownerDocument=doc;this.captures=new Set();this.rect={left:100,top:50,width:200,height:100};}
 getBoundingClientRect(){return this.rect;}
 setPointerCapture(id){this.captures.add(id);}
 hasPointerCapture(id){return this.captures.has(id);}
 releasePointerCapture(id){this.captures.delete(id);this.emit('lostpointercapture',id);}
 emit(type,id,x=120,y=60,button=0){const e=new Event(type,{cancelable:true});Object.assign(e,{pointerId:id,clientX:x,clientY:y,button});this.dispatchEvent(e);return e;}
}
const target=new Surface(),logs=[];let enabled=true;
const input=bindPointers(target,{enabled:()=>enabled,maxPointers:2,down:(c,e)=>({owner:e.clientX<200?'left':'right'}),move:(c,e,delta)=>logs.push(['move',c.id,c.data.owner,delta]),up:c=>logs.push(['up',c.id]),cancel:c=>logs.push(['cancel',c.id])});
assert.deepEqual(pointerPoint(target,{clientX:150,clientY:75},{width:1000,height:500}),{x:250,y:125});
target.rect={left:20,top:10,width:400,height:200};assert.deepEqual(pointerPoint(target,{clientX:220,clientY:110},{width:1000,height:500}),{x:500,y:250});
target.rect.width=0;assert.equal(pointerPoint(target,{clientX:220,clientY:110}),null);target.rect.width=400;
target.emit('pointerdown',1,100,50);target.emit('pointerdown',2,300,100);target.emit('pointerdown',3);target.emit('pointerdown',1);assert.equal(input.size,2);
target.emit('pointermove',1,350,80);target.emit('pointermove',2,50,50);target.emit('pointermove',99);assert.deepEqual(logs.slice(0,2),[['move',1,'left',{x:250,y:30}],['move',2,'right',{x:-250,y:-50}]]);
target.emit('pointercancel',1);target.emit('pointerup',1);target.emit('pointerup',2);assert.deepEqual(logs.slice(2),[['cancel',1],['up',2]]);assert.equal(target.captures.size,0);
target.emit('pointerdown',4);enabled=false;target.emit('pointermove',4);assert.equal(input.size,0);enabled=true;
target.emit('pointerdown',5);win.dispatchEvent(new Event('blur'));assert.equal(input.size,0);
target.emit('pointerdown',6);doc.hidden=true;doc.dispatchEvent(new Event('visibilitychange'));assert.equal(input.size,0);doc.hidden=false;
target.emit('pointerdown',7);input.dispose();input.dispose();assert.equal(target.captures.size,0);target.emit('pointerdown',8);assert.equal(input.size,0);

const node=(x,y)=>({disabled:false,hidden:false,closest:()=>null,getClientRects:()=>[{}],getBoundingClientRect:()=>({x,y,width:40,height:40})});
const a=node(0,0),b=node(100,0),c=node(0,100);assert.equal(menuNeighbor([a,b,c],a,1,0),b);assert.equal(menuNeighbor([a,b,c],a,0,1),c);assert.equal(menuNeighbor([a,b,c],c,0,1),a);assert.equal(menuNeighbor([],a,1,0),null);
b.disabled=true;assert.equal(menuUsable(b),false);b.disabled=false;b.closest=()=>({inert:true});assert.equal(menuUsable(b),false);
let changes=0;const select={options:[{}, {disabled:true}, {parentElement:{disabled:true}},{}],selectedIndex:0,dispatchEvent:()=>changes++};
stepSelect(select,1);assert.equal(select.selectedIndex,3);stepSelect(select,1);assert.equal(changes,1);stepSelect(select,1,{wrap:true});assert.equal(select.selectedIndex,0);select.options.forEach(o=>o.disabled=true);assert.equal(stepSelect(select,1),false);

assert.deepEqual(presentationSettings(),{effects:'full'});assert.equal(decorativeCount(20,{presentation:{effects:'reduced'}}),5);assert.equal(decorativeCount(20,{reduceMotion:true}),5);assert.equal(decorativeCount(20,{presentation:{effects:'off'}}),0);assert.equal(decorativeCount(NaN),0);
validatePresentationSettings({});for(const presentation of [null,[],{effects:'invalid'},{effects:1}])assert.throws(()=>validatePresentationSettings({presentation}),/Presentation/);
validatePresentationSettings({presentation:{effects:'off'}});

let state={ready:false,muted:false,musicOn:true,music:20},beats=0,quiet=0,created=0;const timers=new Map();
const clock=createMusicClock({doc,win,getState:()=>state,onBeat:()=>beats++,onQuiet:()=>quiet++,schedule:fn=>{timers.set(++created,fn);return created;},unschedule:id=>timers.delete(id)});
clock.sync();assert.equal(timers.size,0,'never unlock audio automatically');state.ready=true;clock.sync();clock.sync();assert.equal(timers.size,1);assert.equal(created,1,'unrelated settings do not restart musical phase');[...timers.values()][0]();assert.equal(beats,1);
for(const patch of [{muted:true},{music:0},{musicOn:false},{backgroundSuspended:true}]){const old={...state};Object.assign(state,patch);clock.sync();assert.equal(timers.size,0);state=old;clock.sync();assert.equal(timers.size,1);}
doc.hidden=true;doc.dispatchEvent(new Event('visibilitychange'));assert.equal(timers.size,0);doc.hidden=false;doc.dispatchEvent(new Event('visibilitychange'));assert.equal(timers.size,1);win.dispatchEvent(new Event('pagehide'));assert.equal(timers.size,0);clock.dispose();clock.sync();assert.equal(timers.size,0);assert.ok(quiet>=3);

// Exercise the actual shared audio module, including scheduled voice cleanup.
globalThis.localStorage={getItem:()=>null,setItem(){}};globalThis.matchMedia=()=>({matches:false});globalThis.document=doc;
const realInterval=globalThis.setInterval,realClear=globalThis.clearInterval;globalThis.setInterval=fn=>{timers.set(++created,fn);return created;};globalThis.clearInterval=id=>timers.delete(id);
let contexts=0,starts=0,stops=0;const gains=[];
class AudioContext{
 constructor(){contexts++;this.state='running';this.currentTime=1;this.destination={};}
 createGain(){const values=[],gain={setTargetAtTime:v=>values.push(v),setValueAtTime(){},exponentialRampToValueAtTime(){}};gains.push(values);return{gain,connect(){},disconnect(){}};}
 createAnalyser(){return{connect(){},getByteFrequencyData(){},frequencyBinCount:128};}
 createOscillator(){return{frequency:{setValueAtTime(){}},connect(){},disconnect(){},start(){starts++;},stop(){stops++;}};}
}
globalThis.window={AudioContext};const {DB,backupJSON,parseBackup}=await import('../dist/js/data.js');const audio=await import('../dist/js/audio.js');
assert.equal(contexts,0);DB.settings.muted=true;audio.fx();assert.equal(contexts,0);
DB.settings.muted=false;DB.settings.musicOn=true;audio.audio();audio.applyAudio();assert.equal(contexts,1);assert.equal(timers.size,1);
const clockId=[...timers.keys()][0];audio.applyAudio();assert.equal([...timers.keys()][0],clockId);
audio.fx('win');assert.equal(starts,4);const before=stops;doc.hidden=true;doc.dispatchEvent(new Event('visibilitychange'));assert.equal(stops,before+4,'hidden page stops queued celebratory voices');assert.equal(timers.size,0);audio.fx('win');assert.equal(starts,4);assert.equal(gains[0].at(-1),0);
doc.hidden=false;doc.dispatchEvent(new Event('visibilitychange'));assert.equal(gains[0].at(-1),1);audio.muteBackground(true);assert.equal(timers.size,0);audio.muteBackground(false);assert.equal(timers.size,1);audio.fx('win');const beforePagehide=stops;win.dispatchEvent(new Event('pagehide'));assert.equal(stops,beforePagehide+4);assert.equal(gains[0].at(-1),0);win.dispatchEvent(new Event('pageshow'));assert.equal(gains[0].at(-1),1);DB.settings.muted=true;audio.applyAudio();assert.equal(timers.size,0);
DB.settings.presentation={effects:'reduced'};assert.equal(parseBackup(backupJSON(DB,[])).data.settings.presentation.effects,'reduced');delete DB.settings.presentation;parseBackup(backupJSON(DB,[]));const invalid=JSON.parse(backupJSON(DB,[]));invalid.data.settings.presentation={effects:'ultra'};assert.throws(()=>parseBackup(JSON.stringify(invalid)),/Presentation/);
globalThis.setInterval=realInterval;globalThis.clearInterval=realClear;
console.log('PASS: independent lifetime disposal/error isolation, scaled two-contact input and cancellation, common menu selection, bounded decorative settings/backup compatibility, one music clock and actual shared audio mute/hidden cleanup. Device/audio fixtures, not physical hardware or audible QA.');
