import {GamepadHub,padAxis,padButton} from './3d/gamepads.js';
import {cameraRelativeMovement} from './3d/third-person.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const WAR_PAD_HELP='3D edition controller field controls: left stick moves your ground cursor (LT for precision); D-pad chooses troops; A places or confirms a move; X picks up a placed troop; B cancels a move, or returns to menu cursors. Y readies your army (starts when both are ready; solo starts directly). Right stick orbits; LB/RB zoom. Menu pauses; View opens help. Finish held troop moves before orbiting. Touch and mouse still work. Two native cursors need two controllers; use cursor mode or touch for one-controller turns. Use GAMEPAD: FIELD to return from menu cursors.';
export function warCursorBounds({team='solo',side=0,owner=0}={}){return{x0:side?1.3:-10.9,x1:side?10.9:-1.3,z0:team==='coop'&&owner===1?.15:-6.1,z1:team==='coop'&&owner===0?-.15:6.1};}
// Game-owned adapter. It reads inputs only; simulation, prices and legal deployment stay in the game.
export function createWarNative({players=1,getContext,getPads=()=>navigator.getGamepads?.()||[],onPlace=()=>null,onPick=()=>null,onPreview=()=>{},onDrop=()=>{},onCancel=()=>{},onCycle=()=>{},onReady=()=>{},onPause=()=>{},onHelp=()=>{},onMenus=()=>{},request=f=>requestAnimationFrame(f),cancel=id=>cancelAnimationFrame(id),auto=true}={}){
 let disposed=false,frame=null,last=0,active=false,key=null;
 const states=Array.from({length:players},(_,owner)=>({owner,x:-5,z:0,handle:null,visible:false,repeat:0}));
 const clearHandles=()=>{for(const s of states){if(s.handle)onCancel(s.owner,s.handle);s.handle=null;s.visible=false;s.repeat=0;}};
 const hub=new GamepadHub({players,onDisconnect(){if(active){clearHandles();active=false;onPause('Controller disconnected. Resume when ready.');}}});
 function ownership(ctx){if(ctx?.surface)ctx.surface.dataset.nativeGamepad=String(!!ctx.active);}
 function refresh(){const ctx=getContext();ownership(ctx);if(!ctx.active){active=false;clearHandles();hub.clear();}return ctx;}
 function tick(now){if(disposed)return;let ctx=refresh(),dt=clamp((now-last)/1000||1/60,0,.05);last=now;active=!!ctx.active;const next=ctx.active?String(ctx.key):'menus';
  if(next!==key){clearHandles();key=next;for(const s of states){const side=ctx.side?.(s.owner)||0;s.x=side?5:-5;s.z=ctx.team==='coop'?(s.owner?3:-3):0;}hub.clear();}
  let pads=[];try{pads=getPads();}catch{}hub.poll(pads,next);
  if(active&&getContext().active){let cameraUsed=false;for(const s of states){const pad=hub.pad(s.owner);if(!pad||hub.slots[s.owner]?.neutral)continue;s.visible=ctx.phase==='build';
   if(hub.pressed(s.owner,9)){clearHandles();onPause('Controller pause');refresh();break;}
   if(hub.pressed(s.owner,8)){clearHandles();onHelp();refresh();break;}
   if(hub.pressed(s.owner,1)){if(s.handle){onCancel(s.owner,s.handle);s.handle=null;}else{clearHandles();onMenus();refresh();break;}continue;}
   const camera=ctx.camera,rx=padAxis(pad,2),ry=padAxis(pad,3),zoom=(padButton(pad,4)?1:0)-(padButton(pad,5)?1:0);
   if(camera&&!ctx.cameraLocked&&!cameraUsed&&(rx||ry||zoom)){cameraUsed=true;camera.alpha-=rx*dt*1.9;camera.beta=clamp(camera.beta+ry*dt*1.25,camera.lowerBetaLimit??.3,camera.upperBetaLimit??1.38);camera.radius=clamp(camera.radius+zoom*dt*9,camera.lowerRadiusLimit??12,camera.upperRadiusLimit??43);}
   if(ctx.phase!=='build')continue;
   const b=warCursorBounds({team:ctx.team,side:ctx.side(s.owner),owner:s.owner}),move=cameraRelativeMovement({x:padAxis(pad,0),z:padAxis(pad,1)},camera?.alpha??Math.PI/2),speed=padButton(pad,6)?1.2:4.2;
   s.x=clamp(s.x+move.x*dt*speed,b.x0,b.x1);s.z=clamp(s.z+move.z*dt*speed,b.z0,b.z1);const point={x:s.x,z:s.z};
   if(s.handle){if(ctx.validHandle?.(s.handle)===false)s.handle=null;else onPreview(s.owner,s.handle,point);}
   const cycle=(padButton(pad,14)||padButton(pad,12)?-1:padButton(pad,15)||padButton(pad,13)?1:0);
   if(cycle&&now>=s.repeat){onCycle(s.owner,cycle);s.repeat=now+220;}if(!cycle)s.repeat=0;
   if(hub.pressed(s.owner,2)&&!s.handle)s.handle=onPick(s.owner,point)||null;
   else if(hub.pressed(s.owner,0)){if(s.handle){onDrop(s.owner,s.handle,point);s.handle=null;}else s.handle=onPlace(s.owner,point)||null;}
   if(hub.pressed(s.owner,3)){if(s.handle){onCancel(s.owner,s.handle);s.handle=null;}onReady(s.owner);ctx=refresh();if(!ctx.active)break;}
  }}
  if(auto&&!disposed)frame=request(tick);
 }
 const api={hub,states,tick,refresh,cancel(){clearHandles();hub.clear();},cursors(){return active?states.filter(s=>s.visible).map(s=>({owner:s.owner,x:s.x,z:s.z,held:!!s.handle})):[];},dispose(){disposed=true;if(frame!==null)cancel(frame);clearHandles();hub.dispose();const ctx=getContext();if(ctx?.surface)ctx.surface.dataset.nativeGamepad='false';}};
 if(auto)tick(performance.now());return api;
}
