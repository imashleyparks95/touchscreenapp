// Wobbly Wars policy only: previews never mutate deployment or spend coins.
export function commitWarMove(model,handle,point,{coop=false}={}){
 if(model.phase!=='build'||!handle||!point||coop&&(handle.owner===0?point.z>=-.1:point.z<.1))return false;
 const u=model.items.find(u=>u.id===handle.id&&u.side===handle.side&&u.owner===handle.owner);if(!u||Math.hypot(u.x-point.x,u.z-point.z)<.01)return false;
 const before=structuredClone(model.items);if(!model.reposition(u.id,point.x,point.z,u.side))return false;
 model.history.push(before);if(model.history.length>60)model.history.shift();return true;
}
export function warGuide({phase='build',paused=false,camera=false,team='solo',simultaneous=false,selected=''}={}){
 if(paused)return 'Battlefield paused. Resume when ready; formation and battle clock are safe.';
 if(phase!=='build')return 'Combat is automatic. Orbit or zoom to follow the action; pause to change playback or graphics.';
 if(camera)return 'Camera mode: drag to orbit, pinch to zoom. Return to Deploy before placing or moving troops.';
 return (selected?selected+' selected. ':'')+(team==='coop'?'Build in your blue half with your own share of the budget. ':team==='versus'?'Build inside your player color. ':'Tap your colored zone to purchase. ')+'Drag placed troops, then lift to move. Canceling keeps their original position.'+(team!=='solo'?(simultaneous?' Both players can deploy together.':' Press Ready to pass the deployment turn.'):'');
}
