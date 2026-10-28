import {segmentDistance} from './math.js';
export function integrateProjectile(p,dt){const old={x:p.x,y:p.y,z:p.z};p.vy-=(p.g||0)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.life-=dt;return old;}
export function sweptTarget(from,to,targets,{eligible=()=>true,positionAt=u=>u,radiusAt=u=>u.radius||.35,padding=0}={}){return targets.find(u=>eligible(u)&&segmentDistance(from,to,positionAt(u))<=radiusAt(u)+(to.r||0)+padding)||null;}
export class ProjectilePool{
 constructor({limit=160}={}){this.limit=limit;this.active=[];this.free=[];this.serial=0;}
 spawn(values){if(this.active.length>=this.limit)return null;const p=this.free.pop()||{};for(const k of Object.keys(p))delete p[k];Object.assign(p,values,{id:values.id??++this.serial});this.active.push(p);return p;}
 update(dt,{collision=()=>null,onHit=()=>{},onExpire=()=>{}}={}){const next=[];for(const p of this.active){const old=integrateProjectile(p,dt),hit=collision(old,p);if(hit)onHit(hit,p,old);if(p.life>0&&!hit)next.push(p);else{onExpire(p,hit);if(this.free.length<this.limit)this.free.push(p);}}this.active=next;}
 clear(){this.free.push(...this.active);this.active=[];this.free.length=Math.min(this.free.length,this.limit);}
}

/** Earliest normalized contact time for a swept sphere against a 3D AABB. */
export function sweptBoxFraction(a,b,box,radius=0){let low=0,high=1;for(const axis of['x','y','z']){const min=box['min'+axis.toUpperCase()]-radius,max=box['max'+axis.toUpperCase()]+radius,d=b[axis]-a[axis];if(Math.abs(d)<1e-10){if(a[axis]<min||a[axis]>max)return null;}else{const x=(min-a[axis])/d,y=(max-a[axis])/d;low=Math.max(low,Math.min(x,y));high=Math.min(high,Math.max(x,y));if(low>high)return null;}}return low;}
export function sweptSphereFraction(a,b,center,radius){const d={x:b.x-a.x,y:b.y-a.y,z:b.z-a.z},v={x:a.x-center.x,y:a.y-center.y,z:a.z-center.z},aa=d.x*d.x+d.y*d.y+d.z*d.z,cc=v.x*v.x+v.y*v.y+v.z*v.z-radius*radius;if(cc<=0)return 0;if(aa<1e-12)return null;const bb=2*(v.x*d.x+v.y*d.y+v.z*d.z),disc=bb*bb-4*aa*cc;if(disc<0)return null;const t=(-bb-Math.sqrt(disc))/(2*aa);return t>=0&&t<=1?t:null;}
