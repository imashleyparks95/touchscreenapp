// Pure puzzle model: integer cells, independently owned pointers, verified solution certificates.
export const WIRE_COLORS=['#59f0da','#ff88b7','#ffd66b','#aa96ff','#6ab9ff','#ff9d66'];
export const WIRE_SIGNS=['A','B','C','D','E','F'];
const adj=(a,b,n)=>Math.abs(a%n-b%n)+Math.abs(Math.floor(a/n)-Math.floor(b/n))===1;
const axis=(a,b,n)=>Math.abs(a-b)===1?'h':'v';
const clone=x=>JSON.parse(JSON.stringify(x));
function makeLevel(index){
 const tier=Math.floor(index/6),n=4+tier,count=2+Math.min(4,tier),bridge=index>=11&&index%3===2;
 let solutions=[],walls=[],bridges=[];
 if(bridge){
  const c=Math.floor(n/2);bridges=[c*n+c];
  solutions=[Array.from({length:n},(_,x)=>c*n+x),Array.from({length:n},(_,y)=>y*n+c)];
  // Additional circuits around the outside of the crossing.
  const chunks=[[0,1,n+1,n],[n-2,n-1,2*n-1,2*n-2],[(n-2)*n,(n-2)*n+1,(n-1)*n+1,(n-1)*n],[(n-1)*n+n-2,(n-2)*n+n-2,(n-2)*n+n-1,n*n-1]];
  for(const p of chunks)if(solutions.length<count&&!p.some(c=>solutions.some(s=>s.includes(c))))solutions.push(p);
 }else{
  // Spiral and serpentine boards, segmented into distinct circuits with deliberate route choices.
  let route=[];
  if(index%2){let l=0,r=n-1,t=0,b=n-1;while(l<=r&&t<=b){for(let x=l;x<=r;x++)route.push(t*n+x);t++;for(let y=t;y<=b;y++)route.push(y*n+r);r--;if(t<=b){for(let x=r;x>=l;x--)route.push(b*n+x);b--;}if(l<=r){for(let y=b;y>=t;y--)route.push(y*n+l);l++;}}}
  else for(let y=0;y<n;y++)for(let x=0;x<n;x++)route.push(y*n+(y%2?n-1-x:x));
  let offset=0;for(let k=0;k<count;k++){const left=route.length-offset,parts=count-k,len=k===count-1?left:Math.max(3,Math.floor(left/parts)+(index%3-1));solutions.push(route.slice(offset,offset+len));offset+=len;}
  // A gap between pairs acts as a physical obstacle in middle levels.
  if(index>=6&&index%3===0){const p=solutions[0];if(p.length>4)walls.push(p.pop());}
 }
 const transform=c=>{let x=c%n,y=Math.floor(c/n);if(index%4>=2)x=n-1-x;if(index%2===0)[x,y]=[y,x];return y*n+x;};
 solutions=solutions.map(p=>p.map(transform));walls=walls.map(transform);bridges=bridges.map(transform);
 const pairs=solutions.map((path,i)=>({id:i,source:path[0],target:path.at(-1),stage:index>=24?i:0,timed:index>=21&&i===solutions.length-1}));
 let straight=[];solutions.forEach((p,i)=>p.slice(1,-1).forEach((c,j)=>{if(axis(p[j],c,n)===axis(c,p[j+2],n)&&!bridges.includes(c))straight.push({cell:c,axis:axis(p[j],c,n),pair:i});}));
 const booster=solutions[0][Math.floor(solutions[0].length/2)],components=[{kind:'booster',cell:booster}];
 if(index>=14&&straight.length){const s=straight.shift();components.push({kind:'switch',cell:s.cell,open:false});}
 if(index>=17&&straight.length){const s=straight.shift();components.push({kind:'rotator',cell:s.cell,axis:s.axis==='h'?'v':'h',solution:s.axis});}
 if(index>=18&&straight.length){const s=straight.shift();components.push({kind:'barrier',cell:s.cell,period:3400,openFor:2000});}
 const names=['First Spark','Twin Current','Neon Bend','Loop Logic','Signal Garden','Power Lines','Crystal Grid','Side Channel','Hidden Route','Laser Lane','Static Field','Over Under','Voltage Vault','Echo Chamber','Bridge Works','Switch Yard','Relay Maze','Rotor Room','Pulse Gate','Copper Canyon','Night Shift','Time Trial','Live Wire','Cross Current','Sequence One','Ion Storm','Power Matrix','Quantum Relay','Final Frequency','Neon Nexus'];
 return{id:index+1,name:names[index],tier:tier+1,n,pairs,walls,bridges,components,solutions};
}
export const CIRCUIT_LEVELS=Array.from({length:30},(_,i)=>makeLevel(i));
export class CircuitBoard{
 constructor(level,difficulty=3){this.level=clone(level);this.n=level.n;this.difficulty=difficulty;this.paths={};this.connected=new Set();this.clock=0;this.errors=0;this.attempts=0;this.completedAt=null;this.active=null;this.history=[];this.feedback='Drag from a lettered source to its matching receiver.';this.flash=0;this.done=false;this.boosts=0;}
 snapshot(){return{paths:clone(this.paths),connected:[...this.connected],boosts:this.boosts};}
 restore(s){this.paths=clone(s.paths);this.connected=new Set(s.connected);this.boosts=s.boosts;this.done=false;this.completedAt=null;this.active=null;}
 update(dt){if(this.done)return;this.clock+=dt;this.flash=Math.max(0,this.flash-dt);if(this.active&&this.active.deadline<this.clock){this.fail('Connection timed out. Try again.');this.cancel();}}
 fail(s){this.errors++;this.feedback=s;this.flash=300;return false;}
 start(cell,pointer){if(this.done||this.active)return false;const p=this.level.pairs.find(p=>p.source===cell);if(!p)return false;if(p.stage&&this.level.pairs.some(q=>q.stage<p.stage&&!this.connected.has(q.id)))return this.fail('Power the earlier letters first.');this.history.push(this.snapshot());this.connected.delete(p.id);this.paths[p.id]=[cell];this.attempts++;this.active={pair:p.id,pointer,deadline:p.timed?this.clock+[15000,13000,11000,9500,8000][this.difficulty-1]:Infinity};this.feedback=p.timed?'Timed wire! Keep going.':'Connect '+WIRE_SIGNS[p.id]+' → '+WIRE_SIGNS[p.id];return true;}
 gateOpen(c){return c.kind==='switch'?c.open:c.kind==='barrier'?(this.clock%c.period)<c.openFor:true;}
 move(cell,pointer){const a=this.active;if(!a||a.pointer!==pointer||this.done)return false;const p=this.level.pairs[a.pair],path=this.paths[p.id],last=path.at(-1);if(cell===last)return true;if(!Number.isInteger(cell)||cell<0||cell>=this.n*this.n||!adj(last,cell,this.n))return false;
  if(path.length>1&&cell===path.at(-2)){path.pop();return true;}
  if(path.includes(cell))return this.fail('A wire cannot loop over itself.');
  if(this.level.walls.includes(cell))return this.fail('That cell is insulated.');
  if(this.level.pairs.some(q=>q.id!==p.id&&(q.source===cell||q.target===cell)))return this.fail('Match the same letter and color.');
  if(!this.level.components.filter(c=>c.cell===cell).every(c=>this.gateOpen(c)))return this.fail('Wait for the gate, or flip the switch.');
  for(const c of this.level.components.filter(c=>c.kind==='rotator'&&(c.cell===cell||c.cell===last)))if(c.axis!==axis(last,cell,this.n))return this.fail('Rotate the connector to align this wire.');
  const bridge=this.level.bridges.includes(cell),prevBridge=this.level.bridges.includes(last);
  if(prevBridge&&path.length>1&&axis(path.at(-2),last,this.n)!==axis(last,cell,this.n))return this.fail('Cross the bridge in a straight line.');
  for(const [id,other]of Object.entries(this.paths))if(+id!==p.id&&other.includes(cell)){
   if(!bridge)return this.fail('Wires cannot cross here. Undo a wire to make room.');
   const pos=other.indexOf(cell),before=other[pos-1],after=other[pos+1];
   if(before==null||after==null||axis(before,cell,this.n)===axis(last,cell,this.n))return this.fail('The bridge has one horizontal and one vertical lane.');
  }
  path.push(cell);if(cell===p.target){this.connected.add(p.id);if(path.some(c=>this.level.components.some(x=>x.kind==='booster'&&x.cell===c)))this.boosts++;this.active=null;this.feedback='⚡ '+WIRE_SIGNS[p.id]+' powered!';this.done=this.connected.size===this.level.pairs.length;if(this.done){this.completedAt=this.clock;this.feedback='All circuits powered!';}}return true;
 }
 end(pointer){if(this.active?.pointer!==pointer)return;this.fail('Wire unfinished. Start at its source again.');this.cancel();}
 cancel(){if(!this.active)return;const s=this.history.pop();if(s)this.restore(s);else this.active=null;}
 undo(){if(this.active){this.cancel();return;}const s=this.history.pop();if(s){this.restore(s);this.feedback='Last wire undone.';}}
 reset(){this.active=null;this.paths={};this.connected.clear();this.history=[];this.done=false;this.completedAt=null;this.boosts=0;this.feedback='Board reset. The clock and mistakes keep counting.';}
 component(cell){const c=this.level.components.find(c=>c.cell===cell&&['switch','rotator'].includes(c.kind));if(!c)return;if(Object.values(this.paths).some(p=>p.includes(cell)))return; if(c.kind==='switch')c.open=!c.open;else c.axis=c.axis==='h'?'v':'h';}
 get accuracy(){return Math.round(100*this.level.pairs.length/(this.level.pairs.length+this.errors));}
 get score(){return Math.max(0,this.connected.size*100+this.boosts*50+(this.done?Math.max(0,600-Math.floor(this.clock/250)):0)-this.errors*12);}
}
// Walk every cell intersected by a fast finger movement; never jump over walls.
export function gridWalk(from,to,n){const out=[];let x=from%n,y=Math.floor(from/n),tx=to%n,ty=Math.floor(to/n);while(x!==tx||y!==ty){if(Math.abs(tx-x)>=Math.abs(ty-y)&&x!==tx)x+=Math.sign(tx-x);else y+=Math.sign(ty-y);out.push(y*n+x);}return out;}
export function compareCircuit(a,b,kind='speed'){
 if(kind==='accuracy'){if(a.done!==b.done)return a.done?1:-1;if(a.connected.size!==b.connected.size)return a.connected.size-b.connected.size;if(a.accuracy!==b.accuracy)return a.accuracy-b.accuracy;}
 if(a.connected.size!==b.connected.size)return a.connected.size-b.connected.size;
 if(a.done!==b.done)return a.done?1:-1;
 if(a.done&&b.done&&a.clock!==b.clock)return b.clock-a.clock;
 return a.accuracy-b.accuracy;
}
