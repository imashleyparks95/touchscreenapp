/* Original Wobbly Wars canvas artwork. Presentation only: every living figure is
 * anchored at its ground contact (x,y); walking phase is supplied from distance
 * traveled, never from a decorative horizontal translation. Weapon geometry is
 * shared with the combat controller through warWeaponPose. */
const TAU=Math.PI*2,INK='#34424b',GOLD='#e9c87e';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:0));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
const num=(n,d=0)=>Number.isFinite(n)?n:d;
export const WAR_WEAPON_LENGTHS=Object.freeze({club:34,guard:28,spear:85,knight:52,giant:82,scout:32,lancer:95,banner:55,golem:55,slime:40,axe:48});
const LENGTH=WAR_WEAPON_LENGTHS;
function attack(u){const p=u.attackProgress;return Number.isFinite(p)?clamp(p):null;}
function extension(p){if(p===null)return .43;if(p<.3)return lerp(.43,.24,ease(p/.3));if(p<.38)return lerp(.24,1,ease((p-.3)/.08));if(p<.62)return 1;return lerp(1,.43,ease((p-.62)/.38));}
/** Exact world-space endpoints drawn by drawWarUnit. .38–.62 is full reach.
 * root is the leading hand; tip is the striking surface; muzzle is the release
 * point. u.aim may point in any direction on the overhead battlefield. */
export function warWeaponPose(u,clock=0){
 const s=Math.max(.1,num(u.scale,.62)),f=u.facing===-1?-1:1,p=attack(u),id=u.id||u.type||'club';
 let dx=num(u.aim?.x,f),dy=num(u.aim?.y),n=Math.hypot(dx,dy)||1;dx/=n;dy/=n;
 const flying=id==='dragon',lift=flying?18+Math.sin(clock/260)*3:0;
 const handY=id==='lancer'?-53:id==='cannon'?-25:-35;
 const wind=p!==null&&p<.35?Math.sin(p/.35*Math.PI):0;
 const root={x:num(u.x)+f*(id==='dragon'?44:10-wind*7)*s,y:num(u.y)+((id==='dragon'?-34:handY)-lift)*s};
 const length=(LENGTH[id]||({archer:31,slinger:29,cannon:43,healer:35,wizard:37,ice:37,fire:37,dragon:9,trickster:30,robot:36}[id]||34))*s;
 const reach=LENGTH[id]?length*extension(p):length;
 const sweep=LENGTH[id]&&!['spear','lancer','slime','golem','guard'].includes(id)&&p!==null&&p<.38?(-1.35*(1-ease(p/.38))):0;
 const sx=dx*Math.cos(sweep)-dy*Math.sin(sweep),sy=dx*Math.sin(sweep)+dy*Math.cos(sweep);
 const tip={x:root.x+sx*reach,y:root.y+sy*reach};
 return{root,tip,muzzle:{x:root.x+dx*length,y:root.y+dy*length}};
}
function line(c,pts,color=INK,w=2){c.beginPath();pts.forEach((p,i)=>(i?c.lineTo:c.moveTo).call(c,p[0],p[1]));c.lineCap='round';c.lineJoin='round';c.strokeStyle=color;c.lineWidth=w;c.stroke();}
function poly(c,pts,fill,stroke=INK,w=1.5){c.beginPath();pts.forEach((p,i)=>(i?c.lineTo:c.moveTo).call(c,p[0],p[1]));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.lineWidth=w;c.strokeStyle=stroke;c.stroke();}}
function oval(c,x,y,rx,ry,fill,stroke=null,w=1.5){c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,TAU);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.stroke();}}
function box(c,x,y,w,h,r,fill,stroke=INK,lw=1.5){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
function palette(u){const red=!!u.side;return{cloth:red?'#bd6e7e':'#5289ac',light:red?'#e3a0a3':'#9fc4d5',dark:red?'#763c55':'#315470',cape:red?'#95516a':'#476d94',metal:'#b9cbd1',metalDark:'#718e9e',skin:'#ebbd91',leather:'#80634b',team:red?'#eeb8b0':'#b0e9ef'};}
function armor(c,x,y,w,h,p){box(c,x-w/2,y-h/2,w,h,5,p.metal);line(c,[[x-w*.32,y-h*.32],[x,y-h*.42],[x+w*.32,y-h*.32]],'#edf2de',2);line(c,[[x,y-h*.25],[x,y+h*.36]],p.metalDark,1.5);oval(c,x-w*.27,y+h*.25,1.4,1.4,GOLD);oval(c,x+w*.27,y+h*.25,1.4,1.4,GOLD);}
function limb(c,a,k,b,color,width=8,metal=false){line(c,[a,k,b],INK,width+3);line(c,[a,k,b],color,width);if(metal){oval(c,k[0],k[1],width*.6,width*.6,'#d9e0d6',INK,1);line(c,[[k[0]+1,k[1]+1],[b[0]+1,b[1]-2]],'#e3ece5',1.4);}oval(c,b[0],b[1],width*.5,width*.55,metal?'#b8cbd0':'#e4b68e',INK,1);}
function face(c,x,y,p,{helmet=false,hood=false,hat=false,robot=false,hurt=0,dead=false,viking=false,knight=false,clock=0}={}){
 if(robot){box(c,x-13,y-13,26,25,5,'#aac2c7');box(c,x-10,y-5,20,7,3,'#304c65');line(c,[[x-6,y-2],[x-2,y-2]],'#b1f7e7',2);line(c,[[x+3,y-2],[x+7,y-2]],'#b1f7e7',2);line(c,[[x-4,y+7],[x+5,y+7]],'#5b7785',2);line(c,[[x,y-14],[x+1,y-22]],'#617b8b',2);oval(c,x+1,y-23,3,3,p.team,INK,1);return;}
 if(hood){poly(c,[[x-17,y+12],[x-19,y-4],[x-11,y-23],[x+4,y-27],[x+18,y-7],[x+16,y+13]],p.dark);}
 oval(c,x-11,y,4,5,p.skin,INK,1);oval(c,x+11,y,4,5,p.skin,INK,1);oval(c,x,y,12,15,p.skin,INK,1.4);
 oval(c,x-7,y+6,3,1.7,'#d8937d88');oval(c,x+7,y+6,3,1.7,'#d8937d88');
 const blink=dead||hurt>.65||Math.sin(clock/2100)>.999;
 for(const sign of[-1,1]){const ex=x+sign*4.8;oval(c,ex,y-2,3.1,3.9,'#fff8e3');if(blink)line(c,[[ex-2,y-2],[ex+2,y-1]],INK,1.4);else oval(c,ex+1,y-1.4,1.7,2.3,'#354654');}
 line(c,[[x-9,y-8],[x-3,y-7]],'#69533e',1.6);line(c,[[x+3,y-7],[x+9,y-9]],'#69533e',1.6);line(c,[[x+1,y],[x+3,y+4],[x,y+4]],'#bc8b66',1.1);
 c.beginPath();c.moveTo(x-3,y+9);c.quadraticCurveTo(x+2,y+(hurt>.25||dead?5:12),x+6,y+8);c.strokeStyle='#765442';c.lineWidth=1.4;c.stroke();
 if(helmet){c.beginPath();c.moveTo(x-14,y-4);c.lineTo(x-14,y-12);c.quadraticCurveTo(x,y-31,x+15,y-11);c.lineTo(x+15,y-4);c.lineTo(x+9,y-6);c.lineTo(x+8,y-14);c.lineTo(x-9,y-13);c.lineTo(x-10,y-3);c.closePath();c.fillStyle=p.metal;c.fill();c.strokeStyle=INK;c.lineWidth=1.6;c.stroke();line(c,[[x-10,y-14],[x+9,y-15]],'#f0f0db',2);box(c,x-1.5,y-14,3,15,1,'#b7c9cc','#69828f',1);if(knight){poly(c,[[x-5,y-23],[x-8,y-35],[x+1,y-32],[x+10,y-29],[x+7,y-24]],p.cloth);box(c,x-13,y-4,5,17,2,p.metalDark);box(c,x+9,y-4,5,17,2,p.metalDark);}}
 else if(hat){oval(c,x,y-12,24,5,p.leather,INK,1.6);poly(c,[[x-12,y-14],[x-10,y-26],[x+1,y-29],[x+12,y-23],[x+13,y-14]],'#aa8055');line(c,[[x-11,y-16],[x+12,y-16]],p.dark,4);}
 else if(!hood){poly(c,[[x-13,y-2],[x-12,y-14],[x-3,y-20],[x+11,y-14],[x+14,y-4],[x+7,y-11],[x+1,y-9],[x-5,y-13]],viking?'#b5884f':'#6a4b3a');}
 if(viking){poly(c,[[x-10,y+3],[x-10,y+15],[x,y+22],[x+10,y+13],[x+9,y+3],[x+3,y+10],[x-3,y+10]],'#a37347',null);if(helmet){poly(c,[[x-12,y-18],[x-24,y-26],[x-22,y-14],[x-14,y-10]],'#e8d6b1');poly(c,[[x+12,y-18],[x+24,y-26],[x+22,y-14],[x+14,y-10]],'#e8d6b1');}}
}
function shield(c,x,y,p,block=false){c.save();c.translate(x,y);c.rotate(block?-.15:.1);poly(c,[[-13,-16],[0,-21],[14,-15],[12,7],[0,22],[-12,7]],GOLD);poly(c,[[-10,-13],[0,-17],[11,-12],[9,5],[0,17],[-9,5]],p.cloth);line(c,[[0,-14],[0,13]],'#e9dcb4',3);line(c,[[-8,-3],[8,-3]],'#e9dcb4',3);oval(c,0,-3,4,4,p.metal,INK,1);c.restore();}
function localPose(u,clock){const s=Math.max(.1,num(u.scale,.62)),f=u.facing===-1?-1:1,w=warWeaponPose(u,clock),point=p=>[(p.x-num(u.x))/(s*f),(p.y-num(u.y))/s];return{root:point(w.root),tip:point(w.tip),muzzle:point(w.muzzle)};}
function weapon(c,u,p,pose,clock){const id=u.id||u.type||'club',ap=attack(u),r=pose.root,t=LENGTH[id]?pose.tip:pose.muzzle,dx=t[0]-r[0],dy=t[1]-r[1],angle=Math.atan2(dy,dx),len=Math.hypot(dx,dy),active=ap!==null&&ap>=.35&&ap<.65;
 c.save();c.translate(r[0],r[1]);c.rotate(angle);
 if(['spear','lancer','banner'].includes(id)){line(c,[[-18,0],[Math.max(0,len-9),0]],'#785c40',4);line(c,[[-16,-.8],[Math.max(0,len-11),-.8]],'#c4a16c',1.4);poly(c,[[len-13,-4],[len,0],[len-13,4],[len-9,0]],'#d7e5dd');if(id==='banner'){poly(c,[[-9,-2],[-9,-34],[20,-31],[15,-17],[-9,-20]],p.cloth);poly(c,[[1,-27],[7,-23],[1,-19],[-5,-23]],GOLD,null);}}
 else if(id==='club'){line(c,[[-7,0],[Math.max(0,len-11),0]],p.leather,6);box(c,len-19,-8,22,16,7,'#a28055');for(const x of[len-14,len-5])line(c,[[x,-7],[x,7]],'#c3a06e',2);}
 else if(id==='axe'){line(c,[[-10,0],[len-4,0]],'#916d46',5);poly(c,[[len-12,-13],[len+2,-16],[len+5,-3],[len-2,1],[len+4,4],[len+1,17],[len-12,13],[len-6,3],[len-7,-3]],'#b6ccd1');line(c,[[len+2,-14],[len+4,-5]],'#eef2dd',2);}
 else if(id==='giant'){line(c,[[-14,0],[len-7,0]],'#936b47',8);box(c,len-23,-17,30,34,5,'#829ba6',INK,2);box(c,len-19,-13,22,26,3,'#b3c4c4','#6a828d',1);line(c,[[len-8,-11],[len-8,11]],GOLD,3);}
 else if(id==='guard'){shield(c,len-3,0,p,active);}
 else if(['golem','slime'].includes(id)){line(c,[[-5,0],[len-5,0]],id==='golem'?'#8caaa9':'#82b985',id==='golem'?14:11);oval(c,len-4,0,id==='golem'?12:10,id==='golem'?12:9,id==='golem'?'#b0c3b6':'#a1d39a',INK,2);if(id==='golem')line(c,[[len-9,-4],[len,-6],[len+4,0]],'#dcddb0',2);}
 else if(['knight','scout'].includes(id)){box(c,-9,-3,12,6,2,p.leather);line(c,[[0,-8],[0,8]],GOLD,3);poly(c,[[3,-3],[len-8,-4],[len,0],[len-8,4],[3,3]],'#c4d8dc');line(c,[[5,0],[len-8,0]],'#f7f1d2',1.5);}
 else if(id==='archer'){const pull=ap===null?0:ap<.4?Math.sin(ap/.4*Math.PI/2):Math.max(0,1-(ap-.4)*8);c.translate(len-6,0);c.beginPath();c.moveTo(0,-25);c.quadraticCurveTo(25,0,0,25);c.strokeStyle=INK;c.lineWidth=5;c.stroke();c.strokeStyle='#bd8f54';c.lineWidth=3;c.stroke();line(c,[[0,-25],[-5-pull*15,0],[0,25]],'#eee5bc',1.3);if(ap!==null&&ap<.4){line(c,[[-14-pull*8,0],[18,0]],'#c8a97d',2);poly(c,[[18,-3],[25,0],[18,3]],'#e1e5ce');}}
 else if(id==='slinger'){const whirl=ap!==null&&ap<.42?clock/55:0;c.rotate(whirl);line(c,[[0,0],[len*.55,-9],[len,0],[len*.55,9],[0,0]],'#d8c491',1.8);oval(c,len,0,4.5,4,'#a8b0ac',INK,1);}
 else if(id==='cannon'){const recoil=ap!==null&&ap>.4&&ap<.7?Math.sin((ap-.4)/.3*Math.PI)*4:0;box(c,-7-recoil,-9,len+6,18,5,'#55717f',INK,2);box(c,1-recoil,-11,12,22,3,'#9baea9',INK,1.2);oval(c,len-recoil,0,3.5,10,'#273f50',INK,1.5);line(c,[[-8,9],[len-8,9]],'#c1cbbb',2);}
 else if(id==='robot'){box(c,-3,-8,len+1,16,4,'#8da7b6',INK,2);box(c,len-9,-5,12,10,2,p.dark);line(c,[[3,-6],[len-13,-6]],p.team,2);if(active)oval(c,len+2,0,5,8,'#bdf8e9');}
 else if(id==='dragon'){/* Dragon mouth is drawn on the creature; fire originates at the shared muzzle. */}
 else{const color=id==='ice'?'#a6e5ec':id==='fire'?'#f6b56d':id==='healer'?'#b6e5b4':id==='trickster'?'#d9abeb':'#bbacdf';line(c,[[-16,0],[len-4,0]],'#8c724e',4);box(c,len-11,-5,9,10,2,GOLD);poly(c,[[len-2,-10],[len+7,0],[len-2,10],[len-8,0]],color);if(ap!==null&&ap<.48){const charge=Math.sin(ap/.48*Math.PI/2);oval(c,len,0,6+charge*5,6+charge*5,color+'66');for(let k=0;k<3;k++){const a=clock/250+k*TAU/3;oval(c,len+Math.cos(a)*(10+charge*7),Math.sin(a)*(10+charge*7),2,2,color);}}if(id==='healer'){line(c,[[len-2,-5],[len-2,5]],'#eff9d2',2);line(c,[[len-7,0],[len+3,0]],'#eff9d2',2);}}
 if(active&&LENGTH[id]&&!['guard','golem','slime','spear','lancer','banner'].includes(id)){c.globalAlpha=.25;line(c,[[len*.35,-4],[len*.65,-8],[len,-5]],'#f7dfab',4);}
 c.restore();
}
function humanoid(c,u,p,clock,pose,{offX=0,offY=0,mounted=false}={}){
 const id=u.id||u.type||'club',ap=attack(u),moving=!!u.moving&&!u.down,phase=num(u.walkPhase),heavy=['knight','guard','giant','golem','cannon'].includes(id),stride=moving?(heavy?8:13):0;
 const swing=Math.sin(phase)*stride,other=Math.sin(phase+Math.PI)*stride,lift=Math.max(0,Math.cos(phase))*(moving?7:0),lift2=Math.max(0,Math.cos(phase+Math.PI))*(moving?7:0),bob=moving?Math.abs(Math.sin(phase))*1.4:Math.sin(clock/680)*.7;
 const robe=['wizard','healer','ice','fire','trickster'].includes(id),metal=['knight','guard','spear','lancer','giant','robot'].includes(id),viking=['giant','axe','slinger','banner'].includes(id),bodyY=-39+bob+offY;
 const backFoot=[offX-9-other,mounted?-18+offY:-lift2],frontFoot=[offX+9+swing,mounted?-18+offY:-lift];
 if(!mounted){limb(c,[offX-7,-25],[offX-9-other*.35,-13-lift2*.5],backFoot,metal?p.metalDark:p.dark,7,metal);box(c,backFoot[0]-7,backFoot[1]-4,14,5,2,p.leather);}
 // Capes and robes are behind articulated arms and chest plates.
 if(['knight','banner','wizard','healer'].includes(id))poly(c,[[offX-11,bodyY-15],[offX+11,bodyY-14],[offX+20,offY-7],[offX+4,offY-11],[offX-18,offY-8]],p.cape);
 const idleHand=[offX-22-Math.sin(phase)*stride*.25,bodyY+15];
 const rearHand=u.victory?[offX-22,bodyY-27]:idleHand;
 limb(c,[offX-12,bodyY-11],[offX-22,bodyY+2],rearHand,metal?p.metalDark:p.cloth,7,metal);
 if(id==='guard'||id==='knight')shield(c,offX-22,bodyY+7,p,ap!==null&&ap<.4||num(u.hurt)>0);
 if(robe){poly(c,[[offX-12,bodyY-16],[offX+12,bodyY-16],[offX+21,offY-5],[offX-20,offY-5]],p.cloth);line(c,[[offX,bodyY-8],[offX,offY-9]],GOLD,2);line(c,[[offX-15,offY-8],[offX+16,offY-8]],p.light,3);}else{box(c,offX-14,bodyY-16,28,35,6,p.cloth);if(metal)armor(c,offX,bodyY,31,34,p);else{line(c,[[offX-10,bodyY-12],[offX+9,bodyY+13]],p.leather,4);oval(c,offX,bodyY+1,3,3,GOLD,INK,1);}}
 box(c,offX-14,bodyY+11,28,6,1,p.leather);box(c,offX-3,bodyY+11,6,6,1,GOLD,INK,1);
 if(!mounted&&!robe){limb(c,[offX+7,-25],[offX+9+swing*.35,-13-lift*.5],frontFoot,metal?p.metal:p.cloth,7,metal);box(c,frontFoot[0]-6,frontFoot[1]-4,15,5,2,p.leather);}
 const faceY=bodyY-29;face(c,offX,faceY,p,{helmet:metal,hood:robe||id==='archer',hat:['scout','lancer','cannon'].includes(id),robot:id==='robot',viking,knight:id==='knight',hurt:num(u.hurt),dead:u.alive===false,clock});
 if(id==='archer'){line(c,[[offX-16,bodyY-21],[offX-20,bodyY+11]],p.leather,7);for(let k=0;k<3;k++){line(c,[[offX-20+k*3,bodyY-6],[offX-22+k*3,bodyY-32]],'#c5a36f',1.4);poly(c,[[offX-22+k*3,bodyY-32],[offX-26+k*3,bodyY-37],[offX-21+k*3,bodyY-35]],'#e5d9b2',null);}}
 const leading=u.victory?[offX+22,bodyY-29]:pose.root;
 const elbow=[lerp(offX+14,leading[0],.48),lerp(bodyY-10,leading[1],.5)+6];
 limb(c,[offX+12,bodyY-11],elbow,leading,metal?p.metal:p.cloth,7,metal);
 if(viking){oval(c,offX-13,bodyY-15,7,5,'#d9ccb1',INK,1);oval(c,offX+13,bodyY-15,7,5,'#d9ccb1',INK,1);}
}
function mounted(c,u,p,clock,pose){const phase=num(u.walkPhase),stride=u.moving?10:0;for(const side of[-1,1])for(const k of[0,1]){const baseX=side*21,kick=Math.sin(phase+k*Math.PI+(side<0?1:0))*stride,footY=-Math.max(0,Math.cos(phase+k*Math.PI+(side<0?1:0)))*(u.moving?7:0);limb(c,[baseX,-21],[baseX+kick*.4,-10],[baseX+kick,footY],k?'#805d49':'#b58c66',5);box(c,baseX+kick-4,footY-4,9,5,1,'#4e4b45');}oval(c,0,-26,32,16,'#b68a62',INK,2);poly(c,[[16,-32],[21,-51],[32,-55],[39,-43],[48,-36],[45,-26],[31,-28],[24,-16]],'#bd956c');poly(c,[[20,-48],[25,-60],[31,-51]],'#b68a62');oval(c,34,-44,2,2,INK);line(c,[[26,-52],[20,-44],[18,-30]],'#705143',5);line(c,[[-27,-30],[-40,-39],[-43,-27],[-36,-13]],'#715444',5);box(c,-13,-39,26,11,3,p.cloth);line(c,[[6,-42],[29,-34],[42,-31]],'#63513f',2);humanoid(c,u,p,clock,pose,{offX:-6,offY:-1,mounted:true});}
function golem(c,u,p,clock,pose){const phase=num(u.walkPhase),stride=u.moving?7:0;for(const [sign,q]of[[-1,phase],[1,phase+Math.PI]]){const x=sign*13+Math.sin(q)*stride,y=-Math.max(0,Math.cos(q))*(u.moving?4:0);box(c,x-9,-24,18,25,5,'#8fa7a0',INK,2);box(c,x-11,y-8,24,9,3,'#aabbb1',INK,2);line(c,[[x-6,-18],[x+1,-13],[x-3,-5]],'#617b76',1.5);}poly(c,[[-24,-57],[-11,-66],[12,-65],[25,-52],[21,-26],[6,-21],[-20,-27]],'#9ab1a8',INK,2.5);poly(c,[[-18,-52],[-5,-58],[15,-54],[19,-35],[0,-28],[-16,-35]],'#b6c7ba');line(c,[[0,-56],[-3,-45],[7,-39],[0,-28]],'#738e83',2);poly(c,[[-7,-48],[0,-55],[7,-48],[0,-40]],p.team,INK,1);box(c,-14,-83,29,25,8,'#a4bab0',INK,2);box(c,-11,-73,8,5,1,'#d4e9b9');box(c,4,-73,8,5,1,'#d4e9b9');line(c,[[-7,-63],[0,-66],[7,-63]],'#516c62',2);limb(c,[-22,-50],[-32,-34],[-28,-20],'#8da69c',12,true);limb(c,[22,-49],[24,-37],pose.root,'#98b0a7',12,true);}
function slime(c,u,p,clock,pose){const t=u.moving?Math.sin(num(u.walkPhase)):Math.sin(clock/700)*.3;c.beginPath();c.moveTo(-29,0);c.bezierCurveTo(-35,-22,-22,-52,0,-55+t*3);c.bezierCurveTo(24,-57-t*3,37,-18,29,0);c.quadraticCurveTo(18,5,8,0);c.quadraticCurveTo(0,5,-8,0);c.quadraticCurveTo(-20,5,-29,0);c.closePath();c.fillStyle=u.side?'#b997b0':'#87bd9f';c.fill();c.strokeStyle=INK;c.lineWidth=2;c.stroke();oval(c,-13,-38,7,9,'#cfe7ca',null);for(const sign of[-1,1]){oval(c,sign*9,-25,5,7,'#f2f1d5');oval(c,sign*9+1,-24,2.2,3.3,INK);}line(c,[[-4,-14],[1,-11],[6,-15]],INK,2);box(c,-12,-42,25,6,2,p.dark);poly(c,[[-9,-42],[-5,-51],[0,-45],[6,-51],[12,-42]],p.cloth);limb(c,[23,-27],[28,-30],pose.root,'#8fbc9d',8);}
function dragon(c,u,p,clock,pose){const lift=18+Math.sin(clock/260)*3,flap=Math.sin(clock/170),y=-lift;
 // A ground shadow and animated wings make flight deliberate rather than a missing walk cycle.
 oval(c,0,1,33,7,'#263c4422');for(const sign of[-1,1])poly(c,[[sign*2,y-32],[sign*24,y-57-flap*12],[sign*51,y-51-flap*17],[sign*41,y-29],[sign*24,y-20]],u.side?'#ae6e87':'#6f9fa8',INK,2);
 oval(c,0,y-21,31,17,u.side?'#af7b8b':'#6d9d8e',INK,2);poly(c,[[-25,y-23],[-49,y-29],[-39,y-13],[-24,y-12]],'#769686');poly(c,[[18,y-30],[23,y-51],[38,y-55],[50,y-44],[46,y-31],[31,y-26]],u.side?'#bb8996':'#83ad96',INK,2);poly(c,[[29,y-51],[28,y-63],[37,y-54]],GOLD);oval(c,39,y-43,3,4,'#f5e8bb',INK,1);oval(c,40,y-43,1.5,2.4,INK);line(c,[[42,y-33],[51,y-34]],'#49685d',2);for(const x of[-18,12]){line(c,[[x,y-11],[x+3,y-2],[x+11,y-3]],'#587d70',5);line(c,[[x+6,y-3],[x+10,y-6]],'#e6ddbc',1.5);}box(c,-12,y-39,23,8,2,p.cloth);box(c,-7,y-45,15,18,4,p.cloth);c.save();c.translate(0,y-56);c.scale(.63,.63);face(c,0,0,p,{helmet:true,clock,hurt:num(u.hurt)});c.restore();line(c,[[8,y-42],[24,y-42],[43,y-35]],'#694f41',2);
 if(attack(u)!==null&&attack(u)<.42)oval(c,pose.muzzle[0],pose.muzzle[1],5+Math.sin(clock/50),6,'#f9be7666');
}
/** All units share the same art path in placement, inspection and live combat. */
export function drawWarUnit(c,u,clock=0){
 const id=u.id||u.type||'club',s=Math.max(.1,num(u.scale,.62)),f=u.facing===-1?-1:1,p=palette(u),pose=localPose({...u,id},clock),down=clamp(u.down??(u.alive===false?1:0));
 c.save();c.translate(num(u.x),num(u.y));c.scale(f*s,s);c.lineCap='round';c.lineJoin='round';
 if(id!=='dragon'){oval(c,0,2,id==='lancer'?42:id==='giant'||id==='golem'?27:20,5,'#29424b29');}
 if(down){c.translate(0,-8*down);c.rotate(down*1.32);c.globalAlpha*=u.alive===false?.6:1;}
 if(num(u.hurt)>0){c.translate(-num(u.hurt)*2,0);}
 if(id==='lancer')mounted(c,u,p,clock,pose);
 else if(id==='golem')golem(c,u,p,clock,pose);
 else if(id==='slime')slime(c,u,p,clock,pose);
 else if(id==='dragon')dragon(c,u,p,clock,pose);
 else if(id==='cannon'){humanoid(c,u,p,clock,pose,{offX:-19,offY:0});box(c,-8,-20,42,9,2,'#856b4e');for(const x of[0,28]){oval(c,x,-8,10,10,'#b59460',INK,2);oval(c,x,-8,4,4,'#687d83',INK,1);for(let k=0;k<4;k++){const a=k*Math.PI/2+num(u.walkPhase);line(c,[[x,-8],[x+Math.cos(a)*8,-8+Math.sin(a)*8]],'#755b3e',1.3);}}}
 else humanoid(c,u,p,clock,pose);
 if(!u.victory)weapon(c,{...u,id},p,pose,clock);
 if(u.victory){for(let k=0;k<3;k++){const a=clock/280+k*TAU/3;oval(c,Math.cos(a)*22,-88+Math.sin(a)*5,2.5,2.5,GOLD);}}
 if(num(u.hurt)>.1){c.globalAlpha*=clamp(num(u.hurt))*.45;poly(c,[[-18,-38],[-27,-43],[-20,-49],[-28,-53],[-15,-56],[-11,-47]],'#fff2b6',null);}
 c.restore();
}
/** Distinct ammunition; height is a cosmetic arc above the actual ground path. */
export function drawWarProjectile(c,p,clock=0){
 const kind=p.kind||'stone',x=num(p.x),y=num(p.y)-num(p.height),angle=Math.atan2(num(p.vy),num(p.vx,1)),r=Math.max(2,num(p.r,5)),age=num(p.age,clock),team=p.side?'#f5a5ba':'#a6e9f0';
 c.save();c.translate(x,y);c.rotate(angle);c.lineCap='round';
 if(kind==='arrow'||kind==='bolt'){line(c,[[-24,0],[3,0]],kind==='bolt'?'#a4bdc5':'#c6a577',2);poly(c,[[2,-3],[10,0],[2,3]],'#e3e8d5',INK,.8);for(const sign of[-1,1])poly(c,[[-16,0],[-24,sign*5],[-23,0]],team,INK,.6);line(c,[[-37,0],[-27,0]],'#f3e6b955',1);}
 else if(kind==='stone'||kind==='rock'){c.rotate(age/110);poly(c,[[-r,-r*.2],[-r*.5,-r*.9],[r*.5,-r],[r,r*.1],[r*.3,r],[-r*.7,r*.7]],'#9baaa3',INK,1.2);poly(c,[[-r*.5,-r*.4],[r*.3,-r*.7],[r*.1,0],[-r*.7,r*.2]],'#d3d6bf',null);}
 else if(kind==='cannonball'){for(let k=3;k>0;k--)oval(c,-k*9,Math.sin(age/70+k)*2,r*(1-k*.13),r*(1-k*.13),'#d7cbaa'+['','77','44','22'][k]);oval(c,0,0,r,r,'#3e5665',INK,1.5);oval(c,-r*.32,-r*.35,r*.3,r*.22,'#9daead');line(c,[[-3,r*.6],[r*.5,r*.4]],'#213c4c',1.5);}
 else if(kind==='fireball'||kind==='breath'){const length=kind==='breath'?r*5:r*3.5;poly(c,[[r,0],[-length,-r*.7],[-length*.75,-r*.1],[-length*1.2,0],[-length*.7,r*.3],[-length,r*.8]],'#ef925a',null);poly(c,[[r*.4,0],[-length*.7,-r*.35],[-length*.5,0],[-length*.7,r*.4]],'#f8d58a',null);oval(c,0,0,r,r*.85,'#f7bc6f');oval(c,1,-1,r*.55,r*.5,'#fff1b4');}
 else if(kind==='ice'){poly(c,[[-r*2,0],[-r*.4,-r],[r*1.4,-r*.25],[r*2,0],[r*1.1,r*.5],[-r*.6,r]],'#a5dce8',INK,1);line(c,[[-r*1.5,0],[r*1.4,0]],'#f2ffff',1.5);line(c,[[0,0],[-r*.4,-r*.8]],'#f5fff5',1);for(let k=1;k<=3;k++)oval(c,-r*2-k*6,Math.sin(age/80+k)*r,1.5,1.5,'#bce8ebaa');}
 else if(kind==='pulse'||kind==='rocket'){box(c,-r*2,-r*.55,r*3,r*1.1,r*.5,'#effff0',team,1.5);line(c,[[-r*3,0],[-r*2.3,0]],team,3);if(kind==='rocket')poly(c,[[-r*2,-r*.5],[-r*3,-r],[-r*2,0],[-r*3,r],[-r*2,r*.5]],'#e4b675',INK,1);}
 else if(kind==='heal'){oval(c,0,0,r*1.5,r*1.5,'#a8e8bd33');oval(c,0,0,r,r,'#a8dfb5',INK,1);line(c,[[-r*.5,0],[r*.5,0]],'#f3ffd2',2.5);line(c,[[0,-r*.5],[0,r*.5]],'#f3ffd2',2.5);}
 else{oval(c,0,0,r*1.7,r*1.7,'#b89fe333');oval(c,0,0,r,r,'#c5afe7','#ede5bc',1);c.rotate(age/160);for(let k=0;k<3;k++){const a=k*TAU/3;oval(c,Math.cos(a)*r*1.5,Math.sin(a)*r*1.5,2,2,'#eed3a0');}poly(c,[[0,-r*.7],[r*.5,0],[0,r*.7],[-r*.5,0]],'#fff0ce',null);}
 c.restore();
}
