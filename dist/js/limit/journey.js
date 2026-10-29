import {LivingForest,FOREST_SEED} from './core.js';
import {JOURNEY_AREAS,journeyWorld} from './journey-worlds.js';
export {JOURNEY_AREAS};
export const CHAMBER_DEFAULTS=Object.freeze({characters:0,enemies:0,physics:8,projectiles:0,particles:20,lights:0,complexity:1});
export function chamberLimits(software=false){return{characters:software?2:12,enemies:software?2:8,physics:software?12:48,projectiles:software?8:24,particles:software?24:220,lights:software?0:8,complexity:software?1:3};}
export function chamberSettings(value={},software=false){const limits=chamberLimits(software);return Object.fromEntries(Object.entries(limits).map(([key,max])=>[key,Number.isFinite(value[key])?Math.max(0,Math.min(max,Math.round(value[key]))):Math.min(max,CHAMBER_DEFAULTS[key])]));}

export class ExpeditionArea extends LivingForest{
 constructor({id,players=1,seed=FOREST_SEED}={}){super({players,seed,world:journeyWorld(id)});this.zoneId=id;this.chamber={...CHAMBER_DEFAULTS};}
 ai(unit,dt){
  if(unit.boss&&unit.alive&&unit.hp<=unit.maxHP/2&&this.targetFor(unit,9,true)&&!unit.attack&&!unit.casting&&this.clock>=unit.castReady){this.beginAction(unit,'cast');unit.phase=2;}
  super.ai(unit,dt);
 }
 configureChamber(value={},software=false){
  if(this.zoneId!=='chaos'||this.done)return false;
  this.chamber=chamberSettings(value,software);
  this.npcs=this.npcs.filter(unit=>!unit.optional);this.enemies=this.enemies.filter(unit=>!unit.optional);
  const add=(count,team)=>Array.from({length:count},(_,i)=>this.makeUnit({id:'load-'+team+'-'+i,optional:true,team,role:team===1?'caster':'warden',model:i%2?'companion':'hero',scale:.75,x:(i%2?-1:1)*(5+(i%3)),z:-10+Math.floor(i/2)*2,hp:80,maxHP:80,speed:1.5,waypoint:1,waitUntil:0,thinkAt:0,noticedAt:null,route:[{x:-7+(i%4)*4,z:-10},{x:-7+(i%4)*4,z:-4}],checkpoint:{x:0,z:-15}}));
  this.npcs.push(...add(this.chamber.characters,2));this.enemies.push(...add(this.chamber.enemies,1));
  this.projectiles.clear();for(const unit of this.units)this.refreshObstacles(unit);
  this.message='Chamber load changed. Optional test enemies do not lock the objective gate.';return true;
 }
}

/** Serial progression owns no renderer, browser storage or partial-score writes. */
export class LimitExpedition{
 constructor({players=1,seed=FOREST_SEED}={}){this.players=players;this.seed=seed;this.index=0;this.chapters=[];this.done=false;this.current=new LivingForest({players,seed});this.current.zoneId='forest';}
 advance(){
  if(this.done||!this.current.done)return false;
  this.chapters.push({id:JOURNEY_AREAS[this.index].id,...this.current.summary()});
  if(this.index===JOURNEY_AREAS.length-1){this.done=true;return true;}
  this.index++;this.current=new ExpeditionArea({id:JOURNEY_AREAS[this.index].id,players:this.players,seed:this.seed});return true;
 }
 summary(){const totals=this.chapters.reduce((all,chapter)=>{for(const key of ['elapsed','retries','defeats','lanterns','sentinels'])all[key]+=chapter[key]||0;return all;},{elapsed:0,retries:0,defeats:0,lanterns:0,sentinels:0});return{...totals,completed:this.done,chapters:this.chapters.map(chapter=>({...chapter})),score:this.done?Math.max(1000,6400-totals.retries*100-totals.defeats*150+Math.round(Math.max(0,900-totals.elapsed))):0};}
}
