import {adventureRecordRows} from '../dist/js/limit/records.js';
import assert from 'node:assert/strict';
import {distance} from '../dist/js/3d/math.js';
import {LimitExpedition,ExpeditionArea,JOURNEY_AREAS,chamberSettings,chamberLimits,CHAMBER_DEFAULTS} from '../dist/js/limit/journey.js';
import {FOREST_SWITCH,LANTERNS} from '../dist/js/limit/core.js';
import {instructionContent} from '../dist/js/game-instructions.js';

assert.equal(JOURNEY_AREAS.length,4);assert.match(instructionContent('limit',{mode:'journey'}).win,/Castle/);assert.match(instructionContent('limit',{mode:'journey'}).score,/completed four-area/);
assert.deepEqual(chamberSettings({characters:99,enemies:99,physics:99,projectiles:99,particles:999,lights:99,complexity:99},true),chamberLimits(true));
assert.equal(chamberSettings({physics:-3}).physics,0);assert.equal(chamberSettings({physics:NaN}).physics,CHAMBER_DEFAULTS.physics);
const load=new ExpeditionArea({id:'chaos'}),required=load.requiredEnemies;load.configureChamber(chamberLimits(true),true);assert.equal(load.requiredEnemies,required);assert.equal(load.enemies.filter(unit=>unit.optional).length,2);load.configureChamber(CHAMBER_DEFAULTS,true);assert.equal(load.enemies.filter(unit=>unit.optional).length,0);assert.equal(load.npcs.length,0);assert.equal(load.chamber.physics,8);

let completedSummary;
for(const players of [1,2]){
 const expedition=new LimitExpedition({players});assert.equal(expedition.advance(),false);assert.equal(expedition.summary().score,0);
 for(const definition of JOURNEY_AREAS){
  const model=expedition.current;assert.equal(model.zoneId,definition.id);
  const input=()=>model.players.map(player=>{const enemy=model.enemies.filter(unit=>unit.alive).sort((a,b)=>distance(player,a)-distance(player,b))[0];return enemy&&player.alive?{attack:distance(player,enemy)<1.7,cast:distance(player,enemy)>=1.7&&distance(player,enemy)<9}:{};});
  function tick(){model.update(1/60,input());model.events.length=0;}
  function go(target){for(let i=0;i<players;i++)model.navigate(i,{x:target.x+(i?.5:0),z:target.z});for(let step=0;step<6000;step++){tick();if(model.players.every(player=>player.alive&&distance(player,target)<(players===2?1.9:1.5)))return;const fighting=model.enemies.some(enemy=>enemy.alive&&model.players.some(player=>distance(player,enemy)<4));if(step%45===0&&!fighting)for(let i=0;i<players;i++)model.navigate(i,{x:target.x+(i?.5:0),z:target.z});}assert.fail('Unreachable '+definition.id+' '+JSON.stringify(target)+' '+JSON.stringify(model.players.map(p=>({x:p.x,z:p.z,hp:p.hp}))));}
  function interact(){for(let step=0;step<300;step++){if(model.use(0))return;tick();}assert.fail('Interaction unavailable: '+definition.id+' '+model.message);}
  if(definition.id==='forest'){go(LANTERNS[0]);interact();go({x:0,z:-4});go({x:0,z:2});}
  if(definition.id==='castle'){
   assert.equal(model.sideDoors.length,2);go({x:5,z:6.3});interact();go(model.lanterns[1]);interact();go({x:-5,z:6.3});interact();go(model.lanterns[0]);interact();assert.ok(model.sideDoors.every(door=>door.opened));
  }
  // All victories use real movement, weapon contacts/pulses, cooldowns and recovery.
  for(let step=0;step<36000&&model.defeated<model.requiredEnemies;step++){
   if(step%30===0)for(let i=0;i<players;i++){const player=model.players[i],enemy=model.enemies.filter(unit=>unit.alive).sort((a,b)=>distance(player,a)-distance(player,b))[0];if(enemy&&player.alive&&distance(player,enemy)>1.15)model.navigate(i,enemy);}
   tick();
  }
  assert.equal(model.defeated,model.requiredEnemies,definition.id+' real combat completion');
  if(definition.id==='arena')assert.equal(model.enemies.find(unit=>unit.boss).phase,2,'boss reaches its ranged second phase through real damage');
  for(const lantern of model.lanterns)if(!model.lit.has(lantern.id)){go(lantern);interact();}
  go(definition.id==='forest'?FOREST_SWITCH:model.switch);interact();go({x:0,z:19});for(let i=0;i<120&&!model.done;i++)tick();
  assert.equal(model.done,true,definition.id+' complete together');assert.equal(expedition.advance(),true);
  if(!expedition.done)assert.equal(expedition.summary().score,0,'no partial expedition points');
  console.log('Legal expedition area:',players,'player(s),',definition.id,model.clock.toFixed(1)+'s,',model.defeats,'recoveries.');
 }
 assert.equal(expedition.done,true);assert.equal(expedition.advance(),false);const summary=expedition.summary();completedSummary=summary;assert.equal(summary.chapters.length,4);assert.equal(summary.lanterns,8);assert.equal(summary.sentinels,11);assert.ok(summary.score>=1000);assert.ok(summary.elapsed>0);
}
console.log('PASS: legal full solo/co-op four-area expeditions, side doors/seals, two-phase boss, separate completion-only scoring, bounded/resettable optional workload and actual journey instructions. Pure gameplay, not physical/GPU evidence.');

const store=new Map();globalThis.localStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)};globalThis.matchMedia=()=>({matches:false});
const {DB,commitRound,backupJSON,parseBackup}=await import('../dist/js/data.js');DB.profiles[0].results.push({game:'limit',difficulty:3,learn:false,mode:'solo',score:500,at:1,ruleset:'limit-forest-v2'});
for(const profile of DB.profiles.slice(0,2))commitRound([{id:profile.id,score:completedSummary.score,hits:11,completed:true,elapsed:completedSummary.elapsed,duration:completedSummary.elapsed,soloWin:true,details:{chapters:completedSummary.chapters,lanterns:8,sentinels:11,defeats:completedSummary.defeats}}],{game:'limit',difficulty:3,learn:false,mode:'solo',ruleset:'limit-expedition-v1',levelId:1,competition:'coop',challengeKey:'four-paths-1'});
const text=backupJSON(DB,[]),restored=parseBackup(text);assert.equal(restored.data.profiles[0].results.find(record=>record.ruleset==='limit-forest-v2').score,500);assert.equal(restored.data.profiles[1].results[0].details.chapters.length,4);
for(const change of [record=>record.details.chapters.pop(),record=>record.completed=false,record=>record.details.chapters[0].id='unknown',record=>record.details.chapters[1].elapsed=-1]){const invalid=JSON.parse(text),record=invalid.data.profiles[0].results.find(record=>record.ruleset==='limit-expedition-v1');change(record);assert.throws(()=>parseBackup(JSON.stringify(invalid)),/expedition completion/i);}
console.log('PASS: actual separate co-op expedition records preserve older Forest results in schema-3 backups; malformed/partial completion records are rejected.');

assert.equal(adventureRecordRows(DB.profiles,'limit-forest-v2','solo')[0].result.score,500);assert.equal(adventureRecordRows(DB.profiles,'limit-expedition-v1','coop').length,2);assert.equal(adventureRecordRows(DB.profiles,'limit-expedition-v1','solo').length,0);
console.log('PASS: adventure leaderboards keep old/new editions and solo/co-op results separate.');
