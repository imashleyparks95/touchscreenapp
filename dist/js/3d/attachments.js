/** Engine-independent rig math; metres, right-handed +Y up. Quaternions [x,y,z,w]. */
export const rigAdd=(a,b)=>({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z});
export const rigSub=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
export const rigScale=(a,s)=>({x:a.x*s,y:a.y*s,z:a.z*s});
export const rigDot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
export const rigCross=(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
export const rigLength=a=>Math.hypot(a.x,a.y,a.z);
export const rigNormalize=a=>rigScale(a,1/(rigLength(a)||1));
export const rigVector=a=>({x:a[0],y:a[1],z:a[2]});
export const rigQuatMultiply=(a,b)=>[a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]];
export const rigQuatInverse=q=>[-q[0],-q[1],-q[2],q[3]];
export function rigRotate(q,v){const t=rigScale(rigCross({x:q[0],y:q[1],z:q[2]},v),2);return rigAdd(v,rigAdd(rigScale(t,q[3]),rigCross({x:q[0],y:q[1],z:q[2]},t)));}
export function rigEuler(x=0,y=0,z=0){const a=x/2,b=y/2,c=z/2,sx=Math.sin(a),cx=Math.cos(a),sy=Math.sin(b),cy=Math.cos(b),sz=Math.sin(c),cz=Math.cos(c);return[sx*cy*cz+cx*sy*sz,cx*sy*cz-sx*cy*sz,cx*cy*sz-sx*sy*cz,cx*cy*cz+sx*sy*sz];}
export function rigFromTo(from,to){const a=rigNormalize(from),b=rigNormalize(to),d=rigDot(a,b);if(d<-.999999){const axis=rigNormalize(rigCross(a,Math.abs(a.x)<.8?{x:1,y:0,z:0}:{x:0,y:1,z:0}));return[axis.x,axis.y,axis.z,0];}const c=rigCross(a,b),q=[c.x,c.y,c.z,1+d],n=Math.hypot(...q)||1;return q.map(v=>v/n);}
/** Stable analytic two-bone IK. Unreachable targets clamp; pole chooses elbow side. */
export function solveTwoBoneIK({root,target,upperLength,lowerLength,pole={x:0,y:0,z:1}}){if(!(upperLength>0&&lowerLength>0))throw Error('IK requires positive limb lengths');const delta=rigSub(target,root),distance=rigLength(delta),dir=distance>1e-8?rigScale(delta,1/distance):{x:0,y:-1,z:0},d=Math.max(Math.abs(upperLength-lowerLength)+1e-6,Math.min(upperLength+lowerLength-1e-6,distance)),along=(upperLength**2+d*d-lowerLength**2)/(2*d);let bend=rigSub(pole,rigScale(dir,rigDot(pole,dir)));if(rigLength(bend)<1e-6)bend=rigCross(dir,Math.abs(dir.x)<.8?{x:1,y:0,z:0}:{x:0,y:1,z:0});const elbow=rigAdd(root,rigAdd(rigScale(dir,along),rigScale(rigNormalize(bend),Math.sqrt(Math.max(0,upperLength**2-along**2))))),end=rigAdd(root,rigScale(dir,d));return{elbow,end,error:rigLength(rigSub(end,target))};}

/** Bone sockets follow the actual skeleton, including physics-detached ragdoll bones.
 * sockets: {name:{bone,position:[x,y,z],rotation:[x,y,z]}}. Asset names are caller-owned.
 */
export function createBoneAttachments({B,scene},{skeleton,mesh,sockets}){
 const anchors=new Map(),items=new Set();for(const[name,spec]of Object.entries(sockets)){const bone=skeleton.bones.find(b=>b.name===spec.bone);if(!bone)throw Error('Missing socket bone: '+spec.bone);const anchor=new B.TransformNode('socket:'+name,scene);anchor.attachToBone(bone,mesh);anchor.position.set(...(spec.position||[0,0,0]));anchor.rotationQuaternion=B.Quaternion.FromEulerAngles(...(spec.rotation||[0,0,0]));anchors.set(name,anchor);}
 function attach(node,{socket,position=[0,0,0],rotation=[0,0,0],pivot=[0,0,0],scale=1}={}){const anchor=anchors.get(socket);if(!anchor)throw Error('Unknown attachment socket: '+socket);const mount=new B.TransformNode('grip:'+socket,scene);mount.parent=anchor;mount.position.set(...position);mount.rotationQuaternion=B.Quaternion.FromEulerAngles(...rotation);mount.scaling.setAll(scale);node.parent=mount;node.position.set(-pivot[0],-pivot[1],-pivot[2]);items.add(mount);return mount;}
 function point(socket,local=[0,0,0]){const anchor=anchors.get(socket);if(!anchor)throw Error('Unknown attachment socket: '+socket);skeleton.prepare(true);skeleton.computeAbsoluteMatrices(true);return B.Vector3.TransformCoordinates(new B.Vector3(...local),anchor.computeWorldMatrix(true));}
 return{attach,point,anchors,dispose(){for(const mount of items)mount.dispose();for(const anchor of anchors.values())anchor.dispose();items.clear();anchors.clear();}};
}
