import {createLifetime} from './lifetime.js';

/** Re-read the CSS rectangle on every event, including during resize/fullscreen. */
export function pointerPoint(target,event,{width,height}={}){
 const r=target.getBoundingClientRect();
 if(!(r.width>0&&r.height>0))return null;
 return{x:(event.clientX-r.left)*(width??r.width)/r.width,y:(event.clientY-r.top)*(height??r.height)/r.height};
}

/** Independent captured contacts. Cancellation never invokes a successful up. */
export function bindPointers(target,{enabled=()=>true,maxPointers=Infinity,down=()=>{},move=()=>{},up=()=>{},cancel=()=>{},win=target.ownerDocument?.defaultView}={}){
 const life=createLifetime(),contacts=new Map();
 function release(id,event,cancelled=true){
  const contact=contacts.get(id);if(!contact)return;
  contacts.delete(id); // lostpointercapture can dispatch synchronously.
  try{if(target.hasPointerCapture?.(id))target.releasePointerCapture(id);}catch{}
  (cancelled?cancel:up)(contact,event);
 }
 function cancelAll(){for(const id of [...contacts.keys()])release(id);}
 life.listen(target,'pointerdown',event=>{
  if(!enabled()||contacts.has(event.pointerId)||contacts.size>=maxPointers||event.button>0)return;
  event.preventDefault();
  const contact={id:event.pointerId,startX:event.clientX,startY:event.clientY,x:event.clientX,y:event.clientY,data:undefined};
  contacts.set(contact.id,contact);
  try{target.setPointerCapture?.(contact.id);}catch{}
  contact.data=down(contact,event);
 });
 life.listen(target,'pointermove',event=>{
  const contact=contacts.get(event.pointerId);if(!contact)return;
  if(!enabled()){cancelAll();return;}
  event.preventDefault();const dx=event.clientX-contact.x,dy=event.clientY-contact.y;
  contact.x=event.clientX;contact.y=event.clientY;move(contact,event,{x:dx,y:dy});
 });
 life.listen(target,'pointerup',event=>{if(contacts.has(event.pointerId)){event.preventDefault();release(event.pointerId,event,!enabled());}});
 for(const type of ['pointercancel','lostpointercapture'])life.listen(target,type,event=>release(event.pointerId,event));
 if(win){life.listen(win,'blur',cancelAll);life.listen(win,'pagehide',cancelAll);}
 if(target.ownerDocument)life.listen(target.ownerDocument,'visibilitychange',()=>{if(target.ownerDocument.hidden)cancelAll();});
 life.defer(cancelAll);
 return{get size(){return contacts.size;},cancel:cancelAll,dispose:()=>life.dispose()};
}
