import {clamp,dist,seeded,segmentCircle,angleDelta} from './touch-utils.js';
export {clamp,dist,seeded,segmentCircle,angleDelta};
export const STEP=1000/120;
export class Physics{
 constructor(gravity=1){this.M=globalThis.Matter;if(!this.M)throw Error('Physics engine unavailable. Reload the arcade.');this.engine=this.M.Engine.create({positionIterations:7,velocityIterations:6});this.engine.gravity.y=gravity;this.engine.gravity.scale=.001;this.acc=0;this.disposed=false;}
 rect(x,y,w,h,options={}){const b=this.M.Bodies.rectangle(x,y,w,h,{friction:.25,restitution:.35,...options});this.M.Composite.add(this.engine.world,b);return b;}
 circle(x,y,r,options={}){const b=this.M.Bodies.circle(x,y,r,{friction:.12,restitution:.65,...options});this.M.Composite.add(this.engine.world,b);return b;}
 bounds(){this.rect(500,652,1040,40,{isStatic:true});this.rect(-20,320,40,720,{isStatic:true});this.rect(1020,320,40,720,{isStatic:true});this.rect(500,-20,1040,40,{isStatic:true});}
 add(x){this.M.Composite.add(this.engine.world,x);return x;}remove(x){this.M.Composite.remove(this.engine.world,x);}
 tick(dt,step){this.acc+=dt;let n=0;while(this.acc>=STEP&&n++<120&&!this.disposed){step?.(STEP);this.M.Engine.update(this.engine,STEP);for(const b of this.M.Composite.allBodies(this.engine.world))if(!b.isStatic&&b.speed>22)this.M.Body.setVelocity(b,{x:b.velocity.x/b.speed*22,y:b.velocity.y/b.speed*22});this.acc-=STEP;}}
 dispose(){this.disposed=true;this.M.Events.off(this.engine);this.M.Composite.clear(this.engine.world,false);this.M.Engine.clear(this.engine);}
}
export class Ragdoll{
 constructor(physics,x,y,scale=1,{topdown=false,mass=1,neck=false}={}){this.p=physics;const M=physics.M,group=M.Body.nextGroup(true),opts={collisionFilter:{group},frictionAir:topdown?.07:.015,density:.001*mass,restitution:.3};const r=(dx,dy,w,h)=>physics.rect(x+dx*scale,y+dy*scale,w*scale,h*scale,opts),c=(dx,dy,r)=>physics.circle(x+dx*scale,y+dy*scale,r*scale,opts);this.torso=r(0,0,33,52);this.head=c(0,-41,21);this.parts=[this.torso,this.head,r(-28,-5,15,38),r(28,-5,15,38),r(-12,42,17,40),r(12,42,17,40)];this.joints=[];for(const[b,pa,pb]of [[this.head,{x:0,y:-24},{x:0,y:18}],[this.parts[2],{x:-16,y:-17},{x:0,y:-15}],[this.parts[3],{x:16,y:-17},{x:0,y:-15}],[this.parts[4],{x:-10,y:23},{x:0,y:-18}],[this.parts[5],{x:10,y:23},{x:0,y:-18}]])this.joints.push(physics.add(M.Constraint.create({bodyA:this.torso,pointA:{x:pa.x*scale,y:pa.y*scale},bodyB:b,pointB:{x:pb.x*scale,y:pb.y*scale},stiffness:.7,damping:.14,length:3*scale})));this.scale=scale;this.grabs=new Map();this.dead=false;if(neck)this.enableNeck();}
 // A torso-relative rotary joint: soft spring inside the range, an inelastic angular stop at its limits.
 // Both bodies share the reaction, so a thrown body can still turn completely upside down.
 enableNeck(){const M=this.p.M,head=this.head,torso=this.torso;this.neckLimit=.5;this.joints[0].stiffness=.9;this.joints[0].damping=.22;
 this.neckBefore=()=>{const relative=angleDelta(head.angle,torso.angle),omega=(head.angularVelocity-torso.angularVelocity)/(1000/60),acceleration=clamp(-.000055*relative-.014*omega,-.00022,.00022),torque=head.inertia*acceleration;head.torque+=torque;torso.torque-=torque;};
 this.neckAfter=()=>{const relative=angleDelta(head.angle,torso.angle),error=relative-clamp(relative,-this.neckLimit,this.neckLimit);if(Math.abs(error)>=1e-7){const inverse=head.inverseInertia+torso.inverseInertia,headShare=head.inverseInertia/inverse,torsoShare=torso.inverseInertia/inverse;const headAnchor=M.Vector.add(head.position,M.Vector.rotate({x:0,y:18*this.scale},head.angle)),torsoAnchor=M.Vector.add(torso.position,M.Vector.rotate({x:0,y:-24*this.scale},torso.angle));M.Body.rotate(head,-error*headShare,headAnchor);M.Body.rotate(torso,error*torsoShare,torsoAnchor);const velocity=head.angularVelocity-torso.angularVelocity;if(velocity*error>0){M.Body.setAngularVelocity(head,head.angularVelocity-velocity*headShare);M.Body.setAngularVelocity(torso,torso.angularVelocity+velocity*torsoShare);}}
 // Project excess neck stretch using inverse masses, around its physical attachment points.
 const a=M.Vector.add(torso.position,M.Vector.rotate({x:0,y:-24*this.scale},torso.angle)),b=M.Vector.add(head.position,M.Vector.rotate({x:0,y:18*this.scale},head.angle)),delta=M.Vector.sub(b,a),length=M.Vector.magnitude(delta);if(length>8*this.scale){const inverse=head.inverseMass+torso.inverseMass,correction=M.Vector.mult(delta,(length-3*this.scale)/length);M.Body.translate(head,M.Vector.mult(correction,-head.inverseMass/inverse));M.Body.translate(torso,M.Vector.mult(correction,torso.inverseMass/inverse));}};
 M.Events.on(this.p.engine,'beforeUpdate',this.neckBefore);M.Events.on(this.p.engine,'afterUpdate',this.neckAfter);}

 grab(id,x,y){if(this.grabs.has(id))return false;const b=this.parts.reduce((a,b)=>dist(b.position,{x,y})<dist(a.position,{x,y})?b:a);if(dist(b.position,{x,y})>75*this.scale)return false;const con=this.p.add(this.p.M.Constraint.create({pointA:{x,y},bodyB:b,pointB:{x:x-b.position.x,y:y-b.position.y},length:0,stiffness:.16,damping:.08}));this.grabs.set(id,{con,at:{x,y},last:{x,y}});return true;}
 move(id,x,y){const g=this.grabs.get(id);if(!g)return;g.last=g.at;g.at={x,y};g.con.pointA={x:clamp(x,12,988),y:clamp(y,20,610)};}
 release(id,cancel=false){const g=this.grabs.get(id);if(!g)return false;this.p.remove(g.con);if(!cancel){const dx=clamp(g.at.x-g.last.x,-30,30),dy=clamp(g.at.y-g.last.y,-30,30);this.p.M.Body.setVelocity(g.con.bodyB,{x:dx*.4,y:dy*.4});}this.grabs.delete(id);return true;}
 impulse(x,y){for(const b of this.parts)this.p.M.Body.applyForce(b,b.position,{x:x*b.mass,y:y*b.mass});}
 cancel(){for(const id of this.grabs.keys())this.release(id,true);}
 dispose(){this.cancel();if(this.neckBefore)this.p.M.Events.off(this.p.engine,'beforeUpdate',this.neckBefore);if(this.neckAfter)this.p.M.Events.off(this.p.engine,'afterUpdate',this.neckAfter);for(const b of [...this.parts,...this.joints])this.p.remove(b);}
}
export class History{
 constructor(model){this.model=model;this.undoStack=[];this.redoStack=[];}
 push(){this.undoStack.push(structuredClone(this.model.items));if(this.undoStack.length>50)this.undoStack.shift();this.redoStack=[];}
 undo(){if(!this.undoStack.length)return false;this.redoStack.push(structuredClone(this.model.items));this.model.items=this.undoStack.pop();return true;}
 redo(){if(!this.redoStack.length)return false;this.undoStack.push(structuredClone(this.model.items));this.model.items=this.redoStack.pop();return true;}
}
export function metric(m){return{completed:m.complete,score:m.score,clock:m.clock,mistakes:m.mistakes||0,hits:m.hits||0,...m.summary?.()};}
export const comparePremium=(a,b)=>Number(a.complete)-Number(b.complete)||a.score-b.score||(b.mistakes||0)-(a.mistakes||0)||b.clock-a.clock;
