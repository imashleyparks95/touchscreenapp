// Original authored layouts. One set of extents drives visible architecture and collision.
const bounds={minX:-15,maxX:15,minZ:-18,maxZ:20};
const box=(id,x,z,w,d,h=4,kind='stone',minY=0)=>({id,x,z,w,d,minY,maxY:minY+h,kind});
const perimeter=()=>[box('west-wall',-15,1,1,38),box('east-wall',15,1,1,38),box('south-wall',0,-18,30,1),box('north-west-wall',-8.5,18,13,1),box('north-east-wall',8.5,18,13,1)];
const sentinel=(name,x,z,role='melee',model='hero',hp=78,scale=.83)=>({name,x,z,role,model,hp,scale,route:[{x,z},{x:x+1.1,z:z-1.1}]});
export const JOURNEY_AREAS=Object.freeze([
 {id:'forest',name:'The Living Forest',short:'Forest',description:'Restore the trail lights and open the Wayfarer Gate.'},
 {id:'castle',name:'The Ancient Castle',short:'Castle',description:'Open the side chambers, recover two seals and raise the keep gate.'},
 {id:'arena',name:'The Crown Arena',short:'Arena',description:'Light the oath brazier and defeat the Crown Warden and its arcanists.'},
 {id:'chaos',name:'The Chaos Chamber',short:'Chamber',description:'Stabilize two reactors, defeat the wardens and open the return portal.'}
]);
export function castleHeight(x,z){
 if(Math.abs(x)<2.5&&z>=11&&z<=14)return .8;
 if(Math.abs(x)<2.5&&z>=9.4&&z<11)return Math.min(.8,(Math.floor((z-9.4)/.4)+1)*.2);
 return 0;
}
export function journeyWorld(id){
 if(!['castle','arena','chaos'].includes(id))throw Error('Unknown expedition area');
 const definition=JOURNEY_AREAS.find(area=>area.id===id),common={...definition,bounds:{...bounds},height:()=>0,spawn:{x:0,z:-10.5},gate:{x:0,z:19},switch:{x:3,z:15.6},door:box(id+'-exit',0,18,3.4,.4,3.2,'door'),waterRoutes:[],routes:[],sideDoors:[]};
 let obstacles=[...perimeter(),...[-1,1].map(side=>box('exit-pillar-'+side,side*1.94,18,.74,.95,4.2,'gateway'))],lanterns,enemies;
 if(id==='castle'){
  common.height=castleHeight;
  obstacles.push(box('hall-west',-8.8,0,12.4,.7,4.5),box('hall-east',8.8,0,12.4,.7,4.5));
  for(const side of [-1,1]){
   obstacles.push(box('chamber-'+side+'-south',side*5,2.5,.65,4.2,4.5),box('chamber-'+side+'-north',side*5,12,.65,7,4.5));
   common.sideDoors.push({...box('chamber-door-'+side,side*5,6.3,.6,3.4,3.5,'oak'),name:side<0?'West reliquary':'East observatory',axis:'x'});
   obstacles.push(box('courtyard-column-'+side,side*9,-9,1,1,4.5,'column'),box('keep-column-'+side,side*3.5,14,1,1,4.5,'column'));
  }
  obstacles.push(box('keep-dais',0,12.5,5,3,.8,'stone'));
  for(let i=0;i<4;i++)obstacles.push(box('keep-step-'+i,0,9.6+i*.4,5,.4,.2*(i+1),'step'));
  lanterns=[{id:0,name:'West Moon Seal',x:-10,z:7},{id:1,name:'East Sun Seal',x:10,z:7}];
  enemies=[sentinel('Reliquary Guard',-10,10),sentinel('Observatory Arcanist',10,11,'caster','companion',72),sentinel('Keep Guardian',0,14.8,'guardian','hero',125)];
  common.intro='Two side chambers hold the seals. Use Interact at each wooden door; stairs lead to the keep.';
 }else if(id==='arena'){
  for(const [x,z]of [[-8,-5],[8,-5],[-8,7],[8,7]])obstacles.push(box('arena-pillar-'+x+'-'+z,x,z,1.15,1.15,3.5,'column'));
  lanterns=[{id:0,name:'Oath Brazier',x:0,z:-9}];
  enemies=[sentinel('Crown Warden',0,8,'guardian','hero',300,1.12),sentinel('Ember Arcanist',-7,7,'caster','companion',84),sentinel('Frost Arcanist',7,7,'caster','companion',84)];
  enemies[0].boss=true;enemies[0].radius=.55;enemies[0].height=2.5;common.intro='Light the oath brazier. The Crown Warden casts below half health: watch its wind-up and keep cover.';
 }else{
  for(const side of [-1,1])for(const z of [-6,11])obstacles.push(box('reactor-support-'+side+'-'+z,side*11,z,1.2,1.2,3.2,'column'));
  obstacles.push(box('chamber-spindle',0,8,2,2,2.2,'column'));
  lanterns=[{id:0,name:'West Reactor',x:-9,z:4},{id:1,name:'East Reactor',x:9,z:4}];
  enemies=[sentinel('Chamber Warden',-3,12,'guardian','hero',145),sentinel('Flux Arcanist',5,12,'caster','companion',92)];
  common.intro='Stabilize both reactors and clear the wardens. Optional load controls are bounded; reset them instantly if play slows.';
 }
 for(const lantern of lanterns)obstacles.push(box('seal-'+lantern.id,lantern.x,lantern.z,1,1,1.2,'seal'));
 obstacles.push(box('exit-lever',common.switch.x,common.switch.z,.45,.45,.8,'lever'));
 return{...common,lanterns,enemies,layout:{obstacles,trees:[],rocks:[],foliage:[]}};
}
