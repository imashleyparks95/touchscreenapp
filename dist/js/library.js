import {matchingWorlds} from './discovery.js';

// Public launcher capabilities, checked against the actual game instruction/mode inventory.
// No secret entries or legacy score-only IDs belong in these shelves.
export const LIBRARY_MODES=Object.freeze({
 gladiator:'Turn-based duels',math:'Take turns · co-op',bugs:'Split-screen versus',paint:'Create together',
 balloons:'Split-screen versus',cafe:'Take turns',circuit:'Split-screen versus',gravity:'Split-screen versus',
 battle:'Simultaneous versus',build:'Take turns',beat:'Shared studio · take turns',slime:'Split-screen races',
 dentist:'Take turns',ninja:'Split-screen races',castle:'Take turns · co-op',buddy:'Take turns',
 doodle:'Split-screen · co-op',robot:'Take turns',wars:'Versus · co-op',funny:'Two-face challenges',
 monster:'Take turns · create',zoo:'Shared zoo · take turns',air:'Versus · co-op',spelling:'Split-screen · turns · co-op',limit:'Simultaneous co-op'
});
const publicId=id=>Object.hasOwn(LIBRARY_MODES,id);
export function worldCapabilities(id){
 return{multiplayer:LIBRARY_MODES[id]||'',controller:id==='limit'?'Native controller':'Controller cursor',
  touch:['funny','monster'].includes(id)?'Touch editing':'Touch & mouse',
  device:({funny:'Camera for face tracking',monster:'Camera / microphone for capture',zoo:'Microphone for custom voices',air:'Camera tracking or touch fallback',spelling:'Speakers for spoken words'})[id]||'',
  note:id==='limit'?'Explore the Living Forest. Castle and Chaos Chamber are still future chapters.':id==='paint'?'Freehand drawing works best with touch or a mouse.':id==='math'?'Use touch or a mouse for handwriting; submit answers separately.':id==='beat'?'Make music together, or take turns in rhythm challenges.':id==='wars'?'Choose simultaneous touch deployment when your device supports it, or take turns.':''};
}
export function libraryState(profile){
 const value=profile?.library;
 return{favorites:[...new Set((Array.isArray(value?.favorites)?value.favorites:[]).filter(publicId))].slice(0,25),
  recent:(Array.isArray(value?.recent)?value.recent:[]).filter(item=>item&&publicId(item.id)&&Number.isFinite(item.at)&&item.at>=0).filter((item,i,all)=>all.findIndex(other=>other.id===item.id)===i).slice(0,12).map(item=>({...item}))};
}
export function toggleFavorite(profile,id){
 if(!profile||!publicId(id))return false;
 const state=libraryState(profile),selected=!state.favorites.includes(id);
 state.favorites=selected?[...state.favorites,id]:state.favorites.filter(value=>value!==id);profile.library=state;return selected;
}
export function rememberProfileWorld(profile,id,at=Date.now()){
 if(!profile||!publicId(id)||!Number.isFinite(at)||at<0)return;
 const state=libraryState(profile);state.recent=[{id,at},...state.recent.filter(item=>item.id!==id)].slice(0,12);profile.library=state;
}
export function validateLibrary(profile){
 if(profile.library===undefined)return;
 const value=profile.library;
 if(!value||typeof value!=='object'||Array.isArray(value)||!Array.isArray(value.favorites)||value.favorites.length>25||value.favorites.some(id=>!publicId(id))||new Set(value.favorites).size!==value.favorites.length||!Array.isArray(value.recent)||value.recent.length>12||value.recent.some(item=>!item||!publicId(item.id)||!Number.isFinite(item.at)||item.at<0)||new Set(value.recent.map(item=>item.id)).size!==value.recent.length)throw Error('Game library preferences are invalid.');
}
export function libraryWorlds(games,{filter='all',query='',sort='featured',profile}={}){
 const state=libraryState(profile),ids=filter==='favorites'?state.favorites:filter==='recent'?state.recent.map(item=>item.id):null;
 const result=matchingWorlds(games,ids?'all':filter,query).filter(game=>!ids||ids.includes(game.id));
 if(sort==='name')result.sort((a,b)=>a.name.localeCompare(b.name));
 else if(sort==='recent'||filter==='recent')result.sort((a,b)=>{const index=id=>{const i=state.recent.findIndex(item=>item.id===id);return i<0?Infinity:i;};return index(a.id)-index(b.id);});
 return result;
}
