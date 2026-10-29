import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createAssetLibrary} from '../dist/js/3d/assets.js';
import {createGraphicsControl} from '../dist/js/3d/graphics.js';
import {createSceneMonitor} from '../dist/js/3d/telemetry.js';
import {ExpeditionArea,CHAMBER_DEFAULTS,chamberLimits} from '../dist/js/limit/journey.js';
import {createJourneyScene} from '../dist/js/limit/journey-scene.js';
import {forestWeaponPose} from '../dist/js/limit/combat.js';
import {IMPORTED_CONTACTS} from '../dist/js/limit/geometry-data.js';

const require=createRequire(import.meta.url),B=require('babylonjs');require('babylonjs-loaders');
const hk=await require('@babylonjs/havok')({wasmBinary:fs.readFileSync('dist/vendor/3d/HavokPhysics.wasm')}),manifest=JSON.parse(fs.readFileSync('dist/assets/limit/manifest.json'));
const original=B.SceneLoader.LoadAssetContainerAsync;B.SceneLoader.LoadAssetContainerAsync=(_,url,scene)=>original('',new Uint8Array(fs.readFileSync('dist/'+url)),scene,null,'.glb');
for(const id of ['castle','arena','chaos']){
 const engine=new B.NullEngine({renderWidth:900,renderHeight:550}),scene=new B.Scene(engine);engine.getCaps().maxVertexUniformVectors=256;scene.useRightHandedSystem=true;scene.useConstantAnimationDeltaTime=true;scene.enablePhysics(new B.Vector3(0,-18,0),new B.HavokPlugin(false,hk));scene.physicsEnabled=false;
 const camera=new B.ArcRotateCamera('camera',-Math.PI/2,1.15,7,new B.Vector3(0,1,-14),scene);new B.HemisphericLight('sky',new B.Vector3(0,1,0),scene);new B.DirectionalLight('sun',new B.Vector3(-.5,-1,-.2),scene);
 const runtime={B,scene,engine,camera,software:true,quality:'low',stats:()=>({triangles:0})};runtime.assets=createAssetLibrary(runtime);const graphics=createGraphicsControl(runtime);graphics.apply('low');
 const model=new ExpeditionArea({id,players:2}),imageFactory=()=>({set src(value){this.width=this.height=1024;queueMicrotask(()=>this.onload());}}),view=await createJourneyScene(runtime,model,graphics,{manifest,imageFactory});
 assert.equal(view.actors.length,2);assert.equal(view.actors[0].skel.bones.length,41);assert.ok(scene.meshes.length>80);assert.ok(scene.getMeshByName(id+'-floor').metadata.softwareTexture.image,'local surface textures reach the compatibility renderer');
 for(const shape of model.layout.obstacles){const mesh=scene.getMeshByName(shape.id+(['seal','lever','gateway'].includes(shape.kind)?'-collision':''));assert.ok(mesh,shape.id+' visual matches collision');assert.equal(mesh.position.x,shape.x);assert.equal(mesh.position.z,shape.z);}
 for(let i=0;i<150;i++){scene.getPhysicsEngine()._step(1/60);view.syncCollision();model.update(1/60,[]);view.update(1/60);scene.render();}
 assert.ok(view.props.every(prop=>prop.mesh.position.y>.2),'actual Havok crates settle on the real floor');assert.equal(model.dynamic.length,view.props.length);
 if(id==='castle'){
  const door=model.sideDoors[0],mesh=scene.getMeshByName(door.id+'-physics'),before=mesh.position.y;door.opened=true;
  for(let i=0;i<65;i++){model.update(1/60,[]);view.update(1/60);scene.getPhysicsEngine()._step(1/60);}
  assert.ok(mesh.position.y>before+3,'actual animated Havok door rises with rule state');
 }
 if(id==='arena'){
  const item=view.npcActors.get('sentinel-0'),unit=item.unit,actor=item.actor,profile=IMPORTED_CONTACTS.hero,weapon=actor.meshes.find(mesh=>mesh.name.split(':').at(-1)===profile.weapon);let error=0;
  for(const action of ['attack','cast'])for(const phase of [0,.18,.35,.5,.67,.9]){unit.attack=action==='attack'?{progress:phase}:null;unit.casting=action==='cast'?{progress:phase}:null;unit.animation=action;unit.angle=.8;view.update(0);scene.render();weapon.computeWorldMatrix(true);const pose=forestWeaponPose(unit,action,phase),actual=action==='attack'?B.Vector3.TransformCoordinates(B.Vector3.FromArray(profile.localTip),weapon.getWorldMatrix()):actor.nodes['handslot.l'].getAbsolutePosition(),point=action==='attack'?pose.tip:pose.release;error=Math.max(error,B.Vector3.Distance(actual,new B.Vector3(point.x,point.y,point.z)));}
  assert.ok(error<.025,'large boss weapon and casting palm match real baked contact paths');console.log('Actual boss blade/palm max alignment error:',error.toFixed(6),'m');
 }
 if(id==='chaos'){
  const bodyCount=()=>scene.getPhysicsEngine().getBodies().length;
  // Warm both optional palette variants, then ensure repeated load/reset stabilizes.
  model.configureChamber(chamberLimits(true),true);await view.refreshLoad();model.configureChamber(CHAMBER_DEFAULTS,true);await view.refreshLoad();
  const baseline={bodies:bodyCount(),meshes:scene.meshes.length,materials:scene.materials.length};
  for(let cycle=0;cycle<3;cycle++){
   model.configureChamber(chamberLimits(true),true);await view.refreshLoad();for(let i=0;i<60;i++){model.update(1/60,[]);view.update(1/60);scene.getPhysicsEngine()._step(1/60);scene.render();}
   assert.equal(view.loadStats.physics,12);assert.equal(view.loadStats.characters,2);assert.equal(view.loadStats.enemies,2);assert.ok(view.loadStats.projectiles<=8);assert.equal(view.loadStats.particles,24);assert.equal(view.loadStats.lights,0);
   model.configureChamber(CHAMBER_DEFAULTS,true);await view.refreshLoad();assert.deepEqual({bodies:bodyCount(),meshes:scene.meshes.length,materials:scene.materials.length},baseline,'repeated reset cannot leak workload actors/meshes/materials/bodies');
  }
  const monitor=createSceneMonitor(runtime,{memory:()=>undefined});monitor.frame(20);const metrics=monitor.snapshot({characters:view.characters});assert.equal(metrics.averageFPS,50);assert.equal(metrics.characters,view.characters);assert.equal(metrics.bodies,bodyCount());assert.equal(metrics.gpuMs,null);assert.equal(metrics.gpuVRAM,null);monitor.dispose();
 }
 view.dispose();view.dispose();runtime.assets.dispose();graphics.dispose();assert.equal(scene.getPhysicsEngine().getBodies().length,0,'all area bodies released');scene.dispose();engine.dispose();console.log('PASS: actual',id,'architecture, imported rigs, textured surfaces, real Havok contacts and full disposal.');
}
