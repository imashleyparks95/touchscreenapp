import {createBoneAttachments} from './3d/attachments.js';
// Game-owned costume details. Imported rigs, wrist sockets and combat shapes stay intact.
export function createWarCostume({B,scene},actor,unit,material){
 const meshes=[],cloaked=['knight','guard','wizard','ice','fire','healer','banner'].includes(unit.type);
 let cape=null,rest=null,clock=0,attachments=null,scarf=null,scarfRest=null,core=null;
 const accessory=['archer','slinger','scout','robot'].includes(unit.type);
 if(cloaked||accessory)attachments=createBoneAttachments({B,scene},{skeleton:actor.skel,mesh:actor.meshes[0],sockets:{back:{bone:'spine'}}});
 const attach=(mesh,position=[0,0,0])=>{mesh.isPickable=false;mesh.receiveShadows=true;attachments.attach(mesh,{socket:'back',position});meshes.push(mesh);return mesh;};
 if(cloaked){
  cape=new B.Mesh('class-cape-'+unit.id,scene);
  const data=new B.VertexData();
  // The cape lives behind the torso; its bottom is wider with a notched hem.
  rest=[-.23,.14,-.23, 0,.14,-.23, .23,.14,-.23, -.26,-.14,-.26, 0,-.16,-.27, .26,-.14,-.26, -.29,-.35,-.29, 0,-.46,-.30, .29,-.35,-.29];
  data.positions=[...rest];data.indices=[0,3,4,0,4,1,1,4,5,1,5,2,3,6,7,3,7,4,4,7,8,4,8,5];data.colors=Array.from({length:9},(_,i)=>i>=6?[1,.85,.62,1]:i===4?[.72,.78,.88,1]:[1,1,1,1]).flat();data.normals=[];B.VertexData.ComputeNormals(data.positions,data.indices,data.normals);data.applyToMesh(cape,true);
  const colors={wizard:'#76618f',ice:'#6595ac',fire:'#a8583d',healer:'#66875a'};
  cape.material=material('cape-'+unit.type+'-'+unit.side,colors[unit.type]||(unit.side?'#a84d45':'#3b709c'));
  cape.material.backFaceCulling=false;cape.material.twoSidedLighting=true;cape.material.emissiveColor=cape.material.diffuseColor.scale(.08);cape.isPickable=false;cape.receiveShadows=true;
  attachments.attach(cape,{socket:'back'});meshes.push(cape);
  // One low-poly crest follows the real spine; hand and weapon offsets stay intact.
  const crest=new B.Mesh('class-crest-'+unit.id,scene),v=new B.VertexData();
  v.positions=[-.12,-.02,.29, 0,.12,.29, .12,-.02,.29, 0,-.20,.29, -.07,-.02,.295, 0,.065,.295, .07,-.02,.295, 0,-.13,.295, 0,-.03,.30];
  v.indices=[];for(let i=0;i<4;i++){const j=(i+1)%4;v.indices.push(i,j,4+j,i,4+j,4+i,4+i,4+j,8);}
  const jewel={wizard:[.65,.48,.84],ice:[.38,.77,.92],fire:[.88,.32,.17],healer:[.32,.70,.42],banner:[.91,.73,.28]}[unit.type]||(unit.side?[.8,.27,.22]:[.22,.52,.81]);
  v.colors=Array.from({length:9},(_,i)=>i<4?[.92,.76,.4,1]:[...jewel,1]).flat();v.normals=[];B.VertexData.ComputeNormals(v.positions,v.indices,v.normals);v.applyToMesh(crest);
  crest.material=material('crest-enamel','#ddc48c');crest.material.backFaceCulling=false;crest.isPickable=false;attachments.attach(crest,{socket:'back'});meshes.push(crest);
 }
 // Class silhouettes use the real spine, leaving palms, weapons and collision untouched.
 if(unit.type==='archer'){
  const tube=B.MeshBuilder.CreateCylinder('class-quiver-'+unit.id,{height:.62,diameterTop:.20,diameterBottom:.16,tessellation:7},scene);tube.material=material('quiver-leather','#6f4932');attach(tube,[.20,.10,-.32]);tube.parent.rotation.z=-.22;
  const arrows=new B.Mesh('stored-arrows-'+unit.id,scene),v=new B.VertexData();v.positions=[];v.indices=[];for(let i=0;i<3;i++){const x=.18+i*.055,y=.68+(i%2)*.07,z=-.32,at=v.positions.length/3;v.positions.push(x-.008,y-.55,z,x+.008,y-.55,z,x+.008,y+.10,z,x-.008,y+.10,z,x-.04,y+.12,z,x,y+.18,z,x+.04,y+.12,z);v.indices.push(at,at+1,at+2,at,at+2,at+3,at+4,at+5,at+6);}v.normals=[];B.VertexData.ComputeNormals(v.positions,v.indices,v.normals);v.applyToMesh(arrows);arrows.material=material('stored-fletching','#dbcaa0');arrows.material.backFaceCulling=false;attach(arrows);
 }
 if(unit.type==='slinger'){
  const pouch=B.MeshBuilder.CreateBox('class-pouch-'+unit.id,{width:.23,height:.25,depth:.15},scene);pouch.material=material('pouch-leather','#825839');attach(pouch,[.20,-.25,-.24]);
  const clasp=B.MeshBuilder.CreateBox('pouch-clasp-'+unit.id,{width:.07,height:.09,depth:.02},scene);clasp.material=material('pouch-clasp','#ddbb79');attach(clasp,[.20,-.23,-.325]);
 }
 if(unit.type==='scout'){
  scarf=new B.Mesh('class-scarf-'+unit.id,scene);const v=new B.VertexData();scarfRest=[-.10,.09,-.25,.11,.09,-.25,.10,-.04,-.28,-.05,-.09,-.28,.07,-.22,-.34,.20,-.31,-.36,.18,-.10,-.30];v.positions=[...scarfRest];v.indices=[0,1,2,0,2,3,2,4,5,2,5,6];v.normals=[];B.VertexData.ComputeNormals(v.positions,v.indices,v.normals);v.applyToMesh(scarf,true);scarf.material=material('scout-scarf-'+unit.side,unit.side?'#bb6652':'#76a5b0');scarf.material.backFaceCulling=false;attach(scarf);
 }
 if(unit.type==='robot'){
  const plate=B.MeshBuilder.CreateBox('ranger-panel-'+unit.id,{width:.24,height:.28,depth:.055},scene);plate.material=material('ranger-plate','#485d68');attach(plate,[0,-.02,.26]);
  core=B.MeshBuilder.CreatePolyhedron('ranger-core-'+unit.id,{type:1,size:.09},scene);core.material=material('ranger-core','#83c5c5',.15);attach(core,[0,-.01,.32]);
 }
 // Distinct metallic highlights preserve the authored toy-soldier forms.
 for(const mesh of actor.meshes){const m=mesh.material;if(!m)continue;if(m.name==='steel')m.roughness=.42;if(m.name==='gold')m.roughness=.32;}
 return{meshes,attachments,update(unit,dt){clock+=Math.max(0,dt);const moving=unit.state==='walk'||unit.state==='run';if(cape&&dt>0){const positions=[...rest];if(!unit.reduceMotion)for(const i of [3,4,5,6,7,8])positions[i*3+2]-=(moving?.05:.012)*Math.sin(clock*(moving?7:2)+i*.4);cape.updateVerticesData(B.VertexBuffer.PositionKind,positions);}if(scarf&&dt>0){const positions=[...scarfRest];if(!unit.reduceMotion)for(const i of [4,5,6])positions[i*3+2]-=Math.sin(clock*(moving?8:2)+i)*.035;scarf.updateVerticesData(B.VertexBuffer.PositionKind,positions);}if(core&&dt>0)core.scaling.setAll(unit.reduceMotion?1:1+Math.sin(clock*3)*.07);for(const m of meshes)m.visibility=unit.opacity??1;},dispose(){attachments?.dispose();for(const m of meshes)m.dispose();}};
}
