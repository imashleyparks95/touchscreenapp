import {createBoneAttachments} from './3d/attachments.js';
// Game-owned costume details. Imported rigs, wrist sockets and combat shapes stay intact.
export function createWarCostume({B,scene},actor,unit,material){
 const meshes=[],cloaked=['knight','guard','wizard','ice','fire','healer','banner'].includes(unit.type);
 let cape=null,rest=null,clock=0,attachments=null;
 if(cloaked){
  cape=new B.Mesh('class-cape-'+unit.id,scene);
  const data=new B.VertexData();
  // The cape lives behind the torso; its bottom is wider with a notched hem.
  rest=[-.23,.14,-.23, 0,.14,-.23, .23,.14,-.23, -.26,-.14,-.26, 0,-.16,-.27, .26,-.14,-.26, -.29,-.35,-.29, 0,-.46,-.30, .29,-.35,-.29];
  data.positions=[...rest];data.indices=[0,3,4,0,4,1,1,4,5,1,5,2,3,6,7,3,7,4,4,7,8,4,8,5];data.colors=Array.from({length:9},(_,i)=>i>=6?[1,.85,.62,1]:i===4?[.72,.78,.88,1]:[1,1,1,1]).flat();data.normals=[];B.VertexData.ComputeNormals(data.positions,data.indices,data.normals);data.applyToMesh(cape,true);
  const colors={wizard:'#76618f',ice:'#6595ac',fire:'#a8583d',healer:'#66875a'};
  cape.material=material('cape-'+unit.type+'-'+unit.side,colors[unit.type]||(unit.side?'#a84d45':'#3b709c'));
  cape.material.backFaceCulling=false;cape.material.twoSidedLighting=true;cape.material.emissiveColor=cape.material.diffuseColor.scale(.08);cape.isPickable=false;cape.receiveShadows=true;
  attachments=createBoneAttachments({B,scene},{skeleton:actor.skel,mesh:actor.meshes[0],sockets:{back:{bone:'spine'}}});
  attachments.attach(cape,{socket:'back'});meshes.push(cape);
  // One low-poly crest follows the real spine; hand and weapon offsets stay intact.
  const crest=new B.Mesh('class-crest-'+unit.id,scene),v=new B.VertexData();
  v.positions=[-.12,-.02,.29, 0,.12,.29, .12,-.02,.29, 0,-.20,.29, -.07,-.02,.295, 0,.065,.295, .07,-.02,.295, 0,-.13,.295, 0,-.03,.30];
  v.indices=[];for(let i=0;i<4;i++){const j=(i+1)%4;v.indices.push(i,j,4+j,i,4+j,4+i,4+i,4+j,8);}
  const jewel={wizard:[.65,.48,.84],ice:[.38,.77,.92],fire:[.88,.32,.17],healer:[.32,.70,.42],banner:[.91,.73,.28]}[unit.type]||(unit.side?[.8,.27,.22]:[.22,.52,.81]);
  v.colors=Array.from({length:9},(_,i)=>i<4?[.92,.76,.4,1]:[...jewel,1]).flat();v.normals=[];B.VertexData.ComputeNormals(v.positions,v.indices,v.normals);v.applyToMesh(crest);
  crest.material=material('crest-enamel','#ddc48c');crest.material.backFaceCulling=false;crest.isPickable=false;attachments.attach(crest,{socket:'back'});meshes.push(crest);
 }
 // Distinct metallic highlights preserve the authored toy-soldier forms.
 for(const mesh of actor.meshes){const m=mesh.material;if(!m)continue;if(m.name==='steel')m.roughness=.42;if(m.name==='gold')m.roughness=.32;}
 return{meshes,attachments,update(unit,dt){clock+=Math.max(0,dt);if(cape){const positions=[...rest],moving=unit.state==='walk'||unit.state==='run';for(const i of [3,4,5,6,7,8])positions[i*3+2]-=(moving?.05:.012)*Math.sin(clock*(moving?7:2)+i*.4);if(dt>0)cape.updateVerticesData(B.VertexBuffer.PositionKind,positions);for(const m of meshes)m.visibility=unit.opacity??1;}},dispose(){attachments?.dispose();for(const m of meshes)m.dispose();}};
}
