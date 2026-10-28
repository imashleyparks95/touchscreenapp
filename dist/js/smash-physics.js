import {WORLD,MATERIALS,PROJECTILES} from './smash-levels.js';
export const STEP=1000/120;
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function matter(){const M=globalThis.Matter;if(!M)throw Error('The physics engine has not loaded. Reload the arcade online once.');if(globalThis.decomp)M.Common.setDecomp(globalThis.decomp);return M;}
export function makeBlock(spec,{staticBody=false,durability=1,index=0}={}){
 const M=matter(),{Bodies,Body}=M,m=MATERIALS[spec.mat]||MATERIALS.wood,w=spec.w,h=spec.h,x=spec.x,y=spec.y,opts={isStatic:staticBody,density:m.density,friction:m.friction,frictionStatic:.8,frictionAir:.002,restitution:m.restitution,slop:.025,label:'block'};let b;
 if(spec.shape==='circle')b=Bodies.circle(x,y,w/2,opts,28);
 else if(spec.shape==='cylinder')b=Bodies.rectangle(x,y,w,h,{...opts,chamfer:{radius:Math.min(w,h)*.22}});
 else if(['triangle','arch','trapezoid','polygon'].includes(spec.shape)){
  const shapes={triangle:[[-.5,.5],[.5,.5],[0,-.5]],trapezoid:[[-.5,.5],[.5,.5],[.3,-.5],[-.3,-.5]],polygon:[[-.5,.15],[-.35,-.45],[.15,-.5],[.5,-.15],[.35,.5],[-.25,.4]],arch:[[-.5,.5],[-.5,-.15],[-.4,-.42],[-.25,-.5],[.25,-.5],[.4,-.42],[.5,-.15],[.5,.5],[.26,.5],[.26,-.05],[.15,-.21],[-.15,-.21],[-.26,-.05],[-.26,.5]]};
  b=Bodies.fromVertices(x,y,[shapes[spec.shape].map(([a,c])=>({x:a*w,y:c*h}))],opts,true,.01,2,.01);
 }else b=Bodies.rectangle(x,y,w,h,opts);
 Body.translate(b,{x:x-(b.bounds.min.x+b.bounds.max.x)/2,y:y-(b.bounds.min.y+b.bounds.max.y)/2});if(spec.angle)Body.setAngle(b,spec.angle*Math.PI/180);
 b.plugin={...b.plugin,smash:{kind:'block',index,spec:{...spec},hp:m.hp*durability,maxHp:m.hp*durability,broken:false}};return b;
}
export function validateStructure(blocks){
 if(!Array.isArray(blocks)||blocks.length<1||blocks.length>45)return 'Use between 1 and 45 pieces.';
 const bodies=[];for(const [i,s]of blocks.entries()){
  if(!MATERIALS[s.mat]||!['square','rectangle','beam','triangle','circle','cylinder','arch','trapezoid','polygon'].includes(s.shape)||!['x','y','w','h','angle'].every(k=>Number.isFinite(s[k]))||s.w<20||s.h<16||s.w>380||s.h>220)return 'A building piece has invalid dimensions.';
  const b=makeBlock(s,{staticBody:true,index:i});if(b.bounds.min.x<700||b.bounds.max.x>1530||b.bounds.min.y<140||b.bounds.max.y>800.6)return 'Keep all pieces inside the construction zone and above the ground.';
  const overlaps=matter().Query.collides(b,bodies);if(overlaps.some(c=>c.depth>1.2))return 'Pieces cannot overlap. Stack them edge to edge.';bodies.push(b);
 }return null;
}
export class SmashWorld{
 constructor(config,{onBreak=()=>{},onImpact=()=>{},onBlast=()=>{}}={}){
  this.M=matter();this.config=structuredClone(config);this.onBreak=onBreak;this.onImpact=onImpact;this.onBlast=onBlast;this.tick=0;this.armed=false;this.destroyed=0;this.chain=0;this.breakTicks=[];this.projectiles=[];this.fragments=[];this.pending=new Map();this.blasts=[];this.shots=0;this.shotTick=-1;this.lastBreakTick=-1;
  const {Engine,Bodies,Composite,Events}=this.M;this.engine=Engine.create({positionIterations:10,velocityIterations:8,constraintIterations:4,enableSleeping:false});this.engine.gravity.y=1;this.engine.gravity.scale=.001;
  const terrain=[Bodies.rectangle(800,840,1800,80,{isStatic:true,friction:.9,label:'ground'}),Bodies.rectangle(-25,400,50,1000,{isStatic:true,label:'boundary'}),Bodies.rectangle(1625,400,50,1000,{isStatic:true,label:'boundary'}),Bodies.rectangle(800,-80,1800,80,{isStatic:true,label:'boundary'})];
  this.blocks=config.blocks.map((s,i)=>makeBlock(s,{durability:config.durability||1,index:i}));this.obstacles=(config.obstacles||[]).map((o,i)=>{let b=Bodies.rectangle(o.x,o.y,o.w,o.h,{isStatic:true,friction:.4,restitution:.4,label:'obstacle'});b.plugin.smash={kind:'obstacle',spec:o,index:i};return b;});
  Composite.add(this.engine.world,[...terrain,...this.blocks,...this.obstacles]);this.boundaries=terrain;
  this.collision=event=>{if(!this.armed)return;for(const pair of event.pairs){let a=pair.bodyA.parent,b=pair.bodyB.parent;if(a===b)continue;let normal=pair.collision.normal,relative={x:a.velocity.x-b.velocity.x,y:a.velocity.y-b.velocity.y},speed=Math.abs(relative.x*normal.x+relative.y*normal.y);if(speed<2.6)continue;let mass=a.isStatic?b.mass:b.isStatic?a.mass:a.mass*b.mass/(a.mass+b.mass),energy=.5*mass*speed*speed;let damage=energy*.42;for(const [target,other]of[[a,b],[b,a]]){let data=target.plugin.smash;if(data?.kind==='block'&&!data.broken)this.pending.set(target,(this.pending.get(target)||0)+damage);if(data?.kind==='projectile'&&data.type==='explosive'&&!data.used){data.used=true;this.blasts.push({x:target.position.x,y:target.position.y,radius:190,power:235,source:target});}}this.onImpact(pair.collision.supports[0]||a.position,clamp(speed/20,0,1));}};
  Events.on(this.engine,'collisionStart',this.collision);
  for(let n=0;n<180;n++)this.update(false);this.tick=0;this.initial=this.snapshot();
 }
 snapshot(){return this.blocks.map(b=>({index:b.plugin.smash.index,x:b.position.x,y:b.position.y,angle:b.angle,vx:b.velocity.x,vy:b.velocity.y,hp:b.plugin.smash.hp}));}
 arm(){this.armed=true;}
 launch(type,pull){if(this.config.shots!=null&&this.shots>=this.config.shots)return null;if(this.config.projectiles&&!this.config.projectiles.includes(type))throw Error('That projectile is not unlocked for this level.');if(!PROJECTILES[type])throw Error('Unknown projectile.');const p=PROJECTILES[type],len=Math.min(WORLD.pull,Math.hypot(pull.x,pull.y)),scale=Math.hypot(pull.x,pull.y)?len/Math.hypot(pull.x,pull.y):0;if(len<8)return null;
  const b=this.addBall(WORLD.sling.x+pull.x*scale,WORLD.sling.y+pull.y*scale,p.radius,type),v={x:-pull.x*scale*.19*p.power,y:-pull.y*scale*.19*p.power};this.M.Body.setVelocity(b,v);this.shots++;this.shotTick=this.tick;return b;
 }
 addBall(x,y,r,type,small=false){const p=PROJECTILES[type],b=this.M.Bodies.circle(x,y,r,{density:small?.008:p.density,friction:.2,frictionAir:type==='speed'?.001:.003,restitution:p.bounce,label:'projectile'},24);b.plugin.smash={kind:'projectile',type,used:small,born:this.tick,small};this.M.Composite.add(this.engine.world,b);this.projectiles.push(b);return b;}
 special(){const b=[...this.projectiles].reverse().find(b=>!b.plugin.smash.used&&['split','explosive'].includes(b.plugin.smash.type));if(!b)return false;if(b.plugin.smash.type==='split')this.split(b);else{b.plugin.smash.used=true;this.blasts.push({x:b.position.x,y:b.position.y,radius:190,power:235,source:b});}return true;}
 split(b){if(b.plugin.smash.used)return;b.plugin.smash.used=true;for(let i=-1;i<=1;i++){let child=this.addBall(b.position.x+16*i,b.position.y+18*i,13,'split',true);this.M.Body.setVelocity(child,{x:b.velocity.x*1.04+1,y:b.velocity.y+i*4});}this.removeBall(b);}
 removeBall(b){this.M.Composite.remove(this.engine.world,b);this.projectiles=this.projectiles.filter(x=>x!==b);}
 blast({x,y,radius,power,source}){if(source)this.removeBall(source);for(const b of this.blocks){if(b.plugin.smash.broken)continue;let dx=b.position.x-x,dy=b.position.y-y,d=Math.hypot(dx,dy);if(d>radius)continue;let strength=1-d/radius;this.pending.set(b,(this.pending.get(b)||0)+power*(.3+.7*strength));this.M.Body.applyForce(b,b.position,{x:dx/Math.max(12,d)*.035*strength*b.mass,y:(dy/Math.max(12,d)-.25)*.035*strength*b.mass});}this.onBlast({x,y,radius});}
 breakBlock(b){let d=b.plugin.smash;if(d.broken)return;d.broken=true;this.destroyed++;this.lastBreakTick=this.tick;this.breakTicks.push(this.tick);this.breakTicks=this.breakTicks.filter(t=>this.tick-t<=240);this.chain=Math.max(this.chain,this.breakTicks.length);this.M.Composite.remove(this.engine.world,b);
  if(d.spec.mat==='explosive')this.blasts.push({x:b.position.x,y:b.position.y,radius:175,power:225});
  for(let n=0;n<3&&this.fragments.length<130;n++){const r=clamp(Math.min(d.spec.w,d.spec.h)/4,5,14),f=this.M.Bodies.polygon(b.position.x+(n-1)*r,b.position.y-r,3,r,{density:MATERIALS[d.spec.mat].density,friction:.7,restitution:.12,frictionAir:.012,label:'fragment'});f.plugin.smash={kind:'fragment',mat:d.spec.mat,born:this.tick};this.M.Body.setVelocity(f,{x:b.velocity.x+(n-1)*1.4,y:b.velocity.y-1.5});this.M.Body.setAngularVelocity(f,(n-1)*.09);this.M.Composite.add(this.engine.world,f);this.fragments.push(f);}this.onBreak({x:b.position.x,y:b.position.y,material:d.spec.mat,index:d.index});
 }
 update(moveObstacles=true){this.tick++;if(moveObstacles)for(const b of this.obstacles){const o=b.plugin.smash.spec;this.M.Body.setPosition(b,{x:o.x,y:o.y+Math.sin(this.tick*STEP/1000*Math.PI*2/o.period)*o.range},true);}
  this.M.Engine.update(this.engine,STEP);
  if(this.armed){for(const b of [...this.projectiles]){const d=b.plugin.smash;if(d.type==='split'&&!d.used&&this.tick-d.born>=78)this.split(b);if(this.tick-d.born>1440||b.position.x<-60||b.position.x>1660||b.position.y>920)this.removeBall(b);}
   let rounds=0;while((this.pending.size||this.blasts.length)&&rounds++<60){while(this.blasts.length)this.blast(this.blasts.shift());let damage=[...this.pending];this.pending.clear();for(const [b,amount]of damage){const d=b.plugin.smash;if(d.broken)continue;d.hp-=amount;if(d.hp<=0)this.breakBlock(b);}}
  }
  for(const f of [...this.fragments])if(this.tick-f.plugin.smash.born>960||f.position.y>950){this.M.Composite.remove(this.engine.world,f);this.fragments=this.fragments.filter(x=>x!==f);}
 }
 settled(){if(this.shotTick<0||this.tick-this.shotTick<150)return false;return this.blocks.filter(b=>!b.plugin.smash.broken).every(b=>b.speed<.5&&b.angularSpeed<.025)&&this.projectiles.every(b=>b.speed<.6)||this.tick-this.shotTick>=1080;}
 get full(){return this.destroyed===this.blocks.length;}
 dispose(){this.M.Events.off(this.engine,'collisionStart',this.collision);this.M.Composite.clear(this.engine.world,false);this.M.Engine.clear(this.engine);}
}
export function aimVelocity(type,pull){const p=PROJECTILES[type],len=Math.hypot(pull.x,pull.y),f=Math.min(1,WORLD.pull/Math.max(.001,len));return{x:-pull.x*f*.19*p.power,y:-pull.y*f*.19*p.power};}
export function trajectory(type,pull){let {x:vx,y:vy}=aimVelocity(type,pull),x=WORLD.sling.x+pull.x*Math.min(1,WORLD.pull/Math.max(.001,Math.hypot(pull.x,pull.y))),y=WORLD.sling.y+pull.y*Math.min(1,WORLD.pull/Math.max(.001,Math.hypot(pull.x,pull.y))),points=[];for(let i=0;i<210;i++){const drag=1-(type==='speed'?.001:.003)*.5;vx*=drag;vy=vy*drag+1000/7200;x+=vx*.5;y+=vy*.5;if(i%8===0)points.push({x,y});if(y>WORLD.ground||x<0||x>1600)break;}return points;}
