import assert from 'node:assert/strict';
import {GameModel,BUG_COLORS} from '../dist/js/refine-core.js';
import {balloonLabel,reactionCue,drawReactionGame} from '../dist/js/reaction-art.js';
// Legal clocks/taps, all difficulties and both learning choices; no forced scores/completion.
for(const game of ['bugs','balloons'])for(let difficulty=1;difficulty<=5;difficulty++)for(const learn of [false,true]){
 const a=new GameModel({game,difficulty,learn,seed:7841}),b=new GameModel({game,difficulty,learn,seed:7841});
 for(let i=0;i<1500&&!a.done;i++)for(const m of [a,b]){
  m.update(50);const target=[...m.items].reverse().find(item=>item.y-item.r>125&&item.y+item.r<630&&(game==='bugs'?item.color===m.target:m.balloonCorrect(item)));
  if(target)m.input('down',target.x,target.y,1);
 }
 assert.ok(a.done);assert.ok(a.hits>0);assert.deepEqual(a.summary('same'),b.summary('same'));assert.ok(a.duration+a.bonusTime<=70000);
}
const m=new GameModel({game:'balloons',difficulty:1,learn:true,seed:42});
for(const type of ['normal','gold','speed','tiny','armor','time','mystery'])for(let color=0;color<5;color++)assert.equal(balloonLabel(m,{type,color,label:12}),BUG_COLORS[color].mark,'special artwork cannot hide the actual learning color/symbol');
m.difficulty=4;for(const type of ['armor','gold','time','mystery'])assert.equal(balloonLabel(m,{type,color:0,label:72}),'72','armor hit count never replaces learning answer');
// Real mystery branch, then verify all existing/new balloons slow only during its active window.
const breeze=new GameModel({game:'balloons',difficulty:3,seed:1});breeze.items=[{...breeze.makeBalloon(),x:500,y:350,r:40,type:'mystery',hp:1,nextTap:0}];breeze.rng=()=>.9;breeze.tapBalloon(500,350);assert.equal(breeze.slowUntil,3000);
const item={...breeze.makeBalloon(),x:500,y:550,r:40,type:'normal',path:'drift',speed:100};breeze.items=[item];breeze.spawnAt=1e9;const y=item.y;breeze.update(50);assert.ok(Math.abs(y-item.y-3.25)<1e-9);assert.equal(item.speed,100);
breeze.clock=3000;const y2=item.y;breeze.update(50);assert.ok(Math.abs(y2-item.y-5)<1e-9);assert.equal(item.speed,100);
const hidden={...item,y:60,r:30};breeze.items=[hidden];breeze.update(1);assert.ok(!breeze.items.includes(hidden));assert.equal(breeze.misses,1);
for(const game of ['bugs','balloons']){const model=new GameModel({game,difficulty:3});model.input('down',500,40,1);assert.equal(model.errors,0,'prompt band is not an incorrect gameplay tap');}
const calls=[],context=new Proxy({}, {get:(o,k)=>o[k]??(k==='createLinearGradient'?()=>({addColorStop(){}}):(...args)=>{if(k==='fillText')calls.push(args[0]);assert.ok(args.every(a=>typeof a!=='number'||Number.isFinite(a)));}),set:(o,k,v)=>(o[k]=v,true)});
for(const game of ['bugs','balloons']){const model=new GameModel({game,difficulty:5,learn:true});model.update(100);drawReactionGame(context,model,{reduceMotion:true,effects:'off'});assert.ok(reactionCue(model).title);}
assert.ok(calls.some(t=>String(t).includes('FIND')));
console.log('PASS: 20 legal full seeded rounds, real scoring/learning fairness, special balloon answer visibility, actual temporary mystery breeze/expiry/new spawns, hidden-target exit, prompt tap protection and finite reduced-effects art.');
const memory=new Map();globalThis.matchMedia=()=>({matches:false});globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
const data=await import('../dist/js/data.js'),{refinedBoard}=await import('../dist/js/refined.js'),id=data.DB.active;
const entry={id,score:9999,hits:10,errors:0,misses:0,duration:60,soloWin:true};
for(const [ruleset,score]of [['refinement-v1',9999],['balloon-breeze-v2',100]])data.commitRound([{...entry,score}],{game:'balloons',difficulty:3,learn:false,mode:'solo',ruleset,levelId:'classic-1',competition:'classic',challengeKey:'skill',seed:1});
assert.equal(refinedBoard('balloons',3,'classic','solo')[0].result.score,100);assert.equal(refinedBoard('balloons',3,'classic','solo',false,1,'all',false,'refinement-v1')[0].result.score,9999);
const restored=data.parseBackup(data.backupJSON(data.DB,[]));assert.ok(restored.data.profiles.find(p=>p.id===id).results.some(r=>r.ruleset==='refinement-v1'&&r.score===9999));assert.ok(restored.data.profiles.find(p=>p.id===id).results.some(r=>r.ruleset==='balloon-breeze-v2'&&r.score===100));
console.log('PASS: real corrected/legacy Balloon leaderboards remain separate and both editions roundtrip through schema-3 backups without rewriting old records.');
