import {pointerPoint} from '../shared/pointers.js';
import {createLifetime} from '../shared/lifetime.js';
import {PointerOwnership} from './multiplayer.js';
// All pointers have independent ownership; camera gestures cannot place armies.
export function bind3DInput(canvas,runtime,{pick,down,move,up,cancel=()=>{},cameraMode=()=>false,ownerAt=()=>0}={}){const {B,scene,camera}=runtime,pointers=new Map(),ownership=new PointerOwnership(ownerAt);const life=createLifetime();let pinch=null;
 function ground(e){const point=pointerPoint(canvas,e,{width:runtime.engine.getRenderWidth(),height:runtime.engine.getRenderHeight()});if(!point)return null;const {x,y}=point,ray=B.Ray.CreateNew(x,y,runtime.engine.getRenderWidth(),runtime.engine.getRenderHeight(),B.Matrix.Identity(),camera.getViewMatrix(),camera.getProjectionMatrix()),t=-ray.origin.y/ray.direction.y;if(!Number.isFinite(t)||t<0)return null;const p=ray.origin.add(ray.direction.scale(t));return{x:p.x,z:p.z};}
 function onDown(e){if(pointers.has(e.pointerId))return;e.preventDefault();canvas.setPointerCapture(e.pointerId);const p={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,camera:cameraMode()||e.button===2,start:ground(e)};pointers.set(e.pointerId,p);if(p.camera){if(pointers.size===2)pinch=Math.hypot(...[...pointers.values()].reduce((a,p,i)=>i?[a[0]-p.x,a[1]-p.y]:[p.x,p.y],[]));return;}if(p.start){p.owner=ownership.begin(e.pointerId,p.start);p.handle=down?.(p.start,e,p.owner);}}
 function onMove(e){const p=pointers.get(e.pointerId);if(!p)return;e.preventDefault();if(p.camera){const dx=e.clientX-p.lastX,dy=e.clientY-p.lastY;if(pointers.size===2){const list=[...pointers.values()];p.x=e.clientX;p.y=e.clientY;const d=Math.hypot(list[0].x-list[1].x,list[0].y-list[1].y);if(pinch)camera.radius=Math.max(camera.lowerRadiusLimit,Math.min(camera.upperRadiusLimit,camera.radius*pinch/(d||1)));pinch=d;}else{camera.alpha-=dx*.006;camera.beta=Math.max(camera.lowerBetaLimit,Math.min(camera.upperBetaLimit,camera.beta+dy*.005));}}else{const at=ground(e);if(at)move?.(at,p.handle,e);}p.lastX=e.clientX;p.lastY=e.clientY;}
 function release(id){pointers.delete(id);ownership.end(id);pinch=null;try{if(canvas.hasPointerCapture?.(id))canvas.releasePointerCapture(id);}catch{}}
 function onUp(e){const p=pointers.get(e.pointerId);if(!p)return;e.preventDefault();release(e.pointerId);if(!p.camera)up?.(ground(e),p.handle,e);}
 function onCancel(e){const p=pointers.get(e.pointerId);if(!p)return;release(e.pointerId);if(!p.camera)cancel(p.handle,e);}
 function wheel(e){e.preventDefault();camera.radius=Math.max(camera.lowerRadiusLimit,Math.min(camera.upperRadiusLimit,camera.radius+e.deltaY*.015));}
 function stop(){for(const id of [...pointers.keys()])release(id);ownership.clear();pinch=null;cancel();}
 const context=e=>e.preventDefault();
 for(const [name,fn]of [['pointerdown',onDown],['pointermove',onMove],['pointerup',onUp],['pointercancel',onCancel],['lostpointercapture',onCancel],['wheel',wheel],['contextmenu',context]])life.listen(canvas,name,fn,name==='wheel'?{passive:false}:undefined);
 const doc=canvas.ownerDocument,win=doc?.defaultView;
 if(win){life.listen(win,'blur',stop);life.listen(win,'pagehide',stop);}
 if(doc)life.listen(doc,'visibilitychange',()=>{if(doc.hidden)stop();});
 life.defer(stop);
 return{ground,cancel:stop,dispose:()=>life.dispose()};
}
