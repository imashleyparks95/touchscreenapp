// Wobbly-owned framing extents and prop articulation; no simulation or shared toolkit changes.
export const WAR_FRAME_POINTS=Object.freeze([-12,12].flatMap(x=>[-7,7].flatMap(z=>[0,3.8].map(y=>Object.freeze({x,y,z})))));
export function createWarFraming(runtime,{onChange=()=>{}}={}){
 const {B,camera,engine}=runtime;let aspect=0,renderAspect=0,disposed=false;
 const dimensions=()=>{const r=runtime.canvas?.getBoundingClientRect?.(),rw=Math.max(1,engine.getRenderWidth()),rh=Math.max(1,engine.getRenderHeight());return{w:Math.max(1,r?.width||rw),h:Math.max(1,r?.height||rh),rw,rh};};
 function fits(){const size=dimensions(),bottom=size.w<size.h?Math.min(.85,1-120/size.h):.85;const view=camera.getViewMatrix(true),projection=camera.getProjectionMatrix(true),matrix=view.multiply(projection),viewport=new B.Viewport(0,0,1,1);return WAR_FRAME_POINTS.every(p=>{const q=B.Vector3.Project(new B.Vector3(p.x,p.y,p.z),B.Matrix.Identity(),matrix,viewport);return Number.isFinite(q.x+q.y+q.z)&&q.x>=.07&&q.x<=.93&&q.y>=.10&&q.y<=bottom&&q.z>=0&&q.z<=1;});}
 function fit({reset=false}={}){if(disposed)return false;onChange();const size=dimensions();aspect=size.w/size.h;renderAspect=size.rw/size.rh;if(reset){camera.alpha=aspect<.85?0:Math.PI/2;camera.beta=.78;}camera.target.set(0,1,0);camera.lowerRadiusLimit=12;camera.upperRadiusLimit=125;let lo=12,hi=110;camera.radius=hi;if(fits()){for(let n=0;n<18;n++){const mid=(lo+hi)/2;camera.radius=mid;if(fits())hi=mid;else lo=mid;}}camera.radius=hi;camera.upperRadiusLimit=Math.min(125,Math.max(43,hi*1.25));return fits();}
 return{fit,fits,update(){if(disposed)return false;const s=dimensions(),next=s.w/s.h;if(Math.abs(next-aspect)>.015||Math.abs(s.rw/s.rh-renderAspect)>.015){fit({reset:aspect===0});return true;}return false;},inspect(unit){if(disposed||!unit)return false;onChange();camera.target.set(unit.x,1.25*(unit.scale||1),unit.z);camera.lowerRadiusLimit=6;camera.radius=7;return true;},dispose(){disposed=true;}};
}
export function warPropMotion(u,{clock=0,deathAge=0,reduceMotion=false}={}){
 const moving=u.state==='walk'||u.state==='run',phase=Number.isFinite(u.walk)?u.walk:0,fall=u.alive===false?Math.min(1,Math.max(0,deathAge)/.8):0;
 return{leg:moving?Math.sin(phase)*.45:0,wing:fall*.6+(1-fall)*(reduceMotion?0:Math.sin(clock*(moving?6:4))*(moving?.34:.18)),wheel:-(Number.isFinite(u.traveled)?u.traveled:0)/.32};
}
