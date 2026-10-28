import {distance} from './math.js';
/** Lowest score wins. Game rules supply eligibility and tactical bias. No team IDs are assumed. */
export function acquireTarget(self,candidates,{eligible=()=>true,bias=()=>0,metric=distance}={}){let best=null,rank=Infinity;for(const other of candidates){if(other===self||!eligible(other))continue;const score=metric(self,other)+bias(other,self);if(score<rank){best=other;rank=score;}}return best;}
/** Bounded think cadence; pursue/retreat/hold uses an injected controlled character. */
export class NavigationBehavior{
 constructor(controller,{thinkInterval=.5,desiredDistance=1.5,retreatDistance=0,choose=()=>null}={}){Object.assign(this,{controller,thinkInterval,desiredDistance,retreatDistance,choose});this.wait=0;this.target=null;this.state='idle';}
 update(dt,world){this.wait-=dt;if(this.wait<=0){this.target=this.choose(world);this.wait=this.thinkInterval;if(!this.target){this.controller.stop();this.state='idle';}else{const d=distance(this.controller,this.target);if(d<this.retreatDistance){const n=d||1;this.controller.moveTo({x:this.controller.x+(this.controller.x-this.target.x)/n*2,z:this.controller.z+(this.controller.z-this.target.z)/n*2});this.state='retreat';}else if(d>this.desiredDistance){this.controller.moveTo(this.target);this.state='pursue';}else{this.controller.stop();this.state='hold';}}}this.controller.update(dt);}
}
