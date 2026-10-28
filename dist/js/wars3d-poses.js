import {hitReaction} from './3d/combat.js';
import {WAR_WEAPONS,SOLDIER_SOCKETS,DEFEAT_TIMING} from './wars3d-weapons.js';
import {rigAdd as add,rigSub as sub,rigScale as mul,rigVector as vec,rigLength as length,rigNormalize as norm,rigEuler as euler,rigRotate as rotate,rigQuatMultiply as quat,rigQuatInverse as inverse,rigFromTo as fromTo,solveTwoBoneIK} from './3d/attachments.js';
const identity=[0,0,0,1],zero={x:0,y:0,z:0},clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{const t=clamp(v);return t*t*(3-2*t);},mix=(a,b,t)=>a+(b-a)*t,point=(a,b,t)=>({x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),z:mix(a.z,b.z,t)});
export const SOLDIER_BIND=Object.freeze({root:{parent:null,p:[0,0,0]},hips:{parent:'root',p:[0,.85,0]},spine:{parent:'hips',p:[0,.3,0]},head:{parent:'spine',p:[0,.4,0]},armL:{parent:'spine',p:[-.34,.2,0]},foreL:{parent:'armL',p:[-.04,-.28,0]},handL:{parent:'foreL',p:[0,-.29,0]},armR:{parent:'spine',p:[.34,.2,0]},foreR:{parent:'armR',p:[.04,-.28,0]},handR:{parent:'foreR',p:[0,-.29,0]},legL:{parent:'hips',p:[-.15,0,0]},shinL:{parent:'legL',p:[0,-.4,0]},legR:{parent:'hips',p:[.15,0,0]},shinR:{parent:'legR',p:[0,-.4,0]}});
export function warActorOffset(u,age=0){const mounted=u.mounted??['lancer','dragon'].includes(u.type),drop=mounted&&(u.alive===false||u.state==='dead')?smooth(age/DEFEAT_TIMING.kneel):0;return{x:.65*drop*(u.scale??1),y:mounted?.32*(1-drop)*(u.scale??1):0,z:u.type==='cannon'?-.75*(u.scale??1):0};}
export function evaluateSoldierJoints(targets){const joints={};for(const[name,b]of Object.entries(SOLDIER_BIND)){const t=targets[name],parent=joints[b.parent]||{p:zero,q:identity};joints[name]={p:add(parent.p,rotate(parent.q,vec(t.position))),q:quat(parent.q,t.quaternion||euler(...(t.rotation||[0,0,0])))};}return joints;}
function sample(keys,p){for(let i=1;i<keys.length;i++)if(p<=keys[i][0]){const t=smooth((p-keys[i-1][0])/(keys[i][0]-keys[i-1][0]));return keys[i-1][1].map((v,k)=>mix(v,keys[i][1][k],t));}return keys.at(-1)[1];}
/** One deterministic grip/IK pose drives both skeleton animation and core hit geometry. */
export function warWeaponFrame(u,progress=u.attack?.progress??0,override=u.weaponOverride||{}){
 const original=WAR_WEAPONS[u.type]||WAR_WEAPONS.club,cfg={...original,...override,grip:{...original.grip,...override.grip}},p=clamp(progress),attack=!!u.attack||u.state==='attack',moving=['walk','run'].includes(u.state),walk=u.walk||0,s=Math.sin(walk),clock=u.clock||0,dead=u.alive===false||u.state==='dead',age=Math.max(0,u.deathAge??clock-(u.deadAt??clock)),kneel=dead?smooth(age/DEFEAT_TIMING.kneel):0,mounted=u.mounted??['lancer','dragon'].includes(u.type),scale=u.scale??1;
 const targets={};for(const[name,b]of Object.entries(SOLDIER_BIND))targets[name]={position:[...b.p],rotation:[0,0,0],immediate:!dead&&u.state!=='recover'};
 targets.spine.rotation=[moving?.025:Math.sin(clock*2)*.012,0,0];targets.head.rotation=[0,0,Math.sin(clock*1.6)*.018];
 targets.legL.rotation=[moving?s*.58:0,0,0];targets.legR.rotation=[moving?-s*.58:0,0,0];targets.shinL.rotation=[moving?Math.max(0,-s)*.72:0,0,0];targets.shinR.rotation=[moving?Math.max(0,s)*.72:0,0,0];
 if(moving&&!mounted)targets.hips.position[1]+=Math.sin(walk*2)*.012;
 if(mounted){targets.legL.rotation=[-1.15,0,-.22];targets.legR.rotation=[-1.15,0,.22];targets.shinL.rotation=[1.2,0,0];targets.shinR.rotation=[1.2,0,0];}
 // Damage feedback overlays the pose; the attack timeline and wrists stay authoritative.
 const recoil=dead?0:(u.state==='hit'?1:hitReaction(clock,u.hurtAt));targets.spine.rotation[0]-=.035*recoil;targets.head.rotation[2]+=.055*recoil;if(['stun','stagger'].includes(u.state)){targets.spine.rotation[0]-=.08;targets.head.rotation[0]=.12;}
 if(dead){targets.hips.position[1]=mix(.85,.44,kneel);targets.spine.rotation=[.48*smooth((age-.3)/1.1),0,0];targets.head.rotation=[.35*kneel,0,.04];targets.legL.rotation=targets.legR.rotation=[.08*kneel,0,0];targets.shinL.rotation=targets.shinR.rotation=[1.48*kneel,0,0];}
 let position={x:.35,y:1.04,z:.25},angles=[.2,0,-.12],draw=0,freeHand={x:-.40,y:.88,z:moving?-s*.12:.035},freeQ=euler(-.25,0,0),aim=Math.max(-.55,Math.min(.9,u.aimPitch||0));
 const active=attack?p:0,bowStance=cfg.animation==='bow'&&attack?smooth(p/.2)*(1-smooth((p-.74)/.26)):0;
 if(cfg.animation==='bow'){const sign=cfg.socket==='left'?1:-1;targets.hips.rotation[1]=.6*bowStance*sign;targets.spine.rotation[1]=.65*bowStance*sign;targets.head.rotation[1]=-1.25*bowStance*sign;}
 if(cfg.animation==='swing'){
  const k=sample([[0,[.35,1.04,.25,.2,0,-.12]],[.22,[.38,1.30,.26,-.35,-.65,-.25]],[.52,[.30,1.14,.34,1.55,.18,0]],[.72,[.23,1.06,.35,1.45,.8,.12]],[1,[.35,1.04,.25,.2,0,-.12]]],active);position=vec(k);angles=k.slice(3);
 }else if(cfg.animation==='thrust'){
  const thrust=attack?Math.sin(smooth(clamp((p-.16)/.6))*Math.PI):0;position=cfg.twoHanded?{x:.28,y:1.18,z:.08+thrust*.08}:{x:.37,y:1.16,z:.23+thrust*.12};angles=[Math.PI/2-.06,0,0];
 }else if(cfg.animation==='heavy'){
  const k=sample([[0,[.12,1.36,.40,.12,0,0]],[.24,[.14,1.48,.38,-.15,0,-.55]],[.51,[.18,1.24,.41,1.65,0,0]],[.73,[.18,1.24,.41,1.75,.18,0]],[1,[.12,1.36,.40,.12,0,0]]],active);position=vec(k);angles=k.slice(3);
 }else if(cfg.animation==='bow'){
  position=point({x:-.10,y:1.08,z:.30},{x:0,y:1.50,z:.10+cfg.drawLength*Math.cos(aim)},bowStance);if(attack)position.y=mix(1.08,1.5,smooth(p/.08)*(1-smooth((p-.74)/.26)))+cfg.drawLength*Math.sin(aim)*bowStance;angles=[-aim,0,0];draw=attack?(p<.48?bowStance:1-smooth((p-.48)/.08)):0;
 }else if(cfg.animation==='gun'){position={x:.08,y:1.23,z:.34};angles=[-aim+(attack&&p>.54&&p<.68?-.06:0),0,0];
 }else if(cfg.animation==='cast'){position={x:.36,y:1.14,z:.26};angles=[attack?mix(.12,Math.PI/2-aim,smooth(p/.35)*(1-smooth((p-.72)/.28))):.12,0,0];
 }else if(cfg.animation==='sling'){position={x:.36,y:1.17,z:.27};angles=[attack?sample([[0,[.5]],[.25,[-1.2]],[.45,[-aim]],[.53,[-aim]],[.7,[.9]],[1,[.5]]],p)[0]:.5,0,0];
 }else if(cfg.animation==='crew'){position={x:.36,y:1.08,z:.26};angles=[.15,0,0];
 }else if(cfg.animation==='reins'){position={x:.16,y:1.12,z:.33};angles=[Math.PI/2,0,0];}
 if(cfg.animation==='heavy'&&!dead){const turn=(cfg.socket==='left'?-1:1)*.35;targets.spine.rotation[1]=turn;targets.head.rotation[1]=-turn;}
 if(cfg.animation==='thrust'&&cfg.twoHanded&&!dead){const turn=(cfg.socket==='left'?-1:1)*1.1;targets.hips.rotation[1]=moving?0:turn*.3;targets.spine.rotation[1]=moving?turn:turn*.7;targets.head.rotation[1]=-turn;}
 if(moving&&!attack){position.y+=Math.sin(walk*2)*.012;angles[0]+=s*.025;}
 if(dead){position=point(position,{x:original.socket==='left'?-.31:.31,y:.61,z:.29},kneel);angles=angles.map((v,i)=>mix(v,[1.65,0,-.2][i],kneel));draw=0;freeHand={x:-.36,y:mix(.88,.58,kneel),z:.29};}
 if(cfg.shield)cfg.shield={...cfg.shield,socket:cfg.socket==='left'?'right':'left'};
 const primary=cfg.socket==='left'?'L':'R',secondary=primary==='R'?'L':'R',mirror=cfg.socket!==original.socket;if(mirror&&cfg.support)cfg.support=[-cfg.support[0],cfg.support[1],cfg.support[2]];if(mirror){position.x=-position.x;angles[1]*=-1;angles[2]*=-1;freeHand.x=-freeHand.x;}
 if(attack&&['bow','gun','cast','sling'].includes(cfg.animation))angles[1]+=u.aimYaw||0;
 const weaponQ=euler(...angles),mountQ=euler(...cfg.grip.rotation),primaryQ=quat(weaponQ,inverse(mountQ)),gripPosition=vec(cfg.grip.position),pivot=vec(cfg.grip.pivot),weaponPoint=local=>add(position,rotate(weaponQ,mul(sub(vec(local),pivot),cfg.grip.scale??1)));
 const handGoals={};handGoals[primary]={p:sub(position,rotate(primaryQ,gripPosition)),q:primaryQ};
 if(cfg.animation==='bow'&&!dead){const string=[0,0,-.02-(cfg.drawLength||.30)*(p<.48?draw:bowStance)],target=weaponPoint(string),bodyQ=euler(0,1.25*bowStance*(cfg.socket==='left'?1:-1),0),rest={x:secondary==='R'?.41:-.41,y:.94,z:.035};let drawHand=attack?target:rest;
  if(attack&&p<.14){const raised=rotate(bodyQ,{...rest,y:1.58});drawHand=p<.06?point(rotate(bodyQ,rest),raised,smooth(p/.06)):point(raised,target,smooth((p-.06)/.08));}
  // Return outside the chest: lift to shoulder level, open the elbow, then lower.
  if(attack&&p>.48){const raised=rotate(bodyQ,{...rest,y:1.58}),lowered=rotate(bodyQ,rest);drawHand=p<.62?point(target,raised,smooth((p-.48)/.14)):point(raised,lowered,smooth((p-.62)/.38));}
  handGoals[secondary]={p:drawHand,q:euler(-.6-aim,0,0)};
 }else if(cfg.twoHanded&&!dead){handGoals[secondary]={p:weaponPoint(cfg.support),q:quat(weaponQ,inverse(euler(Math.PI/2,0,0)))};
 }else handGoals[secondary]={p:{...freeHand,x:(secondary==='L'?-1:1)*Math.abs(freeHand.x)},q:freeQ};
 if(cfg.shield&&!dead&&!u.unarmed){handGoals[secondary]={p:{x:secondary==='L'?-.32:.32,y:u.block?1.28:1.17,z:u.block?.35:.29},q:euler(-.8,0,0)};}
 if(u.unarmed)for(const side of ['L','R'])handGoals[side]={p:{x:side==='L'?-.4:.4,y:.88,z:moving?Math.sin(walk+(side==='L'?0:Math.PI))*.12:.035},q:euler(-.2,0,0)};
 const errors={},baseJoints=evaluateSoldierJoints(targets);for(const side of ['L','R']){
  const joints=baseJoints;const shoulder=joints['arm'+side].p,parent=joints.spine,q=handGoals[side].q,socket=vec(SOLDIER_SOCKETS[side==='R'?'right':'left'].position),wrist=sub(handGoals[side].p,rotate(q,socket)),pole=rotate(parent.q,{x:side==='R'?1:-1,y:0,z:0}),ik=solveTwoBoneIK({root:shoulder,target:wrist,upperLength:length(vec(SOLDIER_BIND['fore'+side].p)),lowerLength:length(vec(SOLDIER_BIND['hand'+side].p)),pole});
  const upperQ=fromTo(vec(SOLDIER_BIND['fore'+side].p),sub(ik.elbow,shoulder)),foreQ=fromTo(vec(SOLDIER_BIND['hand'+side].p),sub(ik.end,ik.elbow));targets['arm'+side].quaternion=quat(inverse(parent.q),upperQ);targets['fore'+side].quaternion=quat(inverse(upperQ),foreQ);targets['hand'+side].quaternion=quat(inverse(foreQ),q);errors[side]=ik.error;
 }
 const joints=evaluateSoldierJoints(targets),offset=warActorOffset(u,age),yaw=euler(0,u.angle||0,0),world=local=>add({x:u.x||0,y:offset.y,z:u.z||0},rotate(yaw,add({x:offset.x,y:0,z:offset.z},mul(local,scale)))),socketJoint=joints['hand'+primary],actualHand=add(socketJoint.p,rotate(socketJoint.q,vec(SOLDIER_SOCKETS[primary==='R'?'right':'left'].position))),actualGrip=add(actualHand,rotate(socketJoint.q,gripPosition)),actualWeaponQ=quat(socketJoint.q,mountQ),actualPoint=local=>world(add(actualGrip,rotate(actualWeaponQ,mul(sub(vec(local),pivot),cfg.grip.scale??1))));
 let muzzle=actualPoint(cfg.muzzle),direction=rotate(yaw,rotate(actualWeaponQ,['bow','gun','sling'].includes(cfg.animation)?{x:0,y:0,z:1}:{x:0,y:1,z:0}));
 if(cfg.emitter==='cannon'){const pitch=euler(-aim,u.aimYaw||0,0);muzzle=add({x:u.x||0,y:0,z:u.z||0},rotate(yaw,mul(add({x:0,y:.785,z:-.1},rotate(pitch,{x:0,y:0,z:.81})),scale)));direction=rotate(yaw,rotate(pitch,{x:0,y:0,z:1}));}
 if(cfg.emitter==='dragon'){muzzle=add({x:u.x||0,y:0,z:u.z||0},rotate(quat(yaw,euler(0,u.aimYaw||0,0)),{x:0,y:1.04*scale,z:1.03*scale}));direction=rotate(yaw,rotate(euler(-aim,u.aimYaw||0,0),{x:0,y:0,z:1}));}
 const shieldSocket=cfg.shield?.socket||'left',left=joints[shieldSocket==='left'?'handL':'handR'],shieldCenter=world(add(left.p,rotate(left.q,add(vec(SOLDIER_SOCKETS[shieldSocket].position),vec(cfg.shield?.position||[0,0,0]))))),shieldQ=quat(yaw,quat(left.q,euler(...(cfg.shield?.rotation||[0,0,0]))));
 return{config:cfg,targets,joints,root:actualPoint(cfg.hitBase),tip:actualPoint(cfg.tip),grip:world(actualGrip),muzzle,direction:norm(direction),draw,errors,opacity:dead?Math.max(0,1-(age-DEFEAT_TIMING.fadeStart)/(DEFEAT_TIMING.remove-DEFEAT_TIMING.fadeStart)):1,shield:{center:shieldCenter,normal:rotate(shieldQ,{x:0,y:0,z:1})},world,weaponPoint:actualPoint};
}
