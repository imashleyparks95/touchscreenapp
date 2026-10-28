import {clamp,dist,rectHit} from './touch-utils.js';
const themes=['Prism Laboratory','Candy Works','Glowstone Cave','Orbital Facility'];
function level(i){const tier=Math.floor(i/6)+1,shift=(i%6)*14;
 const solids=[{x:0,y:585,w:1000,h:55,kind:'ground'},{x:260+shift,y:470-(i%3)*25,w:115,h:18,kind:'platform'}];
 const hazards=[],zones=[],orbs=[{x:210+shift,y:425,key:true},{x:510,y:365-(i%3)*30,key:tier>=3},{x:795-shift/2,y:420,key:false}];
 if(i>=3)hazards.push({x:400+shift,y:556,w:75,h:29,kind:'spikes'});
 if(tier>=2)solids.push({x:570,y:430,w:100,h:18,kind:'moving',range:50,axis:'y',period:4000});
 if(i>=8)zones.push({x:365,y:280,w:100,h:275,kind:'fan',force:-.17});
 if(i>=10)solids.push({x:30,y:566,w:180,h:19,kind:i%2?'ice':'conveyor',direction:1});
 if(i>=12)hazards.push({x:705,y:250,w:16,h:260,kind:'laser',period:4200,on:1900});
 if(i>=14)solids.push({x:450,y:210,w:18,h:170,kind:'rotator',period:6500});
 if(i>=16)solids.push({x:810,y:510,w:100,h:18,kind:'bounce'});
 if(i>=18){solids.push({x:390,y:150,w:100,h:25,kind:'sticky'});solids.push({x:480,y:405,w:100,h:20,kind:'wall',range:45,axis:'x',period:3600});}
 if(i>=20)zones.push({x:80,y:490,w:35,h:35,kind:'teleporter',dest:{x:330,y:340}});
 if(i>=22){solids.push({x:600,y:180,w:35,h:150,kind:'passage'},{x:600,y:375,w:35,h:160,kind:'passage'});orbs[1]={x:665,y:350,key:true};}
 if(i%5===4)orbs.push({x:155,y:170,key:false,secret:true});
 const pads=i>=24?[{x:240,y:540,w:105,h:25},{x:875,y:540,w:105,h:25}]:[];
 if(i>=24&&hazards[0]?.kind==='spikes'){hazards[0].x=550;hazards[0].w=65;}
 return{id:i+1,name:['Jelly Jump','Orb Collector','Spring Street','Sugar Bounce','Prism Hop','Wobble Works'][i%6]+' '+(Math.floor(i/6)+1),tier,theme:themes[Math.floor(i/8)%4],start:{x:85,y:520},exit:{x:910,y:495,w:65,h:85},solids,hazards,zones,orbs,pads,split:i>=18,requiresSplit:i>=24,time:210000-tier*12000};
}
export const SLIME_LEVELS=Array.from({length:30},(_,i)=>level(i));
function insideBlob(b,p){let inside=false;for(let i=0,j=b.nodes.length-1;i<b.nodes.length;j=i++){const a=b.nodes[i],z=b.nodes[j];if((a.y>p.y)!==(z.y>p.y)&&p.x<(z.x-a.x)*(p.y-a.y)/(z.y-a.y)+a.x)inside=!inside;}return inside;}
export class SlimeBlob{
 constructor(x,y,mass=1){this.mass=mass;this.radius=32*Math.sqrt(mass);this.nodes=Array.from({length:16},(_,i)=>{const a=i*Math.PI/8;return{x:x+Math.cos(a)*this.radius,y:y+Math.sin(a)*this.radius,px:x+Math.cos(a)*this.radius,py:y+Math.sin(a)*this.radius};});this.pins=new Map();this.teleportAt=0;this.grounded=false;}
 get center(){return this.nodes.reduce((a,p)=>({x:a.x+p.x/16,y:a.y+p.y/16}),{x:0,y:0});}
 moveTo(x,y){const c=this.center;for(const p of this.nodes){p.x+=x-c.x;p.y+=y-c.y;p.px=p.x;p.py=p.y;}}
 impulse(vx,vy){for(const p of this.nodes){p.px=p.x-vx/120;p.py=p.y-vy/120;}}
}
export class SlimeModel{
 constructor({level=1,difficulty=3}={}){this.level=structuredClone(SLIME_LEVELS[level-1]);this.difficulty=difficulty;this.clock=0;this.duration=this.level.time;this.blobs=[new SlimeBlob(this.level.start.x,this.level.start.y,[1.12,1.06,1,.94,.8][difficulty-1])];this.mass=this.blobs[0].mass;this.pointers=new Map();this.collected=new Set();this.attempts=0;this.complete=false;this.done=false;this.finishedAt=null;this.padLatched=false;this.padProgress=0;this.splitCount=0;this.mergeCount=0;this.lastSplit=-10000;this.events=[];this.bursts=[];this.feedback='Hold the slime, pull back and release to sling. Its body stays anchored while you aim.';this.secret=false;this.stretchMax=1;}
 geometry(){return [...this.level.solids,...this.level.pads.map(p=>({...p,kind:'pad'}))].map(r=>{let out={...r};if(r.range)out[r.axis]+=Math.sin(this.clock/r.period*Math.PI*2)*r.range;if(r.kind==='rotator'){out.angle=this.clock/r.period*Math.PI*2;}return out;});}
 input(kind,x,y,id){if(this.done)return false;if(kind==='down'){
  if(this.pointers.has(id))return false;let nearest=null;for(const b of this.blobs)for(let i=0;i<b.nodes.length;i++){const p=b.nodes[i],d=dist(p,{x,y});if(!nearest||d<nearest.d)nearest={b,i,d};}if(!nearest||nearest.d>65||nearest.b.pins.size>=2)return false;
  if([...nearest.b.pins.values()].some(p=>p.index===nearest.i))nearest.i=(nearest.i+8)%16;
  if(!nearest.b.pins.size)nearest.b.anchor={...nearest.b.center};const p={blob:nearest.b,index:nearest.i,x,y,origin:{x,y},last:{x,y},travel:0};this.pointers.set(id,p);nearest.b.pins.set(id,p);return true;
 }const p=this.pointers.get(id);if(!p)return false;if(kind==='move'){p.travel+=Math.hypot(x-p.x,y-p.y);p.last={x:p.x,y:p.y};const dx=x-p.origin.x,dy=y-p.origin.y,len=Math.hypot(dx,dy),k=Math.min(1,115/Math.max(1,len));p.x=p.origin.x+dx*k;p.y=p.origin.y+dy*k;this.feedback='Elastic tension '+Math.round(Math.min(100,len/115*100))+'% — release to sling.';return true;}
 if(kind==='up'||kind==='cancel'){p.blob.pins.delete(id);this.pointers.delete(id);if(!p.blob.pins.size)delete p.blob.anchor;if(kind==='up'&&!p.blob.pins.size){const pull={x:p.x-p.origin.x,y:p.y-p.origin.y},length=Math.hypot(pull.x,pull.y);if(length>12){const k=Math.min(720,length*[6.7,6.5,6.3,6.15,6][this.difficulty-1])/length;p.blob.impulse(-pull.x*k,-pull.y*k);this.events.push('boing');}}return true;}return false;}
 cancel(){for(const id of [...this.pointers.keys()])this.input('cancel',0,0,id);}
 split(){if(this.done||!this.level.split||this.blobs.length!==1||this.clock-this.lastSplit<1200)return false;this.cancel();const b=this.blobs[0],c=b.center;this.blobs=[new SlimeBlob(c.x-25,c.y,b.mass/2),new SlimeBlob(c.x+25,c.y,b.mass/2)];this.splitCount++;this.lastSplit=this.clock;this.feedback='Two blobs! Put one on each pad, then bring them together.';this.events.push('split');return true;}
 reset(){this.cancel();this.blobs=[new SlimeBlob(this.level.start.x,this.level.start.y,this.mass)];this.attempts++;this.events.push('oops');this.feedback='Slime is safe! Try a different route. Your orbs are kept.';}
 activeHazards(){return this.level.hazards.filter(r=>r.kind!=='laser'||this.clock%r.period<r.on);}
 step(){if(this.done)return;this.clock+=1000/120;this.bursts=this.bursts.filter(b=>this.clock-b.born<900);const geometry=this.geometry();
 for(const b of this.blobs){b.grounded=false;const pins=[...b.pins.values()];let compression=1;if(pins.length===2){const ratio=dist(pins[0],pins[1])/(b.radius*2);compression=clamp(ratio,.35,1.55);this.stretchMax=Math.max(this.stretchMax,ratio);}
 for(const p of b.nodes){let vx=clamp((p.x-p.px)*.992,-7,7),vy=clamp((p.y-p.py)*.992,-7,7);p.px=p.x;p.py=p.y;p.x+=vx;p.y+=vy+.045;for(const z of this.level.zones)if(z.kind==='fan'&&rectHit(p,z)){p.y+=z.force*(1+this.difficulty*.08);}}
 for(let iter=0;iter<8;iter++){
  const center=b.center,target=b.radius*compression;
  // Perimeter and cross-body springs create a deformable closed mesh.
  for(let i=0;i<16;i++)for(const [offset,stiffness]of [[1,.46],[4,.04],[8,.018]]){const p=b.nodes[i],q=b.nodes[(i+offset)%16],dx=q.x-p.x,dy=q.y-p.y,len=Math.hypot(dx,dy)||.001,rest=2*target*Math.sin(offset*Math.PI/16),f=(len-rest)/len*stiffness;p.x+=dx*f;p.y+=dy*f;q.x-=dx*f;q.y-=dy*f;}
  // Gentle pressure restores volume while two pinned points can compress or stretch it.
  for(const p of b.nodes){let dx=p.x-center.x,dy=p.y-center.y,r=Math.hypot(dx,dy)||1,f=(target-r)/r*.018;p.x+=dx*f;p.y+=dy*f;}
  for(const pin of pins){const p=b.nodes[pin.index],dx=pin.x-p.x,dy=pin.y-p.y,len=Math.hypot(dx,dy),k=len>18?18/len:1;p.x+=dx*k*.72;p.y+=dy*k*.72;}
  for(const p of b.nodes){p.x=clamp(p.x,4,996);p.y=Math.max(10,p.y);for(const r of geometry)this.collide(p,r,b);}
 }
 if(pins.length&&b.anchor){const c=b.center,dx=b.anchor.x-c.x,dy=b.anchor.y-c.y;for(const n of b.nodes){n.x+=dx;n.y+=dy;n.px=n.x;n.py=n.y;}}
 const c=b.center;for(const [i,o]of this.level.orbs.entries())if(!this.collected.has(i)&&(insideBlob(b,o)||b.nodes.some(p=>dist(p,o)<25))){this.collected.add(i);if(o.secret)this.secret=true;this.bursts.push({x:o.x,y:o.y,born:this.clock});this.events.push('orb');}
 if(this.activeHazards().some(r=>b.nodes.some(p=>rectHit(p,r,1)))||c.y>680){this.reset();return;}
 for(const z of this.level.zones)if(z.kind==='teleporter'&&rectHit(c,z,10)&&this.clock>b.teleportAt){b.moveTo(z.dest.x,z.dest.y);b.teleportAt=this.clock+1800;this.events.push('warp');}
 }
 if(this.blobs.length===2){const[a,b]=this.blobs;if(this.level.pads.length){const on=this.level.pads.every(p=>this.blobs.some(b=>{const c=b.center;return c.x>p.x-15&&c.x<p.x+p.w+15&&c.y>p.y-55&&c.y<p.y+p.h&&b.nodes.some(n=>rectHit(n,p,7));}));this.padProgress=on?this.padProgress+1000/120:Math.max(0,this.padProgress-5);if(this.padProgress>[180,220,260,300,350][this.difficulty-1]&&!this.padLatched){this.padLatched=true;this.events.push('gate');this.feedback='Both pads powered! Merge the blobs and reach the exit.';}}
 if(!a.pins.size&&!b.pins.size&&this.clock-this.lastSplit>1300&&dist(a.center,b.center)<a.radius+b.radius+7){const c={x:(a.center.x*a.mass+b.center.x*b.mass)/this.mass,y:(a.center.y*a.mass+b.center.y*b.mass)/this.mass};this.blobs=[new SlimeBlob(c.x,c.y,a.mass+b.mass)];this.mergeCount++;this.events.push('merge');}}
 const keys=this.level.orbs.every((o,i)=>!o.key||this.collected.has(i));if(keys&&(!this.level.requiresSplit||this.padLatched&&this.mergeCount>0)&&this.blobs.length===1&&rectHit(this.blobs[0].center,this.level.exit)){this.complete=true;this.done=true;this.finishedAt=this.clock;this.events.push('finish');}
 if(this.clock>=this.duration){this.done=true;this.feedback='Time is up. Every experiment teaches you something!';}
 }
 collide(p,r,b){let cx=r.x+r.w/2,cy=r.y+r.h/2,angle=r.angle||0,cos=Math.cos(angle),sin=Math.sin(angle),dx=p.x-cx,dy=p.y-cy,lx=dx*cos+dy*sin,ly=-dx*sin+dy*cos;if(Math.abs(lx)>r.w/2||Math.abs(ly)>r.h/2)return;
 const overlapX=r.w/2-Math.abs(lx),overlapY=r.h/2-Math.abs(ly);if(overlapY<overlapX){ly=Math.sign(ly||-1)*(r.h/2+.1);b.grounded=true;}else lx=Math.sign(lx||-1)*(r.w/2+.1);
 p.x=cx+lx*cos-ly*sin;p.y=cy+lx*sin+ly*cos;
 if(r.kind==='bounce'&&ly<0){p.py=p.y+4.5;if(this.clock-(this.lastBounce||-1000)>80){this.events.push('bounce');this.lastBounce=this.clock;}}else if(r.kind==='sticky'){p.px=p.x;p.py=p.y;}else if(r.kind==='conveyor'){p.x+=.025*r.direction;}else if(r.kind!=='ice'){p.px+=(p.x-p.px)*.06;}
 }
 update(dt){this.accumulator=(this.accumulator||0)+dt;let steps=0;while(this.accumulator>=1000/120&&!this.done&&steps++<1200){this.step();this.accumulator-=1000/120;}}
 get accuracy(){return Math.round(100/(1+this.attempts*.12));}
 get stars(){return this.complete?1+(this.collected.size===this.level.orbs.length?1:0)+(this.attempts===0&&this.clock<this.duration*.7?1:0):0;}
 get score(){return Math.max(0,this.collected.size*100+(this.complete?700+Math.max(0,Math.floor((this.duration-this.clock)/300)):0)-this.attempts*40);}
 summary(){return{completed:this.complete,orbs:this.collected.size,totalOrbs:this.level.orbs.length,attempts:this.attempts,split:this.splitCount,merge:this.mergeCount,stretched:this.stretchMax,stars:this.stars};}
}
