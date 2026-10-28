export const FOODS=[
 ['🍕','Pizza',1,1],['🍔','Burger',.9,1.15],['🍟','Fries',1.1,.85],['🍩','Donut',1,.95],['🧁','Cupcake',.9,1.1],['🍎','Apple',1.05,1],['🍌','Banana',1.12,.85],['🍉','Watermelon',.9,1.2],['🍪','Cookie',1.12,.85],['🌭','Hot dog',1.05,.9],['🍦','Ice cream',.95,1],['👾','Monster snack',1.15,.8]
].map(([emoji,name,speed,gravity])=>({emoji,name,speed,gravity}));
export const FACE_MODES={classic:'Classic',target:'Target Challenge',survival:'Survival',frenzy:'Food Frenzy'};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function rng(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
function segmentEllipse(a,b,c,rx,ry){const dx=(b.x-a.x)/rx,dy=(b.y-a.y)/ry,x=(a.x-c.x)/rx,y=(a.y-c.y)/ry,t=clamp(-(x*dx+y*dy)/(dx*dx+dy*dy||1),0,1);return (x+dx*t)**2+(y+dy*t)**2<=1;}
export class FaceModel{
 constructor({difficulty=3,mode='classic',players=1,seed=42,level=1}={}){this.difficulty=difficulty;this.mode=mode;this.players=players;this.seed=seed;this.random=rng(seed);this.level=level;this.clock=0;this.duration=mode==='target'?90000:mode==='survival'?120000:60000;this.done=false;this.target=5+level*2;this.hits=0;this.lives=6;this.food=0;this.selectedFoods=Array(players).fill(0);this.request=0;this.requestChoices=[6,8,10,12,12][difficulty-1];this.requestAt=0;this.nextRequest=[11500,10000,8500,7000,5500][difficulty-1];this.angryUntil=0;this.projectiles=[];this.aims=new Map();this.stats=Array.from({length:players},()=>({score:0,hits:0,shots:0,streak:0,bestStreak:0,fastest:null,misses:0,nextShot:0}));const widths=[200,180,165,145,130];const w=widths[difficulty-1],speed=[80,110,150,185,220][difficulty-1];this.head={x:500,y:230,w,h:w*1.68,vx:speed,vy:speed*.45};this.turnAt=2200;this.expression='closed';this.chew=null;this.chewQueue=0;this.events=[];this.particles=[];this.popups=[];this.obstacles=Array.from({length:Math.max(0,difficulty-3)},(_,i)=>({x:330+i*330,y:400+i*30,w:100,h:20}));}
 get mouth(){const h=this.head;return{x:h.x,y:h.y+h.h*.25,rx:h.w*[.21,.19,.17,.16,.15][this.difficulty-1],ry:h.h*.07};}
 get launchers(){return this.players===2?[{x:140,y:565},{x:860,y:565}]:[{x:190,y:565}];}
 selectFood(owner,index){if(!this.stats[owner]||!FOODS[index])return false;this.selectedFoods[owner]=index;return true;}
 shoot(owner,x,y){if(this.done||!this.stats[owner]||this.clock<this.stats[owner].nextShot)return false;const l=this.launchers[owner],food=this.selectedFoods[owner],f=FOODS[food],travel=Math.min(1.15,.48+Math.hypot(x-l.x,y-l.y)/1400)/f.speed;const vx=(x-l.x)/travel,vy=(y-l.y-.5*260*f.gravity*travel*travel)/travel,s=this.stats[owner];s.shots++;s.nextShot=this.clock+(this.mode==='frenzy'?180:360);this.projectiles.push({x:l.x,y:l.y,vx,vy,owner,food,request:this.request,born:this.clock,dead:false});return true;}
 startAim(){return false;}
 aim(){}
 release(){return false;}
 feed(p){if(p.dead)return;if(p.food!==(p.request??this.request)){this.angryUntil=this.clock+1400;this.stats[p.owner].score=Math.max(0,this.stats[p.owner].score-25);this.events.push({kind:'bad',owner:p.owner});this.miss(p);return;}p.dead=true;let s=this.stats[p.owner];s.hits++;this.hits++;s.streak++;s.bestStreak=Math.max(s.bestStreak,s.streak);s.score+=100*Math.min(5,1+Math.floor((s.streak-1)/3))*(this.mode==='frenzy'?1.25:1);s.fastest=Math.min(s.fastest??Infinity,this.clock-p.born);if(this.chew)this.chewQueue++;else this.startChew();this.events.push({kind:'feed',owner:p.owner});this.popups.push({x:this.mouth.x,y:this.mouth.y,life:1,points:100*Math.min(5,1+Math.floor((s.streak-1)/3))*(this.mode==='frenzy'?1.25:1),owner:p.owner});for(let i=0;i<14;i++){// Cosmetic particles never consume the movement RNG.
 const a=i*Math.PI*2/14;this.particles.push({x:this.mouth.x,y:this.mouth.y,vx:Math.cos(a)*100,vy:Math.sin(a)*90-50,life:.7,owner:p.owner});}}
 startChew(){this.chew={elapsed:0,cycles:3+(this.hits%2),stage:0};this.expression='open';this.events.push({kind:'chew'});}
 miss(p){if(p.dead)return;p.dead=true;let s=this.stats[p.owner];s.misses++;s.streak=0;if(this.mode==='survival'&&this.players===1){this.lives--;if(this.lives<=0)this.done=true;}}
 step(dt){if(this.done)return;dt=Math.min(dt,50);this.clock+=dt;const t=dt/1000,h=this.head,prev={...this.mouth};if(this.clock>=this.nextRequest){this.request=(this.request+1+Math.floor(this.random()*(this.requestChoices-1)))%this.requestChoices;this.requestAt=this.clock;this.nextRequest=this.clock+[11500,10000,8500,7000,5500][this.difficulty-1];this.events.push({kind:'signal'});}
 // Movement has no dependency on chewing, scoring, particles, or expression.
 if(this.clock>=this.turnAt){const speed=[80,110,150,185,220][this.difficulty-1]*(this.mode==='survival'?Math.min(2,1+this.clock/90000):1),angle=this.random()*Math.PI*2;h.vx=Math.cos(angle)*speed;h.vy=Math.sin(angle)*speed*.7;this.turnAt=this.clock+[4000,3000,2300,1800,1300][this.difficulty-1]*(.7+this.random()*.6);}
 h.x+=h.vx*t;h.y+=h.vy*t;const minX=h.w*.57+15,maxX=1000-h.w*.57-15,minY=h.h/2+10,maxY=485-h.h/2;
 if(h.x<minX){h.x=minX+(minX-h.x);h.vx=Math.abs(h.vx);}if(h.x>maxX){h.x=maxX-(h.x-maxX);h.vx=-Math.abs(h.vx);}if(h.y<minY){h.y=minY+(minY-h.y);h.vy=Math.abs(h.vy);}if(h.y>maxY){h.y=maxY-(h.y-maxY);h.vy=-Math.abs(h.vy);}
 this.obstacles.forEach((o,i)=>o.x=280+i*350+Math.sin(this.clock/1200+i)*70);
 const mouth=this.mouth;
 for(let p of this.projectiles){if(p.dead)continue;const a={x:p.x-prev.x,y:p.y-prev.y};p.vy+=260*FOODS[p.food].gravity*t;p.x+=p.vx*t;p.y+=p.vy*t;const b={x:p.x-mouth.x,y:p.y-mouth.y};
 if(this.obstacles.some(o=>segmentEllipse({x:a.x+prev.x,y:a.y+prev.y},{x:p.x,y:p.y},{x:o.x,y:o.y},o.w/2,o.h/2+8))){this.miss(p);continue;}
 if(segmentEllipse(a,b,{x:0,y:0},mouth.rx,mouth.ry)){this.feed(p);continue;}
 if(p.x< -50||p.x>1050||p.y>700||this.clock-p.born>6500)this.miss(p);
 }
 this.projectiles=this.projectiles.filter(p=>!p.dead);
 if(this.chew){const c=this.chew;c.elapsed+=dt;while(c.elapsed>=170){c.elapsed-=170;c.stage++;if(c.stage>=c.cycles*2){this.expression='closed';this.chew=null;this.events.push({kind:'swallow'});if(this.chewQueue){this.chewQueue--;this.startChew();}break;}this.expression=c.stage%2?'closed':'open';if(!(c.stage%2))this.events.push({kind:'chew'});}}
 this.popups=this.popups.filter(p=>{p.life-=t;p.y-=30*t;return p.life>0;});
 this.particles=this.particles.filter(p=>{p.life-=t;p.x+=p.vx*t;p.y+=p.vy*t;p.vy+=180*t;return p.life>0;});
 if(this.clock>=this.duration||(this.mode==='target'&&this.players===1&&this.hits>=this.target))this.done=true;
 }
 update(dt){let remaining=dt;while(remaining>0&&!this.done){const t=Math.min(remaining,1000/120);this.step(t);remaining-=t;}}
 accuracy(i){const s=this.stats[i];return s.shots?Math.round(100*s.hits/s.shots):0;}
}
export function compareFeed(model){const[a,b]=model.stats;return a.score-b.score||a.hits-b.hits||model.accuracy(0)-model.accuracy(1);}
export class SecretTaps{constructor(){this.taps=[];}tap(now){this.taps=this.taps.filter(t=>now-t<=3000);this.taps.push(now);if(this.taps.length===5){this.taps=[];return true;}return false;}reset(){this.taps=[];}}
