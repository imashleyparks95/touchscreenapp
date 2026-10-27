// Original CC0 soldier art revision: match anatomical reach to the broad torso.
// Stretches the existing sleeve/forearm geometry, retains wrists/weights/materials,
// and recomputes bind matrices. No runtime bone scaling or socket displacement.
import fs from 'node:fs';
const path='dist/assets/wars3d/soldier.glb',file=fs.readFileSync(path),n=file.readUInt32LE(12),g=JSON.parse(file.subarray(20,20+n)),bin=Buffer.from(file.subarray(28+n));
if(g.asset.extras?.armReach===2){console.log('Soldier arm reach already fitted.');process.exit(0);}
if(!g.nodes.some(n=>n.name==='handR'))throw Error('Run upgrade-wars-hands.mjs first');
const formats={5126:['readFloatLE','writeFloatLE',4],5123:['readUInt16LE','writeUInt16LE',2]},sizes={VEC3:3,VEC4:4,MAT4:16};
function accessor(index){const a=g.accessors[index],v=g.bufferViews[a.bufferView],[read,write,size]=formats[a.componentType],len=sizes[a.type],offset=(v.byteOffset||0)+(a.byteOffset||0),stride=v.byteStride||len*size;return{a,get(i){return Array.from({length:len},(_,k)=>bin[read](offset+i*stride+k*size));},set(i,k,value){bin[write](value,offset+i*stride+k*size);},count:a.count};}
for(const mesh of g.meshes)for(const p of mesh.primitives){const pos=accessor(p.attributes.POSITION),normals=accessor(p.attributes.NORMAL),j=accessor(p.attributes.JOINTS_0);for(let i=0;i<pos.count;i++){
 const name=g.nodes[g.skins[0].joints[j.get(i)[0]]].name,v=pos.get(i);let stretch=1;
 if(name.startsWith('hand'))v[1]-=.16;
 else if(name.startsWith('fore')){stretch=.29/.21;v[1]=1.07+(v[1]-1.15)*stretch;}
 else if(name.startsWith('arm')&&v[1]<1.29){stretch=.22/.14;v[1]=1.29+(v[1]-1.29)*stretch;}
 else continue;
 for(let k=0;k<3;k++)pos.set(i,k,v[k]);const normal=normals.get(i);normal[1]/=stretch;const len=Math.hypot(...normal);normal.forEach((v,k)=>normals.set(i,k,v/len));
 }
 const rows=Array.from({length:pos.count},(_,i)=>pos.get(i));pos.a.min=[0,1,2].map(k=>Math.min(...rows.map(r=>r[k])));pos.a.max=[0,1,2].map(k=>Math.max(...rows.map(r=>r[k])));
}
for(const side of ['L','R']){g.nodes.find(n=>n.name==='fore'+side).translation[1]=-.28;g.nodes.find(n=>n.name==='hand'+side).translation[1]=-.29;}
const parent=new Map();g.nodes.forEach((n,i)=>n.children?.forEach(c=>parent.set(c,i)));function world(i){const p=[...(g.nodes[i].translation||[0,0,0])];if(parent.has(i)){const up=world(parent.get(i));p.forEach((_,k)=>p[k]+=up[k]);}return p;}
const ibm=accessor(g.skins[0].inverseBindMatrices);g.skins[0].joints.forEach((n,i)=>{for(let k=0;k<16;k++)ibm.set(i,k,k%5===0?1:0);world(n).forEach((v,k)=>ibm.set(i,12+k,-v));});g.asset.extras={...g.asset.extras,armReach:2};
const json=Buffer.from(JSON.stringify(g)),padded=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]),header=Buffer.alloc(20),bh=Buffer.alloc(8);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+padded.length+bin.length,8);header.writeUInt32LE(padded.length,12);header.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(bin.length);bh.writeUInt32LE(0x004e4942,4);fs.writeFileSync(path,Buffer.concat([header,padded,bh,bin]));console.log('Fitted sleeve/elbow/forearm geometry to .283m upper arms + .29m forearms; rebuilt bind matrices.');
