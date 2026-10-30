import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {Battle3D} from '../dist/js/wars3d-core.js';
import {createAttack} from '../dist/js/3d/combat.js';
import {free} from '../dist/js/3d/math.js';
const m=new Battle3D({mode:'sandbox',field:9,budget:10000});
const archer=m.spawn({type:'archer',x:-4,z:0},0),first=m.spawn({type:'club',x:3,z:0},1),other=m.spawn({type:'club',x:2,z:2},1);
m.phase='battle';archer.targetId=first.id;archer.retargetAt=0;archer.attack=createAttack({duration:1,target:first.id});
m.step(1/60);assert.equal(archer.targetId,first.id,'windup retains its actual release target');
archer.vx=3;archer.vz=2;archer.speedNow=4;archer.stunUntil=10;m.step(1/60);
assert.equal(archer.vx,0);assert.equal(archer.vz,0);assert.equal(archer.speedNow,0);
archer.path=[{x:99,z:99}];archer.repath=999;first.alive=false;archer.stunUntil=0;m.step(1/60);assert.equal(archer.targetId,other.id);assert.equal(archer.attack,null,'dead locked target releases windup');assert.deepEqual(archer.path,[],'new target discards previous route');
const empty=new Battle3D({mode:'sandbox',field:9});const solo=empty.spawn({type:'club',x:0,z:0},0);empty.phase='battle';solo.vx=9;solo.speedNow=9;empty.step(1/60);assert.equal(solo.vx,0);assert.equal(solo.speedNow,0);
for(const field of [0,2,8,9]){
 const b=new Battle3D({mode:'sandbox',field,budget:100000,limit:48,seed:654});
 for(const side of [0,1])for(let i=0;i<48;i++)assert.ok(b.place(['club','archer','guard','spear','healer','slime'][i%6],(side?1:-1)*(3+i%8),-5.5+Math.floor(i/8)*2,side),b.feedback);
 assert.ok(b.start());assert.equal(b.units.length,96);const start=performance.now();
 for(let i=0;i<9200&&!b.done;i++){
  b.update(1/60);assert.ok(b.projectiles.length<=160);assert.ok(b.units.length<=101);
  if(i%60===0)for(const u of b.units)assert.ok(Number.isFinite(u.x+u.z+u.hp+u.vx+u.vz)&&free(u,b.obstacles,u.radius-.015),'finite grounded crowded actor');
 }
 assert.ok(b.done,'bounded battle finishes');const clock=b.clock;b.update(.1);assert.equal(b.clock,clock);
 console.log(`Field ${field}: ${b.units.length} total actors, ${b.clock.toFixed(1)} simulated seconds, ${(performance.now()-start).toFixed(0)}ms CPU (not GPU/frame rate), winner ${b.winner}`);
}
console.log('PASS: attack target lock/death recovery, stopped/stunned velocity, four 96-unit legal mixed armies, bounded projectiles/splits, finite terrain-safe actors and terminal clock.');
