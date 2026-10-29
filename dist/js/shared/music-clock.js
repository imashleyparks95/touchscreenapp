import {createLifetime} from './lifetime.js';
/** One optional music clock; stopping never resumes a shared AudioContext. */
export function createMusicClock({getState,onBeat,onQuiet=()=>{},doc=globalThis.document,win=doc?.defaultView,schedule=setInterval,unschedule=clearInterval,interval=420}={}){
 const life=createLifetime();let timer=null;
 function sync(){
  const s=getState(),playing=!life.disposed&&!doc?.hidden&&!s.backgroundSuspended&&!s.muted&&s.musicOn&&s.music>0&&s.ready;
  if(!playing){if(timer!==null){unschedule(timer);timer=null;}return;}
  if(timer===null)timer=schedule(()=>{const s=getState();if(doc?.hidden||s.backgroundSuspended||s.muted||!s.musicOn||!(s.music>0)||!s.ready){sync();return;}onBeat();},interval);
 }
 const quiet=()=>{onQuiet();sync();};
 if(doc?.addEventListener)life.listen(doc,'visibilitychange',quiet);
 if(win?.addEventListener){life.listen(win,'pagehide',()=>{if(timer!==null){unschedule(timer);timer=null;}onQuiet(true);});life.listen(win,'pageshow',quiet);}
 life.defer(()=>{if(timer!==null)unschedule(timer);timer=null;onQuiet(true);});
 return{sync,get running(){return timer!==null;},dispose:()=>life.dispose()};
}
