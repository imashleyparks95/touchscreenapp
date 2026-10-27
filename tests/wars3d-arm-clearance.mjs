import assert from 'node:assert/strict';
import fs from 'node:fs';
import {warWeaponFrame,SOLDIER_BIND,evaluateSoldierJoints} from '../dist/js/wars3d-poses.js';
import {WAR_WEAPONS} from '../dist/js/wars3d-weapons.js';
import {rigRotate,rigQuatInverse,rigSub,rigAdd} from '../dist/js/3d/attachments.js';
// Inspect the actual shipped, skinned CC0 mesh, not an invented stick figure.
const file=fs.readFileSync('dist/assets/wars3d/soldier.glb'),n=file.readUInt32LE(12),g=JSON.parse(file.subarray(20,20+n)),bin=file.subarray(28+n),types={5126:['readFloatLE',4],5123:['readUInt16LE',2]},sizes={VEC3:3,VEC4:4};
function acc(index){const a=g.accessors[index],v=g.bufferViews[a.bufferView],[read,size]=types[a.componentType],len=sizes[a.type];return Array.from({length:a.count},(_,i)=>Array.from({length:len},(_,k)=>bin[read]((v.byteOffset||0)+(a.byteOffset||0)+i*(v.byteStride||size*len)+k*size)));}
assert.equal(g.asset.extras.armReach,2);
for(const [name,b] of Object.entries(SOLDIER_BIND))assert.ok((g.nodes.find(n=>n.name===name).translation||[0,0,0]).every((v,i)=>Math.abs(v-b.p[i])<1e-7),'asset and deterministic pose bind agree: '+name);
const bind=evaluateSoldierJoints(Object.fromEntries(Object.entries(SOLDIER_BIND).map(([name,b])=>[name,{position:b.p}]))),unique=new Map();
for(const mesh of g.meshes)for(const primitive of mesh.primitives){const positions=acc(primitive.attributes.POSITION),joints=acc(primitive.attributes.JOINTS_0),weights=acc(primitive.attributes.WEIGHTS_0);for(let i=0;i<positions.length;i++){
 const name=g.nodes[g.skins[0].joints[joints[i][0]]].name;if(!/^(arm|fore|hand)/.test(name))continue;assert.equal(weights[i][0],1,'the original rigid limb islands keep their authored weights');
 const p=rigSub({x:positions[i][0],y:positions[i][1],z:positions[i][2]},bind[name].p);
 // The proximal sleeve intentionally tucks under the pauldron. Validate the
 // distal upper sleeve and ALL forearm, cuff, palm and thumb vertices.
 if(name.startsWith('arm')&&p.y>-.17)continue;unique.set(name+positions[i].join(','),{name,p});
}}
const vertices=[...unique.values()];let poses=0,skinChecks=0,maxReachError=0;
function inside(p){return p.y>-.19&&p.y<.20&&(p.x/.255)**2+(p.z/.16)**2<.9;}
function inspect(u,label){const frame=warWeaponFrame(u),spine=frame.joints.spine,inverse=rigQuatInverse(spine.q),local=p=>rigRotate(inverse,rigSub(p,spine.p));maxReachError=Math.max(maxReachError,...Object.values(frame.errors));assert.ok(Math.max(...Object.values(frame.errors))<.002,label+' hand target is reachable');
 for(const name of ['foreL','foreR','handL','handR'])assert.ok(!inside(local(frame.joints[name].p)),label+' joint inside torso: '+name);
 for(const v of vertices){const joint=frame.joints[v.name],p=local(rigAdd(joint.p,rigRotate(joint.q,v.p)));assert.ok(!inside(p),label+' posed skin enters torso core: '+v.name+' '+JSON.stringify(p));skinChecks++;}poses++;
}
for(const type of Object.keys(WAR_WEAPONS)){
 for(const state of ['idle','walk','run','stun','stagger','hit','dead'])for(const walk of [0,1.3,3.9])inspect({type,alive:state!=='dead',state,deathAge:1.4,clock:1,walk},`${type}/${state}/${walk}`);
 for(let i=0;i<=100;i++)for(const hurtAt of [-Infinity,.95])inspect({type,alive:true,state:'attack',attack:{progress:i/100},hurtAt,clock:1},`${type}/attack/${i}/hit=${hurtAt}`);
}
// Independently mirror representative handedness and exercise high/low aiming.
for(const type of ['knight','spear','archer','robot','guard'])for(const socket of ['right','left'])for(const aimPitch of [-.55,.35,.9])for(const p of [0,.1,.2,.48,.65,.82,.95])inspect({type,alive:true,state:'attack',attack:{progress:p},clock:1,aimPitch,weaponOverride:{socket}},`${type}/${socket}/aim${aimPitch}/${p}`);
for(const state of ['idle','walk','run'])for(const walk of [0,1.3,3.9])inspect({type:'club',unarmed:true,alive:true,state,walk,clock:1},'unarmed/'+state);
console.log(`PASS: ${poses} arm poses, ${skinChecks} actual skinned-vertex clearance checks: all 21 classes, full swings with/without simultaneous damage feedback, locomotion, explicit statuses, kneeling death, both hands, low/high aim and unarmed stance. Max reach error ${maxReachError.toFixed(6)}m. Proximal shoulder/armor seam excluded intentionally; this is a torso-core guard, not a zero-intersection claim for every costume triangle.`);
