import {menuUsable,stepSelect,menuNeighbor} from './shared/menu.js';
import {GamepadHub,padAxis,padButton} from './3d/gamepads.js';

const controls='button,a[href],select,input:not([type="hidden"]),textarea,[tabindex="0"]';
const usable=menuUsable;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

// Controller pointers use the game's existing input handlers, not a second rules engine.
// Capture is local to these virtual IDs; physical mouse/touch capture remains native.
export function createControllerPointers(doc=document){
 const pointers=new Map(),patched=new Map();
 function patch(node){
  if(patched.has(node))return;
  const saved={};
  for(const name of ['setPointerCapture','releasePointerCapture','hasPointerCapture']){
   saved[name]=Object.getOwnPropertyDescriptor(node,name);
   const native=node[name]?.bind(node);
   Object.defineProperty(node,name,{configurable:true,value(id){
    const p=pointers.get(id);
    if(!p)return native?.(id);
    if(name==='hasPointerCapture')return p.capture===node;
    if(name==='setPointerCapture')p.capture=node;
    else if(p.capture===node)p.capture=null;
   }});
  }
  patched.set(node,saved);
 }
 function restore(){if(pointers.size)return;for(const [node,saved]of patched){for(const [name,descriptor]of Object.entries(saved)){if(descriptor)Object.defineProperty(node,name,descriptor);else delete node[name];}}patched.clear();}
 function emit(target,type,p,buttons=1){
  target?.dispatchEvent(new doc.defaultView.PointerEvent(type,{bubbles:true,cancelable:true,pointerId:p.id,pointerType:'gamepad',isPrimary:p.player===0,clientX:p.x,clientY:p.y,button:type==='pointermove'?-1:0,buttons,pressure:buttons?.5:0}));
 }
 const hit=(x,y)=>{const n=doc.elementFromPoint(x,y);return n?.closest('button,a,input,select,canvas')||n;};
 return{
  down(player,x,y){const id=10000+player;if(pointers.has(id))return;const target=hit(x,y);if(!target)return;const p={id,player,x,y,startX:x,startY:y,target,capture:null};pointers.set(id,p);for(let n=target;n&&n!==doc.body;n=n.parentElement)patch(n);target.closest(controls)?.focus({preventScroll:true});emit(target,'pointerdown',p);},
  move(player,x,y){const p=pointers.get(10000+player);if(!p)return;p.x=x;p.y=y;if(!p.target.isConnected){this.cancel(player);return;}emit(p.capture||p.target,'pointermove',p);},
  up(player){const p=pointers.get(10000+player);if(!p)return;emit(p.capture||p.target,'pointerup',p,0);pointers.delete(p.id);if(p.target.isConnected&&p.target===hit(p.x,p.y)&&Math.hypot(p.x-p.startX,p.y-p.startY)<10)p.target.closest('button,a,input,select')?.click();restore();},
  cancel(player){const p=pointers.get(10000+player);if(!p)return;emit(p.capture||p.target,'pointercancel',p,0);if(p.capture)emit(p.capture,'lostpointercapture',p,0);pointers.delete(p.id);restore();},
  cancelAll(){for(const p of [...pointers.values()])this.cancel(p.player);},
  get size(){return pointers.size;}
 };
}

export function controllerHelp(){return `<div class="eyebrow">CONTROLLERS · BLUETOOTH OR USB</div><h2>Another way to play.</h2><p>Pair a standard-mapping controller in your device’s Bluetooth settings or plug it in with USB. Press a button to connect, then release it before choosing anything.</p><dl class="controller-guide"><dt>D-pad</dt><dd>Move between buttons. Left/right adjusts a selected option or slider.</dd><dt>A</dt><dd>Select. Hold on a game canvas to drag or draw; release to let go.</dd><dt>Left stick</dt><dd>Move your labeled controller cursor. Hold A or RT to drag.</dd><dt>Right stick</dt><dd>Scroll menus and long pages.</dd><dt>B</dt><dd>Cancel a drag or close a dismissible dialog. Required instructions still need acknowledgement.</dd><dt>Menu ☰</dt><dd>Pause or intentionally resume when the game offers it.</dd></dl><p>Two controllers have independent P1 and P2 cursors. Choose a two-player mode in the game first and use your own play area. A single controller has one pointer; activities that need two simultaneous fingers still need touch or a second controller.</p><p><strong>Slime Lab and Shadow Ninjas:</strong> native controls take over during active play; read their game instructions for sling, movement and ability mappings. Menus and paused screens keep normal controller navigation.</p><p><strong>Wobbly Wars 3D:</strong> native field controls take over on the active battlefield. Left stick moves a ground cursor, D-pad selects troops, A places/confirms, X picks up, B cancels or returns to menu cursors, Y readies/starts. Right stick orbits; LB/RB zoom. Paused screens and dialogs keep normal navigation.</p><p><strong>Living Forest:</strong> its dedicated controller controls take over automatically, including movement, camera and combat. Use its controller guide for the exact buttons.</p><p>Camera, microphone and speech activities still need their real devices. Controller cursor input does not provide tracking or recorded audio. The Xbox/Home button is reserved by your device. Browser permission prompts, file pickers and audio unlock may need a touchscreen or mouse tap. Physical controller, Bluetooth and GPU checks must be done on the arcade PC.</p><button class="btn primary" data-controller-close>LET’S PLAY</button>`;}

export function createArcadeController({doc=document,win=window,getPads=()=>navigator.getGamepads?.()||[],request=cb=>requestAnimationFrame(cb),cancel=id=>cancelAnimationFrame(id),auto=true}={}){
 const pointers=createControllerPointers(doc),states=[0,1].map(i=>({x:0,y:0,mode:'focus',held:false,cursor:null,repeat:0}));
 let frame=null,last=0,context=null,focused=null,disposed=false,status=null;
 const hub=new GamepadHub({onDisconnect(player){pointers.cancel(player);states[player].held=false;pause(false);}});
 const topDialog=()=>[...doc.querySelectorAll('dialog[open]')].at(-1);
 const surface=()=>topDialog()||doc.body;
 const items=root=>[...root.querySelectorAll(controls)].filter(usable);
 const mark=n=>{focused?.classList.remove('controller-focus');focused=n;if(n){n.classList.add('controller-focus');n.focus({preventScroll:true});n.scrollIntoView({block:'nearest',inline:'nearest'});}};
 function adjust(n,step){
  if(n.tagName==='SELECT'){
   stepSelect(n,step);
  }else if(n.matches('input[type="range"]')){step>0?n.stepUp():n.stepDown();n.dispatchEvent(new Event('input',{bubbles:true}));n.dispatchEvent(new Event('change',{bubbles:true}));}
 }
 function moveFocus(root,dx,dy){
  const nodes=items(root);if(!nodes.length)return;const active=doc.activeElement;
  if(!nodes.includes(active)){mark(nodes[0]);return;}
  if(dx&&active.matches('select,input[type="range"]')){adjust(active,dx);return;}
  const next=menuNeighbor(nodes,active,dx,dy);if(next)mark(next);
 }
 function confirm(root){const n=root.contains(doc.activeElement)&&usable(doc.activeElement)&&doc.activeElement.matches(controls)?doc.activeElement:items(root)[0];if(!n)return;mark(n);if(n.tagName==='SELECT')adjust(n,1);else if(n.matches('input[type="range"]'))adjust(n,1);else n.click();}
 function back(){const dialog=topDialog();if(!dialog)return;const button=dialog.querySelector('[data-instructions-back],[data-back]');if(button){button.click();return;}const e=new Event('cancel',{cancelable:true});if(dialog.dispatchEvent(e))dialog.close();}
 function scrollTarget(node){for(let n=node;n&&n!==doc.body;n=n.parentElement){if(n.scrollHeight>n.clientHeight&&/(auto|scroll)/.test(win.getComputedStyle(n).overflowY))return n;}return topDialog()||doc.scrollingElement;}
 function pause(resume=true){const button=items(doc).find(n=>n.tagName==='BUTTON'&&new RegExp(resume?'^(pause|resume)( game)?$':'^pause( game)?$','i').test(n.textContent.replace(/[^a-z ]/gi,'').trim()));button?.click();}
 function reset(){pointers.cancelAll();hub.clear();for(const s of states){s.held=false;s.repeat=0;}mark(null);}
 function cursor(player,root){const s=states[player];if(!s.cursor){s.cursor=doc.createElement('div');s.cursor.className='controller-cursor player-'+(player+1);s.cursor.setAttribute('aria-hidden','true');s.cursor.textContent='P'+(player+1);s.x=win.innerWidth*(player?.7:.3);s.y=win.innerHeight*.5;}const mount=root.tagName==='DIALOG'?root:doc.body;if(s.cursor.parentElement!==mount)mount.append(s.cursor);return s.cursor;}
 function guide(){if(topDialog())return;const dialog=doc.createElement('dialog');dialog.className='modal controller-help';dialog.setAttribute('aria-label','Controller setup and controls');dialog.innerHTML=controllerHelp();doc.body.append(dialog);dialog.querySelector('[data-controller-close]').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal();}
 function tick(now){
  if(disposed)return;const dt=clamp((now-last)/1000||1/60,0,.05);last=now;
  const root=surface(),native=!!doc.querySelector('#view .lb-app, #view [data-native-gamepad="true"]'),next=topDialog()?.firstElementChild||doc.querySelector('#view')?.firstElementChild||root;
  if(next!==context){reset();context=next;}
  let pads=[];try{pads=getPads();}catch{}
  if(doc.hidden||!doc.hasFocus()||native){reset();for(const s of states)if(s.cursor)s.cursor.hidden=true;if(status)status.hidden=true;}else{
   hub.poll(pads,'arcade');const connected=hub.slots.filter(Boolean).length;
   if(connected&&!status){status=doc.createElement('button');status.className='controller-status';status.setAttribute('aria-label','Controller help and controls');status.onclick=guide;doc.body.append(status);}
   if(status){status.hidden=!connected;status.textContent=`${connected} CONTROLLER${connected>1?'S':''} · CONTROLS ?`;}
   for(let player=0;player<states.length;player++){
    const s=states[player],pad=hub.pad(player);if(!pad){if(s.cursor)s.cursor.hidden=true;continue;}
    const c=cursor(player,root),x=padAxis(pad,0),y=padAxis(pad,1),dx=padButton(pad,14)?-1:padButton(pad,15)?1:0,dy=padButton(pad,12)?-1:padButton(pad,13)?1:0;
    if(x||y){s.mode='pointer';mark(null);const speed=padButton(pad,4)?180:700;s.x=clamp(s.x+x*dt*speed,4,win.innerWidth-4);s.y=clamp(s.y+y*dt*speed,4,win.innerHeight-4);pointers.move(player,s.x,s.y);}
    if((dx||dy)&&now>=s.repeat&&!s.held){s.mode='focus';moveFocus(root,dx,dy);s.repeat=now+220;}
    if(!dx&&!dy)s.repeat=0;
    c.hidden=s.mode!=='pointer';c.style.left=s.x+'px';c.style.top=s.y+'px';
    const scroll=padAxis(pad,3);if(scroll)scrollTarget(s.mode==='focus'?doc.activeElement:doc.elementFromPoint(s.x,s.y))?.scrollBy?.(0,scroll*dt*750);
    const held=padButton(pad,0)||padButton(pad,7);
    if(held&&!s.held){if(s.mode==='pointer')pointers.down(player,s.x,s.y);else if(hub.pressed(player,0)){confirm(root);reset();break;}}
    if(!held&&s.held)pointers.up(player);s.held=held;
    if(hub.pressed(player,1)){const dragging=pointers.size>0;pointers.cancelAll();if(!dragging)back();reset();break;}
    if(hub.pressed(player,9)){pointers.cancelAll();pause();reset();break;}
    if(hub.pressed(player,8)){pointers.cancelAll();guide();reset();break;}
   }
  }
  if(auto)frame=request(tick);
 }
 const blur=()=>{reset();pause(false);},visibility=()=>{if(doc.hidden)blur();};
 win.addEventListener('blur',blur);doc.addEventListener('visibilitychange',visibility);
 if(auto)frame=request(tick);
 return{tick,hub,pointers,dispose(){disposed=true;if(frame!==null)cancel(frame);reset();hub.dispose();for(const s of states)s.cursor?.remove();status?.remove();win.removeEventListener('blur',blur);doc.removeEventListener('visibilitychange',visibility);}};
}
