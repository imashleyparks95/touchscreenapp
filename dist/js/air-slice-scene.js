import {SceneReliability,stabilizeAlpha,SCENE_LIMITS} from './air-slice-mask.js';
// Only this small transparent canvas is composited over scenery. Raw video is never drawn
// over the virtual world as an opaque rectangle. Frames and masks stay in memory locally.
export class AirPersonScene{
 constructor({enabled=true,onFallback=()=>{}}={}){this.enabled=enabled;this.onFallback=onFallback;this.reliability=new SceneReliability();this.status=enabled?'Starting local background removal…':'Original webcam view.';this.foreground=null;this.maskCanvas=null;this.previous=null;this.lastSourceTime=-1;this.blocked=false;this.opacity=1;}
 setEnabled(enabled){this.enabled=!!enabled;this.reset();this.status=this.enabled?'Starting local background removal…':'Original webcam view.';}
 reset(){this.reliability.reset();this.previous=null;this.lastSourceTime=-1;this.blocked=false;this.opacity=1;if(this.foreground)this.foreground.getContext('2d').clearRect(0,0,this.foreground.width,this.foreground.height);}
 fallback(reason){if(this.blocked)return;this.blocked=true;this.status=reason;this.onFallback(reason);}
 accept(result,players,now=performance.now()){
 const scene=result?.scene;if(!this.enabled||this.blocked){scene?.frame?.close?.();return false;}
 if(result?.segmentationError){scene?.frame?.close?.();this.fallback('Background removal is unavailable on this device. Virtual scenery stays on. Select OFF for the original camera or OFF/ON to retry.');return false;}
 if(!scene?.frame){const state=this.reliability.check(null,result?.landmarks,players,now);this.status=this.reliability.reason;if(state.disable)this.fallback(state.reason);return false;}
 try{if(now-result.time>SCENE_LIMITS.lateMs){const late=this.reliability.check(null,result.landmarks,players,now,{totalMs:now-result.time});this.status='Recovering a delayed outline; virtual scenery stays on.';if(late.disable)this.fallback(late.reason);return false;}const quality=this.reliability.check(scene.mask,result.landmarks,players,now,{totalMs:result.inferenceMs,maskMs:result.maskMs});this.status=this.reliability.reason;if(quality.disable){this.fallback(quality.reason);return false;}if(!quality.valid)return false;
  const frame=scene.frame,w=frame.width,h=frame.height;if(!this.foreground){this.foreground=document.createElement('canvas');this.maskCanvas=document.createElement('canvas');}
  if(this.foreground.width!==w||this.foreground.height!==h){this.foreground.width=w;this.foreground.height=h;}
  const mask=scene.mask;if(this.maskCanvas.width!==mask.width||this.maskCanvas.height!==mask.height){this.maskCanvas.width=mask.width;this.maskCanvas.height=mask.height;this.previous=null;}
  const alpha=this.previous=stabilizeAlpha(mask.alpha,this.previous),mc=this.maskCanvas.getContext('2d'),image=mc.createImageData(mask.width,mask.height);for(let i=0;i<alpha.length;i++){image.data[i*4]=255;image.data[i*4+1]=255;image.data[i*4+2]=255;image.data[i*4+3]=alpha[i];}mc.putImageData(image,0,0);
  const c=this.foreground.getContext('2d');c.clearRect(0,0,w,h);c.globalCompositeOperation='source-over';c.drawImage(frame,0,0,w,h);c.globalCompositeOperation='destination-in';c.filter='blur(.55px)';c.drawImage(this.maskCanvas,0,0,w,h);c.filter='none';c.globalCompositeOperation='source-over';this.lastSourceTime=result.time;return true;
 }catch(e){this.fallback('Background compositing is unavailable. Virtual scenery stays on. Turn OFF to use the original camera.');return false;}finally{scene.frame.close?.();}
 }
 get(now=performance.now()){if(!this.enabled)return null;const available=this.reliability.available(now);if(!this.blocked)this.status=this.reliability.reason;this.opacity=Math.max(0,Math.min(1,1-(now-this.reliability.lastGood-SCENE_LIMITS.holdMs)/SCENE_LIMITS.fadeMs));return available?this.foreground:null;}
 observeRender(dt){if(this.enabled&&!this.blocked&&this.reliability.active&&this.reliability.render(dt))this.fallback('Rendering stayed below 25 FPS for over 1.8 seconds. Virtual scenery stays on. Select OFF for the original camera, or OFF/ON to retry.');}
 dispose(){this.enabled=false;this.previous=null;for(const c of [this.foreground,this.maskCanvas])if(c){c.width=1;c.height=1;}this.foreground=null;this.maskCanvas=null;}
}
