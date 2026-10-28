import {staticCollider} from './3d/physics.js';

// Wobbly Wars art direction only. These colors/scenery do not alter collision maps.
export const WAR_LIGHTING=Object.freeze({ambient:.62,sun:1.02});
export const WAR_ENVIRONMENTS=Object.freeze([
 {name:'Grassy Kingdom',biome:'meadow',ground:'#4e813e',soil:'#56432c',surround:'#345a33',path:'#b79460',rock:'#69735a',wall:'#777d69',sky:'#83b8ce',foliage:'#28583b',detail:['#628e45','#426e36','#78994a']},
 {name:'Desert Battlefield',biome:'desert',ground:'#bb853f',soil:'#794d2c',surround:'#965e32',path:'#d1a660',rock:'#925a39',wall:'#9e6942',sky:'#72acc2',foliage:'#456b3e',detail:['#ca984e','#a97538','#d3a560']},
 {name:'Snowy Valley',biome:'snow',ground:'#bdcfd5',soil:'#435b65',surround:'#5e7c89',path:'#7e9ca8',rock:'#526c7a',wall:'#6d8e9c',sky:'#81a9c3',foliage:'#244c42',detail:['#d2dfe0','#a7bdc9','#91afbd']},
 {name:'Castle Courtyard',biome:'courtyard',ground:'#788465',soil:'#4b5144',surround:'#3f6243',path:'#a58d67',rock:'#606b60',wall:'#65756b',sky:'#88b4c8',foliage:'#30553d',detail:['#879071','#64745d','#95967b']},
 {name:'Pirate Island',biome:'coast',ground:'#be9d58',soil:'#7d5b35',surround:'#216d7e',path:'#dcc082',rock:'#6a7c68',wall:'#847351',sky:'#72bdcf',foliage:'#2e6a41',detail:['#cca96b','#af914d','#d4b97b']},
 {name:'Fantasy Forest',biome:'forest',ground:'#376943',soil:'#3c3929',surround:'#234a36',path:'#8d7650',rock:'#53674d',wall:'#61705a',sky:'#67978f',foliage:'#214c37',detail:['#487c49','#315a3b','#5c874c']},
 {name:'Volcanic Arena',biome:'volcano',ground:'#453f42',soil:'#292c30',surround:'#723d2b',path:'#846448',rock:'#35373b',wall:'#5c4c46',sky:'#9d7b77',foliage:'#c36835',detail:['#56474a','#393a3d','#6a4d43']},
 {name:'Futuristic City',biome:'city',ground:'#445e68',soil:'#2b3d49',surround:'#263f4d',path:'#7e9698',rock:'#526774',wall:'#566e7c',sky:'#789fb4',foliage:'#2d806e',detail:['#506c75','#3d535f','#5e7c80']},
 {name:'Floating Islands',biome:'highlands',ground:'#608b58',soil:'#64604d',surround:'#426f85',path:'#b09a70',rock:'#718477',wall:'#7f8c7c',sky:'#87bacc',foliage:'#305e49',detail:['#739b64','#4d7b50','#8aab72']},
 {name:'Training Grounds',biome:'training',ground:'#6d8647',soil:'#5e4c31',surround:'#455f34',path:'#b19664',rock:'#6a7250',wall:'#81765a',sky:'#89b2c4',foliage:'#365a36',detail:['#7c9554','#5d783e','#939d5d']}
].map(theme=>Object.freeze({...theme,detail:Object.freeze(theme.detail)})));

export function createWarEnvironment(runtime,model,mat){
 const {B,scene}=runtime,t=WAR_ENVIRONMENTS[model.field]||WAR_ENVIRONMENTS[0];
 scene.clearColor=B.Color4.FromHexString(t.sky+'ff');scene.fogMode=B.Scene.FOGMODE_EXP;scene.fogDensity=.0018;scene.fogColor=B.Color3.FromHexString(t.sky);
 const box=(name,w,h,d,x,y,z,material,layer)=>{const m=B.MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene);m.position.set(x,y,z);m.material=material;m.receiveShadows=true;if(layer!==undefined)m.metadata={softwareLayer:layer};return m;};
 const ground=box('battlefield',24,.65,14,0,-.325,0,mat('terrain',t.ground),-20);staticCollider(runtime,ground);
 box('island-base',24.4,.8,14.4,0,-.9,0,mat('earth',t.soil),-20);
 // Tiled ground also survives near-plane clipping in the compatibility renderer.
 const surround=B.MeshBuilder.CreateGround('surround-source',{width:16,height:16},scene);surround.metadata={softwareLayer:-30};surround.material=mat('surround',t.surround);surround.setEnabled(false);
 for(let i=0;i<16;i++){const p=surround.clone('surround'+i);p.setEnabled(true);p.position.set(-24+(i%4)*16,-1.4,-24+Math.floor(i/4)*16);}
 // Replace overlapping coplanar discs with four disjoint batches of terrain triangles.
 // The collider retains its box bounds; only the redundant visible top face is removed.
 ground.metadata.softwareLayer=-21;scene.getMeshByName('island-base').metadata.softwareLayer=-22;
 const normals=ground.getVerticesData(B.VertexBuffer.NormalKind),oldIndices=ground.getIndices(),sideIndices=[];
 for(let i=0;i<oldIndices.length;i+=3)if(normals[oldIndices[i]*3+1]<.5)sideIndices.push(...oldIndices.slice(i,i+3));ground.setIndices(sideIndices);
 const batches=Array.from({length:4},()=>({positions:[],indices:[],normals:[]})),terrainPoint=(x,z)=>[-12+x*2+(x>0&&x<12?Math.sin(x*17+z*31)*.35:0),0,-7+z*2+(z>0&&z<7?Math.sin(x*29-z*13)*.35:0)];
 for(let z=0;z<7;z++)for(let x=0;x<12;x++){const color=Math.max(0,Math.min(3,Math.floor((Math.sin(x*.61)+Math.cos(z*.83)+Math.sin((x+z)*.9)+3)/6*4))),data=batches[color],at=data.positions.length/3,x0=-12+x*2,z0=-7+z*2;data.positions.push(...terrainPoint(x,z),...terrainPoint(x+1,z),...terrainPoint(x+1,z+1),...terrainPoint(x,z+1));data.normals.push(0,1,0,0,1,0,0,1,0,0,1,0);data.indices.push(at,at+1,at+2,at,at+2,at+3);}
 batches.forEach((data,i)=>{const mesh=new B.Mesh('terrain-surface'+i,scene),vd=new B.VertexData();Object.assign(vd,data);vd.applyToMesh(mesh);mesh.material=mat('terrain-detail'+i,[t.ground,...t.detail][i]);mesh.receiveShadows=true;mesh.metadata={softwareLayer:-20};mesh.isPickable=false;});
 const stone=B.MeshBuilder.CreatePolyhedron('stone-source',{type:1,size:1},scene);stone.material=mat('rock',t.rock);stone.setEnabled(false);
 for(let i=0;i<18;i++){const p=stone.clone('edge-rock'+i);p.setEnabled(true);p.position.set(-17+(i*7.31)%34,-.7,i%2?-10.5:10.5);p.scaling.set(.45+i%3*.25,.6+i%4*.25,.55+i%2*.4);p.rotation.y=i;}
 const tile=B.MeshBuilder.CreateBox('path-source',{width:1.4,height:.012,depth:.9},scene);tile.material=mat('path',t.path);tile.material.zOffset=-1;tile.metadata={softwareLayer:-10};tile.setEnabled(false);
 for(let i=0;i<28;i++){const p=tile.clone('path-tile'+i);p.setEnabled(true);p.position.set(-10.8+(i%14)*1.65,.012,(i<14?-1:1)*.72);p.rotation.y=Math.sin(i)*.1;}
 for(const o of model.obstacles){const wall=box('solid-obstacle',o.w,2.15,o.d,o.x,1.075,o.z,mat('wall',t.wall));runtime.shadows?.addShadowCaster(wall);staticCollider(runtime,wall);box('wall-cap',o.w+.16,.15,o.d+.16,o.x,2.2,o.z,mat('wall-cap',t.path));}
 const trees=['meadow','snow','courtyard','forest','highlands','training'].includes(t.biome);
 for(let i=0;i<12;i++){
  const x=-16+(i%6)*6.25,z=i<6?-10.8:11.2,y=-1.4;
  if(trees||t.biome==='coast'){
   const trunk=B.MeshBuilder.CreateCylinder('scenery-trunk',{height:2.1,diameter:.28,tessellation:5},scene);trunk.position.set(x,y+1.05,z);trunk.material=mat('bark','#65462f');
   for(let j=0;j<2;j++){const crown=B.MeshBuilder.CreateCylinder('scenery-canopy',{height:2.1,diameterBottom:2.5-j*.55,diameterTop:0,tessellation:t.biome==='coast'?5:7},scene);crown.position.set(x,y+2.2+j*.9,z);crown.material=mat(j?'leaf-light':'leaf-dark',j?B.Color3.FromHexString(t.foliage).scale(1.35).toHexString():t.foliage);runtime.shadows?.addShadowCaster(crown);}
   if(t.biome==='snow'){const snow=B.MeshBuilder.CreateCylinder('snow-crown',{height:.95,diameterBottom:.9,diameterTop:0,tessellation:7},scene);snow.position.set(x,y+3.7,z);snow.material=mat('snow','#d7e3e4');}
  }else if(t.biome==='desert'){
   box('cactus-stem',.42,1.6,.42,x,y+.8,z,mat('cactus',t.foliage));box('cactus-arm',1,.25,.3,x+.3,y+.9,z,mat('cactus',t.foliage));box('cactus-tip',.25,.7,.3,x+.7,y+1.13,z,mat('cactus',t.foliage));
  }else if(t.biome==='city'){
   const tower=box('distant-tower',1.8,2.7+i%3,1.7,x,y+(2.7+i%3)/2,z,mat('tower',i%2?'#344b58':'#3e5a65'));box('tower-window',1.3,.14,1.75,x,y+1.5,z,mat('city-glow','#479f9a',.18));runtime.shadows?.addShadowCaster(tower);
  }
 }
 if(['coast','highlands','volcano'].includes(t.biome))for(let i=0;i<10;i++)box('surround-accent',3.2,.02,.16,-15+(i%5)*7,-1.37,i<5?-13:13,mat('surround-accent',t.biome==='volcano'?'#cb642b':t.biome==='coast'?'#4d9b9a':'#81b5c4',t.biome==='volcano'?.15:0),-29);
 for(const side of [0,1]){const pole=B.MeshBuilder.CreateCylinder('flagpole',{height:3.8,diameter:.1,tessellation:8},scene);pole.position.set(side?11.3:-11.3,1.9,-5.8);pole.material=mat('pole','#76563c');box('army-banner',1.25,.65,.035,side?10.7:-10.7,3.2,-5.8,mat('team'+side,side?'#d44f3d':'#287ac3'));}
 const zoneMeshes=[];for(const side of [0,1]){const zone=B.MeshBuilder.CreateGround('deployment-zone',{width:9.6,height:12.6},scene);zone.position.set(side?6.3:-6.3,.05,0);zone.metadata={softwareLayer:-9};zone.material=mat('zone'+side,side?'#d8654e':'#4298d1');zone.material.alpha=.09;zone.material.zOffset=-2;zone.material.disableDepthWrite=true;zoneMeshes.push(zone);}
 return{theme:t,zoneMeshes};
}
