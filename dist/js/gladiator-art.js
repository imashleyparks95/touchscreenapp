/* Original articulated artwork for Little Big Arcade. No borrowed game assets.
   Canvas stage: 1000 × 560. Arena ground: y=455. Fighter x/y is a feet anchor. */
const TAU=Math.PI*2,INK='#30231d';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:0));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,t)=>a+(b-a)*t;
function color(hex,amount){if(!/^#[0-9a-f]{6}$/i.test(hex||''))return hex||'#b77b4b';return '#'+hex.slice(1).match(/../g).map(v=>Math.round(clamp(parseInt(v,16)+amount,0,255)).toString(16).padStart(2,'0')).join('');}
function path(c,commands,fill,stroke=INK,width=3){c.beginPath();for(const [op,...v]of commands)c[op](...v);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
const M=(x,y)=>['moveTo',x,y],L=(x,y)=>['lineTo',x,y],Q=(a,b,x,y)=>['quadraticCurveTo',a,b,x,y],B=(a,b,d,e,x,y)=>['bezierCurveTo',a,b,d,e,x,y],Z=()=>['closePath'];
function oval(c,x,y,rx,ry,fill,stroke=INK,width=3){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function line(c,points,fill=INK,width=3){c.beginPath();points.forEach((p,i)=>(i?c.lineTo:c.moveTo).call(c,...p));c.strokeStyle=fill;c.lineWidth=width;c.stroke();}
function round(c,x,y,w,h,r,fill,stroke=INK,width=3){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function gradient(c,x,y,w,h,base){const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,color(base,42));g.addColorStop(.4,base);g.addColorStop(1,color(base,-35));return g;}
function star(c,x,y,r,fill,rotation=0){const p=[];for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2+rotation,k=i%2?r*.42:r;p.push(i?L(x+Math.cos(a)*k,y+Math.sin(a)*k):M(x+Math.cos(a)*k,y+Math.sin(a)*k));}p.push(Z());path(c,p,fill,null);}
const metal=i=>i?.color||['#9f987e','#acbec8','#d7b357','#93bcc2','#ce9977','#b1a2c7','#f0ce6c'][clamp((Number(i?.tier)||1)-1,0,6)];
function rivets(c,x,y,n=3,gap=10){for(let i=0;i<n;i++)oval(c,x+i*gap,y,1.6,1.6,'#ffdf90',INK,1);}
function armorPlate(c,x,y,w,h,item){const m=metal(item);path(c,[M(x-w*.45,y),Q(x,y-8,x+w*.45,y),L(x+w*.5,y+h*.65),Q(x,y+h+9,x-w*.5,y+h*.65),Z()],gradient(c,x-w/2,y,w,h,m),INK,3);path(c,[M(x-w*.3,y+4),L(x-w*.26,y+h*.55),Q(x-w*.1,y+h*.72,x,y+h*.75)],null,color(m,70),2);rivets(c,x-w*.3,y+5,3,w*.3);}
function weapon(c,item={}){
 const kind=item.kind||item.type||'sword',tier=clamp(Number(item.tier)||1,1,7),steel=metal(item),length=kind==='dagger'?43:kind==='spear'?115:kind==='longsword'?91:kind==='broadsword'?80:67;
 c.save();c.lineJoin='round';c.lineCap='round';
 // The grip is drawn through the palm: its origin remains the hand anchor.
 round(c,-4,-12,8,29,3,'#70452b',INK,2.5);line(c,[[-3,-6],[3,-8],[-3,0],[3,-2],[-3,7],[3,5]],'#bc8b4b',1.8);oval(c,0,18,6,5,'#c6a052',INK,2);
 if(['sword','longsword','broadsword','dagger'].includes(kind)){
  const w=kind==='broadsword'?14:kind==='dagger'?7:10;
  path(c,[M(-w,-14),L(-w*.7,-length+10),L(0,-length-9),L(w*.7,-length+10),L(w,-14),Z()],gradient(c,-w,-length,w*2,length,steel),INK,3);
  path(c,[M(0,-length+1),L(0,-17),L(w*.67,-18),L(w*.5,-length+12),Z()],color(steel,-30),null);line(c,[[-17,-12],[17,-12]],'#c5a44c',8);line(c,[[-16,-14],[16,-14]],'#f6d77c',2);
 }else if(kind==='axe'||kind==='battleaxe'){
  const big=kind==='battleaxe';round(c,-3,-88,6,78,2,'#8e5631',INK,2);
  path(c,[M(0,-83),Q(17,-98,big?39:30,-85),Q(big?31:24,-66,big?39:31,-47),Q(12,-47,0,-59),Z()],gradient(c,0,-93,40,48,steel),INK,3);
  if(big)path(c,[M(-1,-83),Q(-18,-97,-36,-84),Q(-29,-65,-36,-49),Q(-11,-47,-1,-59),Z()],gradient(c,-36,-92,40,45,steel),INK,3);line(c,[[1,-83],[1,-58]],'#eedbb8',3);
 }else if(kind==='hammer'){
  round(c,-4,-82,8,75,3,'#875433',INK,2);path(c,[M(-29,-95),L(24,-92),L(29,-61),L(-27,-60),Z()],gradient(c,-29,-95,58,36,steel),INK,4);round(c,-34,-94,9,33,2,color(steel,-35),INK,2);line(c,[[-19,-88],[16,-85]],color(steel,65),4);
 }else if(kind==='mace'){
  round(c,-4,-80,8,70,3,'#8b613e',INK,2);for(let i=0;i<6;i++){const a=i*TAU/6;c.save();c.translate(Math.cos(a)*12,-80+Math.sin(a)*12);c.rotate(a);path(c,[M(-4,-5),L(10,0),L(-4,5),Z()],steel,INK,2);c.restore();}oval(c,0,-80,17,19,gradient(c,-17,-99,34,38,steel),INK,3);oval(c,-5,-86,3,4,color(steel,70),null);
 }else if(kind==='club'){
  path(c,[M(-5,12),L(-9,-30),Q(-25,-71,-16,-86),Q(0,-101,18,-84),Q(23,-69,8,-30),L(5,12),Z()],gradient(c,-18,-92,35,100,'#9a6136'),INK,4);line(c,[[-5,-78],[-2,-34]],'#c79251',3);for(const [x,y]of [[-10,-69],[9,-74],[1,-88]]){oval(c,x,y,3,4,'#b7b4a0',INK,1);}
 }else if(kind==='spear'){
  round(c,-3,-101,6,115,2,'#925a32',INK,2);path(c,[M(-10,-97),L(0,-127),L(10,-97),L(0,-105),Z()],gradient(c,-10,-127,20,32,steel),INK,3);line(c,[[0,-120],[0,-101]],'#f6f3d8',2);
 }else{
  path(c,[M(-8,-14),L(-7,-56),L(0,-69),L(7,-56),L(8,-14),Z()],steel,INK,3);line(c,[[-13,-11],[13,-11]],'#d9b24b',6);
 }
 if(tier>=4){star(c,0,-25,4,'#4b7e86');}c.restore();
}
function shield(c,item){const m=metal(item),tier=Number(item?.tier)||1;c.save();
 path(c,[M(-27,-27),Q(0,-40,27,-27),L(24,15),Q(15,34,0,44),Q(-17,31,-25,13),Z()],gradient(c,-28,-38,56,80,m),INK,4);
 path(c,[M(-20,-24),Q(0,-30,20,-24),L(17,13),Q(12,27,0,34),Q(-12,24,-18,12),Z()],tier>=3?'#7b3a3d':'#a75937','#e5bf64',3);
 oval(c,0,0,12,13,gradient(c,-12,-13,24,26,'#b7b9a5'),INK,2.5);oval(c,-3,-4,3,4,'#f4efd0',null);if(tier>=4){path(c,[M(-5,-23),L(0,-31),L(5,-23),L(0,-13),Z()],'#eac85d',INK,1.5);}for(const [x,y]of [[-22,-22],[22,-22],[-20,13],[20,13],[0,36]])oval(c,x,y,2,2,'#f5d774',INK,1);c.restore();
}
function head(c,a,equipment,expression,time){
 const skin=a.skin||'#d49563',hair=a.hair||'#4c3027';
 // Ears and neck are individual shapes; the head shares the torso's local pose.
 path(c,[M(-12,-168),L(-13,-152),Q(0,-144,15,-153),L(13,-170),Z()],color(skin,-17),INK,3);
 oval(c,-31,-192,9,13,skin,INK,3);oval(c,32,-192,8,12,color(skin,-10),INK,3);
 path(c,[M(-30,-217),Q(-18,-232,7,-228),Q(36,-224,37,-198),L(30,-177),Q(13,-160,-8,-166),Q(-29,-170,-31,-192),Z()],gradient(c,-32,-228,69,66,skin),INK,4);
 path(c,[M(-24,-194),Q(-17,-201,-8,-196),M(11,-195),Q(23,-201,30,-193)],null,color(skin,-26),3);
 const angry=expression==='angry'||expression==='power'||a.eyes==='angry',silly=a.eyes==='silly',closed=expression==='defeat'||expression==='rest';
 if(closed){line(c,[[-21,-198],[-8,-197]],INK,3);line(c,[[10,-198],[24,-199]],INK,3);}else{
  oval(c,-13,-198,silly?9:8,silly?10:8,'#fff7dc',INK,2.5);oval(c,18,-198,8,silly?6:8,'#fff7dc',INK,2.5);oval(c,-9,-197,3.1,4.2,INK,null);oval(c,22,-197,3.1,silly?3:4.2,INK,null);oval(c,-8,-198.5,.9,1.4,'white',null);oval(c,23,-198.5,.9,1.4,'white',null);
  line(c,[[-23,-211],[-6,angry?-205:-213]],hair,4);line(c,[[9,angry?-205:-212],[27,-211]],hair,4);
 }
 path(c,[M(3,-199),L(9,-185),L(0,-183)],color(skin,20),INK,2.4);
 const shouting=['taunt','power','charge'].includes(expression),happy=['victory','silly'].includes(expression);
 if(shouting){oval(c,7,-175,10,9,'#592d28',INK,2.5);path(c,[M(-1,-181),Q(7,-184,15,-181),L(14,-176),L(0,-176),Z()],'#fff4d8',null);oval(c,8,-170,5,2,'#d9766b',null);}else if(happy){path(c,[M(-6,-178),Q(9,-169,24,-180),Q(14,-158,0,-169),Z()],'#fff4d8',INK,2.5);}else{path(c,[M(-5,-174),Q(8,-178,23,-176)],null,INK,3);}
 const hs=a.hairStyle||'short';
 if(hs==='short'){path(c,[M(-31,-202),L(-34,-220),Q(-7,-238,26,-223),L(35,-208),L(21,-219),L(10,-214),L(0,-222),L(-10,-215),L(-20,-219),Z()],hair,INK,3);}
 if(hs==='spikes'){path(c,[M(-32,-207),L(-39,-228),L(-21,-223),L(-17,-242),L(-3,-227),L(9,-243),L(16,-224),L(31,-232),L(37,-206),L(24,-218),Q(-5,-222,-32,-207),Z()],hair,INK,3);}
 if(hs==='mohawk'){path(c,[M(-6,-227),L(-12,-247),L(-1,-245),L(2,-257),L(11,-246),L(21,-248),L(23,-224),Z()],hair,INK,3);}
 if(hs==='long'){path(c,[M(-32,-190),Q(-45,-230,-14,-233),Q(27,-243,39,-210),L(42,-169),L(30,-172),L(27,-213),Q(3,-217,-17,-220),L(-22,-177),L(-36,-170),Z()],hair,INK,3);}
 if(a.beard==='stubble'){for(let i=0;i<11;i++){const x=-16+i*4;line(c,[[x,-174+Math.abs(x-5)*.12],[x+1,-169+Math.abs(x-5)*.12]],hair,1.5);}}
 if(a.beard==='moustache'){path(c,[M(5,-181),Q(-5,-189,-13,-175),Q(-2,-174,6,-178),Q(16,-171,27,-177),Q(19,-189,5,-181),Z()],hair,INK,1.5);}
 if(a.beard==='full'){path(c,[M(-27,-184),L(-21,-169),L(-5,-155),L(10,-151),L(26,-165),L(31,-184),L(22,-176),L(13,-180),L(2,-177),L(-8,-181),L(-14,-175),Z()],hair,INK,3);line(c,[[-9,-168],[5,-158],[17,-168]],color(hair,25),2);}
 if(equipment.head){const m=metal(equipment.head),tier=Number(equipment.head.tier)||1;path(c,[M(-36,-201),L(-35,-217),Q(-21,-239,7,-233),Q(34,-234,39,-207),L(30,-201),L(21,-218),Q(-3,-224,-24,-212),L(-27,-194),Z()],gradient(c,-36,-234,76,39,m),INK,4);line(c,[[-31,-214],[-13,-226],[14,-228],[31,-215]],color(m,66),3);path(c,[M(-35,-208),L(-30,-181),L(-20,-175),L(-23,-202),Z()],m,INK,3);path(c,[M(30,-205),L(29,-180),L(36,-186),L(38,-206),Z()],color(m,-18),INK,3);rivets(c,-26,-211,4,16);
  if(tier>=2){path(c,[M(-10,-233),Q(-10,-257,18,-263),Q(12,-245,31,-237),L(15,-234),Z()],tier>=5?'#4c6791':'#ac3936',INK,3);for(let i=0;i<5;i++)line(c,[[i*5-7,-236],[i*5-5,-251+i*2]],'#e66a4b',1.5);}
  if(tier>=5){path(c,[M(2,-225),L(10,-232),L(17,-223),L(9,-215),Z()],'#e3c25f',INK,2);}
 }
 if(expression==='hurt'){path(c,[M(22,-181),L(28,-183),M(-20,-183),L(-14,-180)],null,'#ad4f42',2);}
}
function limb(c,side,a,e,pose){
 const skin=a.skin||'#d49563',upper=side===1?pose.front:pose.back,elbow=side===1?pose.elbowFront:pose.elbowBack;
 c.save();c.translate(side*39,-140);c.rotate(upper);
 path(c,[M(-11,-1),Q(-23,10,-14,30),Q(-9,45,4,43),Q(20,36,15,16),Q(12,-5,-1,-8),Z()],gradient(c,-17,-7,33,52,skin),INK,4);path(c,[M(-11,10),Q(-5,3,6,9),Q(13,20,5,29)],null,color(skin,-35),2.5);
 if(e.shoulder){armorPlate(c,0,-7,37,20,e.shoulder);if((Number(e.shoulder.tier)||1)>=4){for(const x of [-12,0,12])path(c,[M(x-4,-8),L(x-1,-22),L(x+5,-8),Z()],metal(e.shoulder),INK,2);}}
 c.translate(0,35);c.rotate(elbow);
 path(c,[M(-10,0),Q(-17,19,-9,34),Q(1,44,12,32),L(15,12),Q(11,-2,-1,-5),Z()],gradient(c,-13,0,27,39,skin),INK,4);line(c,[[-6,9],[6,13]],color(skin,-30),2.5);
 if(e.hands){armorPlate(c,2,18,26,17,e.hands);line(c,[[-9,25],[12,25]],'#f4d078',2);}
 c.translate(1,37);c.rotate(side===1?pose.wrist:pose.shieldWrist);
 if(side===1&&e.weapon)weapon(c,e.weapon);
 oval(c,0,0,10,11,skin,INK,3);for(const x of [-5,0,5])line(c,[[x,-3],[x+1,3]],color(skin,-37),1.4);
 if(side===-1&&e.shield)shield(c,e.shield);
 c.restore();
}
function leg(c,side,a,e,step,air){const skin=a.skin||'#d49563',lift=air?12:Math.max(0,Math.sin(step+side*Math.PI))*5,shift=air?side*5:Math.sin(step+side*Math.PI)*6;c.save();c.translate(side*19,-59);const kneeX=shift*.6,ankleX=shift,ankleY=53-lift;
 path(c,[M(-12,0),Q(-16,15,kneeX-9,29),L(kneeX+12,30),Q(18,11,12,0),Z()],gradient(c,-13,0,27,32,skin),INK,4);
 path(c,[M(kneeX-9,25),Q(ankleX-13,41,ankleX-9,ankleY),L(ankleX+12,ankleY),Q(ankleX+16,40,kneeX+12,25),Z()],color(skin,-9),INK,4);
 if(e.legs){armorPlate(c,kneeX,5,27,28,e.legs);round(c,kneeX-14,25,28,10,5,color(metal(e.legs),-15),INK,2.5);}
 const boot=e.feet?metal(e.feet):'#6c4530';path(c,[M(ankleX-10,ankleY-10),L(ankleX+11,ankleY-11),Q(ankleX+16,ankleY-3,ankleX+25,ankleY),L(ankleX+25,ankleY+7),L(ankleX-13,ankleY+7),Z()],gradient(c,ankleX-12,ankleY-12,38,20,boot),INK,3.5);line(c,[[ankleX-12,ankleY+3],[ankleX+23,ankleY+3]],e.feet?'#ead393':'#a77c4c',2);if(!e.feet){for(const x of [0,6])line(c,[[ankleX+x,ankleY-11],[ankleX+x+3,ankleY+1]],'#c1a077',3);}c.restore();}
export function drawGladiator(c,fighter={},options={}){
 const {x=0,y=455,scale=1,facing=1,time=0,action='idle',progress=0,reaction='',reactionProgress=0}=options,a=fighter.appearance||{},e=fighter.equipment||{},p=clamp(progress),r=clamp(reactionProgress),body=clamp(Number(a.body)||1,.82,1.25),motion=Math.sin(time/165),walk=['forward','back'].includes(action),jump=['jumpForward','jumpBack','charge'].includes(action),attack=['quick','normal','power','charge'].includes(action),swing=p<.32?smooth(p/.32):p<.65?1-smooth((p-.32)/.33):0;
 const pose={front:-.28,back:.3,elbowFront:-.45,elbowBack:.8,wrist:-.2,shieldWrist:-.15};let lean=0,bob=Math.sin(time/360)*1.2;
 if(walk){const phase=p*TAU*2;pose.front=-.2+Math.sin(phase)*.25;pose.back=.2-Math.sin(phase)*.25;lean=action==='forward'?.08:-.08;bob=-Math.abs(Math.sin(phase))*2;}
 if(jump){lean=action==='jumpBack'?-.15:.18;pose.front=-1.0;pose.back=.95;pose.elbowFront=-.6;}
 if(attack){const heavy=action==='power';pose.front=mix(-1.8,1.2,smooth(clamp((p-.27)/.31)));pose.elbowFront=mix(-.9,-1.2,smooth(clamp((p-.25)/.35)));pose.wrist=mix(-.7,1.0,smooth(clamp((p-.3)/.3)));if(p>.7){const q=smooth((p-.7)/.3);pose.front=mix(pose.front,-.28,q);pose.elbowFront=mix(pose.elbowFront,-.45,q);pose.wrist=mix(pose.wrist,-.2,q);}lean=Math.sin(p*Math.PI)*(heavy?.18:.09);if(p<.25)lean=-Math.sin(p/.25*Math.PI)*.12;pose.back=.1;pose.elbowBack=.65;}
 if(action==='shove'){const push=Math.sin(Math.PI*p);pose.front=-.3-push*.9;pose.elbowFront=-.2-push*.7;pose.back=.4-push*.6;pose.elbowBack=1-push*1.5;lean=push*.2;}
 if(['defend','block'].includes(action)||reaction==='block'){pose.back=1.5;pose.elbowBack=1;pose.shieldWrist=-1.1;pose.front=-.75;pose.elbowFront=-.65;lean=-.08;}
 if(action==='taunt'){pose.front=-2.25;pose.elbowFront=-.45;pose.wrist=Math.sin(time/80)*.12;pose.back=.7;lean=-.08;}
 if(action==='rest'){pose.front=.18;pose.elbowFront=-.2;pose.back=-.1;pose.elbowBack=.4;lean=.13;bob=3+Math.sin(time/180)*2;}
 if(action==='dodge'||reaction==='dodge'){lean=-.38*Math.sin(Math.PI*(reaction?r:p));pose.front=-1;pose.elbowFront=-.6;bob=6*Math.sin(Math.PI*(reaction?r:p));}
 if(action==='hurt'||reaction==='hurt'||reaction==='knockback'){lean=-.28*Math.sin(Math.PI*(reaction?r:p));pose.front=.4;pose.elbowFront=-1.2;pose.back=.9;pose.elbowBack=.4;}
 if(action==='victory'){pose.front=-2.6+Math.sin(time/100)*.12;pose.elbowFront=-.2;pose.back=2.5;pose.elbowBack=.3;lean=Math.sin(time/160)*.04;}
 c.save();c.translate(x,y);c.scale(scale*(facing<0?-1:1),scale);c.lineCap='round';c.lineJoin='round';
 const shadowScale=jump?1-.45*Math.sin(Math.PI*p):1;oval(c,3,3,61*shadowScale,10*shadowScale,'#68401c30',null);
 if(jump)c.translate(0,-Math.sin(Math.PI*p)*(action==='charge'?45:73));
 if(action==='defeat'){const t=smooth(p);c.translate(0,-48*Math.sin(t*Math.PI/2));c.rotate(-t*Math.PI/2);}
 leg(c,-1,a,e,walk?p*TAU*2:0,jump);leg(c,1,a,e,walk?p*TAU*2:0,jump);
 c.save();c.translate(0,-65);c.rotate(lean);c.translate(0,65+bob);c.scale(body,1);
 limb(c,-1,a,e,pose);
 const skin=a.skin||'#d49563';
 path(c,[M(-30,-151),Q(-53,-156,-57,-132),Q(-62,-108,-44,-88),L(-30,-66),Q(0,-56,31,-66),L(43,-86),Q(62,-103,56,-128),Q(52,-152,30,-152),Q(0,-142,-30,-151),Z()],gradient(c,-60,-155,116,98,skin),INK,4.5);
 // Sculpted pectorals, ribs, abdomen and clavicles keep the silhouette illustrative.
 path(c,[M(-40,-133),Q(-24,-147,-3,-132),L(-2,-111),Q(-23,-104,-43,-118),M(3,-132),Q(26,-146,42,-132),L(45,-118),Q(26,-105,3,-111)],null,color(skin,-38),3);
 line(c,[[-25,-145],[-8,-141]],color(skin,40),3);line(c,[[9,-141],[29,-145]],color(skin,40),3);
 path(c,[M(0,-126),L(0,-79),M(-16,-102),Q(-7,-108,-2,-102),M(3,-102),Q(11,-107,18,-100),M(-13,-87),Q(-5,-92,-1,-86),M(3,-86),Q(11,-91,15,-85)],null,color(skin,-27),2.5);
 if(e.chest){const m=metal(e.chest);path(c,[M(-36,-149),L(-18,-139),Q(0,-131,19,-140),L(37,-149),L(46,-121),L(29,-75),Q(0,-68,-29,-75),L(-47,-121),Z()],gradient(c,-46,-150,92,82,m),INK,4);path(c,[M(-34,-129),Q(-18,-138,-3,-125),L(-4,-111),Q(-24,-107,-37,-119),M(4,-125),Q(21,-137,35,-128),L(38,-118),Q(23,-107,5,-111)],null,color(m,-37),3);line(c,[[0,-129],[0,-80]],color(m,55),2);for(const y of [-102,-92,-82])line(c,[[-18,y],[18,y]],color(m,-30),2);rivets(c,-24,-140,4,16);const tier=Number(e.chest.tier)||1;path(c,[M(-7,-123),L(0,-130),L(7,-123),L(5,-114),L(0,-110),L(-5,-114),Z()],tier>=4?'#f1d18a':color(m,60),INK,1.5);}
 // A separate leather waist piece does not change when individual armor is bought.
 path(c,[M(-33,-77),Q(0,-69,33,-77),L(39,-47),L(22,-41),L(11,-49),L(0,-37),L(-11,-49),L(-26,-42),L(-39,-49),Z()],gradient(c,-38,-78,78,42,'#a44335'),INK,4);
 round(c,-34,-78,68,12,4,'#70452a',INK,3);round(c,-8,-78,17,14,2,'#e1bc5a',INK,2);round(c,-3,-74,7,6,1,'#695032',null);for(const xx of [-25,-15,16,26])line(c,[[xx,-63],[xx*1.1,-48]],'#d98754',2);
 head(c,a,e,reaction==='hurt'?'hurt':action,time);
 limb(c,1,a,e,pose);
 c.restore();
 if((action==='hurt'||reaction==='hurt')&&Math.sin(Math.PI*(reaction?r:p))>.2){for(let i=0;i<3;i++){const aa=time/260+i*TAU/3;star(c,Math.cos(aa)*40,-251+Math.sin(aa)*8,6,'#f7ce56',aa);}}
 if(action==='taunt'){for(let i=0;i<3;i++)path(c,[M(53+i*11,-196-i*6),Q(61+i*12,-185,54+i*12,-176+i*4)],null,'#f6e4ad',3);}
 c.restore();
}
export function drawArena(c,{theme='sand',time=0,crowd=0}={}){
 const colors={sand:['#79c4e1','#dcb987','#b77949','#ead18d'],sunset:['#dfa083','#b79686','#9d6649','#e5bd7b'],marble:['#97cce0','#d4d1b5','#a3a18b','#e9d6a0'],volcano:['#c28d7e','#b69580','#7f5a4e','#ccb383'],royal:['#77b4d2','#d6b884','#ae7951','#ecd28d']},pal=colors[theme==='stone'?'marble':theme==='dusk'?'sunset':theme]||colors.sand;
 c.save();c.fillStyle=gradient(c,0,0,0,560,pal[0]);c.fillRect(0,0,1000,560);
 oval(c,790,70,43,43,'#fff2bd',null);for(const [x,y,s]of [[80,80,1],[375,49,.8],[881,130,.7]]){c.save();c.translate(x,y);c.scale(s,s);path(c,[M(-60,10),Q(-77,-8,-52,-15),Q(-39,-50,-10,-29),Q(16,-44,34,-16),Q(72,-17,69,10),Z()],'#fff4d6b3',null);c.restore();}
 path(c,[M(0,230),L(104,153),L(174,222),L(288,125),L(408,231),L(559,160),L(715,227),L(892,151),L(1000,220),L(1000,342),L(0,342),Z()],'#7da6a2',null);
 path(c,[M(255,154),L(288,125),L(321,154),L(302,150),L(286,161),L(274,150),Z()],'#dfecd0',null);
 // Three tiers of coliseum terraces, architectural arches and animated spectators.
 path(c,[M(-40,197),Q(500,299,1040,197),L(1040,386),Q(500,462,-40,386),Z()],gradient(c,0,200,0,230,pal[1]),'#8e603e',4);
 for(let row=0;row<3;row++){
  const base=231+row*43;path(c,[M(0,base),Q(500,base+85,1000,base),L(1000,base+13),Q(500,base+98,0,base+13),Z()],color(pal[2],row*9),'#78553d',2);
  for(let i=0;i<26;i++){const x=i*40+10,y=base+12+Math.sin(Math.PI*x/1000)*43,raise=crowd>0&&((i+row*3)%5===0)?Math.sin(time/100+i)*7:0;c.fillStyle=['#5f4539','#72523c','#815b42','#4c5148'][(i+row)%4];oval(c,x,y-10,5,6,c.fillStyle,null);path(c,[M(x-7,y+10),Q(x-7,y-5,x,y-5),Q(x+7,y-5,x+8,y+10),Z()],['#b75c45','#5c7580','#c6a654','#88738b'][(i*3+row)%4],null);if(raise||((i+row)%7===0))line(c,[[x-5,y],[x-13,y-12-raise],[x-16,y-9-raise]],'#76523c',3);}
 }
 for(let i=0;i<10;i++){const x=i*109-25,y=322+Math.sin(Math.PI*clamp(x/1000))*22;path(c,[M(x,y+75),L(x,y+12),Q(x+32,y-27,x+63,y+12),L(x+63,y+75),Z()],pal[2],'#755036',3);path(c,[M(x+11,y+75),L(x+11,y+18),Q(x+31,y-9,x+52,y+18),L(x+52,y+75),Z()],'#5d4f40',null);}
 path(c,[M(0,375),Q(500,443,1000,375),L(1000,416),Q(500,470,0,416),Z()],gradient(c,0,375,0,85,pal[1]),'#825c3c',4);
 for(let i=0;i<25;i++){const x=i*43;line(c,[[x,380+Math.sin(Math.PI*x/1000)*37],[x,416+Math.sin(Math.PI*x/1000)*28]],'#b49066',2);}
 for(const [x,flip]of [[40,1],[960,-1]]){c.save();c.translate(x,0);c.scale(flip,1);round(c,-12,143,24,264,4,'#c6a87d','#73543c',3);round(c,-21,140,42,19,4,'#ead6a9',INK,2);round(c,-23,395,46,17,3,'#a48057','#6d5037',3);line(c,[[3,148],[3,72]],'#514c40',5);path(c,[M(7,77),Q(44,90,73,76),L(64,128),Q(33,145,7,124),Z()],theme==='royal'?'#575580':'#a74338',INK,3);path(c,[M(28,94),L(34,84),L(40,96),L(51,96),L(43,105),L(45,117),L(33,112),L(23,117),L(24,105),L(17,97),Z()],'#edc55f',null);c.restore();}
 c.fillStyle=gradient(c,0,415,0,145,pal[3]);c.fillRect(0,415,1000,145);path(c,[M(0,418),Q(500,451,1000,418)],null,'#bda164',4);
 // Visible arena ends invite positioning strategies without gore.
 for(const x of [0,938]){c.fillStyle='#68503b';c.fillRect(x,452,62,108);c.fillStyle='#463b32';c.fillRect(x+4,468,54,92);path(c,[M(x,452),L(x+13,446),L(x+24,455),L(x+40,448),L(x+62,452),L(x+62,465),L(x,465),Z()],'#bc9258','#715139',2);}
 for(let i=0;i<36;i++){const x=85+(i*103)%830,y=457+(i*37)%90;oval(c,x,y,3+(i%3)*2,.8,'#ad8d4a44',null);}
 c.restore();
}
export function drawMerchant(c,kind='weapon',x=170,y=390,time=0,mood='welcome'){
 c.save();c.translate(x,y);const weapons=kind==='weapon'||kind==='weapons',a={skin:weapons?'#bc8155':'#bd9674',hair:weapons?'#4d372a':'#d8c9a1',hairStyle:weapons?'mohawk':'short',beard:weapons?'full':'moustache',eyes:mood==='poor'?'silly':'brave',body:1.15};
 drawGladiator(c,{appearance:a,equipment:{weapon:{kind:weapons?'hammer':'mace',tier:2},chest:{tier:1,color:weapons?'#76513d':'#84938e'},hands:{tier:1,color:'#976e45'}}},{x:0,y:0,scale:1.1,facing:1,time,action:mood==='purchase'?'victory':mood==='poor'?'taunt':'idle',progress:(time%1000)/1000});
 round(c,-99,-42,220,55,7,'#855b3b',INK,4);path(c,[M(-111,-46),L(127,-46),L(137,-32),L(-120,-32),Z()],'#bf9360',INK,3);line(c,[[-91,-10],[111,-10]],'#a87e52',3);for(const xx of [-78,90])oval(c,xx,-16,4,4,'#e7bc68',INK,1.5);
 if(weapons){c.save();c.translate(67,-48);c.rotate(Math.PI*.4);weapon(c,{kind:'sword',tier:2});c.restore();}else{c.save();c.translate(59,-69);c.scale(.6,.6);shield(c,{tier:3});c.restore();}c.restore();
}
export function gladiatorCover(){return `<svg viewBox="0 0 320 190" role="img" aria-label="Original cartoon gladiator with a sword and shield in a sunny coliseum" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gaSky" x2="0" y2="1"><stop stop-color="#76c2de"/><stop offset="1" stop-color="#f9e5b2"/></linearGradient><linearGradient id="gaSkin" x2="1" y2=".4"><stop stop-color="#f0b276"/><stop offset="1" stop-color="#bc754d"/></linearGradient><linearGradient id="gaMetal" x2="1" y2="1"><stop stop-color="#f4f1db"/><stop offset=".5" stop-color="#a8bac0"/><stop offset="1" stop-color="#607d89"/></linearGradient></defs><rect width="320" height="190" rx="15" fill="url(#gaSky)"/><circle cx="267" cy="35" r="23" fill="#fff0ad"/><path d="M0 103l49-33 43 31 60-43 58 47 59-35 51 29v63H0" fill="#82a7a0"/><path d="M0 79q160 51 320 0v75H0z" fill="#d9b985" stroke="#79563a" stroke-width="3"/><g fill="#795d43" stroke="#a98056" stroke-width="4"><path d="M8 133v-25q12-17 25 0v25m12 0v-20q12-17 25 0v20m12 0v-15q12-17 25 0v15m106 0v-15q12-17 25 0v15m12 0v-20q12-17 25 0v20m12 0v-25q12-17 25 0v25"/></g><path d="M0 144q160-24 320 0v46H0" fill="#e7cc87"/><ellipse cx="163" cy="176" rx="76" ry="10" fill="#76533133"/><g stroke="#30231d" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M136 136l-8 25 21 2 10-25m17-2 4 26 22-2-7-26" fill="#c18a5b"/><path d="M126 158l21-1 8 15h-35zM178 158l20-2 11 14-32 3z" fill="#6a4831"/><path d="M121 83q-24-7-27 16l11 32 20-3 8-30m64-18q27 2 28 23l-12 25-17-10 9-22" fill="url(#gaSkin)"/><path d="M139 76q-20-1-25 17l10 40 20 12 40-2 24-17 3-36-21-16z" fill="url(#gaSkin)"/><path d="M132 97q14-14 28-1v18q-17 7-30-6m36-12q17-13 30 0l2 13q-16 11-31 3m-3-8v26m-13-9h26" fill="none" stroke="#9e603f" stroke-width="2"/><path d="M125 130l72-2 9 18-16 6-16-5-14 7-14-8-17 5-9-8z" fill="#a14636"/><rect x="127" y="128" width="69" height="9" rx="3" fill="#6d4a2c"/><rect x="154" y="128" width="16" height="12" rx="2" fill="#e8c05b"/><path d="M148 76v-9h30v10" fill="#bd7e50"/><path d="M138 36q17-16 38-7l20 18-4 21-16 16-26-5-16-20z" fill="url(#gaSkin)"/><path d="M133 47l-1-15 15-12 33 4 17 17-16 2-10-11-25 4-6 16z" fill="url(#gaMetal)"/><path d="M154 26q-8-18 15-22l17 13-13 3-4 9z" fill="#b94036"/><path d="M139 45l-5 21 9 7 5-25" fill="#adb9b3"/><ellipse cx="154" cy="49" rx="7" ry="6" fill="#fff6dc"/><ellipse cx="179" cy="49" rx="7" ry="6" fill="#fff6dc"/><path d="M147 40l13 3m13 0 13-3" fill="none"/><path d="M165 50l5 10-7 1m-10 8q13-6 27-1" fill="none" stroke-width="2"/><circle cx="156" cy="50" r="2" fill="#30231d"/><circle cx="181" cy="50" r="2" fill="#30231d"/><g transform="translate(219 112) rotate(20)"><path d="M-5 3v-81L0-91l7 13V3z" fill="url(#gaMetal)"/><path d="M0-80v76" fill="none" stroke="#f9f1d9" stroke-width="2"/><path d="M-14 3h30" stroke="#c6a357" stroke-width="7"/><path d="M0 7v22" stroke="#76523b" stroke-width="8"/><ellipse cy="16" rx="9" ry="10" fill="#d89c65"/></g><g transform="translate(108 126) rotate(-12)"><path d="M-25-29q25-13 50 0l-3 38Q9 31 0 36-17 23-23 8z" fill="#c9b976"/><path d="M-18-23q18-9 36 0l-3 31Q6 24 0 28-11 18-16 6z" fill="#a44935" stroke="#efcb65" stroke-width="3"/><circle cy="-1" r="11" fill="url(#gaMetal)"/></g></g><g fill="#f3c765"><path d="M43 36l4 9 9 3-9 4-4 9-4-9-9-4 9-3z"/><path d="M281 126l3 6 6 3-6 2-3 7-2-7-7-2 7-3z"/></g></svg>`;}
