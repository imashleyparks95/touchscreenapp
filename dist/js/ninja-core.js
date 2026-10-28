import {clamp,dist,rectHit,segmentCircle,angleDelta} from './touch-utils.js';
const themes=['Moonlit Dojo','Bamboo Gardens','Temple of Echoes','Castle Rooftops','Crystal Tunnels','Neon Citadel'];
function blueprint(i){const tier=Math.floor(i/6)+1,delta=(i%6)*8;
 const walls=[{x:390,y:160+delta,w:36,h:255,kind:'wall'},{x:600,y:300-delta,w:120,h:28,kind:'wall'}];
 if(tier>=2)walls.push({x:480,y:60,w:28,h:195,kind:'wall'},{x:480,y:365,w:28,h:215,kind:'wall'});
 if(tier>=3)walls.push({x:480,y:255,w:28,h:110,kind:'door'});
 if(i>=15)walls.push({x:730,y:380,w:24,h:110,kind:'movingWall',range:65,period:5000});
 if(i>=10)walls.push({x:820,y:145,w:90,h:16,kind:'timedDoor',period:4600,openFor:2600});
 const guards=[{x:570,y:430,axis:'x',range:100,period:7000-tier*500,angle:Math.PI,cone:.5,radius:120+tier*15}];
 if(tier>=2)guards.push({x:770,y:190,axis:'y',range:80,period:6500-tier*400,angle:Math.PI/2,cone:.55,radius:155});
 const lights=tier>=3?[{x:550,y:120,angle:.6,range:200,period:6000-tier*400,cone:.28}]:[];
 const lasers=tier>=2?[{x:650,y:430-delta,x2:840,y2:430-delta,period:4500,on:1700}]:[];
 const plates=i>=18?[{x:305,y:510,r:26}]:[];
 const traps=i>=12?[{x:825,y:290,r:24,period:4000,on:1000}]:[];
 const scrolls=[{x:245,y:465-delta,key:true},{x:680+delta,y:110,key:true},{x:840,y:505,key:false}];
 const covers=[{x:285,y:220,w:65,h:70},{x:745,y:460,w:80,h:60}];
 const platforms=i>=15?[{x:130,y:330,w:95,h:32,kind:i%2?'movingPlatform':'collapse',period:3500,range:45}]:[];
 return{id:i+1,name:['Lantern Run','Bamboo Bypass','Silent Steps','Rooftop Relay','Shadow Circuit','Moon Gate'][i%6]+' '+(Math.floor(i/6)+1),tier,theme:themes[Math.floor(i/5)],start:{x:85,y:530},exit:{x:900,y:70,w:60,h:85},walls,guards,lights,lasers,plates,traps,scrolls,covers,platforms,switch:{x:290,y:305,r:18,required:i>=6},requiresPlate:i>=18,time:210000-tier*10000};
}
export const NINJA_LEVELS=Array.from({length:30},(_,i)=>blueprint(i));
export class NinjaModel{
 constructor({level=1,difficulty=3}={}){this.level=structuredClone(NINJA_LEVELS[level-1]);this.difficulty=difficulty;this.ninja={...this.level.start,r:15};this.clock=0;this.duration=this.level.time;this.route=[];this.preview=[];this.pointer=null;this.shieldPointers=new Set();this.energy=[100,90,75,60,45][difficulty-1];this.maxEnergy=this.energy;this.mode='path';this.collected=new Set();this.projectiles=[];this.switchOn=false;this.plateOn=false;this.detected=0;this.alarm=0;this.shieldTime=0;this.complete=false;this.done=false;this.finishedAt=null;this.cooldown=0;this.dashUntil=0;this.slideUntil=0;this.jumpUntil=0;this.stunned=new Map();this.events=[];this.bursts=[];this.feedback='Draw a route. Hold Shield with another finger when a warning fills.';this.dashCount=0;this.blinkCount=0;this.jumpCount=0;this.slideCount=0;this.hidden=false;}
 geometry(){return this.level.walls.filter(r=>(r.kind!=='door'||!this.switchOn)&&(r.kind!=='timedDoor'||this.clock%r.period>=r.openFor)).map(r=>({...r,x:r.x+(r.kind==='movingWall'?Math.sin(this.clock/r.period*Math.PI*2)*r.range:0)}));}
 guards(){return this.level.guards.map((g,i)=>{const t=this.clock/g.period*Math.PI*2,pos=Math.sin(t)*g.range,dir=Math.cos(t)>=0?1:-1;return{...g,index:i,x:g.x+(g.axis==='x'?pos:0),y:g.y+(g.axis==='y'?pos:0),angle:g.axis==='x'?(dir>0?0:Math.PI):(dir>0?Math.PI/2:-Math.PI/2),stunned:(this.stunned.get(i)||0)>this.clock};});}
 blocked(p,radius=this.ninja.r){return p.x<radius||p.y<radius||p.x>1000-radius||p.y>640-radius||this.geometry().some(r=>rectHit(p,r,radius));}
 lineBlocked(a,b){const len=dist(a,b),steps=Math.max(1,Math.ceil(len/8));for(let i=0;i<=steps;i++)if(this.geometry().some(r=>rectHit({x:a.x+(b.x-a.x)*i/steps,y:a.y+(b.y-a.y)*i/steps},r)))return true;return false;}
 shield(id,on){if(on){if(!this.done)this.shieldPointers.add(id);}else this.shieldPointers.delete(id);}
 input(kind,x,y,id){if(this.done)return false;const point={x:clamp(x,18,982),y:clamp(y,18,622)};
 if(kind==='down'){if(this.pointer)return false;this.pointer={id,start:point,at:this.clock,points:[{...this.ninja},point]};this.preview=this.pointer.points;return true;}
 if(this.pointer?.id!==id)return false;if(kind==='move'){const a=this.pointer.points.at(-1);if(dist(a,point)>9)this.pointer.points.push(point);this.preview=this.pointer.points;return true;}
 const p=this.pointer;this.pointer=null;this.preview=[];if(kind==='cancel')return true;p.points.push(point);
 if(this.mode==='star'){this.throwStar(point);return true;}
 if(this.mode==='blink'||this.mode==='jump'){this.special(this.mode,point);return true;}
 if(this.mode==='dash'){const direction={x:point.x-p.start.x,y:point.y-p.start.y},len=Math.hypot(direction.x,direction.y);if(len<18||this.clock<this.cooldown)return false;const end={x:this.ninja.x+direction.x/len*145,y:this.ninja.y+direction.y/len*145};this.route=[end];this.dashUntil=this.clock+350;this.cooldown=this.clock+650;this.dashCount++;this.events.push('dash');return true;}
 this.route=p.points.slice(1);if(this.mode==='slide'){this.slideUntil=this.clock+1700;this.slideCount++;}this.feedback='Route set. Tap Cancel Route to stop.';return true;
 }
 cancel(){this.pointer=null;this.preview=[];this.route=[];this.shieldPointers.clear();}
 throwStar(target){if(this.clock<this.cooldown||this.energy<4)return false;const d=dist(this.ninja,target)||1;this.energy-=4;this.cooldown=this.clock+350;this.projectiles.push({x:this.ninja.x,y:this.ninja.y,vx:(target.x-this.ninja.x)/d*650,vy:(target.y-this.ninja.y)/d*650,life:1400});this.events.push('star');return true;}
 special(kind,target){if(this.clock<this.cooldown||this.energy<(kind==='blink'?18:9))return false;const d=dist(this.ninja,target);if(d<10)return false;const range=kind==='blink'?130:165,k=Math.min(range,d)/d,dest={x:this.ninja.x+(target.x-this.ninja.x)*k,y:this.ninja.y+(target.y-this.ninja.y)*k};if(this.blocked(dest,15)){this.feedback='Choose a clear landing spot.';return false;}
 if(kind==='jump'&&!this.geometry().some(r=>rectHit(this.ninja,r,45))){this.feedback='Wall jump starts next to a wall or ledge.';return false;}
 this.ninja.x=dest.x;this.ninja.y=dest.y;this.route=[];this.energy-=kind==='blink'?18:9;this.cooldown=this.clock+2100;this.jumpUntil=this.clock+400;if(kind==='blink')this.blinkCount++;else this.jumpCount++;this.events.push('warp');return true;
 }
 catch(reason){if(this.clock<(this.safeUntil||0))return;this.detected++;this.ninja.x=this.level.start.x;this.ninja.y=this.level.start.y;this.route=[];this.alarm=0;this.energy=Math.min(this.maxEnergy,this.energy+18);this.safeUntil=this.clock+1800;this.events.push('caught');this.feedback=reason+' Back to the safe lantern. Collected scrolls stay with you.';}
 update(dt){this.accumulator=(this.accumulator||0)+dt;let n=0;while(this.accumulator>=1000/120&&!this.done&&n++<1200){this.step(1000/120);this.accumulator-=1000/120;}}
 step(dt){this.clock+=dt;this.bursts=this.bursts.filter(b=>this.clock-b.born<900);const t=dt/1000,n=this.ninja;this.hidden=this.level.covers.some(c=>rectHit(n,c,8));const shielding=this.shieldPointers.size>0&&this.energy>0;
 if(shielding){this.energy=Math.max(0,this.energy-19*t);this.shieldTime+=dt;}else this.energy=Math.min(this.maxEnergy,this.energy+(this.hidden?12:4)*t);
 n.r=this.clock<this.slideUntil?8:15;
 if(this.route.length){const target=this.route[0],d=dist(n,target),speed=this.clock<this.dashUntil?600:this.clock<this.slideUntil?180:145,step=Math.min(d,speed*t),next={x:n.x+(target.x-n.x)/(d||1)*step,y:n.y+(target.y-n.y)/(d||1)*step};if(!this.blocked(next)){n.x=next.x;n.y=next.y;if(d<4)this.route.shift();}else{this.route=[];this.feedback='Wall ahead. Draw around it, slide a gap, or use a wall jump.';}}
 for(const platform of this.level.platforms){const r={...platform,x:platform.x+Math.sin(this.clock/platform.period*Math.PI*2)*platform.range};if(rectHit(n,r)){if(platform.kind==='movingPlatform')n.x+=Math.cos(this.clock/platform.period*Math.PI*2)*.35;else{this.collapseAt??=this.clock;if(this.clock-this.collapseAt>1100&&!shielding)this.catch('The platform folded into a cushion!');}}}
 this.level.scrolls.forEach((o,i)=>{if(!this.collected.has(i)&&dist(n,o)<26){this.collected.add(i);this.bursts.push({x:o.x,y:o.y,born:this.clock});this.events.push('scroll');}});
 if(this.level.plates.some(p=>dist(n,p)<p.r)){this.plateOn=true;this.events.push(...(!this.plateSound?['gate']:[]));this.plateSound=true;}
 this.projectiles=this.projectiles.filter(p=>{const old={x:p.x,y:p.y};p.x+=p.vx*t;p.y+=p.vy*t;p.life-=dt;if(segmentCircle(old,p,this.level.switch,this.level.switch.r+5)){this.switchOn=true;this.events.push('gate');return false;}for(const g of this.guards())if(segmentCircle(old,p,g,22)){this.stunned.set(g.index,this.clock+3500);this.events.push('stun');return false;}return p.life>0&&!this.lineBlocked(old,p);});
 let visible=false;if(!this.hidden){for(const g of this.guards())if(!g.stunned&&dist(n,g)<g.radius&&Math.abs(angleDelta(Math.atan2(n.y-g.y,n.x-g.x),g.angle))<g.cone&&!this.lineBlocked(g,n))visible=true;for(const l of this.level.lights){const a=l.angle+Math.sin(this.clock/l.period*Math.PI*2)*1.1;if(dist(n,l)<l.range&&Math.abs(angleDelta(Math.atan2(n.y-l.y,n.x-l.x),a))<l.cone&&!this.lineBlocked(l,n))visible=true;}}
 if(visible&&!shielding)this.alarm+=dt;else this.alarm=Math.max(0,this.alarm-dt*2);if(this.alarm>[1200,1050,900,800,700][this.difficulty-1])this.catch('Spotted by the security lights!');
 if(!shielding&&this.clock>this.jumpUntil){for(const l of this.level.lasers)if(this.clock%l.period<l.on&&segmentCircle({x:l.x,y:l.y},{x:l.x2,y:l.y2},n,n.r+2))this.catch('A soft laser tagged your scarf!');for(const trap of this.level.traps)if(this.clock%trap.period<trap.on&&dist(n,trap)<trap.r+n.r)this.catch('A hidden spring trap bounced you back!');}
 const keys=this.level.scrolls.every((s,i)=>!s.key||this.collected.has(i));if(rectHit(n,this.level.exit)&&keys&&(!this.level.switch.required||this.switchOn)&&(!this.level.requiresPlate||this.plateOn)){this.complete=true;this.done=true;this.finishedAt=this.clock;this.events.push('finish');}
 if(this.clock>=this.duration){this.done=true;this.feedback='The lantern festival is closing. Try another route!';}
 }
 get accuracy(){return Math.round(100/(1+this.detected*.2));}
 get stars(){return this.complete?1+(this.detected===0?1:0)+(this.collected.size===this.level.scrolls.length?1:0):0;}
 get score(){return Math.max(0,this.collected.size*150+(this.complete?700+Math.max(0,Math.floor((this.duration-this.clock)/250)):0)-this.detected*100);}
 summary(){return{completed:this.complete,scrolls:this.collected.size,detected:this.detected,perfect:this.complete&&this.detected===0,stars:this.stars,dashes:this.dashCount,wallJumps:this.jumpCount,blinks:this.blinkCount,slides:this.slideCount};}
}
