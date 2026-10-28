export const WORLD={width:1600,height:900,ground:800,sling:{x:230,y:650},pull:125};
export const MATERIALS={
 wood:{name:'Wood',color:'#eda764',edge:'#8f542f',density:.0018,friction:.65,restitution:.08,hp:44},
 glass:{name:'Glass',color:'#80e5f4',edge:'#d1f9ff',density:.0013,friction:.35,restitution:.1,hp:19},
 stone:{name:'Stone',color:'#a4a3bc',edge:'#676984',density:.0035,friction:.8,restitution:.02,hp:115},
 metal:{name:'Metal',color:'#7a9dbb',edge:'#d1e5f3',density:.005,friction:.55,restitution:.12,hp:210},
 ice:{name:'Ice',color:'#b2deff',edge:'#e6faff',density:.0016,friction:.025,restitution:.05,hp:27},
 explosive:{name:'TNT',color:'#f36c80',edge:'#ffd8a5',density:.002,friction:.6,restitution:.02,hp:29}
};
export const SHAPES={square:[60,60],rectangle:[45,90],beam:[180,22],triangle:[90,65],circle:[60,60],cylinder:[65,80],arch:[150,100],trapezoid:[100,60],polygon:[80,70]};
export const PROJECTILES={
 standard:{name:'Nova',label:'Standard',icon:'●',color:'#b58bff',radius:22,density:.008,bounce:.22,power:1,unlock:1,help:'Balanced mass and speed.'},
 heavy:{name:'Atlas',label:'Heavy',icon:'⬢',color:'#ffba68',radius:27,density:.021,bounce:.08,power:.85,unlock:3,help:'A slow, heavy hit for reinforced supports.'},
 bouncy:{name:'Ricochet',label:'Bouncy',icon:'◉',color:'#5ee9cc',radius:22,density:.008,bounce:.93,power:1.05,unlock:6,help:'Bounces off the ground and between towers.'},
 split:{name:'Triplet',label:'Split',icon:'∴',color:'#ff8fcd',radius:24,density:.008,bounce:.15,power:1,unlock:11,help:'Splits into three after 0.65s. Tap SPECIAL to split sooner.'},
 explosive:{name:'Supernova',label:'Explosive',icon:'✹',color:'#ff8270',radius:24,density:.009,bounce:.08,power:1,unlock:16,help:'Blasts on impact. Tap SPECIAL for an airborne blast.'},
 speed:{name:'Comet',label:'Speed',icon:'➤',color:'#6bcfff',radius:18,density:.006,bounce:.12,power:1.42,unlock:21,help:'Light, fast and precise. Aim for weak joints.'}
};
export const THEMES={forest:{name:'Glowwood Forest',sky:'#111c37',glow:'#4bd5ad',back:'#24475b'},site:{name:'Neon Works',sky:'#211b39',glow:'#ffc06c',back:'#494061'},castle:{name:'Moonstone Keep',sky:'#151934',glow:'#bd9cff',back:'#383558'},desert:{name:'Stardust Dunes',sky:'#30203b',glow:'#ffb48c',back:'#74475d'},city:{name:'Orbit City',sky:'#101e38',glow:'#69ddff',back:'#214b67'}};
const block=(x,y,w,h,shape='rectangle',mat='wood',angle=0)=>({x,y,w,h,shape,mat,angle});
function tower(x,tiers,mat='wood',roof='triangle',width=180){let b=[];for(let i=0;i<tiers;i++){let y=800-i*100;b.push(block(x-width*.37,y-40,32,80,'rectangle',mat),block(x+width*.37,y-40,32,80,'rectangle',mat),block(x,y-90,width+32,20,'beam',i%2?'glass':mat));}if(roof){const h=roof==='circle'?90:60;b.push(block(x,800-tiers*100-h/2,90,h,roof,'glass'));}return b;}
function stack(x,n,mat='wood',shape='square',w=60,h=60){return Array.from({length:n},(_,i)=>block(x,800-h*(i+.5),w,h,shape,mat));}
function gate(x,mat='stone'){return [block(x,750,150,100,'arch',mat),block(x,680,90,40,'trapezoid','wood')];}
function bridge(a,b,mat='wood'){return [block(a,740,36,120,'rectangle',mat),block(b,740,36,120,'rectangle',mat),block((a+b)/2,670,b-a+70,20,'beam',mat)];}
function pyramid(x,rows,mat='wood'){let out=[];for(let r=0;r<rows;r++)for(let c=0;c<rows-r;c++)out.push(block(x+(c-(rows-r-1)/2)*64,770-r*60,60,60,'square',mat));return out;}
// Authored blueprints: fixed positions, dimensions, shapes and materials, never random spawns.
const plans=[
 ['First Contact','forest',7,[...tower(1100,1,'wood',null)]],
 ['Twin Signals','forest',7,[...stack(1030,2),...stack(1220,2,'wood','rectangle',70,50)]],
 ['Bridge the Gap','forest',7,[...bridge(1040,1240),block(1140,630,60,60,'square')]],
 ['Treehouse','forest',7,[...tower(1130,2,'wood','triangle')]],
 ['Pyramid Party','forest',6,[...pyramid(1160,3)]],
 ['Glass Skyline','site',6,[...tower(1060,2,'glass','triangle'),...stack(1300,2)]],
 ['Stone Shoes','site',6,[...stack(1030,1,'stone','trapezoid',95,55),...tower(1260,2,'wood','circle')]],
 ['Double Trouble','site',6,[...tower(1020,2,'wood',null,130),...tower(1320,2,'glass','triangle',130)]],
 ['Rolling Stock','site',6,[...bridge(1030,1260,'stone'),block(1110,625,60,60,'circle','glass'),block(1190,625,60,60,'circle','wood')]],
 ['Warehouse Waltz','site',6,[...tower(1140,3,'wood','trapezoid'),...stack(1380,2,'glass')]],
 ['Castle Gate','castle',5,[...gate(1100),...stack(1330,3,'wood')]],
 ['Frosty Foundations','castle',5,[...tower(1050,2,'ice','polygon',140),...tower(1320,2,'wood','triangle',140)]],
 ['Royal Crossing','castle',5,[...bridge(1030,1310,'wood'),...stack(1170,1,'stone','square',60,60),block(1170,605,100,60,'trapezoid','glass')]],
 ['Watchtowers','castle',5,[...tower(1010,3,'wood','triangle',110),...tower(1330,3,'glass','triangle',110)]],
 ['Clockwork Courtyard','castle',5,[...tower(1160,3,'wood','polygon'),...stack(1390,2,'stone','square')]],
 ['Powder Room','desert',5,[...tower(1100,2,'stone',null),block(1100,760,52,52,'square','explosive'),...stack(1360,2,'wood')]],
 ['Desert Dominoes','desert',5,Array.from({length:7},(_,i)=>block(960+i*77,725,28,150,'rectangle',i===3?'explosive':i%2?'wood':'glass'))],
 ['Frozen Oasis','desert',5,[...tower(1060,3,'ice','circle',130),...gate(1330,'stone'),block(1330,775,42,42,'square','explosive')]],
 ['Sunken Treasure','desert',5,[...pyramid(1170,4,'glass'),...stack(1440,2,'wood','cylinder',60,75)]],
 ['Sandstorm Station','desert',5,[...tower(1110,3,'stone',null),block(1110,760,50,50,'square','explosive'),...stack(1370,3,'ice')]],
 ['Steel Horizon','city',5,[...tower(1100,2,'metal',null),block(1100,760,55,55,'square','explosive'),...stack(1360,2,'glass')]],
 ['Orbit Arches','city',5,[...gate(1020,'wood'),...gate(1280,'stone'),block(1280,770,45,45,'square','explosive')]],
 ['Glass Elevator','city',4,[...tower(1040,4,'glass','polygon',120),...tower(1330,2,'metal',null,130),block(1330,760,50,50,'square','explosive')]],
 ['Reactor Row','city',4,[...tower(1020,2,'metal',null,130),...tower(1330,2,'stone',null,130),block(1020,760,45,45,'square','explosive'),block(1330,760,45,45,'square','explosive'),...stack(1175,3,'ice')]],
 ['Cosmic Causeway','city',4,[...bridge(1000,1300,'metal'),block(1150,760,55,55,'square','explosive'),...stack(1080,1,'glass','circle'),...stack(1410,3,'wood','cylinder',65,65)]],
 ['Meteor Museum','city',4,[...tower(1040,3,'stone','polygon',125),block(1040,760,50,50,'square','explosive'),...tower(1350,3,'glass','circle',125)]],
 ['Fortress Frequency','castle',4,[...gate(1020,'metal'),...tower(1330,3,'stone','triangle',120),block(1020,775,48,48,'square','explosive'),block(1330,760,48,48,'square','explosive')]],
 ['Zero Chill','desert',4,[...tower(1020,4,'ice','polygon',115),...pyramid(1350,3,'stone'),block(1350,597.5,45,45,'square','explosive')]],
 ['The Neon Citadel','city',4,[...tower(1020,3,'metal',null,120),...tower(1330,4,'wood','polygon',120),block(1020,760,50,50,'square','explosive'),block(1330,760,50,50,'square','explosive')]],
 ['Supernova Finale','city',6,[...tower(1010,4,'stone',null,115),...tower(1340,4,'metal',null,115),block(1010,760,50,50,'square','explosive'),block(1340,760,50,50,'square','explosive'),...stack(1175,3,'ice','cylinder',60,65),block(1175,580,50,50,'polygon','explosive')]]
];
export const SMASH_LEVELS=plans.map(([name,theme,shots,blocks],i)=>({id:i+1,name,theme,shots,blocks,obstacles:i>=10&&[14,19,24,29].includes(i)?[{x:785,y:525,w:24,h:155,range:90,period:4.8}]:[],goal:.6}));
export function levelConfig(level,difficulty=3){return {...structuredClone(level),difficulty,shots:Math.max(3,level.shots+(3-difficulty)),durability:[.75,.88,1,1.15,1.3][difficulty-1],projectiles:Object.keys(PROJECTILES).filter(k=>PROJECTILES[k].unlock<=level.id)};}
