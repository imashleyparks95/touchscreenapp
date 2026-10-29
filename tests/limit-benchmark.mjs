import assert from 'node:assert/strict';
import {SUITE_STAGES,suiteModel,suiteStep,suiteRun,suiteResult,comparisonKey} from '../dist/js/limit/benchmark-suite.js';
import {recommendPreset,benchmarkCSV} from '../dist/js/3d/benchmark.js';
const parts=[];
for(const stage of SUITE_STAGES){
 const a=suiteModel(stage,true),b=suiteModel(stage,true);
 for(let i=0;i<300;i++){suiteStep(a,1/60);suiteStep(b,1/60);}
 assert.deepEqual(a.players.map(p=>[p.x,p.z,p.hp]),b.players.map(p=>[p.x,p.z,p.hp]));assert.ok(a.units.every(u=>u.alive));if(['combat','combined'].includes(stage.id)){assert.ok(a.events.some(e=>e.type==='hit'),'benchmark produces real contact damage events');assert.ok(a.events.some(e=>e.type==='pulse'),'benchmark produces real ranged pulses');}
 if(stage.zone==='chaos'){assert.equal(a.chamber.physics,12);assert.equal(a.chamber.particles,24);assert.equal(a.chamber.lights,0);}
 const run=suiteRun(stage,{label:'Low'},{renderer:'Fixture',renderWidth:900,renderHeight:550});
 assert.throws(()=>run.result(),/incomplete/);for(let i=0;i<112;i++)run.frame(100);
 const r=run.result();assert.equal(r.overall.averageFPS,10);assert.ok(r.overall.frames>=80);parts.push(r);
}
assert.throws(()=>suiteResult(parts.slice(1)),/Incomplete/);
const result=suiteResult(parts);assert.equal(result.stages.length,5);assert.equal(result.overall.frames,result.frameTimesMs.length);assert.equal(result.overall.averageFPS,10);assert.ok(benchmarkCSV(result).includes('Castle interior lighting'));
const changed=structuredClone(result);changed.metadata.renderWidth++;assert.notEqual(comparisonKey(changed),comparisonKey(result));changed.metadata.renderWidth--;changed.metadata.baseline='living-forest-v2-navigation';assert.notEqual(comparisonKey(changed),comparisonKey(result));
assert.equal(recommendPreset([{preset:'high',report:{averageFPS:60,onePercentLowFPS:10,p95Ms:100}}],60).metTarget,false);
assert.equal(recommendPreset([{preset:'low',report:{averageFPS:62,onePercentLowFPS:50,p95Ms:19}}],60).metTarget,true);
console.log('PASS: five seeded workloads repeat, compatibility caps, warm-up exclusion, incomplete-run rejection, raw-frame aggregation, exports, comparison separation and frame-pacing tuning (explicit 10 FPS fixture).');
const memory=new Map();globalThis.matchMedia=()=>({matches:false});globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
const data=await import('../dist/js/data.js');data.DB.settings.limitBreak={preset:'low',history:[{...result,id:'suite-fixture',at:Date.now()}]};
const backup=data.parseBackup(data.backupJSON(data.DB,[]));assert.equal(backup.data.settings.limitBreak.history[0].stages.length,5);
backup.data.settings.limitBreak.history[0].stages[1].frameTimesMs.pop();assert.throws(()=>data.parseBackup(JSON.stringify(backup)),/incomplete/);
console.log('PASS: real schema-3 suite backup roundtrip and per-scenario raw-sample corruption rejection.');
