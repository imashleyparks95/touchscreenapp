import {clamp,distance,findPath,moveCircle,turnToward} from './math.js';
export {moveCircle};
/** Controlled flat-ground capsule navigation. It does not turn a walker into a dynamic rigid body. */
export class CharacterController{
 constructor({x=0,z=0,radius=.35,speed=2.4,turnSpeed=7,obstacles=[],bounds={minX:-11.4,maxX:11.4,minZ:-6.6,maxZ:6.6}}={}){Object.assign(this,{x,z,radius,speed,turnSpeed,obstacles,bounds});this.angle=0;this.walk=0;this.state='idle';this.target=null;this.path=[];this.repath=0;this.vx=0;this.vz=0;}
 moveTo(point){this.target={x:clamp(point.x,this.bounds.minX+this.radius,this.bounds.maxX-this.radius),z:clamp(point.z,this.bounds.minZ+this.radius,this.bounds.maxZ-this.radius)};this.path=findPath(this,this.target,this.obstacles,this.radius+.05,{...this.bounds,cell:.5});this.repath=0;}
 update(dt){if(dt<=0)return;this.state='idle';this.speedNow=0;if(!this.target)return;while(this.path.length&&distance(this,this.path[0])<.22)this.path.shift();const goal=this.path[0];if(!goal){this.target=null;return;}const dx=goal.x-this.x,dz=goal.z-this.z,d=Math.hypot(dx,dz)||1,old={x:this.x,z:this.z};this.angle=turnToward(this.angle,Math.atan2(dx,dz),this.turnSpeed*dt);moveCircle(this,dx/d*Math.min(d,this.speed*dt),dz/d*Math.min(d,this.speed*dt),this.obstacles,this.bounds);const moved=distance(this,old);this.speedNow=moved/dt;this.vx=(this.x-old.x)/dt;this.vz=(this.z-old.z)/dt;this.walk+=moved*5.5;this.state=moved>.001?'walk':'idle';this.repath+=dt;if(this.repath>1){this.path=findPath(this,this.target,this.obstacles,this.radius+.05,{...this.bounds,cell:.5});this.repath=0;}}
 stop(){this.target=null;this.path=[];this.state='idle';this.vx=this.vz=0;}
}
export function crowdSteering(self,agents,{padding=.25,strength=2}={}){let x=0,z=0;for(const other of agents){if(other===self)continue;const d=distance(self,other),r=self.radius+other.radius+padding;if(d>0&&d<r){x+=(self.x-other.x)/d*(r-d)*strength;z+=(self.z-other.z)/d*(r-d)*strength;}}return{x,z};}
