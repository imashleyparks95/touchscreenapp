import {staticCollider,dynamicBox,create3DEffects,ProjectilePool} from '../3d/index.js';
import {createForestAssets} from './assets.js';
import {createAdventureActors} from './adventure-actors.js';

/** Game-owned architecture and workload. The same authored boxes drive rule/Havok walls. */
export async function createJourneyScene(runtime,model,graphics,{manifest,onCue=()=>{},imageFactory}={}){
 const {B,scene}=runtime,assets=await createForestAssets(runtime,manifest,{imageFactory});
 if(scene.isDisposed){assets.dispose();throw Error('Area closed during loading');}
 const owned=[],bodies=[],props=[],doors=[],seals=[],torches=[],decor=[],motes=[],loadLights=[],units=new Map(),textures=new Map(),shots=new Map(),pool=new ProjectilePool({limit:24}),effects=create3DEffects(runtime),rig=createAdventureActors(runtime,assets,graphics,manifest);
 let stoneImage=null,oakImage=null,masonryImage=null;
 let disposed=false,settings=graphics.settings,visualClock=0,shotClock=0;
 const world=model.world,id=world.id,color=hex=>B.Color3.FromHexString(hex);
 function material(name,hex,roughness=.85){const m=new B.PBRMaterial(name,scene);m.albedoColor=color(hex);m.roughness=roughness;m.metallic=0;owned.push(m);return m;}
 const wallStone=material(id+'-coursed-masonry',id==='castle'?'#a1a9ae':id==='arena'?'#b09d89':'#7c91a1');
 const stone=material(id+'-weathered-limestone',id==='castle'?'#9c9b8e':id==='arena'?'#a98b76':'#687a88'),trim=material(id+'-carved-trim','#c0ae88'),dark=material(id+'-dark-stone','#464b53'),oak=material(id+'-oak','#927255'),metal=material(id+'-bronze','#b89b63',.4),rune=material(id+'-restored-rune','#92dbc5',.3),dormant=material(id+'-dormant-rune','#556775');
 rune.emissiveColor=color('#488c79');metal.metallic=.65;
 function texture(url){if(!textures.has(url))textures.set(url,new B.Texture(url,scene,false,false));return textures.get(url);}
 stone.albedoTexture=texture(manifest.surfaces.forest_ground_04.diff_low);stone.albedoTexture.uScale=2;stone.albedoTexture.vScale=2;stone.bumpTexture=texture(manifest.surfaces.forest_ground_04.nor_gl_low);stone.bumpTexture.level=.3;
 oak.albedoTexture=texture(manifest.surfaces.bark_willow.diff_low);oak.bumpTexture=texture(manifest.surfaces.bark_willow.nor_gl_low);oak.bumpTexture.level=.3;
 function box(name,x,y,z,w,h,d,mat=stone,collide=false){const mesh=B.MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene);mesh.position.set(x,y,z);mesh.material=mat;mesh.receiveShadows=true;mesh.isPickable=false;if(runtime.software&&(mat===stone?stoneImage:mat===oak?oakImage:mat===wallStone?masonryImage||stoneImage:null))mesh.metadata={softwareTexture:{image:mat===stone?stoneImage:mat===oak?oakImage:masonryImage||stoneImage}};owned.push(mesh);graphics.addShadowCaster(mesh);if(collide)bodies.push(staticCollider(runtime,mesh));return mesh;}
 function cylinder(name,x,y,z,radius,height,mat=stone,tessellation=12){const mesh=B.MeshBuilder.CreateCylinder(name,{diameter:radius*2,height,tessellation},scene);mesh.position.set(x,y,z);mesh.material=mat;mesh.receiveShadows=true;mesh.isPickable=false;if(runtime.software&&(mat===stone?stoneImage:mat===oak?oakImage:mat===wallStone?masonryImage||stoneImage:null))mesh.metadata={softwareTexture:{image:mat===stone?stoneImage:mat===oak?oakImage:masonryImage||stoneImage}};owned.push(mesh);graphics.addShadowCaster(mesh);return mesh;}
 function torch(x,z,y=2.1){const mount=box('torch-bracket',x,y-.25,z,.15,.45,.2,metal),flame=B.MeshBuilder.CreateIcoSphere('torch-flame',{radius:.12,subdivisions:1},scene);flame.position.set(x,y,z);const mat=material('warm-torch','#efbc78');mat.emissiveColor=color('#efaa50');flame.material=mat;owned.push(flame);let light=null;if(!runtime.software){light=new B.PointLight('castle-torch',flame.position.clone(),scene);light.diffuse=color('#ffd099');light.intensity=1.4;light.range=6;owned.push(light);}torches.push({flame,light,phase:x+z});return mount;}
 function door(spec){const root=new B.TransformNode(spec.id+'-visual',scene);owned.push(root);const alongX=spec.axis!=='x',width=alongX?spec.w:spec.d;
  for(let i=0;i<8;i++){const plank=box(spec.id+'-plank',0,0,0,width/8-.02,3.1,.18,oak);plank.parent=root;plank.position.set(-width/2+(i+.5)*width/8,1.55,0);}
  for(const y of [.55,2.5]){const brace=box(spec.id+'-iron-brace',0,0,0,width,.13,.23,metal);brace.parent=root;brace.position.set(0,y,-.03);}
  if(!alongX)root.rotation.y=Math.PI/2;
  const mesh=box(spec.id+'-physics',spec.x,1.6,spec.z,spec.w,3.2,spec.d,dark);mesh.isVisible=false;const body=staticCollider(runtime,mesh);body.body.setMotionType(B.PhysicsMotionType.ANIMATED);body.body.disablePreStep=false;bodies.push(body);doors.push({root,mesh,spec});
 }
 function clearLoad(){for(const item of props){graphics.removeShadowCaster(item.mesh);item.body.dispose();item.mesh.dispose();}props.length=0;for(const m of [...decor,...motes])m.dispose();decor.length=motes.length=0;for(const light of loadLights)light.dispose();loadLights.length=0;pool.clear();for(const mesh of shots.values())mesh.dispose();shots.clear();}
 function refresh(){if(disposed)return;settings=graphics.settings;clearLoad();const load=id==='chaos'?model.chamber:null,physics=load?.physics??settings.physics;
  for(let i=0;i<physics;i++){const x=(i%2?-1:1)*(8.2+(i%3)*.7),z=-13+Math.floor(i/6)*.75,mesh=B.MeshBuilder.CreateBox('journey-physics-crate-'+i,{size:.58},scene);mesh.position.set(x,1+(i%3)*.6,z);mesh.material=oak;mesh.receiveShadows=true;graphics.addShadowCaster(mesh);props.push({id:'journey-crate-'+i,mesh,body:dynamicBox(runtime,mesh,{mass:2,friction:.75,restitution:.12})});}
  if(load){
   for(let i=0;i<load.complexity*16;i++){const a=i/16*Math.PI*2,mesh=B.MeshBuilder.CreateCylinder('chamber-complexity-column',{diameter:.26,height:1+(i%5)*.3,tessellation:8},scene);mesh.position.set(Math.sin(a)*(11+i%3),mesh.getBoundingInfo().boundingBox.extendSize.y,Math.cos(a)*12);mesh.material=metal;mesh.isPickable=false;decor.push(mesh);}
   for(let i=0;i<load.particles;i++){const mesh=B.MeshBuilder.CreatePlane('chamber-energy-mote',{size:.055},scene);mesh.material=rune;mesh.billboardMode=B.Mesh.BILLBOARDMODE_ALL;mesh.isPickable=false;motes.push(mesh);}
   if(!runtime.software)for(let i=0;i<load.lights;i++){const light=new B.PointLight('chamber-load-light',new B.Vector3(Math.sin(i)*9,2.5,Math.cos(i)*9),scene);light.diffuse=color(i%2?'#92b8e3':'#d4a58a');light.intensity=.65;light.range=7;loadLights.push(light);}
  }
  syncCollision();
 }
 function syncCollision(){model.setDynamicObstacles(props.map(item=>{item.mesh.computeWorldMatrix(true);const {minimumWorld:min,maximumWorld:max}=item.mesh.getBoundingInfo().boundingBox;return{id:item.id,x:(min.x+max.x)/2,z:(min.z+max.z)/2,w:max.x-min.x,d:max.z-min.z,minY:min.y,maxY:max.y};}));}
 async function syncActors(){
  const wanted=new Map(model.units.map(unit=>[unit.id,unit]));for(const [key,item]of units)if(!wanted.has(key)){item.actor.dispose();for(const resource of [item.marker,item.bar,item.warning])if(resource){resource.dispose();const at=owned.indexOf(resource);if(at>=0)owned.splice(at,1);}units.delete(key);}
  for(const unit of wanted.values())if(!units.has(unit.id)){const actor=await rig.create(unit);if(disposed){actor.dispose();return;}const item={unit,actor};if(unit.team===1){const marker=B.MeshBuilder.CreateTorus('enemy-windup-'+unit.id,{diameter:unit.boss?1.5:.9,thickness:.04,tessellation:24},scene);item.warning=material('enemy-warning-'+unit.id,'#c47a61');marker.material=item.warning;const back=B.MeshBuilder.CreatePlane('journey-health-'+unit.id,{width:unit.boss?1.5:.85,height:.1},scene);back.billboardMode=B.Mesh.BILLBOARDMODE_ALL;back.material=dark;const bar=B.MeshBuilder.CreatePlane('journey-health-fill',{width:unit.boss?1.4:.8,height:.06},scene);bar.parent=back;bar.position.z=-.012;bar.material=marker.material;owned.push(marker,back);item.marker=marker;item.bar=back;item.fill=bar;}units.set(unit.id,item);}
 }
 function setWeather(value='day'){
  const inside=id!=='arena',sun=scene.getLightByName('sun'),sky=scene.getLightByName('sky');scene.clearColor=B.Color4.FromColor3(color(inside?'#202938':'#41465a'),1);scene.fogMode=B.Scene.FOGMODE_EXP2;scene.fogColor=color(inside?'#303747':'#7b7481');scene.fogDensity=inside?.009:.006;sun.intensity=inside?.4:1.15;sky.intensity=inside?.58:.65;
  if(value==='night'){sun.intensity*=.4;sky.intensity*=.8;}else if(value==='dusk')sun.diffuse=color('#e7bd91');else sun.diffuse=color('#e4e8f0');
 }
 function update(dt){if(disposed)return;visualClock+=dt;shotClock+=dt;const clock=model.clock;
  for(const item of units.values()){const {unit,actor}=item;rig.update(actor,unit,clock,dt,settings.distance);if(item.bar){const visible=unit.alive;item.bar.setEnabled(visible);item.marker.setEnabled(visible);item.bar.position.set(unit.x,unit.y+(unit.boss?3:2.15),unit.z);item.fill.scaling.x=Math.max(.001,unit.hp/unit.maxHP);item.marker.position.set(unit.x,model.height(unit.x,unit.z)+.025,unit.z);const charge=unit.attack?.progress??unit.casting?.progress??0;item.marker.scaling.setAll(1+Math.min(.6,charge));item.marker.material.emissiveColor=color(unit.attack||unit.casting?'#bf654b':'#3a2826');}}
  for(const item of seals){const lit=model.lit.has(item.data.id);item.orb.material=lit?rune:dormant;item.orb.rotation.y=clock*.5;}
  for(const item of doors){const progress=item.spec.id===world.door.id?model.doorProgress:item.spec.progress;item.root.position.set(item.spec.x,model.height(item.spec.x,item.spec.z)+progress*3.7,item.spec.z);item.mesh.position.y=item.root.position.y+1.6;item.mesh.computeWorldMatrix(true);}
  for(const item of torches){const strength=.9+Math.sin(visualClock*5+item.phase)*.07;item.flame.scaling.y=strength;if(item.light)item.light.intensity=1.4*strength;}
  // Visible interior/exterior lighting transition in the keep, not an engine swap.
  if(id==='castle'){const inside=model.players.some(player=>player.z>0);scene.getLightByName('sun').intensity=inside?.3:1;scene.getLightByName('sky').intensity=inside?.54:.7;}
  if(id==='chaos'){
   for(const [i,mesh]of motes.entries())mesh.position.set(Math.sin(i*2.4+visualClock*.3)*10,1+(i%7)*.38+Math.sin(visualClock+i)*.2,Math.cos(i*1.7+visualClock*.2)*12);
   const count=model.chamber.projectiles;if(count&&shotClock>.12){shotClock=0;while(pool.active.length<count){const a=visualClock+pool.active.length*.8;pool.spawn({x:Math.sin(a)*9,y:2,z:Math.cos(a)*9,vx:-Math.cos(a)*4,vy:.15,vz:Math.sin(a)*4,life:2,r:.1,g:0});}}
   pool.update(dt,{});const live=new Set();for(const shot of pool.active){live.add(shot.id);if(!shots.has(shot.id)){const mesh=B.MeshBuilder.CreateIcoSphere('non-damaging-test-pulse',{radius:.1,subdivisions:1},scene);mesh.material=rune;mesh.isPickable=false;shots.set(shot.id,mesh);}shots.get(shot.id).position.set(shot.x,shot.y,shot.z);}for(const [key,mesh]of shots)if(!live.has(key)){mesh.dispose();shots.delete(key);}
  }
  while(model.events.length){const event=model.events.shift();if(event.type==='push'){const item=props.find(p=>p.id===event.id);if(item&&Math.hypot(item.body.body.getLinearVelocity().x,item.body.body.getLinearVelocity().z)<3)item.body.body.applyImpulse(new B.Vector3(event.x,0,event.z),item.mesh.getAbsolutePosition());}if(event.point&&['hit','defeat','impact','pulse'].includes(event.type))effects.burst(event.point,event.type==='defeat'?'#e3c384':'#9bd4c2',event.type==='defeat'?12:5);onCue(event);}effects.update(dt);
 }
 function dispose(){if(disposed)return;disposed=true;clearLoad();effects.dispose();rig.dispose();for(const body of bodies)body.dispose();for(const item of owned){if(item.getClassName?.().includes('Mesh'))graphics.removeShadowCaster(item);item.dispose();}for(const t of textures.values())t.dispose();assets.dispose();units.clear();}
 try{
  // Original, deterministic coursed stone drawn locally; no external asset or API.
  if(globalThis.document?.createElement){const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d');if(c){c.fillStyle='#303a43';c.fillRect(0,0,512,512);for(let row=0;row<8;row++)for(let col=-1;col<5;col++){const x=col*128+(row%2?64:0),y=row*64,tone=122+((row*17+col*13)%19);c.fillStyle=`rgb(${tone-5},${tone},${tone+3})`;c.fillRect(x+3,y+3,122,58);c.strokeStyle='#c3c8c545';c.lineWidth=2;c.strokeRect(x+5,y+5,118,54);c.fillStyle='#26323c24';for(let i=0;i<10;i++)c.fillRect(x+8+(i*31+row*7)%108,y+10+(i*13+col*7)%42,7,2);}masonryImage=canvas;const map=new B.DynamicTexture(id+'-original-masonry',canvas,scene,true);map.update(false);map.uScale=2;wallStone.albedoTexture=map;owned.push(map);}}
  if(runtime.software){stoneImage=await assets.image(manifest.surfaces.forest_ground_04.diff_low);oakImage=await assets.image(manifest.surfaces.bark_willow.diff_low);if(scene.isDisposed)throw Error('Area closed during texture loading');}
  const floor=box(id+'-floor',0,-.2,1,32,.4,40,id==='arena'?stone:wallStone,true);floor.metadata={...floor.metadata,softwareLayer:-20};
  // Uneven seams, footings, carved caps and battlements give walls genuine depth.
  for(const shape of world.layout.obstacles){
   if(['seal','lever','gateway'].includes(shape.kind)){const proxy=box(shape.id+'-collision',shape.x,(shape.minY+shape.maxY)/2,shape.z,shape.w,shape.maxY-shape.minY,shape.d,dark,true);proxy.isVisible=false;continue;}
   const h=shape.maxY-shape.minY,mesh=box(shape.id,shape.x,shape.minY+h/2,shape.z,shape.w,h,shape.d,shape.kind==='column'?trim:wallStone,true);
   if(shape.kind==='stone'&&h>2){const alongX=shape.w>shape.d;box(shape.id+'-foundation',shape.x,.2,shape.z,shape.w+(alongX?0:.18),.4,shape.d+(alongX?.18:0),dark);box(shape.id+'-cornice',shape.x,h-.25,shape.z,shape.w+.16,.25,shape.d+.16,trim);
    const length=alongX?shape.w:shape.d;for(let i=0;i<Math.floor(length/2);i++){const offset=-length/2+1+i*2;box(shape.id+'-merlon-'+i,shape.x+(alongX?offset:0),h+.25,shape.z+(alongX?0:offset),alongX?.8:shape.w,.5,alongX?shape.d:.8,trim);}
   }
   if(shape.kind==='column'){for(const y of [.2,h-.2])cylinder(shape.id+'-capital',shape.x,y,shape.z,.85,.3,trim);}
  }
  // Reused imported gateway/beacon assets retain their original licenses and UVs.
  assets.spawn('gate',{x:0,z:18,y:model.height(0,18)});
  for(const data of world.lanterns){assets.spawn('beacon',{x:data.x,z:data.z,y:model.height(data.x,data.z)});const orb=B.MeshBuilder.CreateIcoSphere('seal-core-'+data.id,{radius:.2,subdivisions:2},scene);orb.position.set(data.x,model.height(data.x,data.z)+1.4,data.z);orb.material=dormant;owned.push(orb);seals.push({data,orb});}
  door({...world.door,progress:0});for(const side of model.sideDoors)door(side);
  const lever=cylinder('exit-switch-base',world.switch.x,.4,world.switch.z,.23,.8,dark);const handle=box('exit-switch-handle',world.switch.x,1,world.switch.z,.12,.65,.12,metal);handle.rotation.z=.5;
  for(const side of [-1,1])for(const z of [-11,-2,5,13])torch(side*13.9,z);
  if(id==='castle'){
   // Side-room ceiling beams/windows and courtyard paving, with a readable open center.
   for(const side of [-1,1])for(const z of [3,7,11,15]){box('keep-ceiling-beam',side*10,4.4,z,9,.25,.3,oak);box('window-inset',side*14.45,2.6,z,.05,1.1,.8,dark);box('window-sill',side*14.25,2,z,.45,.15,1.1,trim);}
   for(let i=0;i<24;i++){const x=-6+(i%6)*2,z=-13+Math.floor(i/6)*2;box('courtyard-paving',x,.025,z,1.85,.05,1.85,i%3?stone:trim);}
   for(const side of [-1,1]){box('keep-banner',side*3,3,1.6,.75,1.7,.04,material('royal-banner-'+side,side<0?'#6b648c':'#65897f'));torch(side*3,1.8,2.4);}
  }else if(id==='arena'){
   // Three architectural tiers, radial buttresses and a patterned central fighting ring.
   for(let tier=0;tier<3;tier++)for(let i=0;i<24;i++){const a=i/24*Math.PI*2,x=Math.sin(a)*(17+tier*.9),z=Math.cos(a)*(21+tier*.9),mesh=box('arena-gallery-'+tier+'-'+i,x,.5+tier*.7,z,2.4,1+tier*.9,1.2,tier%2?dark:stone);mesh.rotation.y=-a;}
   for(let i=0;i<12;i++){const a=i/12*Math.PI*2;cylinder('arena-outer-column',Math.sin(a)*17,2.5,Math.cos(a)*21,.5,5,trim);}
   const ring=B.MeshBuilder.CreateTorus('arena-inlaid-ring',{diameter:16,thickness:.035,tessellation:64},scene);ring.position.y=.025;ring.material=metal;owned.push(ring);
   for(const side of [-1,1])box('arena-banner',side*14.3,2,-1,.04,2.2,1.1,material('arena-banner-cloth-'+side,side<0?'#885f68':'#5d8291'));
  }else{
   for(const side of [-1,1])for(const z of [-9,0,9]){box('chamber-rib',side*14.2,2.4,z,.4,4.8,.45,metal);box('chamber-overhead-beam',0,4.8,z,28,.2,.3,dark);}
   const core=B.MeshBuilder.CreateIcoSphere('chamber-central-crystal',{radius:1,subdivisions:2},scene);core.position.set(0,3.1,8);core.material=rune;owned.push(core);
   for(const data of world.lanterns){const hoop=B.MeshBuilder.CreateTorus('reactor-ring',{diameter:2.4,thickness:.08,tessellation:32},scene);hoop.position.set(data.x,1,data.z);hoop.rotation.x=Math.PI/2;hoop.material=metal;owned.push(hoop);}

  }
  refresh();setWeather();await syncActors();update(0);
 }catch(error){dispose();throw error;}
 return{actors:[...units.values()].filter(item=>item.unit.team===0).map(item=>item.actor),npcActors:units,assets,props,get characters(){return units.size;},syncCollision,refresh,setWeather,update,resetPhysics:refresh,async refreshLoad(){refresh();await syncActors();update(0);},get loadStats(){return{characters:model.npcs.filter(unit=>unit.optional).length,enemies:model.enemies.filter(unit=>unit.optional&&unit.alive).length,physics:props.length,projectiles:pool.active.length,particles:motes.length,lights:loadLights.length,complexity:decor.length};},dispose};
}
