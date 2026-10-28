// Pure local mask operations shared by the pose worker and main-thread compatibility path.
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function mergePersonMasks(masks,maxWidth=320){
 const valid=(masks||[]).filter(m=>m&&m.width>0&&m.height>0&&m.data?.length===m.width*m.height);if(!valid.length)return null;
 const width=Math.min(maxWidth,valid[0].width),height=Math.max(1,Math.round(width*valid[0].height/valid[0].width)),alpha=new Uint8ClampedArray(width*height);
 for(const m of valid){const sx=m.width/width,sy=m.height/height;for(let y=0;y<height;y++)for(let x=0;x<width;x++){let confidence=0;for(const [dx,dy]of [[.25,.25],[.75,.25],[.25,.75],[.75,.75]]){const v=m.data[Math.min(m.height-1,Math.floor((y+dy)*sy))*m.width+Math.min(m.width-1,Math.floor((x+dx)*sx))];if(Number.isFinite(v))confidence=Math.max(confidence,v);}const t=clamp((confidence-.16)/.6,0,1),a=Math.round(t*t*(3-2*t)*255),i=y*width+x;alpha[i]=Math.max(alpha[i],a);}}
 // One mask pixel of conservative expansion protects thin fingers at reduced resolution.
 const expanded=alpha.slice();for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){let a=alpha[y*width+x];for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)a=Math.max(a,alpha[(y+j)*width+x+i]);expanded[y*width+x]=a;}
 return{width,height,alpha:expanded,count:valid.length};
}
export function maskCoverage(mask,landmarks,expectedPlayers=1){
 if(!mask?.alpha||mask.alpha.length!==mask.width*mask.height)return{valid:false,reason:'Waiting for a person outline.'};
 let occupied=0;for(const a of mask.alpha)if(a>80)occupied++;const ratio=occupied/mask.alpha.length;
 if(ratio<.008||ratio>.985)return{valid:false,reason:'Recovering the person outline.'};
 const bodies=(landmarks||[]).filter(p=>p?.length>=25);
 for(const p of bodies.slice(0,expectedPlayers)){
  const check=[0,11,12,13,14,15,16,19,20].filter(i=>{const q=p[i];return q&&(q.visibility??1)>.45&&(q.presence??1)>.4&&q.x>.015&&q.x<.985&&q.y>.015&&q.y<.985;});
  if(check.length<3)continue;
  for(const i of check){const q=p[i],x=Math.round(q.x*(mask.width-1)),y=Math.round(q.y*(mask.height-1));let a=0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const px=clamp(x+dx,0,mask.width-1),py=clamp(y+dy,0,mask.height-1);a=Math.max(a,mask.alpha[py*mask.width+px]);}if(a<55)return{valid:false,reason:'Recovering a complete player outline.'};}
 }
 return{valid:true,ratio};
}
export function stabilizeAlpha(next,previous){if(!previous||previous.length!==next.length)return next.slice();return Uint8ClampedArray.from(next,(n,i)=>Math.abs(n-previous[i])<45?Math.round(n*.75+previous[i]*.25):n);}
export const SCENE_LIMITS={holdMs:250,fadeMs:180,lateMs:300,maskMs:35,inferenceMs:130,renderMs:40,windowMs:2500,failureMs:8000};
export class SceneReliability{
 constructor(){this.reset();}
 reset(){this.samples=0;this.good=0;this.lastGood=-Infinity;this.started=null;this.active=false;this.reason='Starting local background removal…';this.costs=[];this.frames=[];this.renderClock=0;}
 check(mask,landmarks,players,now,{totalMs=0,maskMs=0}={}){this.started??=now;this.samples++;this.costs.push({at:now,slow:maskMs>SCENE_LIMITS.maskMs||totalMs>SCENE_LIMITS.inferenceMs});this.costs=this.costs.filter(s=>now-s.at<SCENE_LIMITS.windowMs);if(this.costs.length>=8&&now-this.costs[0].at>=1800&&this.costs.filter(s=>s.slow).length/this.costs.length>.35)return{disable:true,reason:'Outline processing exceeded the device budget. Virtual scenery stays on. Turn Background Removal OFF for the normal camera, or toggle OFF/ON to retry.'};const quality=maskCoverage(mask,landmarks,players);if(quality.valid){this.good++;this.lastGood=now;if(this.good>=2)this.active=true;this.reason='Players inside the animated world.';}else{this.good=0;this.reason=quality.reason;}if(now-Math.max(this.lastGood,this.started)>SCENE_LIMITS.failureMs)return{disable:true,reason:'A stable outline could not be recovered for 8 seconds. Virtual scenery stays on; choose OFF for the normal camera or toggle OFF/ON to retry.'};return{...quality,active:this.active};}
 available(now){return this.active&&now-this.lastGood<=SCENE_LIMITS.holdMs+SCENE_LIMITS.fadeMs;}
 render(dt){this.renderClock+=Math.max(0,dt);this.frames.push({at:this.renderClock,slow:dt>SCENE_LIMITS.renderMs});this.frames=this.frames.filter(f=>this.renderClock-f.at<SCENE_LIMITS.windowMs);return this.frames.length>=3&&this.renderClock-this.frames[0].at>=1800&&this.frames.filter(f=>f.slow).length/this.frames.length>.5;}
}
