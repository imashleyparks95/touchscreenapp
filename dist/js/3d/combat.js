import {segmentDistance} from './math.js';
/** Attack timing is independent of animation/rendering. Damage remains game-owned. */
export function createAttack({duration=.8,windup=.24,activeEnd=.73,target=null}={}){if(duration<=0||windup<0||activeEnd<windup||activeEnd>1)throw Error('Invalid attack timeline');return{duration,windup,activeEnd,target,progress:0,hits:new Set(),released:false};}
export function advanceAttack(attack,dt){attack.progress=Math.min(1,attack.progress+Math.max(0,dt)/attack.duration);return attack.progress>=1;}
/** Authoritative action priority. Routine damage is an overlay, never an action. */
export function combatAction(unit,now){if(unit.alive===false)return'dead';if(now<(unit.downUntil||0))return'down';if(now<(unit.recoverUntil||0))return'recover';if(now<(unit.stunUntil||0))return'stun';if(now<(unit.staggerUntil||0))return'stagger';if(unit.attack)return'attack';return null;}
/** Bounded additive reaction envelope. Repeated hits cannot accumulate a stun. */
export function hitReaction(now,lastHit,duration=.24){const age=now-lastHit;if(!Number.isFinite(age)||age<0||age>=duration)return 0;const t=age/duration;return Math.sin(Math.PI/2*Math.min(1,t/.18))*(1-t)**2;}
export function contactTargets({attack,root,tip,targets,previousTip=attack.previousTip,positionAt=u=>u,radiusAt=u=>u.radius||.35,eligible=()=>true,padding=.2}){const hits=[];if(attack.progress>=(attack.windup??.24)&&attack.progress<=(attack.activeEnd??.73))for(const u of targets){if(!eligible(u)||attack.hits.has(u.id))continue;const p=positionAt(u),r=radiusAt(u)+padding;if(segmentDistance(root,tip,p)<=r||previousTip&&segmentDistance(previousTip,tip,p)<=r){attack.hits.add(u.id);hits.push(u);}}attack.previousTip={...tip};return hits;}
export function frontalBlock({incomingAngle,facing,enabled=false,damage,multiplier=.25,minimumDot=.25}){return enabled&&Math.cos(incomingAngle-facing)>minimumDot?{blocked:true,damage:damage*multiplier}:{blocked:false,damage};}
