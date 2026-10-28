import {warWeaponFrame} from './wars3d-poses.js';
// Wobbly Wars' skeleton names, hand pose, class animation and costume palette.
// This art policy stays outside the generic actor factory.
export function soldierPose(state,rest){return warWeaponFrame(state).targets;}
export const soldierRig={url:'assets/wars3d/soldier.glb',pose:soldierPose,palette:{team:['#398ee2','#e65f53'],plume:['#79c5ec','#ffac78']},collider:{height:1.8,radius:.35},ragdoll:({B,nodes})=>Object.keys(nodes).map(name=>({bone:name,width:name.startsWith('hand')?.12:name==='root'?.18:name==='head'?.42:name==='spine'?.5:.19,height:name.startsWith('hand')?.11:name==='root'?.15:name==='head'?.36:name==='hips'?.25:.29,depth:name==='head'?.36:.22,mass:name.startsWith('hand')?.25:name==='hips'||name==='spine'?3:1,restitution:.08,joint:B.PhysicsConstraintType.BALL_AND_SOCKET,min:name==='head'?-.45:-1.4,max:name==='head'?.45:1.4}))};
