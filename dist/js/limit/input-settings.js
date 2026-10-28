// Forest-owned preferences: no score, graphics, benchmark or shared rig policy.
export const FOREST_INPUT_DEFAULTS=Object.freeze({controllerLook:1,touchLook:1,lookDeadzone:.18,invertY:false,touchControls:'auto'});
export function forestInputSettings(value={}){
 const bounded=(key,min,max)=>Number.isFinite(value?.[key])?Math.max(min,Math.min(max,value[key])):FOREST_INPUT_DEFAULTS[key];
 return{controllerLook:bounded('controllerLook',.25,2),touchLook:bounded('touchLook',.25,2),lookDeadzone:bounded('lookDeadzone',.1,.4),invertY:value?.invertY===true,touchControls:['auto','show','hide'].includes(value?.touchControls)?value.touchControls:'auto'};
}
export function showForestTouch({preference='auto',lastInput='keyboard',hasTouch=false,players=1,controllers=0,activeTouches=0}={}){
 if(preference==='show')return true;if(preference==='hide')return false;
 return activeTouches>0||lastInput==='touch'||hasTouch&&controllers<players;
}
export function rotateForestCamera(camera,x,y,yawScale,pitchScale,invertY=false){
 if(!camera)return;camera.alpha-=x*yawScale;camera.beta=Math.max(camera.lowerBetaLimit??.4,Math.min(camera.upperBetaLimit??1.3,camera.beta+y*pitchScale*(invertY?-1:1)));
}
/** One shared camera drag region, independent of both movement sticks/actions. */
export function bindForestLook(target,{enabled=()=>true,onLook=()=>{}}={}){
 let pointer=null,lastX=0,lastY=0;
 function cancel(){const id=pointer;pointer=null;if(id!==null&&target.hasPointerCapture?.(id))target.releasePointerCapture(id);}
 function down(e){if(!enabled()||pointer!==null)return;e.preventDefault();pointer=e.pointerId;lastX=e.clientX;lastY=e.clientY;target.setPointerCapture(pointer);}
 function move(e){if(e.pointerId!==pointer)return;if(!enabled()){cancel();return;}e.preventDefault();onLook(e.clientX-lastX,e.clientY-lastY);lastX=e.clientX;lastY=e.clientY;}
 function up(e){if(e.pointerId===pointer)cancel();}
 const listeners=[['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['lostpointercapture',up]];
 for(const [name,fn]of listeners)target.addEventListener(name,fn);
 return{cancel,dispose(){cancel();for(const [name,fn]of listeners)target.removeEventListener(name,fn);}};
}
