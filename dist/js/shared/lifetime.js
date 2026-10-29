/** A lightweight owner for DOM/input resources; no renderer or game policy. */
export function createLifetime({onError=error=>console.error('Resource cleanup',error)}={}){
 let disposed=false;const cleaners=[];
 const run=fn=>{try{fn();}catch(error){onError(error);}};
 return{
  get disposed(){return disposed;},
  defer(fn){if(disposed)run(fn);else cleaners.push(fn);return fn;},
  listen(target,type,fn,options){target.addEventListener(type,fn,options);this.defer(()=>target.removeEventListener(type,fn,options));return fn;},
  dispose(){if(disposed)return;disposed=true;for(const fn of cleaners.splice(0).reverse())run(fn);}
 };
}
