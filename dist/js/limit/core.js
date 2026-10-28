import {ThirdPersonController} from '../3d/third-person.js';
import {distance,seeded,blocked,turnToward,moveCircle} from '../3d/math.js';
import {createAttack,advanceAttack,contactTargets} from '../3d/combat.js';
import {ProjectilePool,sweptBoxFraction,sweptSphereFraction} from '../3d/projectiles.js';
import {acquireTarget} from '../3d/ai.js';
import {forestSolids,FOREST_SWITCH,FOREST_DOOR,WATER_ROUTES} from './world.js';
import {forestWeaponPose,FOREST_ACTIONS} from './combat.js';
export {FOREST_SWITCH};
export const FOREST_SEED=872341;
export const FOREST_BOUNDS={minX:-17.5,maxX:17.5,minZ:-19,maxZ:21};
export const LANTERNS=[{id:0,name:'Oak Watch',x:-9,z:-8},{id:1,name:'River Lantern',x:8,z:3.8},{id:2,name:'Crown of Moss',x:-6.5,z:11.2}];
export const FOREST_GATE={x:0,z:16.8};
export function forestHeight(x,z){if(Math.abs(z+1.5)<1.65){if(Math.abs(x)<1.3)return .15;return -.68;}return .10+.12*Math.sin(x*.23)*Math.cos(z*.19)+.06*Math.cos(z*.35);}
export function forestLayout(seed=FOREST_SEED){const random=seeded(seed),trees=[],rocks=[],foliage=[];
 const treeRows=[[-15,-16],[-10,-17],[-4,-18],[5,-18],[12,-17],[16,-12],[-15,-10],[-13,-4],[15,-5],[-16,3],[15,5],[-13,9],[13,11],[-15,16],[9,17],[-10,20],[4,21],[15,20],[-4,5],[7,-10],[11,-5],[-8,16],[-11,5],[6,9],[-2,-12],[3,4]];
 treeRows.forEach(([x,z],i)=>trees.push({x:x+(random()-.5)*.6,z:z+(random()-.5)*.6,key:['BirchTree_1','MapleTree_1','BirchTree_2','MapleTree_3'][i%4],scale:1.2+random()*.65,angle:random()*Math.PI*2}));
 for(let i=0;i<22;i++){const x=(i%2?-1:1)*(7+random()*9),z=-17+random()*35;if(LANTERNS.some(p=>distance(p,{x,z})<2.7))continue;rocks.push({x,z,scale:.55+random()*.75,angle:random()*6.28});}
 for(let i=0;i<200;i++){const x=-16+random()*32,z=-18+random()*37;if(Math.abs(z+1.5)<2||LANTERNS.some(p=>distance(p,{x,z})<1.2)||Math.abs(x)<2.3)continue;foliage.push({x,z,key:['Bush_Small','Grass_Small','Bush_Large','Flower_1_Clump','Grass_Large'][i%5],scale:.45+random()*.5,angle:random()*6.28});}
 const layout={trees,rocks,foliage};layout.obstacles=[...forestSolids(layout,forestHeight),{id:'lever-base',x:FOREST_SWITCH.x,z:FOREST_SWITCH.z,w:.45,d:.45,minY:forestHeight(FOREST_SWITCH.x,FOREST_SWITCH.z),maxY:forestHeight(FOREST_SWITCH.x,FOREST_SWITCH.z)+.8,kind:'lever'},...LANTERNS.map(l=>({id:'lantern-'+l.id,x:l.x,z:l.z,w:1.1,d:1.1,minY:forestHeight(l.x,l.z),maxY:forestHeight(l.x,l.z)+1.3,kind:'lantern'}))];return layout;
}
const center=u=>({x:u.x,y:u.y+.65,z:u.z});
const rect=u=>({id:'body-'+u.id,x:u.x,z:u.z,w:u.radius*1.6,d:u.radius*1.6,minY:u.y,maxY:u.y+1.7,noStand:true,kind:'actor'});
export class LivingForest{
 constructor({players=1,seed=FOREST_SEED,encounters=true}={}){
  this.seed=seed;this.encounters=encounters;this.layout=forestLayout(seed);this.dynamic=[];this.clock=0;this.accumulator=0;this.retries=0;this.defeats=0;this.lit=new Set();this.done=false;this.events=[];this.doorProgress=encounters?0:1;this.doorOpened=!encounters;this.projectiles=new ProjectilePool({limit:32});this.message='Restore the lanterns. The wardens can guide you.';
  const make=(config)=>Object.assign(new ThirdPersonController({groundAt:forestHeight,bounds:FOREST_BOUNDS,radius:.37,stepHeight:.25,...config}),{alive:true,attack:null,casting:null,dodgeUntil:0,dodgeReady:0,attackReady:0,castReady:0,hurtAt:-10,invulnerableUntil:0,interactionUntil:0,landUntil:0,jumpAt:-10,...config});
  this.players=Array.from({length:players},(_,i)=>make({id:i,team:0,x:i?1:-.5,z:-16,model:i?'companion':'hero',scale:i?.82:.75,hp:120,maxHP:120,checkpoint:{x:i?1:-.5,z:-16}}));
  const routes=[[{x:-7,z:-12},{x:-7.5,z:-8},{x:-3,z:-5}],[{x:0,z:3},{x:4,z:4},{x:7,z:3}]];
  this.npcs=routes.map((route,i)=>make({id:'warden-'+i,team:2,name:i?'Rowan · Trail Scout':'Ada · Lightkeeper',x:route[0].x,z:route[0].z,model:i?'companion':'hero',scale:i?.76:.71,speed:1.35,route,waypoint:1,waitUntil:1+i*2,thinkAt:0,role:'warden',hp:1}));
  this.enemies=encounters?[{name:'Briar Sentinel',x:7,z:6,model:'companion',scale:.82,hp:68,role:'melee',route:[{x:7,z:6},{x:8.5,z:5},{x:9,z:8}]},{name:'Ruin Arcanist',x:-5,z:11,model:'companion',scale:.82,hp:62,role:'caster',route:[{x:-5,z:11},{x:-3,z:13}]},{name:'Gatekeeper',x:0,z:14.2,model:'hero',scale:.83,hp:110,role:'guardian',route:[{x:0,z:14.2},{x:3,z:12}]}].map((spec,i)=>make({...spec,id:'sentinel-'+i,team:1,maxHP:Math.round(spec.hp*(players===2?1.4:1)),hp:Math.round(spec.hp*(players===2?1.4:1)),speed:1.7,waypoint:1,waitUntil:i*.5,thinkAt:0,role:spec.role,noticedAt:null})):[];
  for(const u of this.units)this.refreshObstacles(u);
 }
 get units(){return[...this.players,...this.npcs,...this.enemies];}
 get defeated(){return this.enemies.filter(e=>!e.alive).length;}
 get solids(){return[...this.layout.obstacles,...(this.doorProgress<.95?[{...FOREST_DOOR,minY:forestHeight(0,16.8)+this.doorProgress*3.7,maxY:forestHeight(0,16.8)+3.1+this.doorProgress*3.7}]:[]),...this.dynamic];}
 setDynamicObstacles(boxes){this.dynamic=boxes.filter(b=>[b.x,b.z,b.w,b.d,b.minY,b.maxY].every(Number.isFinite)).map(b=>({...b,kind:'crate'}));}
 refreshObstacles(u){u.obstacles=[...this.solids,...this.units.filter(v=>v!==u&&v.alive&&Math.abs(v.y-u.y)<1.7).map(rect)];u.navigationObstacles=[...u.obstacles,...WATER_ROUTES];}
 nearest(p){return LANTERNS.filter(l=>!this.lit.has(l.id)).map(l=>({...l,d:distance(p,l)})).sort((a,b)=>a.d-b.d)[0]||null;}
 use(index){const p=this.players[index];if(!p?.alive||this.done||p.attack||p.casting)return false;const near=this.nearest(p);if(near&&near.d<2.2){this.lit.add(near.id);p.stop();p.interactionUntil=this.clock+1.05;p.checkpoint={x:near.x,z:near.z-1.3};p.hp=p.maxHP;this.message=this.lit.size===3?'All lanterns restored. Clear the sentinels and use the gate lever.':near.name+' restored. Health recovered; checkpoint saved.';this.events.push({type:'lantern',id:near.id,player:index});return true;}
  if(this.encounters&&distance(p,FOREST_SWITCH)<2){if(this.lit.size<3||this.defeated<this.enemies.length){this.message='Gate sealed: restore all three lanterns and defeat all three sentinels.';return false;}if(!this.doorOpened){this.doorOpened=true;p.interactionUntil=this.clock+.6;this.events.push({type:'door'});this.message='The gate is opening. Bring every explorer through.';}return true;}
  const npc=this.npcs.find(n=>distance(n,p)<2.2);if(npc){npc.stop();npc.waitUntil=this.clock+3;this.message=near?npc.name+': Follow lantern '+(near.id+1)+' on your map. Cross the river at the bridge.':npc.name+': Dodge the red wind-up. Strike nearby, or aim a pulse at the sentinels. The lever opens the gate.';this.events.push({type:'talk',id:npc.id});return true;}this.message=near?'Move closer to '+near.name+'.':'Clear the sentinels and use the lever beside the arch.';return false;
 }
 lineBlocked(a,b){const from=center(a),to=center(b);return this.solids.some(o=>sweptBoxFraction(from,to,{minX:o.x-o.w/2,maxX:o.x+o.w/2,minY:o.minY??-10,maxY:o.maxY??o.top??10,minZ:o.z-o.d/2,maxZ:o.z+o.d/2})!==null);}
 targetFor(u,range=9,visible=false){return acquireTarget(u,u.team===0?this.enemies:this.players,{eligible:v=>v.alive&&distance(u,v)<range&&(!visible||!this.lineBlocked(u,v))});}
 beginAction(u,kind){if(!u.alive||u.attack||u.casting||this.clock<u.dodgeUntil||this.clock<u.interactionUntil)return false;const action=FOREST_ACTIONS[kind],target=this.targetFor(u,kind==='attack'?3.2:10,kind==='cast');if(this.clock<(u[kind+'Ready']||0))return false;
  if(kind==='dodge'){u.stop();u.dodgeUntil=this.clock+action.duration;u.dodgeReady=this.clock+action.cooldown;u.dodgeVector=u.lastMove||{x:Math.sin(u.angle),z:Math.cos(u.angle)};u.angle=Math.atan2(u.dodgeVector.x,u.dodgeVector.z);this.events.push({type:'dodge',player:u.id});return true;}
  if(target)u.angle=Math.atan2(target.x-u.x,target.z-u.z)+(kind==='attack'?.25:0);u.stop();const timeline=createAttack({...action,target:target?.id});timeline.kind=kind;timeline.startedAt=this.clock;if(kind==='attack')u.attack=timeline;else u.casting=timeline;u[kind+'Ready']=this.clock+action.duration+action.cooldown;this.events.push({type:kind,player:u.id});return true;
 }
 ai(u,dt){if(!u.alive)return;const target=u.team===1?this.targetFor(u,12):null,visible=target&&(distance(u,target)<3||!this.lineBlocked(u,target));
  if(target&&visible&&(distance(u,target)<8||u.noticedAt!==null)){if(u.noticedAt===null){u.noticedAt=this.clock;u.stop();this.events.push({type:'notice',id:u.id});}u.behavior='pursuit';if(u.attack||u.casting)return;const d=distance(u,target),wanted=u.role==='caster'?4.4:1.15;
   if(this.clock-u.noticedAt<1.1){u.stop();u.angle=turnToward(u.angle,Math.atan2(target.x-u.x,target.z-u.z),dt*5);return;}
   if(this.clock>=u.thinkAt){u.thinkAt=this.clock+.4;if(u.role==='caster'&&d<2.2){const angle=Math.atan2(u.x-target.x,u.z-target.z);u.navigate({x:u.x+Math.sin(angle)*2,z:u.z+Math.cos(angle)*2});}else if(d>wanted+.25)u.navigate(target);else u.stop();}
   if(u.role==='caster'&&d<8&&!this.lineBlocked(u,target))this.beginAction(u,'cast');else if(u.role!=='caster'&&d<1.6)this.beginAction(u,'attack');return;
  }
  u.noticedAt=null;u.behavior=this.clock<u.waitUntil?'watching':'patrol';if(this.clock<u.waitUntil){u.stop();return;}const point=u.route[u.waypoint];if(distance(u,point)<.9||u.patrolAt&&this.clock-u.patrolAt>18){u.stop();u.waypoint=(u.waypoint+1)%u.route.length;u.waitUntil=this.clock+2.2;u.patrolAt=null;}else if(!u.target){u.navigate(point);u.patrolAt=this.clock;}
 }
 hit(target,damage,source){if(!target.alive||target.team===2||this.clock<target.invulnerableUntil||this.clock<target.dodgeUntil)return false;target.hp=Math.max(0,target.hp-damage);target.hurtAt=this.clock;if(source){const d=distance(source,target)||1;target.knockX=(target.x-source.x)/d*1.7;target.knockZ=(target.z-source.z)/d*1.7;}this.events.push({type:'hit',id:target.id,point:center(target),damage});if(target.hp===0){target.alive=false;target.deadAt=this.clock;target.attack=target.casting=null;target.stop();if(target.team===0){target.recoverAt=this.clock+2;this.defeats++;this.message='Fallen — returning to your lantern checkpoint.';}else this.events.push({type:'defeat',id:target.id,point:center(target)});}return true;}
 projectileCollision(a,b){let contact=null,time=Infinity;for(const o of this.solids){const t=sweptBoxFraction(a,b,{minX:o.x-o.w/2,maxX:o.x+o.w/2,minY:o.minY??-10,maxY:o.maxY??o.top??10,minZ:o.z-o.d/2,maxZ:o.z+o.d/2},b.r);if(t!==null&&t<time){time=t;contact={obstacle:o};}}for(const u of b.team===0?this.enemies:this.players){if(!u.alive)continue;const t=sweptSphereFraction(a,b,center(u),u.radius+.22+b.r);if(t!==null&&t<time){time=t;contact={unit:u};}}if(b.y<forestHeight(b.x,b.z)+.05)return{obstacle:{kind:'terrain'}};return contact;}
 step(dt,intents){this.clock+=dt;const hits=[];
  if(this.doorOpened)this.doorProgress=Math.min(1,this.doorProgress+dt/.95);
  for(const p of this.players){if(!p.alive&&this.clock>=p.recoverAt){p.alive=true;p.hp=p.maxHP;p.reset(p.checkpoint);p.invulnerableUntil=this.clock+1.5;this.events.push({type:'recover',id:p.id});}if(!p.alive)continue;const input=intents[p.id]||{};if(Math.hypot(input.x||0,input.z||0)>.15){const n=Math.hypot(input.x,input.z);p.lastMove={x:input.x/n,z:input.z/n};}if(input.dodge)this.beginAction(p,'dodge');else if(input.attack)this.beginAction(p,'attack');else if(input.cast)this.beginAction(p,'cast');}
  for(const u of[...this.npcs,...this.enemies]){this.refreshObstacles(u);this.ai(u,dt);}
  for(const u of this.units){if(!u.alive)continue;this.refreshObstacles(u);const old={x:u.x,z:u.z},grounded=u.grounded,requested=u.team===0?(intents[u.id]||{}):{},locked=u.attack||u.casting||this.clock<u.interactionUntil,dodging=this.clock<u.dodgeUntil;let movement=locked?{}:requested;
   if(dodging)movement={x:u.dodgeVector.x,z:u.dodgeVector.z,run:true};const speed=u.runSpeed;if(dodging)u.runSpeed=FOREST_ACTIONS.dodge.speed;if(movement.jump&&u.grounded){u.jumpAt=this.clock;this.events.push({type:'jump',player:u.id});}u.setIntent(movement);u.update(dt);if(u.knockX||u.knockZ){moveCircle(u,(u.knockX||0)*dt,(u.knockZ||0)*dt,u.obstacles.filter(o=>u.solid(o)),u.bounds);u.knockX*=Math.exp(-10*dt);u.knockZ*=Math.exp(-10*dt);}u.runSpeed=speed;if(!grounded&&u.grounded)u.landUntil=this.clock+.18;
   if(u.y<-.4){u.reset(u.checkpoint||u.route[0]);if(u.team===0){this.retries++;this.events.push({type:'water',player:u.id});this.message='Deep water — returned to your lantern. Use the bridge.';}}
   if(u.team===0&&this.players.length===2){const other=this.players[1-u.id];if(other.alive&&distance(u,other)>13&&distance(u,other)>distance(old,other)){u.x=old.x;u.z=old.z;u.vx=u.vz=0;this.message='Stay together — your teammate is outside the camera range.';}}
   if(u.team===0&&Math.hypot(requested.x||0,requested.z||0)>.1)for(const box of this.dynamic)if(Math.abs(u.x-box.x)<box.w/2+u.radius+.08&&Math.abs(u.z-box.z)<box.d/2+u.radius+.08&&u.y<box.maxY&&u.y+1.6>box.minY)this.events.push({type:'push',id:box.id,x:(requested.x||0)*dt*28,z:(requested.z||0)*dt*28});
   if(requested.interact&&u.team===0)this.use(u.id);
   for(const key of['attack','casting']){const action=u[key];if(!action)continue;const complete=advanceAttack(action,dt);if(key==='attack'){const pose=forestWeaponPose(u);for(const v of contactTargets({attack:action,root:pose.root,tip:pose.tip,targets:u.team===0?this.enemies:this.players,positionAt:center,radiusAt:v=>v.radius+.16,padding:.08,eligible:v=>v.alive&&!this.lineBlocked(u,v)}))hits.push({target:v,source:u,damage:u.team===0?34:u.role==='guardian'?20:15});}
    else if(!action.released&&action.progress>=action.windup){action.released=true;const origin=forestWeaponPose(u,'cast',action.progress).release,target=this.targetFor(u,11,true),aim=target?center(target):{x:origin.x+Math.sin(u.angle)*8,y:origin.y,z:origin.z+Math.cos(u.angle)*8},dx=aim.x-origin.x,dy=aim.y-origin.y,dz=aim.z-origin.z,n=Math.hypot(dx,dy,dz)||1,speed=u.team===0?11:7;this.projectiles.spawn({...origin,vx:dx/n*speed,vy:dy/n*speed,vz:dz/n*speed,g:0,r:.12,life:1.8,team:u.team,source:u.id,damage:u.team===0?28:14});this.events.push({type:'pulse',point:origin,team:u.team});}
    if(complete)u[key]=null;
   }
   u.animation=dodging?'dodge':u.attack?'attack':u.casting?'cast':this.clock<u.interactionUntil?'interact':this.clock<u.landUntil?'land':!u.grounded?(this.clock-u.jumpAt<.16?'takeoff':'jump'):u.state;
  }
  this.projectiles.update(dt,{collision:(a,b)=>this.projectileCollision(a,b),onHit:(hit,p)=>{if(hit.unit)hits.push({target:hit.unit,damage:p.damage,source:this.units.find(u=>u.id===p.source)});this.events.push({type:'impact',point:{x:p.x,y:p.y,z:p.z},wall:!!hit.obstacle});}});
  // Contacts are collected before health/death changes: simultaneous swings can trade.
  for(const h of hits)this.hit(h.target,h.damage,h.source);
  if(this.lit.size===3&&(!this.encounters||this.defeated===this.enemies.length)&&this.doorProgress>=.95&&this.players.every(p=>p.alive&&Math.abs(p.x)<1.25&&p.z>18&&p.z<21)){this.done=true;this.players.forEach(p=>{p.stop();p.attack=p.casting=null;p.animation='celebrate';});this.projectiles.clear();this.message='The forest remembers. The way is open.';this.events.push({type:'finish'});}
 }
 update(dt,intents=[]){if(this.done||dt<=0)return;this.accumulator+=Math.min(dt,.1);let first=true;while(this.accumulator+1e-9>=1/60&&!this.done){this.step(1/60,intents.map(v=>first?v:{...v,jump:false,interact:false,attack:false,cast:false,dodge:false}));this.accumulator-=1/60;first=false;}}
 navigate(index,point){const p=this.players[index];if(p?.alive&&!p.attack&&!p.casting){this.refreshObstacles(p);p.navigate(point);}}
 summary(){return{completed:this.done,lanterns:this.lit.size,sentinels:this.defeated,retries:this.retries,defeats:this.defeats,elapsed:this.clock,score:this.done?Math.max(300,1800-this.retries*100-this.defeats*150+Math.round(Math.max(0,240-this.clock)*2)):0};}
}
export const FOREST_BENCHMARK_STAGES=[{name:'Canopy trail',seconds:6},{name:'Water and reflections',seconds:6},{name:'Ruins and lighting',seconds:6},{name:'Navigating wardens',seconds:6},{name:'Physics grove',seconds:6}];
export function forestBenchmarkCamera(stage,t){const paths=[[[0,3.4,-17],[-9,3,-8]],[[3,3.1,-5],[-3,2.6,2]],[[8,3.2,5],[-5,4,12]],[[0,2.8,5],[3,3.1,4]],[[3,4,4],[-3,3.1,7]]],p=paths[stage%paths.length],v=t*t*(3-2*t),position=p[0].map((a,i)=>a+(p[1][i]-a)*v);return{position,target:stage===2?[0,2,16]:stage===3?[0,1.1,4]:stage===4?[0,1,6]:[position[0]*.65,1,position[2]+5]};}
