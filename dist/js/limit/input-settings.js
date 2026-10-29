import {bindPointers} from '../shared/pointers.js';
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
 return bindPointers(target,{enabled,maxPointers:1,move:(_contact,_event,delta)=>onLook(delta.x,delta.y)});
}
