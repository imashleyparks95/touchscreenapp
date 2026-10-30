// One captured gesture per pointer; uses actual hit testing for touch and controller cursors.
export function bindSequenceInput(grid,pattern,{changed,preview,hitTest=(x,y)=>document.elementFromPoint(x,y)}={}){
 const pointers=new Map(),listeners=[];
 const cell=node=>{const el=node?.closest?.('.step');return el&&grid.contains(el)?el:null;};
 function paint(el,value,heard=false){if(!el)return;const row=Number(el.dataset.row),step=Number(el.dataset.step);if(!pattern.matrix[row]||step<0||step>=pattern.steps)return;pattern.matrix[row][step]=value;el.classList.toggle('on',value);el.setAttribute('aria-pressed',String(value));if(heard&&value)preview?.(row);changed?.();}
 function finish(e){if(!pointers.delete(e.pointerId))return;if(grid.hasPointerCapture?.(e.pointerId))grid.releasePointerCapture(e.pointerId);}
 function listen(type,fn){grid.addEventListener(type,fn);listeners.push([type,fn]);}
 listen('pointerdown',e=>{const el=cell(e.target);if(!el||pointers.has(e.pointerId))return;e.preventDefault();const value=!pattern.matrix[+el.dataset.row][+el.dataset.step];pointers.set(e.pointerId,{value,last:el});grid.setPointerCapture?.(e.pointerId);paint(el,value,true);});
 listen('pointermove',e=>{const p=pointers.get(e.pointerId);if(!p)return;e.preventDefault();const el=cell(hitTest(e.clientX,e.clientY));if(el&&el!==p.last){p.last=el;paint(el,p.value);}});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])listen(type,finish);
 listen('keydown',e=>{const el=cell(e.target);if(!el||!['Enter',' '].includes(e.key)||e.repeat)return;e.preventDefault();paint(el,!pattern.matrix[+el.dataset.row][+el.dataset.step],true);});
 return()=>{for(const id of [...pointers.keys()])finish({pointerId:id});for(const [type,fn]of listeners)grid.removeEventListener(type,fn);};
}
