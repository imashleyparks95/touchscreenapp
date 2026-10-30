import {GamepadHub,padAxis,padButton} from './3d/gamepads.js';
/** Game-owned actions use the exact existing pointer, route and ability rules. */
export function createTouchNative({game,getPads=()=>navigator.getGamepads?.()||[],onPause=()=>{},onHelp=()=>{}}){
 let active=false;const states=[0,1].map(()=>({aim:{x:1,y:0},selected:0,charge:0,held:false,pinned:false,route:false}));
 const hub=new GamepadHub({players:2,onDisconnect(){if(active){active=false;onPause('Controller disconnected');}}});
 function cancel(m,i){const s=states[i];if(!m)return;if(game==='slime'){m.input('cancel',0,0,42000+i*2);m.input('cancel',0,0,42001+i*2);}else{m.shield(42000+i,false);if(s.route)m.route=[];}s.held=false;s.charge=0;s.pinned=false;s.route=false;}
 return{hub,states,cancel(models=[]){models.forEach(cancel);hub.clear();},update(models=[],dt=0,playing=false){active=playing;let pads=[];try{pads=getPads();}catch{}hub.poll(pads,playing?'play':'menu');if(!playing||!active){models.forEach(cancel);return;}for(const [i,m]of models.entries()){
  const pad=hub.pad(i),s=states[i];if(!pad||hub.slots[i]?.neutral||m.done){cancel(m,i);continue;}
  if(hub.pressed(i,9)){active=false;models.forEach(cancel);onPause('Controller pause');return;}if(hub.pressed(i,8)){active=false;models.forEach(cancel);onHelp();return;}
  const x=padAxis(pad,0),y=padAxis(pad,1),len=Math.hypot(x,y),rx=padAxis(pad,2),ry=padAxis(pad,3),rlen=Math.hypot(rx,ry);
  if(game==='ninja'){
   if(rlen>.1)s.aim={x:rx/rlen,y:ry/rlen};else if(len>.1)s.aim={x:x/len,y:y/len};
   if(len>.1){m.route=[{x:m.ninja.x+x/len*40,y:m.ninja.y+y/len*40}];s.route=true;}else if(s.route){m.route=[];s.route=false;}
   m.shield(42000+i,padButton(pad,4));const target={x:m.ninja.x+s.aim.x*180,y:m.ninja.y+s.aim.y*180};
   if(hub.pressed(i,2))m.throwStar(target);if(hub.pressed(i,3))m.special('blink',target);if(hub.pressed(i,5))m.special('jump',target);
   if(hub.pressed(i,0)||hub.pressed(i,1)){const old=m.mode;m.mode=hub.pressed(i,0)?'dash':'slide';const id=43000+i;m.input('down',m.ninja.x,m.ninja.y,id);m.input('up',target.x,target.y,id);m.mode=old;s.route=false;}
  }else{
   if(len>.1)s.aim={x:x/len,y:y/len};s.selected=Math.min(s.selected,m.blobs.length-1);const id=42000+i*2;if(s.pinned&&!m.pointers.has(id+1))s.pinned=false;
   if(hub.pressed(i,1)){cancel(m,i);s.blocked=padButton(pad,7)||padButton(pad,0);continue;}if(hub.pressed(i,2)){cancel(m,i);if(!m.split())m.feedback=m.level.split?'Use RB to select an existing blob.':'Splitting unlocks on later courses.';}
   if(hub.pressed(i,3)){cancel(m,i);m.reset();}if(hub.pressed(i,5)){m.input('cancel',0,0,id);s.held=false;s.selected=(s.selected+1)%m.blobs.length;m.feedback='Selected blob '+(s.selected+1)+' / '+m.blobs.length+'. Left stick aims; RT charges.';}
   s.selected=Math.min(s.selected,m.blobs.length-1);const b=m.blobs[s.selected],center=b.center;
   if(hub.pressed(i,4)){if(s.pinned){m.input('cancel',0,0,id+1);s.pinned=false;}else s.pinned=m.input('down',center.x,center.y,id+1);m.feedback=s.pinned?'Anchor pin held. RB selects another blob; LB or B releases.':'Anchor pin released.';}
   const held=padButton(pad,7)||padButton(pad,0);
   if(s.blocked){if(held)continue;s.blocked=false;}if(held&&!s.held){s.origin={...center};s.charge=0;s.held=m.input('down',center.x,center.y,id);}
   if(held&&s.held){s.charge=Math.min(1,s.charge+Math.min(dt,.1)/.9);m.input('move',s.origin.x-s.aim.x*s.charge*115,s.origin.y-s.aim.y*s.charge*115,id);}
   if(!held&&s.held){m.input('up',s.origin.x-s.aim.x*s.charge*115,s.origin.y-s.aim.y*s.charge*115,id);s.held=false;s.charge=0;}
  }
 }},dispose(models=[]){models.forEach(cancel);hub.dispose();}};
}
export const TOUCH_PAD_HELP={slime:'Controller: left stick aims; hold/release RT or A to charge/sling. X splits, Y resets, RB selects a blob, LB toggles an anchor pin, B releases pins. Menu pauses; View opens help. Touch still supports two-point stretch/pinch.',ninja:'Controller: left stick moves, right stick aims. A dashes, B slides, X throws a star, Y blinks, RB wall-jumps, hold LB to shield. Menu pauses; View opens help. Touch routes remain available.'};
