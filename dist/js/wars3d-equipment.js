import {createBoneAttachments,rigFromTo} from './3d/attachments.js';
import {WAR_WEAPONS,SOLDIER_SOCKETS} from './wars3d-weapons.js';
import {warWeaponFrame} from './wars3d-poses.js';

// Wobbly Wars-authored equipment meshes. Every origin is its physical grip pivot.
export function extrudedEquipment(runtime,name,outline,depth,material){const{B,scene}=runtime,positions=[],indices=[];const area=outline.reduce((sum,p,i)=>{const next=outline[(i+1)%outline.length];return sum+p[0]*next[1]-next[0]*p[1];},0);if(area>0)outline=[...outline].reverse();for(const z of [-depth/2,depth/2])for(const[x,y]of outline)positions.push(x,y,z);const n=outline.length;for(let i=1;i<n-1;i++)indices.push(0,i+1,i,n,n+i,n+i+1);for(let i=0;i<n;i++){const j=(i+1)%n;indices.push(i,j,n+i,j,n+j,n+i);}const normals=[];B.VertexData.ComputeNormals(positions,indices,normals);const mesh=new B.Mesh(name,scene),vd=new B.VertexData();Object.assign(vd,{positions,indices,normals});vd.applyToMesh(mesh);mesh.material=material;mesh.isPickable=false;return mesh;}
export function makeArrow(runtime,material,name='arrow'){const{B,scene}=runtime,root=new B.TransformNode(name,scene),shaft=B.MeshBuilder.CreateCylinder(name+'-shaft',{height:.58,diameter:.026,tessellation:5},scene);shaft.rotation.x=Math.PI/2;shaft.position.z=.27;shaft.material=material;shaft.parent=root;const tip=B.MeshBuilder.CreateCylinder(name+'-tip',{height:.14,diameterBottom:.08,diameterTop:0,tessellation:4},scene);tip.rotation.x=Math.PI/2;tip.position.z=.61;tip.material=material;tip.parent=root;return root;}
export function createWarEquipment(runtime,actor,u,material,override={}){
 const {B,scene}=runtime,cfg={...WAR_WEAPONS[u.type],...override,grip:{...WAR_WEAPONS[u.type].grip,...override.grip}},attachments=createBoneAttachments(runtime,{skeleton:actor.skel,mesh:actor.meshes[0],sockets:SOLDIER_SOCKETS}),root=new B.TransformNode('weapon:'+u.id+':'+u.type,scene),wood=material('weapon-wood','#775036'),steel=material('weapon-steel','#b8c5c4'),gold=material('weapon-brass','#c59b42'),leather=material('weapon-leather','#49392b'),len=cfg.length;
 const mesh=(m,parent=root)=>{m.parent=parent;m.isPickable=false;m.receiveShadows=true;runtime.shadows?.addShadowCaster(m);return m;};
 const box=(name,w,h,d,x,y,z,mat,parent=root)=>{const m=mesh(B.MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene),parent);m.position.set(x,y,z);m.material=mat;return m;};
 const cylinder=(name,y0,y1,diameter,mat)=>{const m=mesh(B.MeshBuilder.CreateCylinder(name,{height:y1-y0,diameter,tessellation:6},scene));m.position.y=(y0+y1)/2;m.material=mat;return m;};
 const polygon=(name,points,thick,mat)=>mesh(extrudedEquipment(runtime,name,points,thick,mat));
 const segment=(name,mat,parent=root)=>{const m=mesh(B.MeshBuilder.CreateCylinder(name,{height:1,diameter:.018,tessellation:4},scene),parent);m.material=mat;return m;};
 const setSegment=(m,a,b)=>{const dir=b.subtract(a);m.position.copyFrom(a.add(b).scale(.5));m.scaling.y=dir.length();m.rotationQuaternion=B.Quaternion.FromArray(rigFromTo({x:0,y:1,z:0},dir));};
 let strings=null,nocked=null,reins=null;
 if(['sword','dagger'].includes(cfg.shape)){
  cylinder('sword-handle',cfg.twoHanded?-.30:-.19,.13,.085,leather);box('crossguard',.44,.07,.10,0,.15,0,gold);polygon('blade',[[-.09,.19],[-.11,len-.23],[0,len],[.11,len-.23],[.09,.19]],.055,steel);box('pommel',.12,.11,.12,0,cfg.twoHanded?-.32:-.21,0,gold);
 }else if(['spear','lance'].includes(cfg.shape)){
  cylinder('polearm-shaft',-.22,len-.22,.07,wood);polygon('spearhead',[[-.12,len-.36],[0,len],[.12,len-.36],[0,len-.50]],.07,steel);cylinder('polearm-binding',-.07,.08,.085,leather);
 }else if(['hammer','stone-hammer'].includes(cfg.shape)){
  cylinder('hammer-handle',-.25,len-.16,.085,wood);box('hammer-head',.70,.30,.33,0,len-.15,0,cfg.shape==='stone-hammer'?material('stone-head','#727f72'):steel);cylinder('hammer-grip',-.22,.09,.105,leather);
 }else if(cfg.shape==='axe'){
  cylinder('axe-handle',-.28,len-.10,.075,wood);polygon('axe-edge',[[0,len-.40],[.40,len-.43],[.54,len-.06],[.08,len],[0,len-.18]],.11,steel);cylinder('axe-binding',-.26,.10,.092,leather);
 }else if(['club','ramrod','banner','staff','wand'].includes(cfg.shape)){
  cylinder('shaft',cfg.twoHanded?-.28:-.2,len-.13,.065,wood);cylinder('handle',cfg.twoHanded?-.26:-.12,.1,.09,leather);
  if(cfg.shape==='club')polygon('club-head',[[-.13,len-.4],[-.22,len-.24],[-.13,len],[.13,len],[.22,len-.24],[.13,len-.4]],.24,wood);
  if(cfg.shape==='ramrod')cylinder('ramrod-tip',len-.18,len,.13,leather);
  if(cfg.shape==='banner')polygon('standard-cloth',[[0,len-.08],[.64,len-.08],[.53,len-.47],[0,len-.43]],.025,material('standard-'+u.side,u.side?'#c8483d':'#2a78bd'));
  if(['staff','wand'].includes(cfg.shape)){const gem=mesh(B.MeshBuilder.CreatePolyhedron('focus-gem',{type:1,size:.17},scene));gem.position.y=len-.10;gem.material=material('gem-'+u.type,{fire:'#e47e37',ice:'#63b7d4',healer:'#59ac69',wizard:'#936eb2',trickster:'#ab79ba'}[u.type]||'#85b8ab',.15);cylinder('focus-collar',len-.28,len-.2,.13,gold);}
 }else if(cfg.shape==='bow'){
  const points=[[0,-.63,.08],[0,-.4,.12],[0,-.15,.025],[0,0,0],[0,.15,.025],[0,.4,.12],[0,.63,.08]].map(v=>new B.Vector3(...v));for(let i=1;i<points.length;i++){const limb=segment('bow-limb',wood);limb.scaling.x=limb.scaling.z=3.4;setSegment(limb,points[i-1],points[i]);}cylinder('bow-grip',-.09,.09,.085,leather);
  strings=[segment('bowstring-upper',material('bowstring','#d3c7a3')),segment('bowstring-lower',material('bowstring','#d3c7a3'))];nocked=makeArrow(runtime,wood,'nocked-arrow');nocked.parent=root;
 }else if(cfg.shape==='sling'){
  cylinder('sling-grip',-.07,.07,.065,leather);const cord1=segment('sling-cord1',leather),cord2=segment('sling-cord2',leather);setSegment(cord1,new B.Vector3(-.03,0,0),new B.Vector3(0,len,0));setSegment(cord2,new B.Vector3(.03,0,0),new B.Vector3(0,len,0));const stone=mesh(B.MeshBuilder.CreatePolyhedron('sling-pouch',{type:1,size:.09},scene));stone.position.y=len;stone.material=material('sling-stone','#7b7867');
 }else if(cfg.shape==='gun'){
  box('rifle-body',.15,.16,.35,0,.12,.15,material('rifle','#3b5259'));box('rifle-grip',.09,.23,.09,0,-.035,0,leather);box('rifle-stock',.13,.17,.08,0,.12,-.02,leather);const barrel=segment('rifle-barrel',steel);barrel.scaling.x=barrel.scaling.z=4;setSegment(barrel,new B.Vector3(0,.12,.32),new B.Vector3(0,.12,.56));box('rifle-sight',.04,.05,.08,0,.23,.24,gold);
 }else if(cfg.shape==='reins'){
  box('rein-grip',.06,.07,.07,0,0,0,leather);reins=[segment('right-rein',leather,null),segment('left-rein',leather,null)];
 }
 const mount=attachments.attach(root,{socket:cfg.socket,...cfg.grip});let shield=null,shieldMount=null;if(cfg.shield){shield=extrudedEquipment(runtime,'shield:'+u.id,[[-.31,.40],[.31,.40],[.34,-.08],[0,-.48],[-.34,-.08]],.10,material('shield-'+u.side,u.side?'#a13e36':'#285f96'));shieldMount=attachments.attach(shield,cfg.shield);}
 function update(state){const frame=warWeaponFrame(state,state.attack?.progress??0,state.weaponOverride||override),live=frame.config.grip;mount.parent=attachments.anchors.get(frame.config.socket);mount.position.set(...live.position);mount.rotationQuaternion=B.Quaternion.FromEulerAngles(...live.rotation);mount.scaling.setAll(live.scale??1);root.position.set(...live.pivot.map(v=>-v));if(shieldMount)shieldMount.parent=attachments.anchors.get(frame.config.shield.socket);if(strings){const center=new B.Vector3(0,0,-.02-(frame.config.drawLength||.30)*frame.draw);setSegment(strings[0],new B.Vector3(0,.63,.08),center);setSegment(strings[1],center,new B.Vector3(0,-.63,.08));nocked.setEnabled(state.alive!==false&&!!state.attack&&state.attack.progress<.48);nocked.position.z=center.z;nocked.scaling.z=(.35-center.z)/.68;}
  if(reins){const end=B.Vector3.TransformCoordinates(new B.Vector3(0,1.05,.48),B.Matrix.RotationY(state.angle||0)).add(new B.Vector3(state.x||0,0,state.z||0));setSegment(reins[0],attachments.point('right'),end.add(new B.Vector3(.08,0,0)));setSegment(reins[1],attachments.point('left'),end.add(new B.Vector3(-.08,0,0)));}
  const opacity=Math.max(0,frame.opacity);for(const parent of [root,shield])if(parent)for(const m of [parent,...parent.getDescendants()])if(m.getTotalVertices)m.visibility=opacity;for(const m of reins||[])m.visibility=opacity;return frame;
 }
 return{root,mount,shield,attachments,config:cfg,update,dispose(){for(const m of reins||[])m.dispose();attachments.dispose();}};
}
