// Reproducible upgrade of our original CC0 soldier: real wrists and corrected elbows.
// Rest geometry is preserved by recomputing inverse bind matrices and hand weights.
import fs from 'node:fs';
const path='dist/assets/wars3d/soldier.glb',file=fs.readFileSync(path),jsonLength=file.readUInt32LE(12),g=JSON.parse(file.subarray(20,20+jsonLength).toString()),bin=Buffer.from(file.subarray(28+jsonLength));
if(g.nodes.some(n=>n.name==='handR')){console.log('Soldier already has wrist joints.');process.exit(0);}
const formats={5126:['readFloatLE','writeFloatLE',4],5123:['readUInt16LE','writeUInt16LE',2],5121:['readUInt8','writeUInt8',1]},sizes={VEC3:3,VEC4:4};
function accessor(index){const a=g.accessors[index],view=g.bufferViews[a.bufferView],[read,write,size]=formats[a.componentType],count=sizes[a.type],offset=(view.byteOffset||0)+(a.byteOffset||0),stride=view.byteStride||count*size;return{get(i){return Array.from({length:count},(_,k)=>bin[read](offset+i*stride+k*size));},set(i,k,value){bin[write](value,offset+i*stride+k*size);},count:a.count};}
for(const side of ['L','R']){
 const fore=g.nodes.findIndex(n=>n.name==='fore'+side),node=g.nodes[fore];node.translation[1]=-.2;
 const hand=g.nodes.length;g.nodes.push({name:'hand'+side,translation:[0,-.21,0]});node.children=[...(node.children||[]),hand];const joint=g.skins[0].joints.length;g.skins[0].joints.push(hand);
 const oldJoint=g.skins[0].joints.indexOf(fore);
 for(const mesh of g.meshes)for(const p of mesh.primitives){if(g.materials[p.material].name!=='skin')continue;const pos=accessor(p.attributes.POSITION),joints=accessor(p.attributes.JOINTS_0),parents=new Map(),keys=[];const key=v=>v.map(x=>x.toFixed(4)).join(',');for(let i=0;i<pos.count;i++)if(joints.get(i)[0]===oldJoint){const k=key(pos.get(i));parents.set(k,k);keys[i]=k;}
  const root=k=>{while(parents.get(k)!==k)k=parents.get(k);return k;};for(let i=0;i<pos.count;i+=3){const row=[keys[i],keys[i+1],keys[i+2]].filter(Boolean);for(const k of row.slice(1))parents.set(root(k),root(row[0]));}
  const ranges=new Map();for(let i=0;i<keys.length;i++)if(keys[i]){const k=root(keys[i]),y=pos.get(i)[1],r=ranges.get(k)||[Infinity,-Infinity];r[0]=Math.min(r[0],y);r[1]=Math.max(r[1],y);ranges.set(k,r);}
  for(let i=0;i<keys.length;i++)if(keys[i]){const [min,max]=ranges.get(root(keys[i]));if(min<.91&&max<.971)joints.set(i,0,joint);}
 }
}
const parent=new Map();g.nodes.forEach((n,i)=>n.children?.forEach(c=>parent.set(c,i)));const world=i=>{const t=[...(g.nodes[i].translation||[0,0,0])];if(parent.has(i)){const p=world(parent.get(i));for(let k=0;k<3;k++)t[k]+=p[k];}return t;};
const ibm=Buffer.alloc(g.skins[0].joints.length*64);g.skins[0].joints.forEach((n,i)=>{for(let k=0;k<16;k++)ibm.writeFloatLE(k%5===0?1:0,i*64+k*4);world(n).forEach((v,k)=>ibm.writeFloatLE(-v,i*64+(12+k)*4));});
const view=g.bufferViews.length;g.bufferViews.push({buffer:0,byteOffset:bin.length,byteLength:ibm.length});const acc=g.accessors.length;g.accessors.push({bufferView:view,componentType:5126,count:g.skins[0].joints.length,type:'MAT4'});g.skins[0].inverseBindMatrices=acc;const binary=Buffer.concat([bin,ibm]);g.buffers[0].byteLength=binary.length;const json=Buffer.from(JSON.stringify(g));const jsonPadded=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]),header=Buffer.alloc(20),binaryHeader=Buffer.alloc(8);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+jsonPadded.length+binary.length,8);header.writeUInt32LE(jsonPadded.length,12);header.writeUInt32LE(0x4e4f534a,16);binaryHeader.writeUInt32LE(binary.length);binaryHeader.writeUInt32LE(0x004e4942,4);fs.writeFileSync(path,Buffer.concat([header,jsonPadded,binaryHeader,binary]));console.log('Upgraded soldier to 14 joints, corrected elbow pivots and independently weighted palms/thumbs.');
