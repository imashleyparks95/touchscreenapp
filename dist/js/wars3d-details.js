import {createBoneAttachments} from './3d/attachments.js';
// Game-owned costume details. Imported rigs, wrist sockets and combat shapes stay intact.
export function createWarCostume({B,scene},actor,unit,material){
 const meshes=[],cloaked=['knight','guard','wizard','ice','fire','healer','banner'].includes(unit.type);
 let cape=null,rest=null,clock=0,attachments=null;
 if(cloaked){
  cape=new B.Mesh('class-cape-'+unit.id,scene);
  const data=new B.VertexData();
  // The cape lives behind the torso; its bottom is wider with a notched hem.
  rest=[-.23,.14,-.23, .23,.14,-.23, -.29,-.35,-.29, 0,-.46,-.30, .29,-.35,-.29];
  data.positions=[...rest];data.indices=[0,2,3,0,3,1,1,3,4];data.normals=[];B.VertexData.ComputeNormals(data.positions,data.indices,data.normals);data.applyToMesh(cape,true);
  const colors={wizard:'#76618f',ice:'#6595ac',fire:'#a8583d',healer:'#66875a'};
  cape.material=material('cape-'+unit.type+'-'+unit.side,colors[unit.type]||(unit.side?'#a84d45':'#3b709c'));
  cape.material.backFaceCulling=false;cape.material.twoSidedLighting=true;cape.material.emissiveColor=cape.material.diffuseColor.scale(.08);cape.isPickable=false;cape.receiveShadows=true;
  attachments=createBoneAttachments({B,scene},{skeleton:actor.skel,mesh:actor.meshes[0],sockets:{back:{bone:'spine'}}});
  attachments.attach(cape,{socket:'back'});meshes.push(cape);
 }
 // Distinct metallic highlights preserve the authored toy-soldier forms.
 for(const mesh of actor.meshes){const m=mesh.material;if(!m)continue;if(m.name==='steel')m.roughness=.42;if(m.name==='gold')m.roughness=.32;}
 return{meshes,attachments,update(unit,dt){clock+=Math.max(0,dt);if(cape){const positions=[...rest],moving=unit.state==='walk'||unit.state==='run';for(const i of [2,3,4])positions[i*3+2]-=(moving?.05:.012)*Math.sin(clock*(moving?7:2)+i*.4);cape.updateVerticesData(B.VertexBuffer.PositionKind,positions);cape.visibility=unit.opacity??1;}},dispose(){attachments?.dispose();for(const m of meshes)m.dispose();}};
}
