#!/usr/bin/env node
/** Original CC0 utility. Requires meshoptimizer 1.3.0: npm install meshoptimizer@1.3.0
 * Run: node generate_tree_lod.mjs [source-ready-directory] [output-directory]
 * Uses static original Quaternius CC0 trees, preserves materials and embedded textures.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
import {MeshoptSimplifier} from 'meshoptimizer';
await MeshoptSimplifier.ready;
const here=path.dirname(fileURLToPath(import.meta.url));
const source=path.resolve(process.argv[2]||path.join(here,'../ready'));
const output=path.resolve(process.argv[3]||here);fs.mkdirSync(output,{recursive:true});
const jobs=[['BirchTree_1',300,900],['BirchTree_2',350,1100],['MapleTree_1',300,700],['MapleTree_3',400,1000]];
const reports=[];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function foliageGroups(indices,pos){
 // Preserve whole connected cards when distributing canopy retention budgets.
 const n=pos.length/3,parent=new Int32Array(n);for(let i=0;i<n;i++)parent[i]=i;
 const root=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i];}return i;};
 const join=(a,b)=>{a=root(a);b=root(b);if(a!==b)parent[b]=a;};
 for(let i=0;i<indices.length;i+=3){join(indices[i],indices[i+1]);join(indices[i],indices[i+2]);}
 const groups=new Map();for(let i=0;i<indices.length;i+=3){const key=root(indices[i]);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(indices[i],indices[i+1],indices[i+2]);}
 const cards=Array.from(groups.values());const centers=cards.map(ids=>{const unique=Array.from(new Set(ids));return [0,1,2].map(c=>unique.reduce((s,i)=>s+pos[i*3+c],0)/unique.length);});
 const count=Math.min(8,centers.length);const distance=(a,b)=>a.reduce((s,x,c)=>s+(x-b[c])**2,0);const seeds=[centers[0].slice()];
 while(seeds.length<count){let best=0,bestD=-1;for(let i=0;i<centers.length;i++){const ds=Math.min(...seeds.map(s=>distance(s,centers[i])));if(ds>bestD){bestD=ds;best=i;}}seeds.push(centers[best].slice());}
 let assignments=[];
 for(let step=0;step<20;step++){
  assignments=centers.map(c=>{let best=0;for(let k=1;k<count;k++)if(distance(c,seeds[k])<distance(c,seeds[best]))best=k;return best;});
  const totals=seeds.map(()=>[0,0,0]),counts=new Array(count).fill(0);centers.forEach((c,i)=>{const k=assignments[i];counts[k]++;for(let j=0;j<3;j++)totals[k][j]+=c[j];});for(let k=0;k<count;k++)if(counts[k])seeds[k]=totals[k].map(v=>v/counts[k]);
 }
 const result=seeds.map(()=>[]);cards.forEach((card,i)=>result[assignments[i]].push(...card));return result.filter(g=>g.length).map(g=>new Uint32Array(g));
}

for(const[name,barkTarget,leavesTarget]of jobs){
 const original=fs.readFileSync(path.join(source,name+'.glb'));
 if(original.readUInt32LE(0)!==0x46546c67)throw Error('Expected GLB');
 const jl=original.readUInt32LE(12);const d=JSON.parse(original.subarray(20,20+jl).toString());
 const input=original.subarray(28+jl);const oldAccessors=d.accessors,oldViews=d.bufferViews;
 const readAccessor=i=>{const a=oldAccessors[i],v=oldViews[a.bufferView];const stride={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type];const Type={5121:Uint8Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array}[a.componentType];if(v.byteStride)throw Error('Interleaved input unsupported');return new Type(input.buffer,input.byteOffset+(v.byteOffset||0)+(a.byteOffset||0),a.count*stride).slice();};
 const binary=[];let binaryLength=0;d.accessors=[];d.bufferViews=[];
 function append(data,target){const pad=(4-binaryLength%4)%4;if(pad){binary.push(Buffer.alloc(pad));binaryLength+=pad;}const view={buffer:0,byteOffset:binaryLength,byteLength:data.byteLength};if(target)view.target=target;const vi=d.bufferViews.length;d.bufferViews.push(view);binary.push(Buffer.from(data.buffer,data.byteOffset,data.byteLength));binaryLength+=data.byteLength;return vi;}
 function writeAccessor(a,type,componentType,target){const vi=append(a,target);const width={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[type];const acc={bufferView:vi,componentType,count:a.length/width,type};if(type==='VEC3'&&target===34962){acc.min=Array.from({length:3},(_,c)=>{let v=Infinity;for(let k=c;k<a.length;k+=3)v=Math.min(v,a[k]);return v;});acc.max=Array.from({length:3},(_,c)=>{let v=-Infinity;for(let k=c;k<a.length;k+=3)v=Math.max(v,a[k]);return v;});}const ai=d.accessors.length;d.accessors.push(acc);return ai;}
 let before=0,after=0;const primitives=[];
 for(const mesh of d.meshes)for(const primitive of mesh.primitives){
  const pos=readAccessor(primitive.attributes.POSITION);const normal=readAccessor(primitive.attributes.NORMAL);const uv=readAccessor(primitive.attributes.TEXCOORD_0);const indices=new Uint32Array(readAccessor(primitive.indices));
  const mat=d.materials[primitive.material];const foliage=/Leaves/i.test(mat.name)||mat.alphaMode==='MASK'||mat.alphaMode==='BLEND';const target=foliage?leavesTarget:barkTarget;const attributes=new Float32Array(pos.length/3*5);
  for(let i=0;i<pos.length/3;i++){attributes.set(normal.subarray(i*3,i*3+3),i*5);attributes.set(uv.subarray(i*2,i*2+2),i*5+3);}
  // Leaf UVs are strongly weighted so alpha-bearing cards keep recognizable shapes.
  const weights=foliage?[.25,.25,.25,2,2]:[.5,.5,.5,.65,.65];
  const limit=foliage?.15:.08;
  const groups=foliage?foliageGroups(indices,pos):[indices];
  const budgets=groups.map(g=>Math.max(2,Math.floor(target*g.length/indices.length/2)*2));
  let remaining=target-budgets.reduce((s,x)=>s+x,0);for(let k=0;remaining>=2;k=(k+1)%groups.length){budgets[k]+=2;remaining-=2;}
  const parts=[],groupErrors=[];const globalScale=MeshoptSimplifier.getScale(pos,3);
  for(let k=0;k<groups.length;k++){
   const [part,err]=MeshoptSimplifier.simplifyWithAttributes(groups[k],pos,3,attributes,5,weights,null,budgets[k]*3,foliage?limit*globalScale:limit,foliage?['Permissive','Prune','Sparse','ErrorAbsolute']:['Permissive','Prune']);parts.push(part);groupErrors.push(foliage?err/globalScale:err);
  }
  const newIndices=new Uint32Array(parts.reduce((s,p)=>s+p.length,0));let partOffset=0;for(const part of parts){newIndices.set(part,partOffset);partOffset+=part.length;}const error=Math.max(...groupErrors);
  const [remap,count]=MeshoptSimplifier.compactMesh(newIndices);
  const compact=(values,width)=>{const result=new Float32Array(count*width);for(let i=0;i<remap.length;i++)if(remap[i]!==0xffffffff)result.set(values.subarray(i*width,i*width+width),remap[i]*width);return result;};
  const p2=compact(pos,3),n2=compact(normal,3),u2=compact(uv,2);
  primitive.attributes={POSITION:writeAccessor(p2,'VEC3',5126,34962),NORMAL:writeAccessor(n2,'VEC3',5126,34962),TEXCOORD_0:writeAccessor(u2,'VEC2',5126,34962)};
  primitive.indices=writeAccessor(count<65536?new Uint16Array(newIndices):newIndices,'SCALAR',count<65536?5123:5125,34963);
  const r={material:mat.name,foliage,sourceTriangles:indices.length/3,targetTriangles:target,triangles:newIndices.length/3,appearanceErrorRelative:error,errorLimitRelative:limit,uvWeight:foliage?2:.65,vertices:count,spatialGroups:groups.length,groupAppearanceErrors:groupErrors};primitives.push(r);before+=r.sourceTriangles;after+=r.triangles;
 }
 // Keep exact original embedded image bytes, alpha settings and sampler wrapping.
 for(const image of d.images){const v=oldViews[image.bufferView];image.bufferView=append(input.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength));}
 d.buffers=[{byteLength:binaryLength}];const info={source:name+'.glb',sourceTriangles:before,triangles:after,triangleRatio:after/before,method:'meshoptimizer 1.3.0 attribute-aware simplification, separate bark and alpha foliage budgets; foliage retention distributed over eight spatial card clusters',flags:['Permissive','Prune'],foliageFlags:['Permissive','Prune','Sparse','ErrorAbsolute'],primitives};d.asset.extras={...(d.asset.extras||{}),lod:info};d.extras={...(d.extras||{}),lodLevel:1,source:'https://quaternius.com/packs/ultimatestylizednature.html',license:'CC0-1.0'};
 let j=Buffer.from(JSON.stringify(d));const jp=(4-j.length%4)%4;if(jp)j=Buffer.concat([j,Buffer.alloc(jp,32)]);let body=Buffer.concat(binary);const bp=(4-body.length%4)%4;if(bp)body=Buffer.concat([body,Buffer.alloc(bp)]);
 const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(28+j.length+body.length,8);header.writeUInt32LE(j.length,12);header.writeUInt32LE(0x4e4f534a,16);const bheader=Buffer.alloc(8);bheader.writeUInt32LE(body.length,0);bheader.writeUInt32LE(0x004e4942,4);
 const result=Buffer.concat([header,j,bheader,body]);const filename=name+'_LOD.glb';fs.writeFileSync(path.join(output,filename),result);const report={file:filename,bytes:result.length,sha256:sha(result),sourceSha256:sha(original),...info};reports.push(report);console.log(JSON.stringify(report));
}
fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify({license:'CC0-1.0',source:'https://quaternius.com/packs/ultimatestylizednature.html',generator:'generate_tree_lod.mjs',meshoptimizerVersion:'1.3.0',models:reports},null,2)+'\n');
