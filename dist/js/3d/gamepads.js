/** Stable local controller ownership. Standard Gamepad mapping only; no device inference. */
export const XBOX_ACTIONS=Object.freeze({jump:0,attack:2,dodge:1,interact:3,cast:7,run:5});
export const padButton=(pad,index)=>!!pad?.buttons?.[index]?.pressed||(pad?.buttons?.[index]?.value||0)>.4;
export const padAxis=(pad,index,deadzone=.18)=>{const value=Number(pad?.axes?.[index])||0;return Math.abs(value)<=deadzone?0:Math.sign(value)*(Math.min(1,Math.abs(value))-deadzone)/(1-deadzone);};
export class GamepadHub{
 constructor({players=2,onConnect=()=>{},onDisconnect=()=>{}}={}){this.slots=Array.from({length:players},()=>null);this.onConnect=onConnect;this.onDisconnect=onDisconnect;this.context='';this.unsupported=[];}
 poll(devices=[],context='play'){const pads=Array.from(devices).filter(p=>p&&p.connected!==false&&p.mapping==='standard');this.unsupported=Array.from(devices).filter(p=>p&&p.connected!==false&&p.mapping!=='standard');if(context!==this.context){this.context=context;for(const slot of this.slots)if(slot){slot.neutral=true;slot.previous=new Set();}}
  for(let i=0;i<this.slots.length;i++){const slot=this.slots[i];if(slot&&!pads.some(p=>p.index===slot.index&&p.id===slot.id)){this.slots[i]=null;this.onDisconnect(i,slot);}}
  const assigned=new Set(this.slots.filter(Boolean).map(s=>s.index));for(const pad of pads)if(!assigned.has(pad.index)){const owner=this.slots.indexOf(null);if(owner<0)break;this.slots[owner]={index:pad.index,id:pad.id,neutral:true,previous:new Set(),pad:null,edges:new Set()};assigned.add(pad.index);this.onConnect(owner,pad);}
  for(const slot of this.slots){if(!slot)continue;const raw=pads.find(p=>p.index===slot.index&&p.id===slot.id),pressed=new Set(Array.from({length:raw.buttons.length},(_,i)=>i).filter(i=>padButton(raw,i)));if(slot.neutral&&pressed.size===0)slot.neutral=false;slot.edges=slot.neutral?new Set():new Set([...pressed].filter(i=>!slot.previous.has(i)));slot.previous=pressed;slot.pad={id:raw.id,index:raw.index,mapping:raw.mapping,connected:true,axes:Array.from(raw.axes||[]),buttons:Array.from(raw.buttons||[],b=>({pressed:!slot.neutral&&!!b.pressed,value:slot.neutral?0:b.value||0}))};}
  return this;
 }
 pad(player){return this.slots[player]?.pad||null;}
 pressed(player,button){return this.slots[player]?.edges.has(button)||false;}
 clear(){for(const slot of this.slots)if(slot){slot.neutral=true;slot.previous=new Set();slot.edges.clear();if(slot.pad){slot.pad.axes=slot.pad.axes.map(()=>0);slot.pad.buttons=slot.pad.buttons.map(()=>({pressed:false,value:0}));}}}
 dispose(){this.slots.fill(null);this.unsupported=[];}
}
