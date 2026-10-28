/** Ownership remains fixed from pointer-down until release, regardless of later position. */
export class PointerOwnership{
 constructor(ownerAt){this.ownerAt=ownerAt;this.owners=new Map();}
 begin(id,point){const owner=this.ownerAt(point);this.owners.set(id,owner);return owner;}
 get(id){return this.owners.get(id);}
 end(id){const owner=this.owners.get(id);this.owners.delete(id);return owner;}
 clear(){this.owners.clear();}
}
export const canDeploy=({owner,turn=0,ready=[],simultaneous=false,singlePlayer=false})=>!ready[owner]&&(singlePlayer||simultaneous||owner===turn);
export function splitBudget(total,count=2){if(!Number.isInteger(total)||total<0||!Number.isInteger(count)||count<1)throw Error('Invalid deployment budget');const base=Math.floor(total/count);return Array.from({length:count},(_,i)=>base+(i<total%count?1:0));}
