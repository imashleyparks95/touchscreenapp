/** Common menu mechanics, independent of input device, games and renderer. */
export function menuUsable(node){return !!node&&!node.disabled&&!node.hidden&&!node.closest('[hidden],[inert]')&&node.getClientRects().length>0;}
export function stepSelect(node,step,{wrap=false}={}){
 const valid=Array.from(node.options).map((option,index)=>!option.disabled&&!option.parentElement?.disabled?index:null).filter(index=>index!==null);
 if(!valid.length)return false;
 const index=valid.indexOf(node.selectedIndex),next=wrap?(index+step+valid.length)%valid.length:Math.max(0,Math.min(valid.length-1,index+step));
 if(node.selectedIndex===valid[next])return false;
 node.selectedIndex=valid[next];node.dispatchEvent(new (node.ownerDocument?.defaultView.Event||Event)('change',{bubbles:true}));return true;
}
export function menuNeighbor(nodes,active,dx,dy){
 if(!nodes.length)return null;if(!nodes.includes(active))return nodes[0];
 const a=active.getBoundingClientRect(),ax=a.x+a.width/2,ay=a.y+a.height/2;let chosen=null,best=Infinity;
 for(const node of nodes){if(node===active)continue;const b=node.getBoundingClientRect(),x=b.x+b.width/2-ax,y=b.y+b.height/2-ay,along=x*dx+y*dy,across=Math.abs(x*dy-y*dx);if(along>4&&along+across*2<best){chosen=node;best=along+across*2;}}
 return chosen||(dy?nodes[(nodes.indexOf(active)+(dy>0?1:-1)+nodes.length)%nodes.length]:null);
}
