import {createActorFactory} from '../3d/index.js';
// These are the bundled KayKit rigs/hand slots, not a generic humanoid contract.
const CLIPS={attack:'1H_Melee_Attack_Slice_Horizontal',cast:'Spellcast_Shoot',dodge:'Dodge_Forward',dead:'Death_A',idle:'Idle',walk:'Walking_A',run:'Running_A',takeoff:'Jump_Start',jump:'Jump_Idle',land:'Jump_Land',interact:'Interact',celebrate:'Cheer'};
const ACCESSORIES=/^(1H_Sword_Offhand|Badge_Shield|Rectangle_Shield|Round_Shield|Spike_Shield|1H_Sword|2H_Sword|Knife_Offhand|1H_Crossbow|2H_Crossbow|Knife|Throwable)$/;
export function createAdventureActors(runtime,assets,graphics,manifest){
 const {B}=runtime,factories=new Map(),pending=new Map(),actors=new Set();let disposed=false;
 async function create(unit){
  const key=unit.model;
  if(!pending.has(key))pending.set(key,createActorFactory(runtime,{url:manifest.models[key].url,clips:CLIPS,palette:{[key==='hero'?'knight_texture':'rogue_texture']:['#ffffff','#c58175','#bed2bc']},collider:{height:2.15,radius:.44},strideSpeed:3}).then(factory=>{if(disposed||runtime.scene.isDisposed){factory.dispose();throw Error('Area closed during character loading');}factories.set(key,factory);return factory;}));
  const factory=await pending.get(key);if(disposed||runtime.scene.isDisposed)throw Error('Area closed');
  const actor=factory.create({scale:unit.scale,variant:unit.team}),originalDispose=actor.dispose.bind(actor);actors.add(actor);
  actor.dispose=()=>{for(const mesh of actor.meshes)graphics.removeShadowCaster(mesh);originalDispose();actors.delete(actor);};
  const weapon=key==='hero'?'1H_Sword':'Knife';
  for(const node of actor.root.getDescendants())if(ACCESSORIES.test(node.name.split(':').at(-1)))node.setEnabled(unit.team!==2&&node.name.split(':').at(-1)===weapon);
  try{for(const mesh of actor.meshes){await assets.decorate(mesh,key);if(disposed||runtime.scene.isDisposed)throw Error('Area closed during character loading');graphics.addShadowCaster(mesh);}}catch(error){actor.dispose();throw error;}
  return actor;
 }
 function update(actor,unit,clock,dt,distance){
  const age=unit.alive?0:Math.max(0,clock-unit.deadAt),state={...unit,state:unit.alive?unit.animation||unit.state:'dead',animationProgress:unit.alive?(unit.attack?.progress??unit.casting?.progress??(clock<unit.dodgeUntil?1-(unit.dodgeUntil-clock)/.4:undefined)):Math.min(1,age/.8),animationExclusive:!!unit.attack||!!unit.casting||!unit.alive||clock<unit.dodgeUntil};
  actor.update(state,dt);const near=Math.hypot(unit.x-runtime.camera.target.x,unit.z-runtime.camera.target.z)<distance+4;actor.root.setEnabled(near&&(unit.alive||age<2));for(const mesh of actor.meshes)mesh.visibility=unit.alive?1:Math.max(0,1-(age-.7)/1.3);
 }
 return{create,update,dispose(){if(disposed)return;disposed=true;for(const actor of [...actors])actor.dispose();for(const factory of factories.values())factory.dispose();factories.clear();}};
}
