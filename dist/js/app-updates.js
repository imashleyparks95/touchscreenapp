// Explicit, lobby-only service-worker activation. Never reload a running game.
export function createAppUpdater({serviceWorker,canApply=()=>false,onState=()=>{},reload=()=>location.reload(),schedule=setTimeout,cancel=clearTimeout}={}){
 let registration=null,status='idle',message='',applying=false,reloaded=false,timeout=null;
 const watched=new WeakSet(),cleanups=[];
 const emit=(next,text='')=>{status=next;message=text;onState({status,message,ready:!!registration?.waiting});};
 function watch(worker){if(!worker||watched.has(worker))return;watched.add(worker);const change=()=>{if(worker.state==='installed')emit(registration.waiting||serviceWorker.controller?'ready':'current');else if(worker.state==='redundant')emit('error','The update could not finish downloading. Your installed version is still available.');};worker.addEventListener('statechange',change);cleanups.push(()=>worker.removeEventListener('statechange',change));}
 function finishError(text){applying=false;cancel(timeout);emit(registration?.waiting?'ready':'error',text);}
 const changed=()=>{if(!applying||reloaded)return;reloaded=true;cancel(timeout);reload();};
 const incoming=e=>{if(e.data?.type==='UPDATE_BLOCKED'&&applying)finishError(e.data.message||'Close other arcade tabs, then try again.');};
 if(serviceWorker){serviceWorker.addEventListener('controllerchange',changed);serviceWorker.addEventListener('message',incoming);}
 async function start(){if(!serviceWorker){emit('unsupported','Offline updates are unavailable in this browser.');return;}try{registration=await serviceWorker.register('sw.js',{updateViaCache:'none'});const found=()=>{watch(registration.installing);emit('downloading');};registration.addEventListener('updatefound',found);cleanups.push(()=>registration.removeEventListener('updatefound',found));watch(registration.installing);emit(registration.waiting?'ready':registration.installing?'downloading':'current');}catch{emit('error','Could not check for updates. Reconnect and try again; saved progress is unchanged.');}}
 async function check(){if(applying)return;if(!registration){await start();return;}emit('checking');try{await registration.update();emit(registration.waiting?'ready':registration.installing?'downloading':'current');}catch{emit('error','Update check failed. Reconnect and try again. You can keep playing the installed version.');}}
 function apply(){if(applying||!registration?.waiting||!canApply())return false;applying=true;emit('applying');timeout=schedule(()=>finishError('The update did not activate. Close all arcade tabs and reopen the link; do not clear site data.'),12000);registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});return true;}
 return{start,check,apply,get state(){return{status,message,ready:!!registration?.waiting};},dispose(){cancel(timeout);for(const cleanup of cleanups)cleanup();serviceWorker?.removeEventListener('controllerchange',changed);serviceWorker?.removeEventListener('message',incoming);}};
}
