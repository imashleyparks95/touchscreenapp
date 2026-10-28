// Air Slice: deterministic arcade physics, continuous arm/fruit collisions and shared scoring.
export const AIR_MODES={classic:'Classic',arcade:'Arcade',zen:'Zen',frenzy:'Fruit Frenzy'};
export const AIR_DIFFICULTIES=['Easy','Normal','Hard'];
export const AIR_FRUITS=['watermelon','apple','orange','banana','strawberry','pineapple','kiwi','lemon','peach','coconut'];
export const AIR_DEFAULTS={mode:'arcade',difficulty:3,players:1,competition:'solo',size:1.2,frequency:1,swipe:1,tracking:.5,bombs:true,infinite:false,input:'camera',mirror:true,backgroundRemoval:true,effects:.7,music:.22,sound:.65};
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const lerp=(a,b,t)=>a+(b-a)*t;
const mix=(a,b,t)=>({x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t)});
export function pointSegmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);}
// Relative swept hand-circle collision. No elbow, shoulder or silhouette participates.
export function sweptHandTime(h0,h1,c0,c1,r){const x=h0.x-c0.x,y=h0.y-c0.y,dx=h1.x-c1.x-x,dy=h1.y-c1.y-y,a=dx*dx+dy*dy,b=2*(x*dx+y*dy),c=x*x+y*y-r*r;if(c<=0)return 0;if(a<1e-9)return null;const d=b*b-4*a*c;if(d<0)return null;const t=(-b-Math.sqrt(d))/(2*a);return t>=0&&t<=1?t:null;}
// Retained export for old test/tool imports, now explicitly hand-only.
export function sweptArmTime(e0,w0,e1,w1,c0,c1,r){return sweptHandTime(w0,w1,c0,c1,r);}
export function coverMapping(sourceW,sourceH,w,h,mirror=true){const scale=Math.max(w/sourceW,h/sourceH),dw=sourceW*scale,dh=sourceH*scale,ox=(w-dw)/2,oy=(h-dh)/2;return{scale,ox,oy,dw,dh,point(p){const x=ox+p.x*dw;return{x:mirror?w-x:x,y:oy+p.y*dh};}};}
export const airRuleKey=o=>['hands-v2',o.input,o.infinite&&o.mode==='zen'?'unlimited':'timed','fruit'+o.size,'spawn'+o.frequency,'swipe'+o.swipe,'track'+o.tracking,'bombs'+(o.mode==='zen'?false:o.bombs)].join(':');
const stat=()=>({score:0,slices:0,golden:0,giants:0,highestCombo:0,bombs:0,misses:0,lives:3,swipes:0,teamHits:0});
export class AirSliceWorld{
 constructor(options={}){this.options={...AIR_DEFAULTS,...options};const o=this.options;o.players=o.players===2?2:1;o.competition=o.players===1?'solo':o.competition==='coop'?'coop':'versus';o.difficulty=clamp(Math.round(o.difficulty),1,3);if(o.mode==='zen')o.bombs=false;this.seed=(o.seed??Date.now())>>>0;this.initialSeed=this.seed;this.w=1600;this.h=o.h||900;this.clock=0;this.accumulator=0;this.serial=0;this.wave=0;this.fruit=[];this.pieces=[];this.particles=[];this.labels=[];this.trails=[];this.events=[];this.players=Array.from({length:o.players},stat);this.team={score:0,lives:3,slices:0,highestCombo:0,teamSlices:0,perfectCombos:0,storms:0};this.combos=new Map();this.queue=[];this.nextWave=850;this.doubleUntil=0;this.freezeUntil=0;this.stormUntil=0;this.stormWave=null;this.teamChain=null;this.done=false;this.reason='';this.duration=o.mode==='classic'||o.mode==='zen'&&o.infinite?Infinity:60000;this.soundAt=0;this.shake=0;this.lastStrike=new Map();}
 rnd(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 get coop(){return this.options.competition==='coop';}
 get livePlayers(){return this.players.map((p,i)=>({p,i})).filter(({p})=>this.options.mode!=='classic'||this.coop||p.lives>0).map(x=>x.i);}
 resize(h){if(!Number.isFinite(h)||h<450||h>2200)return;const ratio=h/this.h;for(const f of [...this.fruit,...this.pieces]){f.y*=ratio;f.vy*=Math.sqrt(ratio);if(f.history)f.history=[];}this.h=h;this.queue=[];this.trails=[];}
 emit(type,data={}){this.events.push({type,time:this.clock,...data});if(this.events.length>100)this.events.shift();}
 spawnWave(storm=false){
 const o=this.options,d=o.difficulty,progress=Math.min(1.8,this.clock/60000),zen=o.mode==='zen',frenzy=o.mode==='frenzy';
 const count=storm?3:zen?1:Math.min(4,1+(this.rnd()<.32+progress*.18?1:0)+(frenzy?1:0));const waveId=++this.wave;
 for(let n=0;n<count;n++){
  const type=AIR_FRUITS[Math.floor(this.rnd()*AIR_FRUITS.length)],roll=this.rnd();let special=null,bomb=false;
  if(!zen&&o.bombs&&roll<([.035,.07,.1][d-1]))bomb=true;
  else if(roll<.19){const specials=['golden','rainbow','freeze','giant','storm',...(this.coop?['team']:[])];special=specials[Math.floor(this.rnd()*specials.length)];}
  // Both sides receive the same fruit, size and launch energy. A fruit belongs to its first slicer.
  const vyJitter=this.rnd(),vxJitter=this.rnd(),angle=this.rnd()*Math.PI*2,side=this.wave%6===0&&n===0;
  for(let lane=0;lane<o.players;lane++){
   if(this.fruit.length>=36||o.mode==='classic'&&!this.coop&&this.players[lane].lives<=0)continue;
   if(special==='team'&&lane===1)continue;
   const r=([100,87,75][d-1])*o.size*(zen?1.25:1)*(special==='giant'?1.65:special==='team'?1.45:1),x=special==='team'?800:o.players===2?(lane===0?380:1220)+(vxJitter-.5)*200:360+vxJitter*880;
   const gravity=1450*(zen?.65:1),peak=this.h*(.19+vyJitter*.36),y=this.h+r+8,vy=-Math.sqrt(2*gravity*(y-peak)),vx=(lane===0?1:-1)*(70+vxJitter*160)*(o.players===1?(this.rnd()>.5?1:-1):1);
   const f={id:++this.serial,type:bomb?'bomb':special==='giant'?'watermelon':type,special:bomb?null:special,r,x,y,vx,vy,g:gravity,angle,spin:(vxJitter-.5)*3.5,lane,wave:waveId,born:this.clock,hp:special==='giant'?3:special==='team'?2:1,maxHp:special==='giant'?3:special==='team'?2:1,hitKeys:new Set(),contributors:new Set(),history:[],dead:false};
   if(side){f.x=lane===0?-r:this.w+r;f.y=this.h*.64;f.vx=(lane===0?1:-1)*340;f.vy=-Math.sqrt(gravity*this.h*.45);}
   this.fruit.push(f);if(storm&&this.stormWave)this.stormWave.pending.add(f.id);this.emit('launch',{id:f.id});
  }
 }
 return waveId;
 }
 at(f,t){const history=f.history;if(!history?.length)return{x:f.x,y:f.y};if(t<=history[0].t)return history[0];for(let i=history.length-1;i>=0;i--){const a=history[i];if(a.t<=t){const b=history[i+1];return b?mix(a,b,clamp((t-a.t)/(b.t-a.t),0,1)):a;}}return history[0];}
 submit(owner,arm,swipe){if(this.done||!this.players[owner]||!this.livePlayers.includes(owner))return false;const age=this.clock-(swipe.time??this.clock);if(age>240||age< -20||!Number.isFinite(swipe.dt??80)||swipe.dt>240||swipe.dt<=0)return false;const dt=clamp(swipe.dt||80,8,240),from=swipe.from,to=swipe.to;if(![from,to].every(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)))return false;const distance=Math.hypot(to.x-from.x,to.y-from.y);const threshold=([135,180,225][this.options.difficulty-1])/this.options.swipe;
  if(distance<6||distance/(dt/1000)<threshold)return false;
  this.queue.push({owner,arm:String(arm),from:{...from},to:{...to},dt,time:clamp(swipe.time??this.clock,Math.max(0,this.clock-350),this.clock),stroke:String(swipe.stroke||arm),key:owner+'|'+arm+'|'+swipe.stroke});this.players[owner].swipes++;this.trails.push({owner,points:[from,to],life:.2});return true;
 }
 resolve(){
 const candidates=[];for(const s of this.queue){for(const f of this.fruit){if(f.dead||s.time<f.born||f.hitKeys.has(s.key))continue;const begin=Math.max(f.born,s.time-s.dt),clip=clamp((begin-(s.time-s.dt))/s.dt,0,1),w0=mix(s.from,s.to,clip),c0=this.at(f,begin),c1=this.at(f,s.time),radius=f.r+([22,16,12][this.options.difficulty-1]);const t=sweptHandTime(w0,s.to,c0,c1,radius);if(t!==null)candidates.push({f,s,t:begin+(s.time-begin)*t});}}
 candidates.sort((a,b)=>Math.abs(a.t-b.t)>6?a.t-b.t:a.f.id===b.f.id?((a.s.owner-a.f.id%this.players.length+this.players.length)%this.players.length)-((b.s.owner-b.f.id%this.players.length+this.players.length)%this.players.length)||a.s.arm.localeCompare(b.s.arm):a.f.id-b.f.id);
 for(const {f,s}of candidates){if(f.dead||!this.livePlayers.includes(s.owner)||f.hitKeys.has(s.key))continue;if(f.hp>1&&this.clock-(f.lastHit??-1000)<220)continue;f.hitKeys.add(s.key);if(f.special==='team'&&f.contributors.has(s.owner))continue;f.contributors.add(s.owner);f.lastHit=this.clock;f.hp--;
  if(f.hp>0){this.emit('crack',{owner:s.owner,x:f.x,y:f.y});this.labels.push({x:f.x,y:f.y,text:f.special==='team'?'YOUR TEAMMATE’S TURN!':f.hp+' MORE '+(f.hp===1?'SLICE':'SLICES'),color:'#fff2cc',life:1.1});continue;}
  this.hit(f,s);
 }
 this.queue=[];this.fruit=this.fruit.filter(f=>!f.dead);
 }
 hit(f,s){f.dead=true;const p=this.players[s.owner];if(f.type==='bomb'){
  p.bombs++;if(this.options.mode==='classic'){if(this.coop)this.team.lives=Math.max(0,this.team.lives-1);else p.lives=Math.max(0,p.lives-1);}else{const loss=Math.min(this.coop?this.team.score:p.score,30);if(this.coop)this.team.score-=loss;else p.score-=loss;}
  this.shake=10;this.emit('bomb',{owner:s.owner});this.particles.push({x:f.x,y:f.y,vx:0,vy:0,r:f.r,life:.5,color:'#ffc471',burst:true});return;
 }
 p.slices++;this.team.slices++;if(f.special==='golden')p.golden++;if(f.special==='giant')p.giants++;if(f.special==='team'){p.teamHits++;this.addTeamBonus(100,'DOUBLE TROUBLE CLEARED!');}
 const comboKey=s.owner+'|'+s.arm+'|'+s.stroke,existing=this.combos.get(comboKey),combo=existing&&this.clock-existing.at<650?existing:{count:0,at:this.clock};combo.count++;combo.at=this.clock;this.combos.set(comboKey,combo);p.highestCombo=Math.max(p.highestCombo,combo.count);this.team.highestCombo=Math.max(this.team.highestCombo,combo.count);
 const base=f.special==='golden'?50:f.special==='giant'?35:f.special==='team'?25:10,mult=Math.min(5,combo.count),double=this.clock<this.doubleUntil?2:1,points=base*mult*double;p.score+=points;if(this.coop)this.team.score+=points;
 if(combo.count>=2)this.emit('combo',{owner:s.owner,count:combo.count});this.labels.push({x:f.x,y:f.y,text:'+'+points+(mult>1?' ×'+mult:''),color:s.owner?'#ffb580':'#b5f4fa',life:1});
 if(this.coop){if(!this.teamChain||this.clock-this.teamChain.at>600)this.teamChain={at:this.clock,count:0,owners:new Set(),team:false,perfect:false};const chain=this.teamChain;chain.count++;this.team.highestCombo=Math.max(this.team.highestCombo,chain.count);chain.owners.add(s.owner);chain.at=this.clock;if(chain.owners.size===2&&!chain.team){chain.team=true;this.team.teamSlices++;this.addTeamBonus(30,'TEAM SLICE!');}if(chain.owners.size===2&&chain.count>=4&&!chain.perfect){chain.perfect=true;this.team.perfectCombos++;this.addTeamBonus(100,'PERFECT TEAM COMBO!');}}
 if(f.special==='rainbow'){this.doubleUntil=this.clock+7000;this.emit('power',{text:'DOUBLE POINTS · 7 SECONDS'});}if(f.special==='freeze'){this.freezeUntil=this.clock+5000;this.emit('power',{text:'FRUIT FREEZE · 5 SECONDS'});}if(f.special==='storm'){this.stormUntil=this.clock+5500;this.stormWave={pending:new Set(),failed:false};this.spawnWave(true);this.emit('power',{text:this.coop?'TEAM FRUIT STORM!':'FRUIT STORM!'});}
 if(this.stormWave?.pending.delete(f.id)&&!this.stormWave.pending.size){if(this.coop&&!this.stormWave.failed){this.team.storms++;this.addTeamBonus(80,'TEAM STORM CLEARED!');}this.stormWave=null;}
 const angle=Math.atan2(s.to.y-s.from.y,s.to.x-s.from.x),nx=-Math.sin(angle),ny=Math.cos(angle);for(const side of [-1,1])this.pieces.push({type:f.type,special:f.special,r:f.r,x:f.x,y:f.y,vx:f.vx+nx*side*200,vy:f.vy*.4+ny*side*140-100,g:1200,angle:f.angle,spin:f.spin+side*1.3,side,life:1.65,maxHp:f.maxHp,hp:0});
 const colors={watermelon:'#ff6682',apple:'#ffb395',orange:'#ffb444',banana:'#ffe59c',strawberry:'#fa6f86',pineapple:'#f7d46b',kiwi:'#a6d850',lemon:'#ffe359',peach:'#ffa993',coconut:'#f6ead1'};const count=Math.round(12*this.options.effects)+5;for(let i=0;i<count;i++){const a=this.rnd()*Math.PI*2,speed=90+this.rnd()*300;this.particles.push({x:f.x,y:f.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-80,r:3+this.rnd()*9,life:.45+this.rnd()*.5,color:f.special==='golden'?'#ffe584':colors[f.type]});}if(this.particles.length>450)this.particles.splice(0,this.particles.length-450);this.emit('slice',{owner:s.owner,special:f.special});
 }
 addTeamBonus(points,text){this.team.score+=points;this.emit('team',{text,points});}
 miss(f){if(f.type==='bomb')return;this.players[f.lane].misses++;if(this.options.mode==='classic'){if(this.coop)this.team.lives=Math.max(0,this.team.lives-1);else this.players[f.lane].lives=Math.max(0,this.players[f.lane].lives-1);this.emit('miss',{owner:f.lane});}if(this.stormWave?.pending.delete(f.id)){this.stormWave.failed=true;if(!this.stormWave.pending.size)this.stormWave=null;}}
 update(ms){if(this.done)return;this.accumulator+=clamp(ms,0,250);let loops=0;while(this.accumulator>=1000/120&&loops++<31&&!this.done){this.step(1000/120);this.accumulator-=1000/120;}this.resolve();if(this.options.mode==='classic'&&(this.coop?this.team.lives<=0:this.players.every(p=>p.lives<=0)))this.finish('No lives left');}
 step(dt){const seconds=dt/1000;this.clock+=dt;
  for(const f of this.fruit){if(!f.history.length)f.history.push({t:Math.max(f.born,this.clock-dt),x:f.x,y:f.y});const slow=this.clock<this.freezeUntil?.4:1;f.x+=f.vx*seconds*slow;f.y+=f.vy*seconds*slow+.5*f.g*(seconds*slow)**2;f.vy+=f.g*seconds*slow;f.angle+=f.spin*seconds*slow;if(this.clock-f.history.at(-1).t>=16){f.history.push({t:this.clock,x:f.x,y:f.y});if(f.history.length>32)f.history.shift();}if(f.y-f.r>this.h+80&&f.vy>0||f.x+f.r<-150||f.x-f.r>this.w+150){f.dead=true;this.miss(f);}}
  this.fruit=this.fruit.filter(f=>!f.dead);for(const p of this.pieces){p.x+=p.vx*seconds;p.y+=p.vy*seconds;p.vy+=p.g*seconds;p.angle+=p.spin*seconds;p.life-=seconds;}this.pieces=this.pieces.filter(p=>p.life>0);for(const p of this.particles){p.x+=p.vx*seconds;p.y+=p.vy*seconds;p.vy+=650*seconds;p.life-=seconds;}this.particles=this.particles.filter(p=>p.life>0);for(const l of this.labels){l.y-=38*seconds;l.life-=seconds;}this.labels=this.labels.filter(l=>l.life>0);for(const t of this.trails)t.life-=seconds;this.trails=this.trails.filter(t=>t.life>0).slice(-40);this.shake=Math.max(0,this.shake-dt*.07);
  if(this.clock>=this.nextWave&&this.clock<this.duration-1200){this.spawnWave();const o=this.options,progress=Math.min(.4,this.clock/180000),base=o.mode==='zen'?2000:o.mode==='frenzy'?900:1550;this.nextWave=this.clock+Math.max(430,base*(1-progress)/o.frequency*(this.clock<this.stormUntil?.58:1));}
  if(this.clock>=this.duration)this.finish('Time’s up');for(const [key,c]of this.combos)if(this.clock-c.at>800)this.combos.delete(key);
 }
 finish(reason='Session finished'){if(this.done)return;this.done=true;this.reason=reason;this.queue=[];this.emit('end',{reason});}
 summary(){return{version:1,clock:this.clock,seed:this.initialSeed,reason:this.reason,mode:this.options.mode,competition:this.options.competition,input:this.options.input,infinite:this.options.mode==='zen'&&this.options.infinite,options:{...this.options},players:structuredClone(this.players),team:structuredClone(this.team)};}
}
