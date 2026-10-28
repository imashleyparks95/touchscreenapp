import assert from 'node:assert/strict';
import {FOREST_INPUT_DEFAULTS,forestInputSettings,showForestTouch,rotateForestCamera,bindForestLook} from '../dist/js/limit/input-settings.js';
import {validateForestSettings} from '../dist/js/limit/records.js';

assert.deepEqual(forestInputSettings(),FOREST_INPUT_DEFAULTS);
assert.deepEqual(forestInputSettings({controllerLook:99,touchLook:-1,lookDeadzone:2,touchControls:'invalid'}),{...FOREST_INPUT_DEFAULTS,controllerLook:2,touchLook:.25,lookDeadzone:.4});
validateForestSettings({limitBreak:{preset:'low',history:[]}}); // older backups need no new fields
const preferences={controllerLook:1.5,touchLook:.75,lookDeadzone:.22,invertY:true,touchControls:'hide'};
validateForestSettings({limitBreak:{preset:'low',history:[],input:preferences}});
for(const input of [{controllerLook:3},{touchLook:'1'},{lookDeadzone:0},{invertY:1},{touchControls:'other'},null,[]])assert.throws(()=>validateForestSettings({limitBreak:{preset:'low',history:[],input}}),/input setting/i);
assert.equal(showForestTouch(),false,'desktop auto starts uncluttered');
assert.equal(showForestTouch({hasTouch:true}),true,'touch device retains controls');
assert.equal(showForestTouch({hasTouch:true,controllers:1,lastInput:'controller'}),false,'solo controller can hide auto controls');
assert.equal(showForestTouch({hasTouch:true,players:2,controllers:1,lastInput:'controller'}),true,'mixed co-op keeps the second player controls');
assert.equal(showForestTouch({hasTouch:true,players:2,controllers:2,lastInput:'controller'}),false);
assert.equal(showForestTouch({lastInput:'controller',activeTouches:1}),true,'never auto-hide an active gesture');
assert.equal(showForestTouch({lastInput:'touch',controllers:2}),true,'touch handoff restores auto controls');
assert.equal(showForestTouch({preference:'hide',hasTouch:true,activeTouches:1}),false,'explicit hide is respected and caller cancels captures');
assert.equal(showForestTouch({preference:'show',controllers:2}),true);
const camera={alpha:0,beta:.8,lowerBetaLimit:.4,upperBetaLimit:1.3};
rotateForestCamera(camera,1,1,.2,.1);assert.equal(camera.alpha,-.2);assert.equal(camera.beta,.9);
rotateForestCamera(camera,0,1,0,.1,true);assert.equal(camera.beta,.8);
rotateForestCamera(camera,0,99,0,1);assert.equal(camera.beta,1.3);rotateForestCamera(camera,0,-99,0,1);assert.equal(camera.beta,.4);

let enabled=true;const listeners=new Map(),capture=new Set(),moves=[];
const target={addEventListener:(k,f)=>listeners.set(k,f),removeEventListener:k=>listeners.delete(k),setPointerCapture:id=>capture.add(id),hasPointerCapture:id=>capture.has(id),releasePointerCapture:id=>capture.delete(id)};
const binder=bindForestLook(target,{enabled:()=>enabled,onLook:(x,y)=>moves.push([x,y])});
const emit=(type,id,x=0,y=0)=>listeners.get(type)?.({pointerId:id,clientX:x,clientY:y,preventDefault(){}});
emit('pointerdown',4,10,10);emit('pointerdown',5,0,0);emit('pointermove',5,30,40);assert.deepEqual(moves,[],'foreign pointers cannot steal the shared camera');
emit('pointermove',4,25,5);assert.deepEqual(moves,[[15,-5]]);assert.ok(capture.has(4));
enabled=false;emit('pointermove',4,100,100);assert.equal(capture.size,0,'disabled/paused camera releases its capture');assert.equal(moves.length,1);
enabled=true;emit('pointerdown',7);binder.cancel();assert.equal(capture.size,0);emit('pointerdown',8);binder.dispose();assert.equal(capture.size,0);assert.equal(listeners.size,0);
console.log('PASS: backward-compatible Forest input preferences, bounds/invalid backup rejection, mixed-input visibility, camera inversion/limits, independent look-pointer ownership and pause/disposal capture cleanup. Fixtures, not physical touch.');
