import {BenchmarkRun,FrameLog} from '../3d/benchmark.js';
import {LivingForest,FOREST_SEED} from './core.js';
import {ExpeditionArea} from './journey.js';
export const SUITE_EDITION='four-worlds-v1';
export const SUITE_STAGES=Object.freeze([
 {id:'forest',name:'Forest environment',zone:'forest',seconds:8},
 {id:'interior',name:'Castle interior lighting',zone:'castle',seconds:8},
 {id:'combat',name:'Arena animation and combat',zone:'arena',seconds:8},
 {id:'physics',name:'Chamber physics and particles',zone:'chaos',seconds:8},
 {id:'combined',name:'Chamber combined load',zone:'chaos',seconds:8}
]);
export function suiteModel(stage,software=false){
 const model=stage.zone==='forest'?new LivingForest({players:1,seed:FOREST_SEED,encounters:false}):new ExpeditionArea({id:stage.zone,players:1,seed:FOREST_SEED});
 if(stage.zone==='chaos')model.configureChamber({characters:stage.id==='combined'?4:0,enemies:stage.id==='combined'?4:0,physics:24,projectiles:12,particles:80,lights:stage.id==='combined'?4:0,complexity:2},software);
 // Benchmark actors are invulnerable so workload cannot disappear through a death/reset.
 for(const unit of model.units){unit.hp=unit.maxHP=1e9;}
 if(stage.zone==='arena'){model.players[0].reset({x:0,z:0});model.enemies.forEach((u,i)=>u.reset({x:(i-1)*2,z:3}));}
 return model;
}
/** Fixed 60 Hz scripted intents; the caller renders and measures real wall frames. */
export function suiteStep(model,seconds){
 const tick=Math.floor(model.clock*60),cycle=tick%240;
 model.update(seconds,[{x:cycle<120?.35:-.35,z:0,attack:tick%48===0,cast:tick%120===0,dodge:tick%180===0}]);
}
export function suiteCamera(runtime,stage,progress){
 const {B,camera}=runtime,t=Math.max(0,Math.min(1,progress)),a=-Math.PI/2+t*.65;
 const center=stage.zone==='forest'?[0,1,-8]:stage.zone==='castle'?[0,1,7]:[0,1,0];
 camera.setPosition(new B.Vector3(center[0]+Math.cos(a)*12,7,center[2]+Math.sin(a)*12));camera.setTarget(new B.Vector3(...center));
}
export function suiteResult(parts){
 if(parts.length!==SUITE_STAGES.length||parts.some((p,i)=>p.metadata.scenario!==SUITE_STAGES[i].id))throw Error('Incomplete benchmark suite');
 const log=new FrameLog();for(const part of parts)for(const ms of part.frameTimesMs)log.add(ms);
 return{version:1,seed:FOREST_SEED,warmupSeconds:3,settings:parts[0].settings,metadata:{...parts[0].metadata,baseline:SUITE_EDITION,scope:'Five actual area workloads; load and per-scene warm-up excluded',adaptiveQuality:false},frameTimesMs:[...log.samples],overall:log.report(),stages:parts.map(p=>({...p.stages[0],metadata:p.metadata,frameTimesMs:p.frameTimesMs})),formula:parts[0].formula};
}
export function suiteRun(stage,settings,metadata){return new BenchmarkRun({stages:[{name:stage.name,seconds:stage.seconds}],warmup:3,seed:FOREST_SEED,settings,metadata:{...metadata,baseline:SUITE_EDITION,scenario:stage.id,zone:stage.zone,adaptiveQuality:false,simulationHz:60}});}
export function comparisonKey(r){return JSON.stringify([r.metadata.baseline,r.seed,r.metadata.renderer,r.metadata.glInfo,r.metadata.browser,r.metadata.renderWidth,r.metadata.renderHeight,r.settings]);}

export function suiteCSV(result){
 const quote=v=>'"'+String(v??'N/A').replaceAll('"','""')+'"';
 const rows=[['edition','renderer','browser','width','height','preset'],[result.metadata.baseline,result.metadata.renderer,result.metadata.browser,result.metadata.renderWidth,result.metadata.renderHeight,result.settings.label],[],['scenario','frames','average_fps','one_percent_low_fps','median_ms','p95_ms','spikes_over_50ms'],...result.stages.map(stage=>[stage.name,stage.frames,stage.averageFPS,stage.onePercentLowFPS,stage.medianMs,stage.p95Ms,stage.spikes]),[],['scenario','frame_index','frame_ms']];
 for(const stage of result.stages)stage.frameTimesMs.forEach((ms,i)=>rows.push([stage.name,i,ms]));
 return rows.map(row=>row.map(quote).join(',')).join('\r\n');
}
