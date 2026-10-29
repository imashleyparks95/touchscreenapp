import {BUG_COLORS,clamp} from './refine-core.js';
// Original game-owned Canvas illustrations. Decorative motion never changes hit geometry.
const TAU=Math.PI*2;
function oval(c,x,y,rx,ry,fill,stroke){c.beginPath();c.ellipse(x,y,Math.max(0,rx),Math.max(0,ry),0,0,TAU);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1.5;c.stroke();}}
function line(c,points,color,width=2){c.beginPath();points.forEach(([x,y],i)=>(i?c.lineTo:c.moveTo).call(c,x,y));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke();}
function label(c,text,x,y,size,color='#f5edd9'){c.font=`800 ${size}px Outfit,sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;c.fillText(String(text),x,y);}
function gradient(c,top,bottom,y=640){const g=c.createLinearGradient(0,0,0,y);g.addColorStop(0,top);g.addColorStop(1,bottom);return g;}
export const BALLOON_BADGES=Object.freeze({normal:'',gold:'★',speed:'FAST',tiny:'TINY',armor:'ARMOR',time:'+2s',mystery:'?',danger:'!'});
export function balloonLabel(model,b){return model.learn?(model.difficulty===1?BUG_COLORS[b.color].mark:String(b.label)):BALLOON_BADGES[b.type]||'';}
export function reactionCue(m){return m.game==='bugs'?{title:'FIND '+BUG_COLORS[m.target].name,mark:BUG_COLORS[m.target].mark,detail:'Match the shell color AND symbol',color:BUG_COLORS[m.target].hex}: {title:m.learn?m.question:'Pop the sky. Mind the spikes.',mark:m.learn&&m.difficulty===1?BUG_COLORS[m.answer].mark:'↑',detail:'Wave '+m.wave+' · Streak ×'+(1+Math.min(3,Math.floor(m.combo/8))*.5).toFixed(1)+(m.clock<(m.slowUntil||0)?' · Gentle breeze':''),color:'#e1b78c'};}
function garden(c,time){
 c.fillStyle=gradient(c,'#162a34','#243f39');c.fillRect(0,0,1000,640);
 oval(c,820,179,69,69,'#b9c9b914');oval(c,820,179,42,42,'#cfdbc520');
 for(let layer=0;layer<3;layer++){c.beginPath();c.moveTo(0,640);for(let x=0;x<=1000;x+=25)c.lineTo(x,480+layer*45+Math.sin(x/145+layer)*22);c.lineTo(1000,640);c.fillStyle=['#29483f','#234239','#1c3831'][layer];c.fill();}
 for(let i=0;i<21;i++){const x=(i*151)%1000,y=290+(i*71)%340,sway=Math.sin(time/2100+i)*4;line(c,[[x,650],[x+sway,y]],'#54775d',3);for(const side of [-1,1]){c.save();c.translate(x+sway,y+38);c.rotate(side*.7);oval(c,side*13,0,19,6,'#5c806744');c.restore();}if(i%3===0){for(let petal=0;petal<5;petal++){const a=petal*TAU/5;oval(c,x+sway+Math.cos(a)*8,y+Math.sin(a)*8,5,7,'#bbad8d55');}oval(c,x+sway,y,4,4,'#d9bb73');}}
 // Painted timber edging and dew, kept behind targets at the edges.
 for(let i=0;i<14;i++){const x=i*80-10;line(c,[[x,628],[x+58,628]],'#a68d6325',11);line(c,[[x+2,625],[x+53,625]],'#d0b88b20',1);}
 for(let i=0;i<26;i++){const x=(i*139)%1000,y=170+(i*73)%420;oval(c,x,y,1.5,1.5,'#c9d8aa44');}
}
function festival(c,time){
 c.fillStyle=gradient(c,'#242a45','#46576a');c.fillRect(0,0,1000,640);
 for(let i=0;i<28;i++)oval(c,(i*137)%1000,140+(i*97)%330,i%4===0?1.8:1,1,'#e8dbc075');
 for(let i=0;i<5;i++){const x=i*260-70+Math.sin(time/5000+i)*8,y=250+i%2*70;oval(c,x,y,95,15,'#aab6c214');oval(c,x+38,y-12,53,19,'#aab6c214');}
 for(let hill=0;hill<6;hill++)oval(c,hill*220,680,220,180+hill%2*35,hill%2?'#344859':'#304353');
 for(const x of [70,905]){const y=570; c.beginPath();c.moveTo(x-65,y);c.lineTo(x,y-80);c.lineTo(x+65,y);c.closePath();c.fillStyle='#806777';c.fill();for(let i=-2;i<=2;i++)line(c,[[x,y-80],[x+i*23,y]],'#d3af8828',10);c.fillStyle='#574759';c.fillRect(x-57,y,114,59);c.fillStyle='#263544';c.fillRect(x-14,y+10,28,49);line(c,[[x,y-80],[x,y-100]],'#c9ba94');}
 line(c,[[0,140],[250,170],[500,178],[750,170],[1000,140]],'#baa28c55',2);
 for(let i=0;i<19;i++){const x=i*56,y=143+Math.sin(i/18*Math.PI)*33;c.beginPath();c.moveTo(x,y);c.lineTo(x+21,y+2);c.lineTo(x+10,y+27);c.closePath();c.fillStyle=['#a3808b','#b19b76','#7a9b9d'][i%3]+'66';c.fill();}
}
function beetle(c,b,clock){
 const r=b.r,col=BUG_COLORS[b.color];oval(c,b.x,b.y+r*.5,r*.9,r*.32,'#071b2260');
 c.save();c.translate(b.x,b.y);c.rotate(b.angle+Math.PI/2);
 for(const side of [-1,1])for(let leg=0;leg<3;leg++){const gait=Math.sin(clock/85+b.phase+leg*2+side)*r*.08;line(c,[[side*r*.55,(-.4+leg*.4)*r],[side*r*.95,(-.5+leg*.5)*r+gait],[side*r*1.1,(-.35+leg*.45)*r+gait]],'#a9b8a5',Math.max(1,r*.055));}
 oval(c,0,0,r*.82,r,'#172b32');const paint=c.createLinearGradient(-r,-r,r,r);paint.addColorStop(0,'#f5e6b6');paint.addColorStop(.3,col.hex);paint.addColorStop(1,col.hex+'aa');
 oval(c,-r*.37,0,r*.4,r*.94,paint,'#203638');oval(c,r*.37,0,r*.4,r*.94,paint,'#203638');
 for(const side of [-1,1])for(const y of [-.58,.55])oval(c,side*r*.49,y*r,r*.13,r*.16,'#20343be0');
 line(c,[[0,-r*.8],[0,r*.86]],'#273c43',Math.max(1,r*.045));oval(c,-r*.42,-r*.44,r*.12,r*.27,'#fffbe06a');
 oval(c,0,-r*.89,r*.47,r*.35,'#253c44');for(const side of [-1,1]){line(c,[[side*r*.23,-r*1.05],[side*r*.43,-r*1.3],[side*r*.56,-r*1.28]],'#acbda6',Math.max(1,r*.045));oval(c,side*r*.19,-r*.98,r*.095,r*.11,'#f1ead9');oval(c,side*r*.19,-r*1.01,r*.04,r*.055,'#1a3440');}
 c.restore();oval(c,b.x,b.y,r*.34,r*.34,'#22323deb');label(c,col.mark,b.x,b.y,Math.max(10,r*.48));
}
function balloon(c,m,b,time){
 const r=b.r,danger=b.type==='danger',color=danger?'#5a5264':m.learn?BUG_COLORS[b.color].hex:b.type==='gold'?'#d9b75f':b.type==='time'?'#7fc3bc':BUG_COLORS[b.color].hex;
 const sway=Math.sin(time/450+b.phase)*r*.2;
 c.beginPath();c.moveTo(b.x,b.y+r);c.bezierCurveTo(b.x+15+sway,b.y+r+20,b.x-13,b.y+r+30,b.x+sway,b.y+r+45);c.strokeStyle='#c6c5be80';c.lineWidth=1.4;c.stroke();
 if(danger)for(let i=0;i<10;i++){const a=i*TAU/10;c.beginPath();c.moveTo(b.x+Math.cos(a)*r*.65,b.y+Math.sin(a)*r*.85);c.lineTo(b.x+Math.cos(a+.15)*r*1.14,b.y+Math.sin(a+.15)*r*1.27);c.lineTo(b.x+Math.cos(a+.3)*r*.65,b.y+Math.sin(a+.3)*r*.85);c.closePath();c.fillStyle='#d5a4a5';c.fill();}
 const g=c.createLinearGradient(b.x-r,b.y-r,b.x+r,b.y+r);g.addColorStop(0,'#f7e6d2');g.addColorStop(.3,color);g.addColorStop(1,color+'af');oval(c,b.x,b.y,r*.8,r,g,'#253347');
 c.save();c.beginPath();c.ellipse(b.x,b.y,r*.8,r,0,0,TAU);c.clip();for(const side of [-1,1]){c.beginPath();c.moveTo(b.x,b.y-r);c.bezierCurveTo(b.x+side*r*.65,b.y-r*.6,b.x+side*r*.65,b.y+r*.5,b.x,b.y+r);c.strokeStyle='#233e4f24';c.lineWidth=1.4;c.stroke();}c.restore();oval(c,b.x-r*.33,b.y-r*.44,r*.12,r*.24,'#fff7e35c');
 if(b.type==='armor'){c.beginPath();c.ellipse(b.x,b.y,r*.85,r*1.03,0,0,TAU);c.strokeStyle='#d9dce4';c.lineWidth=3;c.stroke();for(let i=0;i<b.hp;i++)oval(c,b.x+(i-(b.hp-1)/2)*r*.25,b.y+r*.68,r*.075,r*.075,'#263a51');}
 const primary=danger?'!':balloonLabel(m,b);
 if(primary){oval(c,b.x,b.y-r*.08,r*.48,r*.31,'#243649eb');label(c,primary,b.x,b.y-r*.08,Math.max(10,r*(String(primary).length>3?.31:.55)));}else{for(const side of [-1,1])oval(c,b.x+side*r*.17,b.y-r*.1,r*.045,r*.065,'#223348');c.beginPath();c.arc(b.x,b.y+r*.12,r*.16,0,Math.PI);c.strokeStyle='#223348';c.lineWidth=2;c.stroke();}
 if(m.learn&&b.type!=='normal'&&!danger)label(c,b.type==='armor'?b.hp+' TAP':BALLOON_BADGES[b.type],b.x,b.y+r*.43,Math.max(8,r*.25),'#23354a');
 c.beginPath();c.moveTo(b.x-4,b.y+r);c.lineTo(b.x+4,b.y+r);c.lineTo(b.x+6,b.y+r+7);c.lineTo(b.x-6,b.y+r+7);c.closePath();c.fillStyle=color;c.fill();
}
export function drawReactionGame(c,m,p){
 const reduced=!!p.reduceMotion||p.effects==='off',time=reduced?0:m.clock;
 c.save();c.beginPath();c.rect(0,0,1000,640);c.clip();m.game==='bugs'?garden(c,time):festival(c,time);
 // The prompt band is never a target; clip illustrations to the actual play area.
 c.save();c.beginPath();c.rect(0,120,1000,520);c.clip();for(const item of m.items)m.game==='bugs'?beetle(c,item,time):balloon(c,m,item,time);
 if(p.effects!=='off')for(const e of m.effects){const t=clamp((m.clock-e.at)/650,0,1),count=reduced?3:p.effects==='reduced'?4:8;for(let i=0;i<count;i++){const a=i*TAU/count,x=e.x+Math.cos(a)*t*(reduced?15:48),y=e.y+Math.sin(a)*t*(reduced?15:48);oval(c,x,y,Math.max(0,3*(1-t)),Math.max(0,5*(1-t)),e.color);}}
 c.restore();const cue=reactionCue(m);c.fillStyle='#162633f5';c.fillRect(0,0,1000,118);label(c,m.game==='bugs'?cue.title+' '+cue.mark:cue.title,500,45,27,cue.color);label(c,m.game==='bugs'?'Match color + symbol · Streak '+m.combo:cue.detail,500,82,17,'#c6d1ce');
 if(m.game==='bugs'){c.fillStyle=cue.color;c.fillRect(20,111,960*clamp((m.switchAt-m.clock)/(m.switchAt-m.targetAt),0,1),3);}
 if(!reduced&&p.effects!=='off'&&m.lastTap&&m.clock-m.lastTap.at<280){c.strokeStyle=m.lastTap.good?'#b4dfc7':'#e2a19b';c.lineWidth=2;c.strokeRect(3,121,994,516);}
 c.restore();
}
